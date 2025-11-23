import React from 'react';
import { GitHubUser } from '../types';
import { Icons } from './Icons';

interface UserProfileProps {
  user: GitHubUser;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <img 
          src={user.avatar_url} 
          alt={user.login} 
          className="w-32 h-32 md:w-64 md:h-64 rounded-full border-4 border-github-border shadow-lg mb-4"
        />
        <h1 className="text-2xl font-bold text-white">
          {user.name}
        </h1>
        <a 
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-github-muted font-light hover:text-github-accent mb-4 block"
        >
          {user.login}
        </a>
        {user.bio && (
           <p className="text-github-text mb-4 text-sm md:text-base">
             {user.bio}
           </p>
        )}
        
        <div className="w-full grid grid-cols-2 gap-2 md:block md:space-y-2 mb-6">
             <div className="flex items-center gap-2 text-github-text">
                <Icons.Users size={16} className="text-github-muted"/>
                <span className="font-bold text-white">{user.followers}</span> 
                <span className="text-github-muted text-sm">followers</span>
             </div>
             <div className="flex items-center gap-2 text-github-text">
                <span className="font-bold text-white ml-0 md:ml-6">{user.following}</span> 
                <span className="text-github-muted text-sm">following</span>
             </div>
        </div>

        <div className="space-y-2 w-full text-sm">
          {user.company && (
            <div className="flex items-center gap-2 text-github-text">
              <Icons.Building size={16} className="text-github-muted flex-shrink-0" />
              <span>{user.company}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center gap-2 text-github-text">
              <Icons.MapPin size={16} className="text-github-muted flex-shrink-0" />
              <span>{user.location}</span>
            </div>
          )}
          {user.blog && (
            <div className="flex items-center gap-2 text-github-text overflow-hidden">
              <Icons.Link size={16} className="text-github-muted flex-shrink-0" />
              <a 
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-github-accent hover:underline truncate"
              >
                {user.blog}
              </a>
            </div>
          )}
           {user.twitter_username && (
            <div className="flex items-center gap-2 text-github-text">
              <Icons.Twitter size={16} className="text-github-muted flex-shrink-0" />
              <a 
                href={`https://twitter.com/${user.twitter_username}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-github-accent"
              >
                @{user.twitter_username}
              </a>
            </div>
          )}
           {user.email && (
            <div className="flex items-center gap-2 text-github-text">
              <Icons.Mail size={16} className="text-github-muted flex-shrink-0" />
              <a 
                href={`mailto:${user.email}`} 
                className="hover:text-github-accent"
              >
                {user.email}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
