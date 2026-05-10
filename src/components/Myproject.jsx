import { useState, useEffect } from 'react';

export default function Myproject({ username = 'Thuantran520' }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
      .then(res => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        if (!mounted) return;
        setRepos(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        if (!mounted) return;
        setError(err.message || 'Failed to load repos');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => { mounted = false };
  }, [username]);

  if (loading) return <div>Loading repositories...</div>;
  if (error) return <div>Error loading repos: {error}</div>;

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {repos.map(repo => (
          <li key={repo.id} style={{ padding: '8px 4px', borderBottom: '1px solid #ddd' }}>
            <div style={{ fontWeight: 700 }}>
              <a href={repo.html_url} target="_blank" rel="noreferrer">{repo.name}</a>
            </div>
            <div style={{ fontSize: '12px', color: '#333' }}>{repo.description}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>{repo.language} · ⭐ {repo.stargazers_count}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
