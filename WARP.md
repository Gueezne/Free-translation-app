# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository layout
- `client/`: Create React App (CRA) frontend (React 19, react-scripts 5). Tests use React Testing Library and jest-dom.
- `server/`: Node/Express dependencies are declared, but no server code is committed yet. The frontend expects a translation endpoint at `http://localhost:5000/?text=<text>&source=<src>&target=<dst>` returning the translated text as `text/plain`.

## Common commands
Run all commands from the indicated directory.

- Install dependencies
  - Frontend: `cd client && npm install`
  - Server: `cd server && npm install`

- Develop (CRA dev server)
  - `cd client && npm start`
  - Opens http://localhost:3000 with fast refresh and ESLint checks in-console.

- Build (production)
  - `cd client && npm run build`
  - Outputs to `client/build`.

- Test
  - Watch mode: `cd client && npm test`
  - Run a single test file: `cd client && npm test -- App.test.js`
  - Run tests by name/pattern: `cd client && npm test -- -t "pattern"`
  - Run once (CI style): `cd client && npm test -- --watchAll=false`

- Lint
  - No standalone `lint` script. CRA runs ESLint during `start`, `build`, and `test`.

## High-level architecture
- Entry: `client/src/index.js` creates the React root and renders `components/App`.
- App shell: `client/src/components/App.js` renders the translator UI (`Translate`).
- Translator logic: `client/src/components/Translate.js`
  - Imperative DOM control inside a single `useEffect` (querying elements, attaching event listeners).
  - Populates language `<select>`s from `components/data.js` (country-code → label map).
  - “Translate” button calls `fetch("http://localhost:5000/?text=...&source=...&target=...")` and inserts the response body into the output textarea.
  - Extras: copy-to-clipboard and speech synthesis (Web Speech API) for both source/target; an “exchange” control swaps text and selected languages.
  - Placeholders are updated to indicate progress/errors; the target textarea is `readOnly`/`disabled` and filled programmatically.
- Styling: `client/src/styles/*.css` plus CRA’s default `public/index.html` template.
- Testing: `client/src/setupTests.js` enables jest-dom. Note: `client/src/App.test.js` imports `./App` but the component lives at `./components/App`. Adjust the import or file location for tests to pass.

## Notes for future changes
- Frontend assumes a server at `localhost:5000` that supports the GET contract above and CORS. If you implement the server, ensure it returns plain text and enables CORS.
- Significant refactors (e.g., moving from imperative DOM in `Translate` to React state/handlers) require rewriting event wiring currently done in `useEffect`.
