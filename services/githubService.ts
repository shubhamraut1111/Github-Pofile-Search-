import { GitHubUser, GitHubRepo } from '../types';

const BASE_URL = 'https://api.github.com';

const handleError = async (response: Response) => {
  if (response.status === 404) {
    throw new Error('User not found. Please check the username and try again.');
  }
  
  if (response.status === 403) {
    const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
    if (rateLimitRemaining === '0') {
      const resetTime = response.headers.get('x-ratelimit-reset');
      const resetDate = resetTime 
        ? new Date(parseInt(resetTime) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'later';
      throw new Error(`API rate limit exceeded. Reset at ${resetDate}.`);
    }
    throw new Error('Access forbidden. You may have been blocked by GitHub.');
  }

  if (response.status >= 500) {
    throw new Error('GitHub API is experiencing issues. Please try again later.');
  }

  throw new Error(`GitHub API Error (${response.status}): ${response.statusText}`);
};

export const fetchUser = async (username: string): Promise<GitHubUser> => {
  try {
    const response = await fetch(`${BASE_URL}/users/${username}`);
    if (!response.ok) {
      await handleError(response);
    }
    return response.json();
  } catch (error: any) {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

export const fetchUserRepos = async (username: string): Promise<GitHubRepo[]> => {
  try {
    const response = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=100`);
    if (!response.ok) {
      await handleError(response);
    }
    return response.json();
  } catch (error: any) {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};