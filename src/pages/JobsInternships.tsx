import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, DollarSign, Clock, Building, ExternalLink, Bot, Send, Loader2, AlertCircle, Target, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { recordActivity } from "@/lib/supabaseLeaderboard";
import { useToast } from "@/components/ui/use-toast";
import { fetchJobsForUser, searchJobs, Job, getUserProfile, updateUserProgress } from "@/lib/jobService";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const JobsInternships = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [internships, setInternships] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI job assistant. I can help you with job search strategies, resume tips, interview preparation, and more. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching jobs for user...');
      const fetchedJobs = await fetchJobsForUser();
      console.log('Fetched jobs:', fetchedJobs);
      
      if (!Array.isArray(fetchedJobs)) {
        throw new Error('Invalid response: expected array of jobs');
      }
      
      // Separate jobs and internships
      const jobsOnly = fetchedJobs.filter(job => job && job.type !== 'Internship');
      const internshipsOnly = fetchedJobs.filter(job => job && job.type === 'Internship');
      
      setJobs(jobsOnly);
      setInternships(internshipsOnly);
      setFilteredJobs(jobsOnly);
      setFilteredInternships(internshipsOnly);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs on component mount
  useEffect(() => {
    console.log('JobsInternships component mounted');
    loadJobs();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Based on your profile, I'd recommend focusing on roles that match your current skill level.",
        "I can help you prepare for interviews. Would you like some common questions and tips?",
        "Networking is key in job hunting. Consider reaching out to professionals in your target companies.",
        "Your resume looks strong! Make sure to tailor it for each application by highlighting relevant experience.",
        "Practice makes perfect! Try mock interviews to build confidence before applying to positions."
      ];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Finding the perfect matches for you...</p>
          </div>
        ) : error ? (
          <Card className="p-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-medium">Unable to load jobs</h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
            <Button
              onClick={loadJobs}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </Card>
        ) : (
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
                    <Input placeholder="Job title, company, or keywords" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Input placeholder="City, State, or Remote" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Job Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All types</SelectItem>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remote" />
                    <label htmlFor="remote" className="text-sm font-medium">Remote only</label>
                  </div>
                  <Button className="w-full">Apply Filters</Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Tabs defaultValue="jobs" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="jobs">Jobs ({filteredJobs.length})</TabsTrigger>
                  <TabsTrigger value="internships">Internships ({filteredInternships.length})</TabsTrigger>
                  <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
                </TabsList>

                <TabsContent value="jobs" className="mt-6">
                  <div className="space-y-4">
                    {filteredJobs.length === 0 ? (
                      <Card className="p-8 text-center">
                        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No opportunities found yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Complete more modules or update your skills to unlock personalized job matches.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button variant="outline" onClick={() => window.location.href = '/roadmap'}>
                            Continue Learning
                          </Button>
                          <Button variant="outline" onClick={() => window.location.href = '/assessment'}>
                            Update Skills
                          </Button>
                        </div>
                      </Card>
                    ) : (
                      filteredJobs.map((job, index) => {
                        if (!job || typeof job !== 'object') return null;
                        return (
                          <Card
                            key={job?.id || `job-${index}`}
                            className="cursor-pointer transition-all hover:shadow-lg"
                          >
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-bold text-lg mb-1">{job?.title || 'Untitled Position'}</h3>
                                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <Building className="h-4 w-4" />
                                    <span>{job?.company || 'Company'}</span>
                                    <MapPin className="h-4 w-4 ml-2" />
                                    <span>{job?.location || 'Location'}</span>
                                    {job?.remote && <Badge variant="secondary">Remote</Badge>}
                                  </div>
                                </div>
                                {job?.matchScore && (
                                  <Badge className="bg-green-100 text-green-800">
                                    {job.matchScore}% match
                                  </Badge>
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground mb-3 overflow-hidden text-ellipsis">
                                {job?.description || 'No description available.'}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span>{job?.salary || 'Salary not specified'}</span>
                                  </div>
                                  {job?.type && <Badge variant="outline">{job.type}</Badge>}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{job?.postedDate || 'Recently posted'}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }).filter(Boolean)
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="internships" className="mt-6">
                  <div className="space-y-4">
                    {filteredInternships.length === 0 ? (
                      <Card className="p-8 text-center">
                        <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No internships found yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Complete more modules or update your skills to unlock personalized internship matches.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button variant="outline" onClick={() => window.location.href = '/roadmap'}>
                            Continue Learning
                          </Button>
                          <Button variant="outline" onClick={() => window.location.href = '/assessment'}>
                            Update Skills
                          </Button>
                        </div>
                      </Card>
                    ) : (
                      filteredInternships.map((internship, index) => {
                        if (!internship || typeof internship !== 'object') return null;
                        return (
                          <Card
                            key={internship?.id || `internship-${index}`}
                            className="cursor-pointer transition-all hover:shadow-lg"
                          >
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-bold text-lg mb-1">{internship?.title || 'Untitled Internship'}</h3>
                                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <Building className="h-4 w-4" />
                                    <span>{internship?.company || 'Company'}</span>
                                    <MapPin className="h-4 w-4 ml-2" />
                                    <span>{internship?.location || 'Location'}</span>
                                    {internship?.remote && <Badge variant="secondary">Remote</Badge>}
                                  </div>
                                </div>
                                {internship?.matchScore && (
                                  <Badge className="bg-green-100 text-green-800">
                                    {internship.matchScore}% match
                                  </Badge>
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground mb-3 overflow-hidden text-ellipsis">
                                {internship?.description || 'No description available.'}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span>{internship?.salary || 'Stipend not specified'}</span>
                                  </div>
                                  {internship?.type && <Badge variant="outline">{internship.type}</Badge>}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{internship?.postedDate || 'Recently posted'}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }).filter(Boolean)
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="assistant" className="mt-6">
                  <Card className="h-[500px] flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        AI Job Assistant
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-0">
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                                  message.isBot
                                    ? 'bg-muted text-muted-foreground'
                                    : 'bg-primary text-primary-foreground'
                                }`}
                              >
                                <p className="text-sm">{message.text}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          {isTyping && (
                            <div className="flex justify-start">
                              <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2">
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                      <div className="border-t p-4">
                        <div className="flex gap-2">
                          <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask me about job search, interviews, resumes..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            disabled={isTyping}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isTyping}
                            size="icon"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6 text-center text-muted-foreground">
                  <p>Select a job to view details</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsInternships;