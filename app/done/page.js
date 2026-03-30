import Nav from '../components/Nav';

export default function DonePage() {
  return (
    <>
      <Nav crumbs={[{ label: 'Home', href: '/' }, { label: 'Task', href: '/task' }, { label: 'Done' }]} />
      <div className="page">
        <h1>Thank You</h1>
        <p className="subtitle">Response recorded</p>
        <p>Your response has been recorded. You may close this window.</p>
        <div className="btn-row">
          <a href="/"><button>Return to Home</button></a>
        </div>
      </div>
    </>
  );
}
