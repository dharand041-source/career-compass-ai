import { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ResumeData {
  education?: string[];
  experience?: string[];
  skills?: string[];
  projects?: string[];
  [key: string]: unknown;
}

interface ChatbotProps {
  onResumeUpdate?: (data: ResumeData) => void;
}

const Chatbot = ({ onResumeUpdate }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI Resume Assistant. I can help you build a professional resume. What would you like to start with? (e.g., education, experience, skills)",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("education")) {
      return "Great! Let's add your education. What degree did you earn, from which university, and when did you graduate? For example: 'Bachelor of Computer Science from MIT, 2020'";
    } else if (lowerMessage.includes("experience")) {
      return "Perfect! Tell me about your work experience. Include your job title, company, dates, and key responsibilities. For example: 'Software Engineer at Google, 2021-Present, developed web applications using React and Node.js'";
    } else if (lowerMessage.includes("skills")) {
      return "Excellent! What are your technical and soft skills? List them with proficiency levels. For example: 'JavaScript (Expert), Python (Intermediate), Communication (Strong)'";
    } else if (lowerMessage.includes("projects")) {
      return "Awesome! Describe your notable projects. Include the project name, technologies used, and your role. For example: 'E-commerce website using React, Node.js, and MongoDB - Led frontend development'";
    } else {
      return "I can help you with education, experience, skills, projects, or career goals. What section would you like to work on?";
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: simulateAIResponse(input),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">AI Resume Assistant</h3>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
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

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;