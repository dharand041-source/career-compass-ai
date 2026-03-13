export interface Career {
  id: string;
  title: string;
  icon: string;
  description: string;
  skills: string[];
  avgSalary: string;
}

export const careers: Career[] = [
  { id: "software-dev", title: "Software Developer", icon: "💻", description: "Build applications and systems using programming languages and frameworks.", skills: ["JavaScript", "Python", "Data Structures", "Git", "REST APIs", "SQL", "React", "Node.js"], avgSalary: "$85k - $140k" },
  { id: "data-scientist", title: "Data Scientist", icon: "📊", description: "Analyze complex data to drive business decisions using ML and statistics.", skills: ["Python", "Statistics", "Machine Learning", "SQL", "Pandas", "TensorFlow", "Data Visualization", "R"], avgSalary: "$90k - $150k" },
  { id: "web-dev", title: "Web Developer", icon: "🌐", description: "Create responsive websites and web applications.", skills: ["HTML/CSS", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Node.js", "Git", "Responsive Design"], avgSalary: "$70k - $120k" },
  { id: "uiux", title: "UI/UX Designer", icon: "🎨", description: "Design intuitive and beautiful user interfaces and experiences.", skills: ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems", "Typography", "Color Theory", "Usability Testing"], avgSalary: "$75k - $130k" },
  { id: "ai-engineer", title: "AI Engineer", icon: "🤖", description: "Build and deploy artificial intelligence and machine learning systems.", skills: ["Python", "Deep Learning", "PyTorch", "NLP", "Computer Vision", "MLOps", "Mathematics", "Cloud Platforms"], avgSalary: "$100k - $170k" },
  { id: "cybersecurity", title: "Cybersecurity Analyst", icon: "🔒", description: "Protect systems and networks from digital threats.", skills: ["Network Security", "Linux", "Ethical Hacking", "SIEM", "Firewalls", "Incident Response", "Cryptography", "Compliance"], avgSalary: "$80k - $140k" },
  { id: "devops", title: "DevOps Engineer", icon: "⚙️", description: "Bridge development and operations with automation and CI/CD.", skills: ["Docker", "Kubernetes", "CI/CD", "AWS/GCP", "Linux", "Terraform", "Monitoring", "Scripting"], avgSalary: "$90k - $155k" },
  { id: "mobile-dev", title: "Mobile Developer", icon: "📱", description: "Build native and cross-platform mobile applications.", skills: ["React Native", "Flutter", "Swift", "Kotlin", "REST APIs", "State Management", "App Store Deployment", "UI Design"], avgSalary: "$80k - $140k" },
];

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export const generateQuestions = (careerId: string): AssessmentQuestion[] => {
  const questionSets: Record<string, AssessmentQuestion[]> = {
    "software-dev": [
      { id: 1, question: "What does 'OOP' stand for?", options: ["Object-Oriented Programming", "Open Online Platform", "Output Oriented Processing", "Operational Object Protocol"], correctIndex: 0 },
      { id: 2, question: "Which data structure uses FIFO?", options: ["Stack", "Queue", "Tree", "Graph"], correctIndex: 1 },
      { id: 3, question: "What is Git used for?", options: ["Database management", "Version control", "Web hosting", "API testing"], correctIndex: 1 },
      { id: 4, question: "What does API stand for?", options: ["Application Programming Interface", "Applied Program Integration", "Automated Process Installer", "Application Protocol Index"], correctIndex: 0 },
      { id: 5, question: "Which language is primarily used for web browsers?", options: ["Python", "Java", "JavaScript", "C++"], correctIndex: 2 },
      { id: 6, question: "What is a variable?", options: ["A fixed value", "A named storage location", "A function type", "A loop construct"], correctIndex: 1 },
      { id: 7, question: "What is recursion?", options: ["A loop type", "A function calling itself", "A data structure", "A design pattern"], correctIndex: 1 },
      { id: 8, question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Question Logic", "System Quality Level", "Standard Query List"], correctIndex: 0 },
      { id: 9, question: "Which is NOT a programming paradigm?", options: ["Functional", "Object-Oriented", "Relational", "Procedural"], correctIndex: 2 },
      { id: 10, question: "What is a 'bug' in programming?", options: ["A feature", "An error in code", "A type of variable", "A testing tool"], correctIndex: 1 },
      { id: 11, question: "What does HTTP stand for?", options: ["HyperText Transfer Protocol", "High Tech Transfer Protocol", "Hyper Terminal Transfer Platform", "Host Transfer Text Protocol"], correctIndex: 0 },
      { id: 12, question: "What is an array?", options: ["A single value", "A collection of elements", "A function", "A class"], correctIndex: 1 },
      { id: 13, question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctIndex: 1 },
      { id: 14, question: "What is a REST API?", options: ["A database type", "An architectural style for APIs", "A programming language", "A testing framework"], correctIndex: 1 },
      { id: 15, question: "What is 'debugging'?", options: ["Writing new code", "Finding and fixing errors", "Deploying code", "Designing UI"], correctIndex: 1 },
    ],
  };

  return questionSets[careerId] || questionSets["software-dev"]!;
};

export interface InterviewQuestion {
  id: number;
  question: string;
  type: "mcq" | "fill";
  options?: string[];
  correctAnswer: string;
}

export const interviewQuestions: InterviewQuestion[] = [
  { id: 1, type: "mcq", question: "What is the purpose of a constructor in OOP?", options: ["To destroy objects", "To initialize objects", "To inherit classes", "To compile code"], correctAnswer: "To initialize objects" },
  { id: 2, type: "mcq", question: "Which HTTP method is used to update a resource?", options: ["GET", "POST", "PUT", "DELETE"], correctAnswer: "PUT" },
  { id: 3, type: "mcq", question: "What does SOLID stand for in software design?", options: ["Five design principles", "A programming language", "A database concept", "A testing methodology"], correctAnswer: "Five design principles" },
  { id: 4, type: "mcq", question: "What is the difference between '==' and '===' in JavaScript?", options: ["No difference", "=== checks type and value", "== is faster", "=== is deprecated"], correctAnswer: "=== checks type and value" },
  { id: 5, type: "mcq", question: "What is a Promise in JavaScript?", options: ["A callback function", "An async operation wrapper", "A variable type", "A loop structure"], correctAnswer: "An async operation wrapper" },
  { id: 6, type: "mcq", question: "What is normalization in databases?", options: ["Making data bigger", "Organizing data to reduce redundancy", "Encrypting data", "Compressing files"], correctAnswer: "Organizing data to reduce redundancy" },
  { id: 7, type: "mcq", question: "What is the purpose of middleware?", options: ["Store data", "Process requests between client and server", "Design UI", "Compile code"], correctAnswer: "Process requests between client and server" },
  { id: 8, type: "mcq", question: "What is Docker?", options: ["A programming language", "A containerization platform", "A database", "A CSS framework"], correctAnswer: "A containerization platform" },
  { id: 9, type: "mcq", question: "What is CI/CD?", options: ["Code Integration / Code Deployment", "Continuous Integration / Continuous Delivery", "Central Intelligence / Central Database", "Compile & Install / Compile & Debug"], correctAnswer: "Continuous Integration / Continuous Delivery" },
  { id: 10, type: "mcq", question: "What is the MVC pattern?", options: ["Model-View-Controller", "Main-Variable-Class", "Module-Version-Control", "Memory-Virtual-Cache"], correctAnswer: "Model-View-Controller" },
  { id: 11, type: "mcq", question: "What is a microservice?", options: ["A small bug", "An independently deployable service", "A UI component", "A testing tool"], correctAnswer: "An independently deployable service" },
  { id: 12, type: "mcq", question: "What does DNS stand for?", options: ["Data Network System", "Domain Name System", "Digital Network Service", "Direct Name Server"], correctAnswer: "Domain Name System" },
  { id: 13, type: "mcq", question: "What is agile methodology?", options: ["A programming language", "An iterative development approach", "A database design", "A testing framework"], correctAnswer: "An iterative development approach" },
  { id: 14, type: "mcq", question: "What is WebSocket used for?", options: ["File storage", "Real-time bidirectional communication", "Database queries", "CSS styling"], correctAnswer: "Real-time bidirectional communication" },
  { id: 15, type: "mcq", question: "What is a design pattern?", options: ["A UI template", "A reusable solution to common problems", "A database schema", "A testing method"], correctAnswer: "A reusable solution to common problems" },
  { id: 16, type: "fill", question: "The JavaScript keyword used to declare a constant is ___.", correctAnswer: "const" },
  { id: 17, type: "fill", question: "In HTML, the tag used to create a hyperlink is ___.", correctAnswer: "a" },
  { id: 18, type: "fill", question: "The CSS property used to make text bold is ___.", correctAnswer: "font-weight" },
  { id: 19, type: "fill", question: "The HTTP status code for 'Not Found' is ___.", correctAnswer: "404" },
  { id: 20, type: "fill", question: "In Git, the command to create a new branch is git ___.", correctAnswer: "branch" },
];

export const jobListings = [
  { id: 1, title: "Junior Frontend Developer", company: "TechCorp", location: "Remote", type: "Full-time", skills: ["React", "JavaScript", "CSS"], salary: "$60k - $80k" },
  { id: 2, title: "Software Engineering Intern", company: "StartupXYZ", location: "San Francisco, CA", type: "Internship", skills: ["Python", "Git", "SQL"], salary: "$25/hr" },
  { id: 3, title: "Full Stack Developer", company: "InnovateLab", location: "New York, NY", type: "Full-time", skills: ["React", "Node.js", "PostgreSQL"], salary: "$90k - $120k" },
  { id: 4, title: "Junior Data Analyst", company: "DataDriven", location: "Remote", type: "Full-time", skills: ["Python", "SQL", "Excel"], salary: "$55k - $75k" },
  { id: 5, title: "UI/UX Design Intern", company: "DesignHub", location: "Austin, TX", type: "Internship", skills: ["Figma", "Prototyping", "User Research"], salary: "$20/hr" },
  { id: 6, title: "DevOps Engineer", company: "CloudFirst", location: "Remote", type: "Full-time", skills: ["Docker", "AWS", "CI/CD"], salary: "$100k - $130k" },
  { id: 7, title: "Backend Developer", company: "APIworks", location: "Seattle, WA", type: "Full-time", skills: ["Node.js", "REST APIs", "MongoDB"], salary: "$85k - $110k" },
  { id: 8, title: "ML Engineering Intern", company: "AI Labs", location: "Boston, MA", type: "Internship", skills: ["Python", "TensorFlow", "Mathematics"], salary: "$30/hr" },
  { id: 9, title: "Mobile App Developer", company: "AppVenture", location: "Los Angeles, CA", type: "Full-time", skills: ["React Native", "JavaScript", "iOS/Android"], salary: "$75k - $95k" },
  { id: 10, title: "Cybersecurity Analyst", company: "SecureNet", location: "Washington, DC", type: "Full-time", skills: ["Network Security", "Linux", "SIEM"], salary: "$80k - $110k" },
  { id: 11, title: "Product Manager Intern", company: "ProductCo", location: "Chicago, IL", type: "Internship", skills: ["Agile", "User Research", "Analytics"], salary: "$22/hr" },
  { id: 12, title: "Data Scientist", company: "InsightAI", location: "Remote", type: "Full-time", skills: ["Python", "Machine Learning", "Statistics"], salary: "$95k - $130k" },
  { id: 13, title: "QA Engineer", company: "QualityFirst", location: "Denver, CO", type: "Full-time", skills: ["Selenium", "Java", "Test Automation"], salary: "$70k - $90k" },
  { id: 14, title: "Cloud Architect", company: "CloudTech", location: "Remote", type: "Full-time", skills: ["AWS", "Azure", "Terraform"], salary: "$120k - $150k" },
  { id: 15, title: "Frontend Developer", company: "WebSolutions", location: "Miami, FL", type: "Full-time", skills: ["Vue.js", "JavaScript", "Tailwind CSS"], salary: "$65k - $85k" },
  { id: 16, title: "Database Administrator", company: "DataCorp", location: "Phoenix, AZ", type: "Full-time", skills: ["PostgreSQL", "MySQL", "Performance Tuning"], salary: "$75k - $100k" },
  { id: 17, title: "AI Research Intern", company: "FutureAI", location: "Palo Alto, CA", type: "Internship", skills: ["Python", "PyTorch", "Research"], salary: "$35/hr" },
  { id: 18, title: "Systems Engineer", company: "InfraTech", location: "Atlanta, GA", type: "Full-time", skills: ["Linux", "Networking", "Shell Scripting"], salary: "$85k - $115k" },
  { id: 19, title: "Technical Writer", company: "DocuTech", location: "Remote", type: "Contract", skills: ["Technical Writing", "API Documentation", "Markdown"], salary: "$50k - $70k" },
  { id: 20, title: "Blockchain Developer", company: "CryptoChain", location: "New York, NY", type: "Full-time", skills: ["Solidity", "Web3", "Ethereum"], salary: "$90k - $120k" },
];

export const leaderboardData = [
  { rank: 1, name: "Alex Chen", points: 2850, avatar: "AC", streak: 45 },
  { rank: 2, name: "Priya Sharma", points: 2720, avatar: "PS", streak: 38 },
  { rank: 3, name: "Jordan Lee", points: 2580, avatar: "JL", streak: 32 },
  { rank: 4, name: "Maria Garcia", points: 2340, avatar: "MG", streak: 28 },
  { rank: 5, name: "Sam Wilson", points: 2180, avatar: "SW", streak: 25 },
  { rank: 6, name: "Aisha Khan", points: 2050, avatar: "AK", streak: 22 },
  { rank: 7, name: "Dev Patel", points: 1920, avatar: "DP", streak: 19 },
  { rank: 8, name: "Emma Brown", points: 1800, avatar: "EB", streak: 16 },
  { rank: 9, name: "Chris Park", points: 1650, avatar: "CP", streak: 14 },
  { rank: 10, name: "You", points: 1200, avatar: "YO", streak: 7 },
];
