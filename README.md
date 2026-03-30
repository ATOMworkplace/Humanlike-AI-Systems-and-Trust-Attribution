# AI Systems and Trust Attribution Experiment

A prototype of an open-source behavioral experiment platform for studying trust calibration in AI-assisted decision systems. Built for the Institute for Social Science Research (ISSR), University of Alabama.


## Overview

This platform supports controlled A/B experiments measuring how interface design influences user reliance on AI recommendations. Participants review patient triage cases and decide whether to accept or reject a recommendation from an AI assistant. Each trial manipulates a single interface cue (agent name and tone) while keeping the underlying recommendation identical across conditions. Decisions and response latency are logged for behavioral analysis.

This is a working prototype. The platform is designed to be modular and extensible for broader human-AI trust, calibration, and adoption studies.


## Condition Logic

Each trial independently assigns the participant to one of two conditions with equal (50/50) probability. The assignment is re-randomized on every trial, so a single session may include both conditions.

| | Condition A | Condition B |
|---|---|---|
| Agent name | Alex | AI-Doc |
| Tone | Conversational, warm | Formal, technical |
| Output format | Natural language paragraph | Structured data table (Priority, Score, Confidence, Action) |
| Example | "I've reviewed this patient's vitals and I'm confident they need immediate attention." | Priority: CRITICAL / Score: 93/100 / Confidence: 0.93 |

Both conditions present identical patient vitals and the same underlying recommendation. Only the interface cue differs, isolating the effect of humanlike framing on user decision behavior.

The experiment includes 20 patient cases covering a range of severity levels, from routine visits (score 3/100) to critical emergencies (score 99/100). Cases are selected randomly each trial.


## Logging Implementation

Every decision is sent via POST to `/api/log`, which appends an entry to `data/logs.json` on the server.

**Event schema:**

```json
{
  "participant_id": "p_ab12cd",
  "condition": "A",
  "decision": "accept",
  "timestamp": "2026-03-30T08:14:22.331Z",
  "latency_ms": 4823
}
```

| Field | Description |
|---|---|
| `participant_id` | Auto-generated on landing page (`p_` + random 6-char string) |
| `condition` | `"A"` (Alex) or `"B"` (AI-Doc), assigned randomly per trial |
| `decision` | `"accept"` or `"reject"` |
| `timestamp` | ISO 8601, written server-side at time of log |
| `latency_ms` | Time from trial page load to button click, measured client-side |

To export as CSV, visit `/api/export` in the browser.


## How to Run Locally

```bash
git clone https://github.com/ATOMworkplace/Humanlike-AI-Systems-and-Trust-Attribution
cd Humanlike-AI-Systems-and-Trust-Attribution
npm install
npm run dev
```

Open `http://localhost:3000`.

**Pages:**

| Route | Description |
|---|---|
| `/` | Landing page. Begin study or view results. |
| `/task` | Decision task. Loops until participant ends the study. |
| `/done` | Completion screen. |
| `/results` | View all logged responses as table, raw JSON, or raw CSV. Download exports. |
| `/api/log` | POST endpoint. Appends decision to `data/logs.json`. |
| `/api/export` | GET endpoint. Returns `logs.json` as a downloadable CSV. |
| `/api/results` | GET endpoint. Returns `logs.json` as JSON. |


## Sample Output

See [`sample_output.json`](./sample_output.json) and [`sample_output.csv`](./sample_output.csv).

```json
[
  { "participant_id": "p_ab12cd", "condition": "A", "decision": "accept", "timestamp": "2026-03-30T08:14:22.331Z", "latency_ms": 4823 },
  { "participant_id": "p_ef34gh", "condition": "B", "decision": "reject",  "timestamp": "2026-03-30T08:17:05.112Z", "latency_ms": 7341 },
  { "participant_id": "p_ij56kl", "condition": "A", "decision": "accept", "timestamp": "2026-03-30T08:19:48.774Z", "latency_ms": 3102 },
  { "participant_id": "p_mn78op", "condition": "B", "decision": "accept", "timestamp": "2026-03-30T08:22:31.005Z", "latency_ms": 9214 }
]
```
