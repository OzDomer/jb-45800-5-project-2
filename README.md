# Cryptonite

Real-time crypto terminal. Track up to 5 coins, watch live prices, get AI buy/don't-buy verdicts.

## Screenshots
<img width="2557" height="1272" alt="Screenshot 2026-05-06 131026" src="https://github.com/user-attachments/assets/604ab16e-6476-4d89-9aa6-9c98ddcb6aa2" />
<img width="2555" height="1270" alt="Screenshot 2026-05-06 130854" src="https://github.com/user-attachments/assets/574a9213-1f64-4412-8bfb-05e7a90ebc7c" />


## Stack
React · TypeScript · Vite · Redux Toolkit · recharts · axios

## Architecture
- Organized by feature rather than by component type — keeps everything related to one feature co-located, and `shared/` holds infrastructure used across features.
- Service translation boundary — vendor API shapes never leak into components (`CoinPrice` model, not `{ [coin]: { USD } }` envelopes)
- Discriminated union state machine for AI request lifecycle (idle / loading / success / error)
- `localStorage` hydration via Redux `preloadedState` + `store.subscribe`
- Custom modal with mount-gated, uncontrolled API

## Run locally
`npm install && npm run dev`

Course project for John Bryce Full Stack 45800-5.
**Repo:** https://github.com/OzDomer/jb-45800-5-project-2