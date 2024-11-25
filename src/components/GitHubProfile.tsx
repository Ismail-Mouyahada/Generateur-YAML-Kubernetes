import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';

interface GitHubStats {
  publicRepos: number;
  followers: number;
}

export default function GitHubProfile() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/users/ismailmouyahada')
      .then((res) => res.json())
      .then((data) => {
        setStats({
          publicRepos: data.public_repos,
          followers: data.followers,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !stats) return null;

  return (
    <div className="flex items-center space-x-2 text-sm">
      <User className="h-4 w-4" />
      <span>{stats.publicRepos} repos</span>
      <span>•</span>
      <span>{stats.followers} followers</span>
    </div>
  );
}