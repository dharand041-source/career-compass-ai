import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, DollarSign, Clock, Building, ExternalLink, Bot, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { recordActivity } from "@/lib/supabaseLeaderboard";
import { useToast } from "@/components/ui/use-toast";

interface Job {
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
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const jobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$80,000 - $120,000",
    description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user-facing web applications using modern technologies.",
    requirements: ["React", "JavaScript", "CSS", "Git", "3+ years experience"],
    postedDate: "2 days ago",
    matchScore: 95,
    remote: true,
  },
  {
    id: "2",
    title: "Data Analyst Intern",
    company: "DataDriven Solutions",
    location: "New York, NY",
    type: "Internship",
    salary: "$25/hour",
    description: "Join our data team as an intern and learn how to analyze large datasets, create visualizations, and derive insights from data.",
    requirements: ["Python", "SQL", "Excel", "Statistics", "Enrolled in college"],
    postedDate: "1 week ago",
    matchScore: 88,
    remote: false,
  },
  {
    id: "3",
    title: "UX Designer",
    company: "Creative Agency",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$70,000 - $90,000",
    description: "Design intuitive user experiences for web and mobile applications. Work closely with product managers and developers.",
    requirements: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "2+ years experience"],
    postedDate: "3 days ago",
    matchScore: 82,
    remote: true,
  },
  {
    id: "4",
    title: "Backend Engineer",
    company: "StartupXYZ",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$90,000 - $130,000",
    description: "Build scalable backend systems and APIs. Work with microservices architecture and cloud technologies.",
    requirements: ["Node.js", "Python", "AWS", "Docker", "MongoDB", "5+ years experience"],
    postedDate: "5 days ago",
    matchScore: 76,
    remote: false,
  },
];

const JobsInternships = () => {
  const { toast } = useToast();
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI Job Assistant. I can help you prepare for job applications, review your resume, or suggest improvements. What would you like help with?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const applyFilters = () => {
    const filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesType = !typeFilter || job.type === typeFilter;
      const matchesRemote = !remoteOnly || job.remote;

      return matchesSearch && matchesLocation && matchesType && matchesRemote;
    });

    // Sort by match score
    filtered.sort((a, b) => b.matchScore - a.matchScore);

    setFilteredJobs(filtered);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: chatInput,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateAIResponse(chatInput);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes("resume") || input.includes("cv")) {
      return "For your resume, focus on quantifiable achievements. Instead of 'Responsible for team projects', say 'Led a team of 5 to deliver a project 2 weeks early, resulting in 15% cost savings'. Would you like me to review a specific section?";
    } else if (input.includes("interview")) {
      return "Prepare for interviews by researching the company, practicing STAR method for behavioral questions, and preparing technical questions. Common questions: 'Tell me about yourself', 'Why do you want to work here?', 'What's your greatest weakness?'";
    } else if (input.includes("cover letter")) {
      return "A good cover letter should be 3-4 paragraphs: introduction with how you found the job, body highlighting relevant experience, conclusion with call to action. Keep it under 400 words and customize for each application.";
    } else if (input.includes("salary") || input.includes("negotiate")) {
      return "Research salary ranges on sites like Glassdoor or Levels.fyi. Consider your experience, location, and company size. Practice negotiation: 'Based on my research and experience, I'm looking for X-Y range. What do you think?'";
    } else {
      return "I can help with resume reviews, interview preparation, cover letter writing, salary negotiation, or general job search advice. What specific area would you like assistance with?";
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-yellow-100 text-yellow-800";
    return "bg-orange-100 text-orange-800";
  };

  return (
    <div className="min-h-screen animated-gradient-bg">
      <div className="container mx-auto max-w-7xl px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Jobs & Internships
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Matched opportunities based on your skills and career path.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <Input
                    placeholder="Job title, company, or keywords"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="City, State, or Remote"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Job Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote"
                    checked={remoteOnly}
                    onCheckedChange={setRemoteOnly}
                  />
                  <label htmlFor="remote" className="text-sm font-medium">
                    Remote only
                  </label>
                </div>

                <Button onClick={applyFilters} className="w-full">
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="jobs" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="jobs">Job Listings ({filteredJobs.length})</TabsTrigger>
                <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
              </TabsList>

              <TabsContent value="jobs" className="mt-6">
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <Card
                      key={job.id}
                      className="cursor-pointer transition-all hover:shadow-lg"
                      onClick={() => setSelectedJob(job)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{job.title}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                              <Building className="h-4 w-4" />
                              <span>{job.company}</span>
                              <MapPin className="h-4 w-4 ml-2" />
                              <span>{job.location}</span>
                              {job.remote && <Badge variant="secondary">Remote</Badge>}
                            </div>
                          </div>
                          <Badge className={getMatchScoreColor(job.matchScore)}>
                            {job.matchScore}% match
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.salary}</span>
                            </div>
                            <Badge variant="outline">{job.type}</Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{job.postedDate}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="assistant" className="mt-6">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <CardTitle>AI Job Assistant</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.isBot
                                  ? "bg-primary/10 text-foreground"
                                  : "bg-primary text-primary-foreground"
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <span className="text-xs opacity-70 mt-1 block">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleChatSend()}
                          placeholder="Ask for help with job applications..."
                          className="flex-1"
                        />
                        <Button onClick={handleChatSend} size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Job Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedJob ? (
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-lg">{selectedJob.title}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{selectedJob.company}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{selectedJob.location}</span>
                    {selectedJob.remote && <Badge variant="secondary">Remote</Badge>}
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-medium">{selectedJob.salary}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Posted {selectedJob.postedDate}</span>
                  </div>

                  <Badge className={getMatchScoreColor(selectedJob.matchScore)}>
                    {selectedJob.matchScore}% match
                  </Badge>

                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <ul className="text-sm space-y-1">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      recordActivity("job", 30)
                        .then(() => {
                          toast({
                            title: "Application started",
                            description: "You've earned 30 points for applying.",
                          });
                        })
                        .catch(() => {
                          // ignore if user isn't logged in
                        });
                      window.open("https://example.com/apply", "_blank");
                    }}
                  >
                    Apply Now <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-8">
                <CardContent className="p-6 text-center text-muted-foreground">
                  <p>Select a job to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsInternships;