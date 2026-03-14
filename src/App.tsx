import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import CareerSelect from "./pages/CareerSelect";
import Assessment from "./pages/Assessment";
import Roadmap from "./pages/Roadmap";
import Interview from "./pages/Interview";
import Dashboard from "./pages/Dashboard";
import Resume from "./pages/Resume";
import Jobs from "./pages/Jobs";
import Leaderboard from "./pages/Leaderboard";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import CareerAssessment from "./pages/CareerAssessment";
import PersonalizedRoadmap from "./pages/PersonalizedRoadmap";
import VideoLearning from "./pages/VideoLearning";
import ResumeBuilder from "./pages/ResumeBuilder";
import JobsInternships from "./pages/JobsInternships";
import Auth from "./pages/Auth";
import ErrorBoundary from "./components/ErrorBoundary";
import FloatingChatbot from "./components/FloatingChatbot";
import Portfolio from "./pages/Portfolio";
import CareerMentor from "./pages/CareerMentor";
import Verify from "./pages/Verify";
import PresentationMode from "./components/PresentationMode";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [presentationMode, setPresentationMode] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F5' && e.shiftKey) {
        e.preventDefault();
        setPresentationMode(true);
      }
      if (e.key === 'Escape' && presentationMode) {
        setPresentationMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [presentationMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/career-select" element={<CareerSelect />} />
            <Route path="/assessment/:careerId" element={<Assessment />} />
            <Route path="/roadmap/:careerId" element={<Roadmap />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/interview/:careerId" element={<Interview />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/career-assessment" element={<CareerAssessment />} />
            <Route path="/personalized-roadmap" element={<PersonalizedRoadmap />} />
            <Route path="/video-learning" element={<VideoLearning />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/jobs-internships" element={
              <ErrorBoundary>
                <JobsInternships />
              </ErrorBoundary>
            } />
            <Route path="/career-mentor" element={<CareerMentor />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingChatbot />
          <PresentationMode
            isActive={presentationMode}
            onClose={() => setPresentationMode(false)}
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
