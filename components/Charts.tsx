import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip as BarTooltip 
} from 'recharts';
import { GitHubRepo } from '../types';

interface ChartsProps {
  repos: GitHubRepo[];
}

const COLORS = ['#58a6ff', '#3fb950', '#d29922', '#a371f7', '#f85149', '#8b949e'];

const Charts: React.FC<ChartsProps> = ({ repos }) => {
  // Calculate Top Languages
  const languageData = useMemo(() => {
    const stats: Record<string, number> = {};
    repos.forEach(repo => {
      if (repo.language) {
        stats[repo.language] = (stats[repo.language] || 0) + 1;
      }
    });
    return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6
  }, [repos]);

  // Calculate Stars per Repo (Top 5)
  const starData = useMemo(() => {
    return [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map(repo => ({
        name: repo.name.length > 15 ? repo.name.substring(0, 12) + '...' : repo.name,
        stars: repo.stargazers_count
      }))
      .filter(item => item.stars > 0);
  }, [repos]);

  if (repos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Language Distribution */}
      <div className="bg-github-darker border border-github-border rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-4 text-github-text">Language Distribution</h3>
        <div className="h-64 w-full">
          {languageData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9' }}
                    itemStyle={{ color: '#c9d1d9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-github-muted text-sm">
              No language data available
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
            {languageData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1 text-xs text-github-muted">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {entry.name}
                </div>
            ))}
        </div>
      </div>

      {/* Top Starred Repos */}
      <div className="bg-github-darker border border-github-border rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-4 text-github-text">Most Starred Repositories</h3>
        <div className="h-64 w-full">
           {starData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={starData} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fill: '#8b949e', fontSize: 12 }} 
                        width={100}
                        interval={0}
                    />
                    <BarTooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9' }}
                    />
                    <Bar dataKey="stars" fill="#58a6ff" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
           ) : (
            <div className="h-full flex items-center justify-center text-github-muted text-sm">
              No stars yet
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Charts;
