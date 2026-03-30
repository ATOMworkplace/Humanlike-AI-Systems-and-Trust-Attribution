'use client';
import { useEffect, useState } from 'react';
import Nav from '../components/Nav';

const PAGE_SIZE = 10;

export default function ResultsPage() {
  const [entries, setEntries] = useState(null);
  const [view, setView] = useState('table');
  const [csvText, setCsvText] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('/api/results')
      .then(r => r.json())
      .then(data => {
        setEntries(data);
        const header = 'participant_id,condition,decision,timestamp,latency_ms';
        const rows = data.map(e =>
          `${e.participant_id},${e.condition},${e.decision},${e.timestamp},${e.latency_ms}`
        );
        setCsvText([header, ...rows].join('\n'));
      });
  }, []);

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadCSV() {
    window.location.href = '/api/export';
  }

  if (!entries) return (
    <>
      <Nav crumbs={[{ label: 'Home', href: '/' }, { label: 'Results' }]} />
      <div className="page"><p>Loading...</p></div>
    </>
  );

  const totalPages = Math.ceil(entries.length / PAGE_SIZE);
  const paginated = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Nav crumbs={[{ label: 'Home', href: '/' }, { label: 'Results' }]} />
      <div className="results-page">
        <h1>Experiment Results</h1>
        <p className="subtitle">{entries.length} response{entries.length !== 1 ? 's' : ''} recorded</p>

        <div className="toolbar">
          <div className="view-tabs">
            <button className={view === 'table' ? 'active' : ''} onClick={() => { setView('table'); setPage(1); }}>Table</button>
            <button className={view === 'json' ? 'active' : ''} onClick={() => setView('json')}>JSON</button>
            <button className={view === 'csv' ? 'active' : ''} onClick={() => setView('csv')}>CSV</button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={downloadJSON}>Download JSON</button>
            <button onClick={downloadCSV}>Download CSV</button>
          </div>
        </div>

        {
          <>
            {view === 'table' && (
              <>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>participant_id</th>
                        <th>condition</th>
                        <th>decision</th>
                        <th>timestamp</th>
                        <th>latency_ms</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((e, i) => (
                        <tr key={i}>
                          <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                          <td>{e.participant_id}</td>
                          <td>{e.condition}</td>
                          <td>{e.decision}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{e.timestamp}</td>
                          <td>{e.latency_ms}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button className="chevron" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>&#8249;</button>
                    <span className="page-info">Page {page} of {totalPages}</span>
                    <button className="chevron" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>&#8250;</button>
                  </div>
                )}
              </>
            )}

            {view === 'json' && <pre>{JSON.stringify(entries, null, 2)}</pre>}
            {view === 'csv' && <pre>{csvText}</pre>}
          </>
        }
      </div>
    </>
  );
}
