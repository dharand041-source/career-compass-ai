import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ExternalLink, Github, Calendar, Tag, Star, Eye, Code, Globe } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  views: number;
  stars: number;
  createdAt: string;
  category: string;
}

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React, Node.js, and MongoDB",
      longDescription: "A comprehensive e-commerce platform featuring user authentication, product catalog, shopping cart, payment integration, and admin dashboard. Built with modern web technologies and responsive design.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
      githubUrl: "https://github.com/username/ecommerce-platform",
      liveUrl: "https://my-ecommerce-demo.vercel.app",
      featured: true,
      views: 1250,
      stars: 45,
      createdAt: "2024-01-15",
      category: "Full Stack"
    },
    {
      id: "2",
      title: "AI Chatbot Assistant",
      description: "Intelligent chatbot with natural language processing capabilities",
      longDescription: "An AI-powered chatbot that provides personalized assistance, answers questions, and helps users navigate complex systems. Features include context awareness, multi-turn conversations, and integration with various APIs.",
      technologies: ["Python", "TensorFlow", "FastAPI", "React", "WebSocket"],
      githubUrl: "https://github.com/username/ai-chatbot",
      featured: true,
      views: 890,
      stars: 32,
      createdAt: "2024-02-20",
      category: "AI/ML"
    },
    {
      id: "3",
      title: "Task Management App",
      description: "Collaborative project management tool with real-time updates",
      longDescription: "A modern task management application that allows teams to collaborate efficiently. Features include real-time updates, drag-and-drop kanban boards, time tracking, and detailed analytics.",
      technologies: ["Vue.js", "Firebase", "Vuex", "Tailwind CSS"],
      githubUrl: "https://github.com/username/task-manager",
      liveUrl: "https://taskmanager-demo.netlify.app",
      featured: false,
      views: 567,
      stars: 18,
      createdAt: "2024-03-10",
      category: "Frontend"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const categories = ["all", "Full Stack", "Frontend", "Backend", "AI/ML", "Mobile", "Other"];

  const filteredProjects = filter === "all"
    ? projects
    : projects.filter(project => project.category === filter);

  const featuredProjects = projects.filter(project => project.featured);

  const ProjectCard = ({ project, featured = false }: { project: Project; featured?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className={`${featured ? 'ring-2 ring-primary/50' : ''}`}>
        {featured && (
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-yellow-600">Featured Project</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="font-display font-semibold text-lg mb-2">{project.title}</h3>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {project.views}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {project.stars}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="flex gap-2">
            {project.githubUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <Github className="h-3 w-3" />
                  Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display text-3xl font-bold">Project Portfolio</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <GlowButton className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Project
                </GlowButton>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input id="title" placeholder="Enter project title" />
                  </div>
                  <div>
                    <Label htmlFor="description">Short Description</Label>
                    <Input id="description" placeholder="Brief project description" />
                  </div>
                  <div>
                    <Label htmlFor="longDescription">Detailed Description</Label>
                    <Textarea id="longDescription" placeholder="Detailed project description" rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                    <Input id="technologies" placeholder="React, Node.js, MongoDB" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="github">GitHub URL</Label>
                      <Input id="github" placeholder="https://github.com/username/project" />
                    </div>
                    <div>
                      <Label htmlFor="live">Live Demo URL</Label>
                      <Input id="live" placeholder="https://project-demo.vercel.app" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <GlowButton onClick={() => setIsAddDialogOpen(false)}>
                      Add Project
                    </GlowButton>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground mb-8">
            Showcase your projects and skills to potential employers and collaborators.
          </p>
        </motion.div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* All Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {filter === "all" ? "Start building your portfolio by adding your first project!" : `No ${filter.toLowerCase()} projects yet.`}
            </p>
            <GlowButton onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2 mx-auto">
              <Plus className="h-4 w-4" />
              Add Your First Project
            </GlowButton>
          </div>
        )}

        {/* Portfolio Stats */}
        <GlassCard className="mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{projects.length}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {projects.reduce((sum, p) => sum + p.technologies.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Technologies Used</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {projects.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {projects.reduce((sum, p) => sum + p.stars, 0)}
              </div>
              <div className="text-sm text-muted-foreground">GitHub Stars</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Portfolio;