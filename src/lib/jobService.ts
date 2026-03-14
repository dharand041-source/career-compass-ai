import { jobListings } from "@/data/careers";
import { careers } from "@/data/careers";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Internship" | "Contract";
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  matchScore: number;
  remote: boolean;
  applyUrl?: string;
}

export interface UserProfile {
  careerId: string;
  skills: string[];
  completedModules: number;
  assessmentScore: number;
}

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate match score based on user skills and job requirements
export const calculateMatchScore = (userSkills: string[], jobRequirements: string[]): number => {
  if (!userSkills || !Array.isArray(userSkills) || userSkills.length === 0) return 0;
  if (!jobRequirements || !Array.isArray(jobRequirements) || jobRequirements.length === 0) return 0;

  const matchedSkills = jobRequirements.filter(req =>
    userSkills.some(skill =>
      skill && req &&
      skill.toLowerCase().includes(req.toLowerCase()) ||
      req.toLowerCase().includes(skill.toLowerCase())
    )
  );

  const matchPercentage = (matchedSkills.length / jobRequirements.length) * 100;
  return Math.round(Math.max(0, Math.min(100, matchPercentage)));
};

// Get user profile from localStorage or create default
export const getUserProfile = (): UserProfile | null => {
  try {
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the parsed data
      if (parsed && typeof parsed === 'object' &&
          typeof parsed.careerId === 'string' &&
          Array.isArray(parsed.skills)) {
        return parsed as UserProfile;
      }
    }
  } catch (error) {
    console.warn('Error reading user profile from localStorage:', error);
  }

  // Return default profile if none exists or parsing failed
  return {
    careerId: 'software-dev',
    skills: ['JavaScript', 'HTML/CSS'],
    completedModules: 2,
    assessmentScore: 12
  };
};

// Save user profile to localStorage
export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

// Fetch jobs based on user profile
export const fetchJobsForUser = async (userProfile?: UserProfile): Promise<Job[]> => {
  try {
    // Simulate API delay
    await delay(1000);

    const profile = userProfile || getUserProfile();
    
    if (!profile) {
      // Return some default jobs if no profile
      const defaultJobs = jobListings.slice(0, 4).map(job => ({
        id: job.id?.toString() || 'default-id',
        title: job.title || 'Untitled Position',
        company: job.company || 'Company',
        location: job.location || 'Location',
        type: (job.type as Job['type']) || 'Full-time',
        salary: job.salary || 'Salary not specified',
        description: `Exciting opportunity at ${job.company || 'Company'} for a ${job.title || 'Position'}. This role involves working with ${Array.isArray(job.skills) ? job.skills.join(', ') : 'various skills'} and offers competitive compensation.`,
        requirements: Array.isArray(job.skills) ? job.skills : [],
        postedDate: `${Math.floor(Math.random() * 7) + 1} days ago`,
        matchScore: Math.floor(Math.random() * 40) + 60, // 60-100% match
        remote: Math.random() > 0.5,
        applyUrl: `https://example.com/apply/${job.id || 'default'}`
      }));
      return defaultJobs;
    }

    const career = careers.find(c => c.id === profile.careerId);
    const userSkills = career ? career.skills : (Array.isArray(profile.skills) ? profile.skills : []);

    // Filter and score jobs based on user profile
    const matchedJobs = jobListings
      .filter(job => {
        if (!job || typeof job !== 'object') return false;
        
        // If user has completed few modules, show entry-level positions
        if (profile.completedModules < 3) {
          return job.type === 'Internship' || (job.title && job.title.toLowerCase().includes('junior'));
        }

        // Match based on skills
        const matchScore = calculateMatchScore(userSkills, Array.isArray(job.skills) ? job.skills : []);
        return matchScore >= 30; // At least 30% skill match
      })
      .map(job => {
        if (!job || typeof job !== 'object') {
          return null;
        }
        
        const matchScore = calculateMatchScore(userSkills, Array.isArray(job.skills) ? job.skills : []);

        // Boost score based on progress and assessment performance
        let finalScore = matchScore;
        if (profile.completedModules > 5) finalScore += 10;
        if (profile.assessmentScore > 12) finalScore += 5;
        finalScore = Math.min(finalScore, 100);

        return {
          id: job.id?.toString() || 'job-id',
          title: job.title || 'Untitled Position',
          company: job.company || 'Company',
          location: job.location || 'Location',
          type: (job.type as Job['type']) || 'Full-time',
          salary: job.salary || 'Salary not specified',
          description: `Exciting opportunity at ${job.company || 'Company'} for a ${job.title || 'Position'}. This role involves working with ${Array.isArray(job.skills) ? job.skills.join(', ') : 'various skills'} and offers competitive compensation.`,
          requirements: Array.isArray(job.skills) ? job.skills : [],
          matchScore: finalScore,
          postedDate: `${Math.floor(Math.random() * 7) + 1} days ago`,
          remote: Math.random() > 0.5,
          applyUrl: `https://example.com/apply/${job.id || 'job'}`
        };
      })
      .filter(job => job !== null) as Job[]; // Filter out null values

    return matchedJobs;
  } catch (error) {
    console.error('Error in fetchJobsForUser:', error);
    throw new Error(`Failed to fetch jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Search jobs with filters
export const searchJobs = async (
  query: string = '',
  typeFilter: string = '',
  locationFilter: string = '',
  remoteOnly: boolean = false,
  userProfile?: UserProfile
): Promise<Job[]> => {
  const allJobs = await fetchJobsForUser(userProfile);

  return allJobs.filter(job => {
    const matchesQuery = !query ||
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase());

    const matchesType = !typeFilter || job.type === typeFilter;
    const matchesLocation = !locationFilter ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesRemote = !remoteOnly || job.remote;

    return matchesQuery && matchesType && matchesLocation && matchesRemote;
  });
};

// Update user profile when they complete modules or assessments
export const updateUserProgress = (careerId: string, completedModules: number, assessmentScore: number): void => {
  const profile = getUserProfile() || {
    careerId,
    skills: [],
    completedModules: 0,
    assessmentScore: 0
  };

  const career = careers.find(c => c.id === careerId);
  const updatedProfile: UserProfile = {
    ...profile,
    careerId,
    skills: career ? career.skills.slice(0, completedModules + 2) : profile.skills,
    completedModules,
    assessmentScore
  };

  saveUserProfile(updatedProfile);
};