import { Job, calculateMatchScore } from './jobService';
import { jobListings, careers } from '@/data/careers';
import { CAREER_COACH_PROMPT } from './prompts';

interface CoachingResponse {
  topMatches: {
    title: string;
    company: string;
    source: string;
    score: number;
  }[];
  explanation: string;
  actionPlan: string[];
  adjacentRoles?: string[];
}

/**
 * simulatedAiCoach
 * Implements the logic described in the Career Coach System Prompt.
 * Even though we don't have a real LLM API here, we follow the prompt's
 * specific instructions for analysis, matching, and formatting.
 */
export const getAiCoaching = async (userSkills: string[], resumeData: any): Promise<CoachingResponse> => {
  // Task 1: Resume Analysis (Simulated)
  // We already have userSkills. We can extract more from resumeData if provided.
  const technicalSkills = userSkills;
  const softSkills = ["Communication", "Teamwork", "Problem Solving"]; // Default mock
  
  // Task 2: Real-time Matching
  // Filter jobs from our "real-time" mock list
  const allJobs = jobListings.map(job => {
    const score = calculateMatchScore(technicalSkills, job.skills);
    return { ...job, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore);

  const top3 = allJobs.slice(0, 3).map(job => ({
    title: job.title,
    company: job.company,
    source: ["LinkedIn", "Internshala", "Indeed"][Math.floor(Math.random() * 3)], // Mock source
    score: job.matchScore
  }));

  // Identify Skill Gaps
  const bestMatch = allJobs[0];
  const missingSkills = bestMatch.skills.filter(s => 
    !technicalSkills.some(us => us.toLowerCase().includes(s.toLowerCase()))
  );

  // Task 3: Output Formatting
  
  // Why You Match (2 sentences)
  const explanation = `Your experience with ${technicalSkills.slice(0, 2).join(" and ")} makes you a strong candidate for ${top3[0].title} roles. specifically, your work in ${resumeData.projects || "relevant projects"} directly aligns with the technical requirements of ${top3[0].company}.`;

  // Action Plan (2 keywords or certifications)
  const actionPlan = missingSkills.length > 0 
    ? [missingSkills[0], `${missingSkills[1] || "Cloud Architecture"} Certification`]
    : ["Advanced System Design", "Leadership in Tech"];

  // Constraint: Adjacent Roles
  let adjacentRoles: string[] = [];
  if (top3[0].score < 50) {
    // If no good match, suggest adjacent
    if (technicalSkills.some(s => s.toLowerCase().includes("python"))) {
      adjacentRoles = ["Backend Development", "Automation Engineer"];
    } else {
      adjacentRoles = ["Frontend Development", "UI Implementation"];
    }
  }

  return {
    topMatches: top3,
    explanation,
    actionPlan,
    adjacentRoles: adjacentRoles.length > 0 ? adjacentRoles : undefined
  };
};
