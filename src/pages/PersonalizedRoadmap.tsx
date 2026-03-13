import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight, CheckCircle, Clock, BookOpen, Code, Users } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  resources: string[];
  projects: string[];
  completed: boolean;
}

interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  items: RoadmapItem[];
  isOpen: boolean;
}

const careerRoadmaps: Record<string, RoadmapPhase[]> = {
  "software developer": [
    {
      id: "fundamentals",
      title: "Programming Fundamentals",
      description: "Build a strong foundation in programming concepts",
      isOpen: true,
      items: [
        {
          id: "html-css",
          title: "HTML & CSS",
          description: "Learn web markup and styling",
          duration: "2-3 weeks",
          difficulty: "Beginner",
          resources: ["freeCodeCamp HTML/CSS", "MDN Web Docs", "CSS Tricks"],
          projects: ["Personal portfolio website", "Responsive landing page"],
          completed: false,
        },
        {
          id: "javascript",
          title: "JavaScript Fundamentals",
          description: "Master the language of the web",
          duration: "4-6 weeks",
          difficulty: "Beginner",
          resources: ["Eloquent JavaScript", "JavaScript.info", "MDN JavaScript Guide"],
          projects: ["Calculator app", "Todo list application"],
          completed: false,
        },
        {
          id: "git",
          title: "Version Control with Git",
          description: "Learn collaborative development",
          duration: "1 week",
          difficulty: "Beginner",
          resources: ["Git Documentation", "Learn Git Branching"],
          projects: ["Create GitHub repository", "Collaborate on open source"],
          completed: false,
        },
      ],
    },
    {
      id: "frontend",
      title: "Frontend Development",
      description: "Create interactive user interfaces",
      isOpen: false,
      items: [
        {
          id: "react",
          title: "React.js",
          description: "Build modern web applications",
          duration: "6-8 weeks",
          difficulty: "Intermediate",
          resources: ["React Official Docs", "React Tutorial", "Fullstack React"],
          projects: ["E-commerce site", "Social media dashboard"],
          completed: false,
        },
        {
          id: "state-management",
          title: "State Management",
          description: "Manage complex application state",
          duration: "2-3 weeks",
          difficulty: "Intermediate",
          resources: ["Redux Toolkit", "Zustand", "React Query"],
          projects: ["Task management app", "Real-time chat application"],
          completed: false,
        },
      ],
    },
    {
      id: "backend",
      title: "Backend Development",
      description: "Build server-side applications",
      isOpen: false,
      items: [
        {
          id: "nodejs",
          title: "Node.js & Express",
          description: "Server-side JavaScript development",
          duration: "4-6 weeks",
          difficulty: "Intermediate",
          resources: ["Node.js Docs", "Express.js Guide", "REST API Design"],
          projects: ["API for blog platform", "Authentication system"],
          completed: false,
        },
        {
          id: "database",
          title: "Database Design",
          description: "Store and manage data effectively",
          duration: "3-4 weeks",
          difficulty: "Intermediate",
          resources: ["SQLZoo", "MongoDB University", "PostgreSQL Tutorial"],
          projects: ["User management system", "E-commerce database"],
          completed: false,
        },
      ],
    },
  ],
  "data scientist": [
    {
      id: "math-stats",
      title: "Mathematics & Statistics",
      description: "Essential mathematical foundations",
      isOpen: true,
      items: [
        {
          id: "linear-algebra",
          title: "Linear Algebra",
          description: "Vectors, matrices, and transformations",
          duration: "4-6 weeks",
          difficulty: "Intermediate",
          resources: ["Khan Academy Linear Algebra", "3Blue1Brown Essence of linear algebra"],
          projects: ["Matrix operations library", "Image transformations"],
          completed: false,
        },
        {
          id: "statistics",
          title: "Statistics & Probability",
          description: "Statistical analysis and probability theory",
          duration: "6-8 weeks",
          difficulty: "Intermediate",
          resources: ["StatQuest on YouTube", "OpenIntro Statistics"],
          projects: ["Statistical analysis of datasets", "Hypothesis testing experiments"],
          completed: false,
        },
      ],
    },
  ],
  "ux designer": [
    {
      id: "design-fundamentals",
      title: "Design Fundamentals",
      description: "Core principles of visual design",
      isOpen: true,
      items: [
        {
          id: "color-theory",
          title: "Color Theory & Typography",
          description: "Understanding visual communication",
          duration: "2-3 weeks",
          difficulty: "Beginner",
          resources: ["Adobe Color", "Google Fonts", "The Non-Designer's Design Book"],
          projects: ["Color palette creation", "Typography hierarchy design"],
          completed: false,
        },
        {
          id: "figma",
          title: "Figma & Design Tools",
          description: "Master design software",
          duration: "3-4 weeks",
          difficulty: "Beginner",
          resources: ["Figma Tutorials", "Design+Code", "The Futur"],
          projects: ["Mobile app wireframes", "Website mockups"],
          completed: false,
        },
      ],
    },
  ],
};

const PersonalizedRoadmap = () => {
  const [careerGoal, setCareerGoal] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [selectedCareer, setSelectedCareer] = useState("");

  const generateRoadmap = () => {
    const normalizedGoal = careerGoal.toLowerCase().trim();
    const availableCareers = Object.keys(careerRoadmaps);

    // Find the closest matching career
    const matchedCareer = availableCareers.find(career =>
      normalizedGoal.includes(career) || career.includes(normalizedGoal)
    ) || availableCareers[0];

    setSelectedCareer(matchedCareer);
    setRoadmap(careerRoadmaps[matchedCareer]);
  };

  const togglePhase = (phaseId: string) => {
    setRoadmap(prev => prev.map(phase =>
      phase.id === phaseId ? { ...phase, isOpen: !phase.isOpen } : phase
    ));
  };

  const toggleItemCompletion = (phaseId: string, itemId: string) => {
    setRoadmap(prev => prev.map(phase =>
      phase.id === phaseId
        ? {
            ...phase,
            items: phase.items.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          }
        : phase
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500/20 text-green-300 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]";
      case "Advanced": return "bg-red-500/20 text-red-300 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
      default: return "bg-slate-500/20 text-slate-300 border border-slate-500/30";
    }
  };

  const getCompletionStats = () => {
    const totalItems = roadmap.reduce((sum, phase) => sum + phase.items.length, 0);
    const completedItems = roadmap.reduce((sum, phase) =>
      sum + phase.items.filter(item => item.completed).length, 0
    );
    return { total: totalItems, completed: completedItems };
  };

  const stats = getCompletionStats();
  const progressPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="min-h-screen animated-gradient-bg">
      <div className="container mx-auto max-w-6xl px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Personalized Roadmap
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Get a custom learning path with the exact skills you need.
          </p>

          {!roadmap.length && (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>What's your career goal?</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="e.g., Software Developer, Data Scientist, UX Designer"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="mb-4"
                />
                <Button onClick={generateRoadmap} className="w-full" disabled={!careerGoal.trim()}>
                  Generate Roadmap
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {roadmap.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold capitalize">{selectedCareer} Roadmap</h2>
                      <p className="text-muted-foreground">
                        {stats.completed} of {stats.total} milestones completed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {Math.round(progressPercentage)}%
                      </div>
                      <Progress value={progressPercentage} className="w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {roadmap.map((phase, phaseIndex) => (
                <Card key={phase.id}>
                  <Collapsible open={phase.isOpen} onOpenChange={() => togglePhase(phase.id)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300 border-b border-[rgba(255,255,255,0.05)]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {phase.isOpen ? <ChevronDown className="h-5 w-5 text-cyan-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
                            <div>
                              <CardTitle className="text-xl text-white">{phase.title}</CardTitle>
                              <p className="text-sm text-slate-400 mt-1">{phase.description}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 bg-cyan-500/10">
                            {phase.items.filter(item => item.completed).length}/{phase.items.length} completed
                          </Badge>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {phase.items.map((item, itemIndex) => (
                            <div
                              key={item.id}
                              className={`p-4 rounded-xl border transition-all duration-300 ${
                                item.completed ? 'bg-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.2)]'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3">
                                  <button
                                    onClick={() => toggleItemCompletion(phase.id, item.id)}
                                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                                      item.completed
                                        ? 'bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                                        : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.3)] hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                                    }`}
                                  >
                                    {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                                  </button>
                                  <div>
                                    <h4 className={`font-semibold ${item.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                                      {item.title}
                                    </h4>
                                    <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <Badge className={getDifficultyColor(item.difficulty)}>
                                    {item.difficulty}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {item.duration}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">Recommended Resources</span>
                                  </div>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    {item.resources.map((resource, idx) => (
                                      <li key={idx}>• {resource}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Code className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">Suggested Projects</span>
                                  </div>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    {item.projects.map((project, idx) => (
                                      <li key={idx}>• {project}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button onClick={() => setRoadmap([])} variant="outline">
                Create New Roadmap
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PersonalizedRoadmap;