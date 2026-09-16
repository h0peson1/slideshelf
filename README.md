# SlideShelf

UI/UX prototype for a **Lecture Slides Management System**.

Course representatives upload lecture slides once. Students browse by level, semester, and course, then open or download what they need — without WhatsApp chase-downs during exams.

## Screens

- `/` — Brand landing
- `/login` — Role-aware sign-in (student / course rep)
- `/student` — Level & semester browse → courses
- `/student/courses/[courseId]` — Slide list with open/download
- `/rep` — Course rep desk
- `/rep/upload` — Upload flow
- `/rep/courses` — Manage courses

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design direction

- Brand: **SlideShelf**
- Palette: forest shelf green, soft mist atmosphere, warm amber accents
- Type: Bricolage Grotesque (display) + Figtree (UI)
- Motions: rise-in hero copy, shelf slide-in, soft floating week rows
