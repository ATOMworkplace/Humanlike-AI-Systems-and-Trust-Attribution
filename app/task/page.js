'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '../components/Nav';

const CASES = [
  {
    patient: 'Male, 67 years old',
    vitals: { 'Heart Rate': '118 bpm (elevated)', 'Blood Pressure': '158/96 mmHg (high)', 'Oxygen Saturation': '91% (low)', 'Complaint': 'Chest tightness, shortness of breath' },
    alex: "I've reviewed this patient's vitals and I'm confident they need immediate attention. I recommend prioritizing them for urgent care.",
    aidoc: { score: 87, confidence: 0.87, priority: 'HIGH', action: 'Immediate escalation to attending physician' },
  },
  {
    patient: 'Female, 45 years old',
    vitals: { 'Heart Rate': '102 bpm (elevated)', 'Blood Pressure': '145/90 mmHg (high)', 'Oxygen Saturation': '94% (borderline)', 'Complaint': 'Sudden severe headache, blurred vision' },
    alex: "This patient's symptoms concern me. A sudden severe headache with vision changes can be serious. I'd recommend getting them seen promptly.",
    aidoc: { score: 81, confidence: 0.81, priority: 'HIGH', action: 'Neurological assessment within 30 minutes' },
  },
  {
    patient: 'Male, 52 years old',
    vitals: { 'Heart Rate': '88 bpm (normal)', 'Blood Pressure': '128/82 mmHg (normal)', 'Oxygen Saturation': '97% (normal)', 'Complaint': 'Mild lower back pain for 3 days' },
    alex: "Looking at this patient, everything seems stable. The back pain is likely musculoskeletal. I'd say routine care is appropriate here.",
    aidoc: { score: 22, confidence: 0.89, priority: 'LOW', action: 'Standard outpatient referral' },
  },
  {
    patient: 'Female, 78 years old',
    vitals: { 'Heart Rate': '124 bpm (elevated)', 'Blood Pressure': '90/60 mmHg (low)', 'Oxygen Saturation': '89% (low)', 'Complaint': 'Confusion, cold extremities' },
    alex: "I'm quite concerned about this patient. Low blood pressure, low oxygen, and confusion together suggest something serious is happening. She needs urgent attention.",
    aidoc: { score: 95, confidence: 0.95, priority: 'CRITICAL', action: 'Immediate resuscitation protocol. Notify ICU.' },
  },
  {
    patient: 'Male, 34 years old',
    vitals: { 'Heart Rate': '76 bpm (normal)', 'Blood Pressure': '122/78 mmHg (normal)', 'Oxygen Saturation': '98% (normal)', 'Complaint': 'Sore throat, mild fever (38.1°C)' },
    alex: "This looks like a fairly standard case. Vitals are all normal and symptoms suggest a minor infection. Routine treatment should be fine.",
    aidoc: { score: 14, confidence: 0.92, priority: 'LOW', action: 'Routine triage. Symptomatic treatment.' },
  },
  {
    patient: 'Female, 61 years old',
    vitals: { 'Heart Rate': '110 bpm (elevated)', 'Blood Pressure': '165/100 mmHg (high)', 'Oxygen Saturation': '93% (low)', 'Complaint': 'Left arm numbness, jaw pain' },
    alex: "Left arm numbness and jaw pain alongside these vitals is a classic warning sign. I strongly recommend this patient be seen immediately. Time matters here.",
    aidoc: { score: 93, confidence: 0.93, priority: 'CRITICAL', action: 'Activate cardiac protocol. 12-lead ECG immediately.' },
  },
  {
    patient: 'Male, 28 years old',
    vitals: { 'Heart Rate': '82 bpm (normal)', 'Blood Pressure': '118/74 mmHg (normal)', 'Oxygen Saturation': '99% (normal)', 'Complaint': 'Sprained ankle after sports injury' },
    alex: "Vitals are perfectly fine and the injury is localized. This patient is stable and can wait for standard treatment.",
    aidoc: { score: 8, confidence: 0.96, priority: 'LOW', action: 'Non-urgent. RICE protocol. Imaging if needed.' },
  },
  {
    patient: 'Female, 55 years old',
    vitals: { 'Heart Rate': '96 bpm (borderline)', 'Blood Pressure': '138/88 mmHg (borderline)', 'Oxygen Saturation': '95% (borderline)', 'Complaint': 'Persistent dry cough, fatigue for 2 weeks' },
    alex: "The vitals aren't alarming but the symptom duration is worth noting. I'd suggest seeing her soon. It's not an emergency but it shouldn't be delayed much longer.",
    aidoc: { score: 44, confidence: 0.74, priority: 'MODERATE', action: 'Semi-urgent review within 2 hours' },
  },
  {
    patient: 'Male, 71 years old',
    vitals: { 'Heart Rate': '58 bpm (low)', 'Blood Pressure': '100/65 mmHg (low-normal)', 'Oxygen Saturation': '92% (low)', 'Complaint': 'Dizziness, near-fainting episode' },
    alex: "A near-fainting episode in a 71-year-old with a slow heart rate and low oxygen worries me. I'd recommend prioritizing this patient for evaluation.",
    aidoc: { score: 76, confidence: 0.83, priority: 'HIGH', action: 'Cardiology review. Rule out arrhythmia.' },
  },
  {
    patient: 'Female, 23 years old',
    vitals: { 'Heart Rate': '108 bpm (elevated)', 'Blood Pressure': '110/70 mmHg (normal)', 'Oxygen Saturation': '98% (normal)', 'Complaint': 'Anxiety attack, hyperventilation' },
    alex: "This seems like an anxiety episode. Vitals are otherwise fine. She needs reassurance and monitoring, but it's not a life-threatening situation.",
    aidoc: { score: 31, confidence: 0.78, priority: 'LOW-MODERATE', action: 'Monitor for 30 minutes. Reassess if elevated HR persists.' },
  },
  {
    patient: 'Male, 48 years old',
    vitals: { 'Heart Rate': '115 bpm (elevated)', 'Blood Pressure': '150/95 mmHg (high)', 'Oxygen Saturation': '91% (low)', 'Complaint': 'Sudden sharp chest pain, sweating' },
    alex: "Sharp chest pain with sweating and these vitals. I wouldn't wait on this one. This patient needs to be seen right away.",
    aidoc: { score: 91, confidence: 0.91, priority: 'CRITICAL', action: 'Immediate cardiac evaluation. Troponin + ECG stat.' },
  },
  {
    patient: 'Female, 38 years old',
    vitals: { 'Heart Rate': '79 bpm (normal)', 'Blood Pressure': '120/80 mmHg (normal)', 'Oxygen Saturation': '98% (normal)', 'Complaint': 'Mild nausea, skipped lunch' },
    alex: "Everything looks normal here. This is likely hunger or mild indigestion. Standard care is appropriate.",
    aidoc: { score: 6, confidence: 0.97, priority: 'LOW', action: 'Non-urgent. Dietary review. Observe.' },
  },
  {
    patient: 'Male, 65 years old',
    vitals: { 'Heart Rate': '105 bpm (elevated)', 'Blood Pressure': '170/105 mmHg (high)', 'Oxygen Saturation': '90% (low)', 'Complaint': 'Worsening breathlessness on lying flat' },
    alex: "Breathlessness that worsens when lying flat alongside these vitals suggests possible heart failure. I'd recommend urgent assessment.",
    aidoc: { score: 88, confidence: 0.88, priority: 'HIGH', action: 'Urgent cardiopulmonary evaluation. Chest X-ray + BNP.' },
  },
  {
    patient: 'Female, 19 years old',
    vitals: { 'Heart Rate': '84 bpm (normal)', 'Blood Pressure': '115/72 mmHg (normal)', 'Oxygen Saturation': '99% (normal)', 'Complaint': 'Minor cut on hand, controlled bleeding' },
    alex: "No concerns here. Vitals are normal and the injury is minor. This patient just needs wound care.",
    aidoc: { score: 5, confidence: 0.98, priority: 'LOW', action: 'Wound care only. No escalation needed.' },
  },
  {
    patient: 'Male, 59 years old',
    vitals: { 'Heart Rate': '98 bpm (borderline)', 'Blood Pressure': '142/92 mmHg (high)', 'Oxygen Saturation': '94% (borderline)', 'Complaint': 'Sudden difficulty speaking, facial droop' },
    alex: "Facial droop and sudden difficulty speaking are serious warning signs. This patient needs immediate evaluation. Time is critical with these symptoms.",
    aidoc: { score: 97, confidence: 0.97, priority: 'CRITICAL', action: 'Stroke protocol activated. CT scan immediately.' },
  },
  {
    patient: 'Female, 42 years old',
    vitals: { 'Heart Rate': '88 bpm (normal)', 'Blood Pressure': '126/82 mmHg (normal)', 'Oxygen Saturation': '97% (normal)', 'Complaint': 'Intermittent knee pain, chronic' },
    alex: "Chronic knee pain with normal vitals. This doesn't need urgent attention. Routine outpatient follow-up is the right call.",
    aidoc: { score: 11, confidence: 0.93, priority: 'LOW', action: 'Routine referral. Orthopedic outpatient clinic.' },
  },
  {
    patient: 'Male, 83 years old',
    vitals: { 'Heart Rate': '120 bpm (elevated)', 'Blood Pressure': '85/55 mmHg (low)', 'Oxygen Saturation': '88% (low)', 'Complaint': 'Unresponsive, brought in by family' },
    alex: "This is a critical situation. Unresponsive patient, dangerously low blood pressure and oxygen. This patient needs emergency care immediately.",
    aidoc: { score: 99, confidence: 0.99, priority: 'CRITICAL', action: 'Code response. Immediate resuscitation team.' },
  },
  {
    patient: 'Female, 31 years old',
    vitals: { 'Heart Rate': '90 bpm (normal)', 'Blood Pressure': '118/76 mmHg (normal)', 'Oxygen Saturation': '98% (normal)', 'Complaint': 'Mild headache, started this morning' },
    alex: "Vitals are all normal and the headache is mild and recent. I'd suggest standard pain management and monitoring.",
    aidoc: { score: 17, confidence: 0.88, priority: 'LOW', action: 'Symptomatic treatment. Reassess in 1 hour.' },
  },
  {
    patient: 'Male, 74 years old',
    vitals: { 'Heart Rate': '112 bpm (elevated)', 'Blood Pressure': '160/98 mmHg (high)', 'Oxygen Saturation': '91% (low)', 'Complaint': 'Sudden abdominal pain, rigid abdomen' },
    alex: "Rigid abdomen with sudden severe pain is a red flag. Combined with these vitals, I'd treat this as urgent and get surgical assessment quickly.",
    aidoc: { score: 90, confidence: 0.90, priority: 'HIGH', action: 'Surgical consult stat. Rule out acute abdomen.' },
  },
  {
    patient: 'Female, 50 years old',
    vitals: { 'Heart Rate': '78 bpm (normal)', 'Blood Pressure': '130/84 mmHg (normal)', 'Oxygen Saturation': '96% (normal)', 'Complaint': 'Routine medication refill, no acute symptoms' },
    alex: "No concerns at all. This patient is here for a routine visit. Standard administrative process.",
    aidoc: { score: 3, confidence: 0.99, priority: 'LOW', action: 'Administrative. No clinical escalation required.' },
  },
];

function randomCase() { return Math.floor(Math.random() * CASES.length); }
function randomCondition() { return Math.random() < 0.5 ? 'A' : 'B'; }
function participantId() {
  let id = sessionStorage.getItem('participant_id');
  if (!id) { id = 'p_' + Math.random().toString(36).slice(2, 8); sessionStorage.setItem('participant_id', id); }
  return id;
}

export default function TaskPage() {
  const router = useRouter();
  const [trial, setTrial] = useState(null);
  const [trialCount, setTrialCount] = useState(1);
  const [lastDecision, setLastDecision] = useState(null);

  useEffect(() => {
    setTrial({ caseIndex: randomCase(), condition: randomCondition(), startTime: Date.now() });
  }, []);

  if (!trial) return null;

  const c = CASES[trial.caseIndex];

  async function handleDecision(decision) {
    const latency_ms = Date.now() - trial.startTime;
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participant_id: participantId(), condition: trial.condition, decision, latency_ms }),
    });
    setLastDecision(decision);
  }

  function handleContinue() {
    setTrial({ caseIndex: randomCase(), condition: randomCondition(), startTime: Date.now() });
    setTrialCount(t => t + 1);
    setLastDecision(null);
  }

  return (
    <>
      <Nav crumbs={[{ label: 'Home', href: '/' }, { label: 'Task' }]} />
      <div className="page">
        <h1>Patient Case Review</h1>
        <p className="subtitle">Trial {trialCount}. Review the case below and respond to the AI recommendation.</p>

        <div className="vitals">
          <p><strong>Patient:</strong> {c.patient}</p>
          {Object.entries(c.vitals).map(([k, v]) => (
            <p key={k}><strong>{k}:</strong> {v}</p>
          ))}
        </div>

        <hr />

        {trial.condition === 'A' ? (
          <div className="ai-block">
            <div className="ai-name">Alex</div>
            <div className="ai-text">{c.alex}</div>
          </div>
        ) : (
          <div className="ai-block">
            <div className="ai-name">AI-Doc</div>
            <table className="aidoc-table">
              <tbody>
                <tr><td>Priority</td><td><strong>{c.aidoc.priority}</strong></td></tr>
                <tr><td>Score</td><td>{c.aidoc.score} / 100</td></tr>
                <tr><td>Confidence</td><td>{c.aidoc.confidence}</td></tr>
                <tr><td>Action</td><td>{c.aidoc.action}</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {lastDecision === null ? (
          <div className="btn-row">
            <button className="primary" onClick={() => handleDecision('accept')}>Accept</button>
            <button onClick={() => handleDecision('reject')}>Reject</button>
          </div>
        ) : (
          <div className="action-section">
            <p style={{ marginBottom: '0.75rem' }}>
              You <strong>{lastDecision}ed</strong> the recommendation. Would you like to continue or end the study?
            </p>
            <div className="btn-row">
              <button className="primary" onClick={handleContinue}>Continue</button>
              <button onClick={() => router.push('/done')}>End Study</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
