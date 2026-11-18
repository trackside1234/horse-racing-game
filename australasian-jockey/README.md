# Australasian Jockey — Prototype 0.1

A desktop-browser prototype for a stylised 3D thoroughbred racing game focused on New Zealand and Australian racing.

## Current scope

- Vite + React + TypeScript application.
- Three.js 3D scene.
- Procedurally assembled placeholder horse models.
- Stylised oval turf course inspired by Flemington.
- Six runners (one player-controlled, five simple AI runners).
- Keyboard controls and stamina telemetry.
- Chase and jockey-style camera modes.
- Start, finish and reset flow.

This is an early prototype, not a historically accurate Flemington recreation. Horse geometry, gait animation, AI, track dimensions and racing physics are placeholders intended to prove the basic interaction loop.

## Run locally

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Controls

- `W` / `Arrow Up`: build pace
- `S` / `Arrow Down`: ease
- `A` / `Arrow Left`: move toward inner lane
- `D` / `Arrow Right`: move toward outer lane
- `Space`: urge forward
- `Shift`: conserve energy
- `C`: switch camera
- `R`: reset race

## Build check

```bash
npm run build
```

## Next development priorities

1. Replace primitive horse geometry with a licensed, rigged GLB thoroughbred model.
2. Replace the approximate oval with measured Flemington course geometry.
3. Implement a track-coordinate system and proper distance measurement.
4. Improve horse gait animation and foot placement.
5. Make lane changes and overtaking depend on field position and available space.
6. Improve AI race strategies and stamina modelling.
7. Add configurable horse attributes and a horse selection screen.
8. Add a replay recorder.

## Important data and licensing note

Do not scrape or redistribute commercial racing databases, race images, horse models, jockey silks or broadcast footage without confirming usage rights. Keep historical records and game-balancing attributes separate.
