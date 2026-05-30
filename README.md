# Plant Quality System — Worker Demo

Interactive demo for **factory workers and supervisors** — lot tracking, line response, and owner notifications.

> **Demo mode only** — all numbers, lots, and VINs are sample data. Not connected to live factory systems.

## Run

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

## Screens

| Tab | Who uses it |
|-----|-------------|
| **Plant map** | Everyone — see whole factory, tap alert zones |
| **Receiving** | Dock — sample lots, release or hold |
| **Assembly** | Line operator — torque, vision, line stop |
| **HVDB test** | Test bench — checklist, lot alerts |
| **Vehicle gate** | Final check before ship |
| **Fleet desk** | Quality — notify affected owners |
| **Trace issue** | Supervisor — find lot → VIN in seconds |

## Client demo flow

1. **Plant map** → tap red **HVDB test** or **Fleet**
2. Show **worker screen** — plain language, big status, action buttons
3. Simulate a defect (demo buttons)
4. **Trace issue** → show supervisor lookup
