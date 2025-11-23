import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GitHubUser, GitHubRepo, AIAnalysisResult } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey });

export const analyzeProfile = async (
  user: GitHubUser,
  repos: GitHubRepo[]
): Promise<AIAnalysisResult> => {
  // Prepare a summarized context for the model to avoid token limits and noise
  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .map(r => ({
      name: r.name,
      description: r.description,
      language: r.language,
      topics: r.topics,
      stars: r.stargazers_count
    }));

  const languages = Array.from(new Set(repos.map(r => r.language).filter(Boolean)));
  
  const promptContext = JSON.stringify({
    username: user.login,
    name: user.name,
    bio: user.bio,
    location: user.location,
    company: user.company,
    followers: user.followers,
    top_repositories: topRepos,
    all_languages: languages,
  });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      professionalSummary: {
        type: Type.STRING,
        description: "A 2-3 sentence professional summary of the developer based on their work.",
      },
      topSkills: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Top 5 technical skills or languages derived from their repositories.",
      },
      suggestedRoles: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 potential job titles that fit this profile (e.g., Frontend Engineer, DevOps Specialist).",
      },
      funFact: {
        type: Type.STRING,
        description: "A lighthearted observation or 'vibe check' based on their coding interests (e.g., 'Likely dreams in Rust').",
      },
    },
    required: ["professionalSummary", "topSkills", "suggestedRoles", "funFact"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this GitHub user profile data and provide a professional assessment: ${promptContext}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a senior technical recruiter and engineering manager. Your goal is to provide insightful, accurate, and encouraging profiles of developers based on their public GitHub activity.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }
    return JSON.parse(text) as AIAnalysisResult;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Return a fallback if AI fails to avoid crashing the UI
    return {
      professionalSummary: "AI analysis unavailable at the moment.",
      topSkills: [],
      suggestedRoles: [],
      funFact: "Only human intelligence available right now."
    };
  }
};
