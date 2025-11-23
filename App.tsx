import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from './components/Icons';
import UserProfile from './components/UserProfile';
import RepoCard from './components/RepoCard';
import Charts from './components/Charts';
import AIAnalysisCard from './components/AIAnalysisCard';
import { fetchUser, fetchUserRepos } from './services/githubService';
import { analyzeProfile } from './services/geminiService';
import { GitHubUser, GitHubRepo, AIAnalysisResult } from './types';

function App() {
  const [username, setUsername] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with a default interesting user
  useEffect(() => {
    handleSearch('google');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    setUsername(query);
    setLoading(true);
    setError(null);
    setUser(null);
    setRepos([]);
    setAiAnalysis(null);

    try {
      // 1. Fetch User Data
      const userData = await fetchUser(query);
      setUser(userData);

      // 2. Fetch Repos Data
      const reposData = await fetchUserRepos(query);
      setRepos(reposData);

      setLoading(false);

      // 3. Trigger AI Analysis (Background)
      setAiLoading(true);
      try {
        const analysis = await analyzeProfile(userData, reposData);
        setAiAnalysis(analysis);
      } catch (e) {
        console.error("AI Analysis failed silently", e);
      } finally {
        setAiLoading(false);
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
      setAiLoading(false);
    }
  }, []);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  return (
    <div className="min-h-screen bg-github-dark text-github-text font-sans selection:bg-github-accent selection:text-white">
      
      {/* Navbar / Search Header */}
      <header className="sticky top-0 z-50 bg-github-dark/80 backdrop-blur-md border-b border-github-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-github-text rounded-full text-github-darker">
                <Icons.Code size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">GitInsight</h1>
          </div>
          
          <form onSubmit={onSearchSubmit} className="w-full sm:w-96 relative">
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search username (e.g., torvalds)" 
              className="w-full bg-github-darker border border-github-border rounded-md py-2 pl-10 pr-4 text-sm text-white placeholder-github-muted focus:outline-none focus:border-github-accent focus:ring-1 focus:ring-github-accent transition-all"
            />
            <Icons.Search className="absolute left-3 top-2.5 text-github-muted" size={18} />
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
             <div className="w-12 h-12 border-4 border-github-accent border-t-transparent rounded-full animate-spin"></div>
             <p className="text-github-muted animate-pulse">Fetching GitHub data...</p>
          </div>
        ) : error ? (
          <div className="max-w-lg mx-auto mt-12 p-8 bg-github-darker border border-red-500/20 rounded-xl text-center shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                <Icons.Terminal size={32} className="text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Connection Issue</h2>
            <p className="text-github-muted mb-6">{error}</p>
            <button 
                onClick={() => handleSearch(username || searchInput)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-github-btn hover:bg-github-btnHover border border-github-border rounded-lg text-white text-sm font-medium transition-all"
            >
                Try Again
            </button>
          </div>
        ) : user ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar: User Profile */}
            <div className="lg:col-span-3">
              <UserProfile user={user} />
            </div>

            {/* Main Content: Stats, AI, Repos */}
            <div className="lg:col-span-9 space-y-8">
              
              {/* AI Analysis Card */}
              <AIAnalysisCard analysis={aiAnalysis} loading={aiLoading} />

              {/* Charts Section */}
              <Charts repos={repos} />

              {/* Repositories Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icons.Book className="text-github-muted" size={20} />
                    Repositories
                    <span className="bg-github-btn text-github-text text-xs px-2 py-1 rounded-full border border-github-border">
                      {user.public_repos}
                    </span>
                  </h2>
                </div>

                {repos.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-github-border rounded-lg text-github-muted">
                        User has no public repositories.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {repos.map((repo) => (
                        <RepoCard key={repo.id} repo={repo} />
                    ))}
                    </div>
                )}
              </div>
            </div>
          </div>
        ) : (
            /* Initial Empty State */
            <div className="text-center py-20 opacity-50">
                <Icons.Search size={64} className="mx-auto mb-4 text-github-muted" />
                <p className="text-xl">Search for a GitHub user to get started.</p>
            </div>
        )}
      </main>
    </div>
  );
}

export default App;