import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hi! I'm your AI Career Assistant. I can help you with career guidance, platform navigation, job search advice, and skill development. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Suggested questions
  const suggestedQuestions = [
    "Suggest skills for AI/ML",
    "Help me build a resume",
    "Find internships for beginners",
    "What career path should I choose?",
    "How does the personalized roadmap work?",
    "Improve my interview skills",
    "Create a project portfolio",
    "Job search strategies",
  ];

  const quickActions = [
    { label: "Suggest Skills", action: "suggest-skills", icon: "🧠" },
    { label: "Resume Help", action: "resume-help", icon: "📄" },
    { label: "Find Jobs", action: "find-jobs", icon: "💼" },
    { label: "Career Advice", action: "career-advice", icon: "🎯" },
  ];

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();

    // Quick action responses
    if (lowerMessage.includes("suggest skills") || lowerMessage.includes("suggest-skills")) {
      return "🎯 **Skill Recommendations for Your Career Path:**\n\nBased on your current progress, here are the most valuable skills to focus on:\n\n**Technical Skills:**\n• Programming (Python/JavaScript)\n• Data Structures & Algorithms\n• Version Control (Git)\n• Cloud Platforms (AWS/GCP)\n\n**Soft Skills:**\n• Problem Solving\n• Communication\n• Project Management\n• Continuous Learning\n\n**Next Steps:** Take our career assessment to get personalized recommendations, then follow your custom roadmap!";
    }

    if (lowerMessage.includes("resume help") || lowerMessage.includes("build resume")) {
      return "📄 **Resume Building Guide:**\n\n**Key Sections to Include:**\n1. **Contact Information** - Professional email, LinkedIn, GitHub\n2. **Professional Summary** - 2-3 sentences highlighting your strengths\n3. **Skills Section** - Technical skills, tools, languages\n4. **Experience** - Projects, internships, relevant work\n5. **Education** - Degree, GPA, relevant coursework\n\n**Pro Tips:**\n• Use action verbs (Developed, Created, Improved)\n• Quantify achievements (Increased performance by 40%)\n• Keep it to 1 page\n• Tailor for each job application\n\nUse our AI Resume Builder to get instant feedback and scoring!";
    }

    if (lowerMessage.includes("find jobs") || lowerMessage.includes("internships")) {
      return "💼 **Job & Internship Search Strategy:**\n\n**Where to Look:**\n• LinkedIn Jobs\n• Indeed, Glassdoor\n• Company career pages\n• AngelList (for startups)\n• Your university's career center\n\n**Pro Tips:**\n• Set up job alerts for your target roles\n• Network on LinkedIn - connect with alumni\n• Customize your resume for each application\n• Follow up 1 week after applying\n• Practice coding interviews on LeetCode\n\n**Our Platform:** Check the Jobs & Internships section for AI-matched opportunities based on your skills!";
    }

    if (lowerMessage.includes("career advice") || lowerMessage.includes("career path")) {
      return "🎯 **Career Path Guidance:**\n\n**Steps to Choose Your Path:**\n1. **Self-Assessment** - What are you passionate about?\n2. **Skills Inventory** - What are you good at?\n3. **Market Research** - What's in demand?\n4. **Try It Out** - Take our career assessment!\n\n**Popular Tech Career Paths:**\n• **Software Development** - Build applications and systems\n• **Data Science** - Analyze data and build ML models\n• **Product Management** - Lead product development\n• **DevOps** - Bridge development and operations\n• **Cybersecurity** - Protect digital assets\n\n**My Advice:** Start with our AI career assessment to get data-driven recommendations based on your interests and skills!";
    }

    // Career guidance responses
    if (lowerMessage.includes("skill") || lowerMessage.includes("learn")) {
      if (lowerMessage.includes("ai") || lowerMessage.includes("machine learning")) {
        return "🤖 **AI/ML Learning Path:**\n\n**Foundation (4-6 weeks):**\n• Python programming\n• Mathematics (Linear Algebra, Calculus)\n• Statistics & Probability\n\n**Core Skills (8-12 weeks):**\n• Machine Learning algorithms\n• Deep Learning (TensorFlow/PyTorch)\n• Data preprocessing\n• Model evaluation\n\n**Advanced (Ongoing):**\n• Computer Vision\n• NLP (Natural Language Processing)\n• MLOps & deployment\n\n**Resources:** Start with our AI Engineer career path assessment!";
      }
      if (lowerMessage.includes("web") || lowerMessage.includes("frontend")) {
        return "🌐 **Web Development Roadmap:**\n\n**Frontend Fundamentals:**\n• HTML, CSS, JavaScript\n• Responsive design\n• Version control (Git)\n\n**Modern Frameworks:**\n• React/Vue/Angular\n• State management\n• API integration\n\n**Advanced Topics:**\n• Performance optimization\n• Testing\n• Deployment (Vercel/Netlify)\n\n**Pro Tip:** Build projects! Create a portfolio website first.";
      }
      if (lowerMessage.includes("data") || lowerMessage.includes("analyst")) {
        return "📊 **Data Analysis Skills:**\n\n**Technical Skills:**\n• SQL for data querying\n• Python/R for analysis\n• Excel/Google Sheets\n• Data visualization (Tableau, Power BI)\n\n**Key Concepts:**\n• Statistics & probability\n• Data cleaning & preprocessing\n• Exploratory data analysis\n• A/B testing\n\n**Career Path:** Data Analyst → Data Scientist → ML Engineer";
      }
    }

    // Platform navigation
    if (lowerMessage.includes("assessment") || lowerMessage.includes("test")) {
      return "🧪 **Career Assessment Guide:**\n\nThe assessment evaluates your skills and interests to recommend the best career paths. Here's how it works:\n\n1. **Choose a Career** - Select from Software Dev, Data Science, etc.\n2. **Answer Questions** - Multiple choice questions testing your knowledge\n3. **Get Results** - Personalized score and skill gap analysis\n4. **Custom Roadmap** - Step-by-step learning plan\n\n**Pro Tip:** Be honest with your current skill level for accurate recommendations!";
    }

    if (lowerMessage.includes("roadmap") || lowerMessage.includes("personalized")) {
      return "🗺️ **Personalized Roadmap Explained:**\n\nYour roadmap is an AI-generated learning path based on your assessment results:\n\n**Features:**\n• **Skill Modules** - Step-by-step learning topics\n• **Video Resources** - Curated YouTube tutorials\n• **Progress Tracking** - Mark completed modules\n• **Adaptive Learning** - Adjusts based on your pace\n\n**How to Use:**\n1. Start with foundational skills\n2. Complete modules in order\n3. Practice with projects\n4. Track your progress on the dashboard\n\n**Gamification:** Earn points and badges as you learn!";
    }

    if (lowerMessage.includes("video") || lowerMessage.includes("learning")) {
      return "🎥 **Video Learning System:**\n\n**How It Works:**\n• **Curated Content** - Hand-picked tutorials for each skill\n• **Structured Learning** - Videos organized by difficulty\n• **Progress Tracking** - Mark videos as watched\n• **Project Integration** - Apply skills in real projects\n\n**Tips for Success:**\n• Watch videos at 1.5x speed\n• Take notes while learning\n• Practice immediately after each video\n• Join study groups for accountability";
    }

    if (lowerMessage.includes("resume") || lowerMessage.includes("cv")) {
      return "📄 **Resume Optimization:**\n\n**AI Resume Builder Features:**\n• **Smart Templates** - ATS-friendly designs\n• **Content Analysis** - AI scoring and suggestions\n• **Keyword Optimization** - Match job descriptions\n• **Export Options** - PDF, Word, LinkedIn\n\n**Scoring Factors:**\n• Skills matching (30%)\n• Experience relevance (25%)\n• Education (20%)\n• Formatting (15%)\n• Keywords (10%)\n\n**Pro Tip:** Get a 75+ score before applying to jobs!";
    }

    if (lowerMessage.includes("job") || lowerMessage.includes("internship")) {
      return "💼 **Smart Job Matching:**\n\n**AI-Powered Features:**\n• **Skill-Based Matching** - Jobs that match your abilities\n• **Experience Level** - Entry, mid, senior positions\n• **Location Preferences** - Remote, hybrid, on-site\n• **Salary Insights** - Market rate information\n\n**Application Strategy:**\n1. Filter by your skill level\n2. Read job descriptions carefully\n3. Customize your resume\n4. Prepare for technical interviews\n5. Follow up after applying";
    }

    // Job search advice
    if (lowerMessage.includes("interview") || lowerMessage.includes("prepare")) {
      return "🎤 **Interview Preparation:**\n\n**Technical Interviews:**\n• **Coding Problems** - Practice on LeetCode, HackerRank\n• **System Design** - Learn scalability concepts\n• **Data Structures** - Master arrays, trees, graphs\n• **Algorithms** - Sorting, searching, dynamic programming\n\n**Behavioral Questions:**\n• Tell me about yourself\n• Why this company?\n• Describe a challenge you overcame\n• Where do you see yourself in 5 years?\n\n**Practice Platforms:** LeetCode, Pramp, Interviewing.io";
    }

    if (lowerMessage.includes("beginner") || lowerMessage.includes("entry level")) {
      return "🌱 **Beginner Career Advice:**\n\n**Your Advantages:**\n• Fresh perspective\n• Latest technologies\n• High learning capacity\n• No bad habits to break\n\n**Focus Areas:**\n1. **Build Projects** - GitHub portfolio is crucial\n2. **Learn Fundamentals** - Don't skip basics\n3. **Network** - Attend meetups, join communities\n4. **Get Experience** - Internships, freelance, open source\n\n**Mindset:** Consistency beats intensity. Code 1 hour daily > 7 hours once a week.";
    }

    // General career advice
    if (lowerMessage.includes("career") || lowerMessage.includes("path")) {
      return "🎯 **Career Development Strategy:**\n\n**Short-term (6 months):**\n• Complete career assessment\n• Build 3-5 key projects\n• Learn one new technology deeply\n• Network with 5 industry professionals\n\n**Medium-term (1-2 years):**\n• Get first job/internship\n• Specialize in one area\n• Build personal brand (LinkedIn, blog)\n• Continuous learning habit\n\n**Long-term (3+ years):**\n• Leadership roles\n• Mentoring others\n• Industry expertise\n• Work-life balance\n\n**Remember:** Career paths are rarely linear. Adapt and learn continuously!";
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("how")) {
      return "I can help you navigate the platform! Try asking about: career assessments, personalized roadmaps, video learning, resume building, job search, or specific skills you want to learn. What would you like to explore?";
    }

    // Default responses
    const defaultResponses = [
      "I'm your AI Career Mentor! I can help you with career guidance, skill development, resume building, job search, and platform navigation. What specific area would you like assistance with?",
      "As your career coach, I'm here to guide you through every step of your professional journey. Whether it's choosing a career path, learning new skills, or landing your dream job, I've got your back!",
      "Welcome to your personalized career development experience! I specialize in helping ambitious individuals like you accelerate their career growth. What challenges are you facing right now?",
      "I'm excited to be your AI career mentor! With the right guidance and consistent effort, you can achieve amazing things in your career. What would you like to focus on today?",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await generateAIResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="w-80 sm:w-96 h-[500px] flex flex-col shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Career Assistant
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            message.isBot
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Suggested Questions */}
                {messages.length === 1 && (
                  <div className="p-4 border-t">
                    <p className="text-xs text-muted-foreground mb-3">Quick actions:</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {quickActions.map((action) => (
                        <button
                          key={action.action}
                          onClick={() => handleSuggestedQuestion(action.action)}
                          className="flex items-center gap-2 p-2 text-xs bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <span>{action.icon}</span>
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Or ask me:</p>
                    <div className="flex flex-wrap gap-1">
                      {suggestedQuestions.slice(0, 4).map((question, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80 text-xs"
                          onClick={() => handleSuggestedQuestion(question)}
                        >
                          {question}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything about your career..."
                      onKeyPress={handleKeyPress}
                      disabled={isTyping}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isTyping}
                      size="icon"
                    >
                      {isTyping ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot;