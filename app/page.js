'use client';
import { useRouter } from 'next/navigation';
import Nav from './components/Nav';

export default function LandingPage() {
  const router = useRouter();

  function handleStart() {
    const id = 'p_' + Math.random().toString(36).slice(2, 8);
    const condition = Math.random() < 0.5 ? 'A' : 'B';
    sessionStorage.setItem('participant_id', id);
    sessionStorage.setItem('condition', condition);
    router.push('/task');
  }

  return (
    <>
      <Nav crumbs={[{ label: 'Home' }]} />
      <div className="page">
        <h1>AI Systems and Trust Attribution Study</h1>
        <p className="subtitle">Human–AI Trust Calibration Experiment</p>

        <p>
          In this study, you will review a patient case and a recommendation from an AI assistant.
          You will decide whether to accept or reject the recommendation.
          Your response is recorded anonymously and takes approximately 2 minutes.
        </p>

        <div className="action-section">
          <h2>Participate</h2>
          <p>Click below to begin the study. You will be assigned to a condition automatically.</p>
          <button className="primary" onClick={handleStart}>Begin Study</button>
        </div>

        <div className="action-section" style={{ marginTop: '1rem' }}>
          <h2>Check Results</h2>
          <p>View all recorded responses, inspect raw JSON and CSV data, and download exports.</p>
          <button onClick={() => router.push('/results')}>View Results</button>
        </div>
      </div>
    </>
  );
}
