# Claude Code Instructions — Australasian Jockey

You are developing a desktop browser-based 3D thoroughbred racing game.

Read `README.md` before changing anything.

## Product direction

- Stylised 3D realism, not photorealism.
- Desktop browser first.
- New Zealand and Australian thoroughbred racing.
- Two eventual modes: Historical Race Recreation and Custom Dream Races.
- The player rides and influences the horse. This is not an autoplay race viewer.

## Current prototype

The current application uses Vite, React, TypeScript and Three.js. It has a placeholder oval course, six procedural horse stand-ins, keyboard input, basic AI movement, stamina telemetry and two camera modes.

Preserve the working prototype while improving it incrementally.

## Engineering rules

1. Inspect the existing code before editing.
2. Run `npm run build` after meaningful changes.
3. Do not replace the project architecture without explaining why.
4. Keep simulation logic separate from rendering and UI.
5. Keep simulation parameters configurable; do not bury balance values throughout rendering code.
6. Use deterministic simulation steps where practical.
7. Avoid adding dependencies unless they solve a real problem.
8. Do not invent historical race results or horse statistics.
9. Use only assets with confirmed licences.
10. Do not claim the course is an accurate Flemington reconstruction until measured geometry has been implemented and verified.

## Immediate next task

Audit the current prototype and fix any functional issues before expanding it.

Then refactor the game into clear modules:

- `simulation/horse.ts`
- `simulation/race.ts`
- `simulation/ai.ts`
- `track/trackData.ts`
- `input/controls.ts`
- `rendering/horseView.ts`
- `rendering/camera.ts`

Keep the application runnable at every stage.

The next gameplay milestone is a convincing player-controlled horse movement loop with:
- Smooth acceleration and deceleration.
- A real stamina/effort model.
- Lane changes constrained by track geometry.
- Competitor awareness and safe overtaking.
- A race distance measured along the course rather than approximated by progress.
- Consistent race start and finish logic.

Do not begin historical databases, multiplayer, career mode or elaborate menus until the riding loop is enjoyable and technically sound.
