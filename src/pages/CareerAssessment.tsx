import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { recordActivity } from "@/lib/supabaseLeaderboard";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";

interface Question {
  id: string;
  question: string;
  options: string[];
  category: string;
}

interface AssessmentResult {
  strengths: string[];
  weaknesses: string[];
  recommendedCareers: string[];
  skillGaps: string[];
  score: number;
}

const questions: Question[] = [
  {
    id: "1",
    question: "How comfortable are you with programming languages like Python, JavaScript, or Java?",
    options: ["Very comfortable - I write code daily", "Somewhat comfortable - I can solve basic problems", "Not very comfortable - I've tried but struggle", "Not comfortable at all"],
    category: "Technical Skills"
  },
  {
    id: "2",
    question: "How do you feel about working with data and analytics?",
    options: ["Love it - I enjoy finding patterns in data", "It's okay - I can handle basic analysis", "Not my favorite - I prefer other tasks", "I avoid it when possible"],
    category: "Data Skills"
  },
  {
    id: "3",
    question: "How confident are you in your communication and presentation skills?",
    options: ["Very confident - I enjoy public speaking", "Confident - I can present when needed", "Somewhat confident - I get nervous but manage", "Not confident - I avoid presentations"],
    category: "Soft Skills"
  },
  {
    id: "4",
    question: "How interested are you in designing user interfaces and user experiences?",
    options: ["Very interested - I love creating beautiful designs", "Somewhat interested - I enjoy the creative aspect", "Not very interested - I prefer functionality over design", "Not interested at all"],
    category: "Design Skills"
  },
  {
    id: "5",
    question: "How do you handle problem-solving and logical thinking?",
    options: ["Excellent - I thrive on complex problems", "Good - I can solve most problems given time", "Fair - I need guidance for difficult problems", "Poor - I struggle with logical puzzles"],
    category: "Problem Solving"
  },
];

const CareerAssessment = () => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<AssessmentResult | null>(null);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    // Simple scoring logic based on answers
    const scores = {
      technical: 0,
      data: 0,
      communication: 0,
      design: 0,
      problemSolving: 0,
    };

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;

      const answerIndex = question.options.indexOf(answer);
      const score = 4 - answerIndex; // Higher index = lower score

      switch (question.category) {
        case "Technical Skills":
          scores.technical += score;
          break;
        case "Data Skills":
          scores.data += score;
          break;
        case "Soft Skills":
          scores.communication += score;
          break;
        case "Design Skills":
          scores.design += score;
          break;
        case "Problem Solving":
          scores.problemSolving += score;
          break;
      }
    });

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 4;
    const percentageScore = Math.round((totalScore / maxScore) * 100);

    // Determine strengths and recommendations
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendedCareers: string[] = [];
    const skillGaps: string[] = [];

    if (scores.technical >= 3) strengths.push("Strong technical skills");
    else skillGaps.push("Technical programming skills");

    if (scores.data >= 3) strengths.push("Good data analysis abilities");
    else skillGaps.push("Data analysis and interpretation");

    if (scores.communication >= 3) strengths.push("Excellent communication skills");
    else skillGaps.push("Communication and presentation skills");

    if (scores.design >= 3) strengths.push("Creative design thinking");
    else skillGaps.push("UI/UX design skills");

    if (scores.problemSolving >= 3) strengths.push("Strong problem-solving abilities");
    else skillGaps.push("Logical thinking and problem-solving");

    // Career recommendations based on scores
    if (scores.technical >= 3 && scores.problemSolving >= 3) {
      recommendedCareers.push("Software Developer", "Data Scientist");
    }
    if (scores.data >= 3) {
      recommendedCareers.push("Data Analyst", "Business Intelligence Analyst");
    }
    if (scores.design >= 3 && scores.communication >= 3) {
      recommendedCareers.push("UX Designer", "Product Manager");
    }
    if (scores.communication >= 3) {
      recommendedCareers.push("Project Manager", "Business Analyst");
    }

    setResults({
      strengths,
      weaknesses,
      recommendedCareers: recommendedCareers.slice(0, 3),
      skillGaps,
      score: percentageScore,
    });
    setShowResults(true);

    // Award points for completing an assessment and update streaks
    recordActivity("assessment", 100)
      .then(() => {
        toast({
          title: "Assessment completed",
          description: "You've earned 100 points for completing this assessment.",
        });
      })
      .catch(() => {
        // Ignore errors (user may not be logged in)
      });
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults && results) {
    return (
      <div className="min-h-screen animated-gradient-bg">
        <Navbar />
        <div className="container mx-auto max-w-4xl px-6 pt-32 pb-12">
          <BackButton />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Card className="mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Assessment Results</CardTitle>
                <div className="flex justify-center mt-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{results.score}%</div>
                    <Progress value={results.score} className="w-32 mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Career Readiness Score</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓
                        </Badge>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.skillGaps.map((gap, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          ⚠
                        </Badge>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recommended Career Paths</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {results.recommendedCareers.map((career, index) => (
                    <Badge key={index} variant="outline" className="text-lg px-4 py-2">
                      {career}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button onClick={resetAssessment} size="lg">
                Take Assessment Again
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-6 pt-32 pb-12">
        <BackButton />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            AI Career Assessment
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Smart questions that evaluate your skills and find knowledge gaps.
          </p>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </motion.div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">{currentQ.question}</CardTitle>
            <Badge variant="outline">{currentQ.category}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQ.id, option)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    answers[currentQ.id] === option
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={!answers[currentQ.id]}
              >
                {currentQuestion === questions.length - 1 ? "Get Results" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareerAssessment;