function highlight(sql) {
  const parts = sql.split(/(\bSELECT\b|\bFROM\b|\bWHERE\b|\bAND\b|\bOR\b|\bUPDATE\b|\bSET\b|\bUNION\b|--.*$)/gm);
  return parts.map((part, i) => {
    if (/^(SELECT|FROM|WHERE|AND|OR|UPDATE|SET|UNION)$/.test(part)) {
      return (
        <span key={i} className="kw">
          {part}
        </span>
      );
    }
    if (part.startsWith("--")) {
      return (
        <span key={i} className="cm">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function QueryPreview({ sql }) {
  return (
    <div className="query-panel">
      <pre className="query-code">{highlight(sql)}</pre>
    </div>
  );
}
