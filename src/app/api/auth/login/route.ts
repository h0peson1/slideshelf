import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSession, UserRole } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    // If a specific role was chosen in the UI, verify compatibility
    const requestedRole = role === "rep" ? "COURSE_REP" : "STUDENT";
    if (role && user.role !== requestedRole) {
      return NextResponse.json(
        {
          error: `This account is registered as ${user.role === "COURSE_REP" ? "Course Rep" : "Student"}. Please switch tabs.`,
        },
        { status: 403 },
      );
    }

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
    });

    const destination = user.role === "COURSE_REP" ? "/rep" : "/student";
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      destination,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during sign in. Please try again." },
      { status: 500 },
    );
  }
}
