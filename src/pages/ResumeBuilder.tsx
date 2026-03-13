import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { recordActivity } from "@/lib/supabaseLeaderboard";
import { useToast } from "@/components/ui/use-toast";

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link?: string;
  }>;
}

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
    },
    summary: "",
    education: [],
    experience: [],
    skills: [],
    projects: [],
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Simulate AI analysis
      setTimeout(() => {
        setAtsScore(Math.floor(Math.random() * 40) + 60); // Random score 60-100
        setSuggestions([
          "Add more quantifiable achievements to your experience section",
          "Include relevant keywords from the job description",
          "Consider adding a skills section with technical competencies",
          "Ensure consistent formatting throughout the resume",
        ]);
      }, 2000);
    }
  };

  const { toast } = useToast();

  const downloadPDF = async () => {
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save("resume.pdf");

      recordActivity("resume", 50)
        .then(() => {
          toast({
            title: "Resume saved",
            description: "You've earned 50 points for creating a resume.",
          });
        })
        .catch(() => {
          // ignore if not logged in
        });
    }
  };

  const calculateCompletion = () => {
    const fields = [
      resumeData.personalInfo.name,
      resumeData.personalInfo.email,
      resumeData.summary,
      ...resumeData.education,
      ...resumeData.experience,
      ...resumeData.skills,
    ];
    const filledFields = fields.filter(field => field && field.toString().trim() !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  };

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
              AI Resume Builder
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Create and analyze resumes with AI-powered scoring.
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-sm text-muted-foreground">Resume Completion:</span>
              <Progress value={calculateCompletion()} className="w-32" />
              <span className="text-sm font-medium">{calculateCompletion()}%</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="builder" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="builder">Resume Builder</TabsTrigger>
                  <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="builder" className="space-y-6">
                  <ResumeForm data={resumeData} onChange={setResumeData} />
                </TabsContent>

                <TabsContent value="upload" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload Existing Resume
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="resume-upload"
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer">
                          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-lg font-medium mb-2">
                            {uploadedFile ? uploadedFile.name : "Click to upload your resume"}
                          </p>
                          <p className="text-sm text-gray-500">
                            PDF, DOC, or DOCX files up to 10MB
                          </p>
                        </label>
                      </div>
                    </CardContent>
                  </Card>

                  {uploadedFile && (
                    <Card>
                      <CardHeader>
                        <CardTitle>AI Resume Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {atsScore !== null && (
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">ATS Score</span>
                                <span className="text-sm font-medium">{atsScore}/100</span>
                              </div>
                              <Progress value={atsScore} className="h-2" />
                            </div>
                            <div className={`p-2 rounded-full ${atsScore >= 80 ? 'bg-green-100' : atsScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                              {atsScore >= 80 ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                              )}
                            </div>
                          </div>
                        )}

                        {suggestions.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">AI Suggestions for Improvement:</h4>
                            <ul className="space-y-2">
                              {suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <span className="text-primary mt-1">•</span>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="preview">
                  <ResumePreview data={resumeData} onDownload={downloadPDF} ref={previewRef} />
                </TabsContent>
              </Tabs>
            </div>

            {/* AI Chatbot Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Chatbot onResumeUpdate={setResumeData} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeBuilder;