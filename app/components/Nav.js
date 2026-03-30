export default function Nav({ crumbs }) {
  // crumbs: [{ label, href }, ...] — last item is current page (no href)
  return (
    <nav>
      {crumbs.map((c, i) => (
        <span key={i}>
          {i > 0 && <span style={{ margin: '0 0.4rem', color: '#aaa' }}>›</span>}
          {c.href
            ? <a href={c.href}>{c.label}</a>
            : <span style={{ color: '#444' }}>{c.label}</span>
          }
        </span>
      ))}
    </nav>
  );
}
