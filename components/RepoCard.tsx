import React from 'react';
import { GitHubRepo } from '../types';
import { Icons } from './Icons';

interface RepoCardProps {
  repo: GitHubRepo;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  return (
    <div className="bg-github-btn border border-github-border rounded-lg p-4 hover:border-github-muted transition-colors flex flex-col h-full">
      <div className="flex items-start justify-between mb-2">
        <a 
          href={repo.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-github-accent font-semibold hover:underline break-all text-lg"
        >
          {repo.name}
        </a>
        <span className="text-xs text-github-muted border border-github-border rounded-full px-2 py-0.5">
          {repo.private ? 'Private' : 'Public'}
        </span>
      </div>
      
      <p className="text-sm text-github-muted mb-4 flex-grow line-clamp-2">
        {repo.description || "No description provided."}
      </p>
      
      <div className="flex items-center gap-4 text-xs text-github-muted mt-auto">
        {repo.language && (
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            {repo.language}
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <Icons.Star size={14} />
          {repo.stargazers_count}
        </div>
        
        <div className="flex items-center gap-1">
          <Icons.Fork size={14} />
          {repo.forks_count}
        </div>

        <div className="text-xs ml-auto">
          {new Date(repo.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
