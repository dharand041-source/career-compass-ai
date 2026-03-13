import { forwardRef } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface ResumePreviewProps {
  data: ResumeData;
  onDownload: () => void;
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data, onDownload }, ref) => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Resume Preview</h3>
          <Button onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>

        <div
          ref={ref}
          className="bg-white text-black p-8 rounded-lg shadow-lg max-w-4xl mx-auto"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {/* Header */}
          <div className="border-b-2 border-gray-300 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {data.personalInfo.name || "Your Name"}
            </h1>
            <div className="text-sm text-gray-600 space-y-1">
              {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
              {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
              {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
              <div className="flex gap-4 mt-2">
                {data.personalInfo.linkedin && (
                  <a href={`https://${data.personalInfo.linkedin}`} className="text-blue-600 hover:underline">
                    LinkedIn
                  </a>
                )}
                {data.personalInfo.github && (
                  <a href={`https://${data.personalInfo.github}`} className="text-blue-600 hover:underline">
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Professional Summary</h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Work Experience</h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                      <span className="text-sm text-gray-600">{exp.duration}</span>
                    </div>
                    <div className="text-gray-700 mb-2">{exp.company}</div>
                    <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Education</h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                        <div className="text-gray-700">{edu.institution}</div>
                      </div>
                      <span className="text-sm text-gray-600">{edu.year}</span>
                    </div>
                    {edu.gpa && <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Projects</h2>
              <div className="space-y-4">
                {data.projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-800">{project.name}</h3>
                      {project.link && (
                        <a
                          href={project.link}
                          className="text-blue-600 hover:underline text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{project.technologies}</div>
                    <p className="text-sm text-gray-700 leading-relaxed">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;