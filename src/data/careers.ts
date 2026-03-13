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
    "data-scientist": [
      { id: 1, question: "What does ML stand for?", options: ["Machine Learning", "Maximized Logic", "Multiple Listing", "Micro Level"], correctIndex: 0 },
      { id: 2, question: "Which library is most commonly used for data manipulation in Python?", options: ["Numpy", "Pandas", "Matplotlib", "Scikit"], correctIndex: 1 },
      { id: 3, question: "What is a DataFrame?", options: ["A picture frame", "A 2D mutable, tabular data structure", "A database query", "An object property"], correctIndex: 1 },
      { id: 4, question: "What is linear regression used for?", options: ["Classification", "Clustering", "Predicting a continuous numeric value", "Data gathering"], correctIndex: 2 },
      { id: 5, question: "What does CSV stand for?", options: ["Computer System Variable", "Common Standard Value", "Comma Separated Values", "Compiled System Version"], correctIndex: 2 },
      { id: 6, question: "Which is NOT a type of Machine Learning?", options: ["Supervised", "Unsupervised", "Reinforcement", "Overvised"], correctIndex: 3 },
      { id: 7, question: "What is Jupyter Notebook?", options: ["A physical book", "An IDE for writing SQL", "An interactive computing environment", "A word processor"], correctIndex: 2 },
      { id: 8, question: "What is 'overfitting' in ML?", options: ["Too much data", "Model performs well on training data but poorly on unseen data", "Model is too small", "Model trains too fast"], correctIndex: 1 },
      { id: 9, question: "Which algorithm is used for Classification?", options: ["Linear Regression", "Logistic Regression", "K-Means", "PCA"], correctIndex: 1 },
      { id: 10, question: "What is Big Data?", options: ["Data over 1GB", "Large, complex datasets that need advanced processing", "A database system", "A programming language"], correctIndex: 1 },
      { id: 11, question: "What does SQL JOIN do?", options: ["Deletes tables", "Combines rows from two or more tables", "Creates a table", "Splits databases"], correctIndex: 1 },
      { id: 12, question: "What is standard deviation?", options: ["A measure of data dispersion", "A mean value", "A data cleaning process", "A ML algorithm"], correctIndex: 0 },
      { id: 13, question: "Which is a deep learning framework?", options: ["Django", "React", "PyTorch", "Flask"], correctIndex: 2 },
      { id: 14, question: "What does NLP stand for?", options: ["Normal Logic Process", "Natural Language Processing", "Node Level Programming", "New Learning Protocol"], correctIndex: 1 },
      { id: 15, question: "What is data wrangling?", options: ["Deleting data", "Cleaning and structuring complex data", "Visualizing data", "Selling data"], correctIndex: 1 },
    ],
    "web-dev": [
      { id: 1, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Learning", "Hyper Tool Multi Language", "Home Text Markup Logic"], correctIndex: 0 },
      { id: 2, question: "What does CSS do?", options: ["Styles the web page", "Creates databases", "Handles backend logic", "Serves the site"], correctIndex: 0 },
      { id: 3, question: "What is React?", options: ["A database", "A CSS framework", "A JavaScript library for building UIs", "A language"], correctIndex: 2 },
      { id: 4, question: "What is DOM?", options: ["Data Object Model", "Document Object Model", "Design Oriented Markup", "Display Object Management"], correctIndex: 1 },
      { id: 5, question: "Which hook manages state in React?", options: ["useEffect", "useState", "useContext", "useReducer"], correctIndex: 1 },
      { id: 6, question: "What is a 'Promise' in JS?", options: ["A strict variable", "An object representing eventual completion of an async operation", "A loop", "A styling property"], correctIndex: 1 },
      { id: 7, question: "What does REST stand for?", options: ["Representational State Transfer", "Responsive Style Text", "Real State Technology", "Rapid Execution System Test"], correctIndex: 0 },
      { id: 8, question: "What is Node.js?", options: ["A UI framework", "A JavaScript runtime built on Chrome's V8 JS engine", "A CSS preprocessor", "A database query language"], correctIndex: 1 },
      { id: 9, question: "What is Tailwind CSS?", options: ["A JavaScript library", "A DB manager", "A utility-first CSS framework", "An animation tool"], correctIndex: 2 },
      { id: 10, question: "What is Responsive Design?", options: ["Makes websites fast", "Makes websites look good on all devices", "Adds animations", "Improves SEO"], correctIndex: 1 },
      { id: 11, question: "Which is a valid CSS unit?", options: ["cm", "px", "kg", "ml"], correctIndex: 1 },
      { id: 12, question: "What does the 'typeof' operator do?", options: ["Changes type", "Returns the type of a variable", "Creates a variable", "Deletes a type"], correctIndex: 1 },
      { id: 13, question: "What is the purpose of 'alt' attribute in an image tag?", options: ["Adds a border", "Provides alternative text for screen readers", "Makes image responsive", "Links the image"], correctIndex: 1 },
      { id: 14, question: "What is npm?", options: ["New Project Manager", "Node Package Manager", "Net Protocol Module", "Network Program Maker"], correctIndex: 1 },
      { id: 15, question: "What does 'CORS' mean?", options: ["Cross-Origin Resource Sharing", "Central Object Rendering System", "Cascading Object Rules", "Call Origin Request System"], correctIndex: 0 },
    ],
    "uiux": [
      { id: 1, question: "What does UX stand for?", options: ["User Exchange", "User Experience", "Utility Extension", "User Example"], correctIndex: 1 },
      { id: 2, question: "What is UI design primarly concerned with?", options: ["Backend servers", "Visual elements and layout", "Database structure", "Writing algorithms"], correctIndex: 1 },
      { id: 3, question: "What is a Wireframe?", options: ["A high-fidelity prototype", "A low-fidelity visual representation of a website's layout", "A colored design", "A CSS file"], correctIndex: 1 },
      { id: 4, question: "Which tool is commonly used for UI/UX design?", options: ["Vim", "Figma", "Docker", "Postman"], correctIndex: 1 },
      { id: 5, question: "What is 'White Space' in design?", options: ["Actual white color", "Empty space between design elements", "A bug in the layout", "A light theme"], correctIndex: 1 },
      { id: 6, question: "What is typography?", options: ["The DB schema", "The art of arranging type to make text legible and appealing", "A coding style", "A type of animation"], correctIndex: 1 },
      { id: 7, question: "What is User Persona?", options: ["A real user", "A fictional character representing a target user type", "A login screen", "A developer's profile"], correctIndex: 1 },
      { id: 8, question: "What is a Call to Action (CTA)?", options: ["A backend endpoint", "A prompt on a website that tells the user to take a specific action", "An error message", "A loading spinner"], correctIndex: 1 },
      { id: 9, question: "What is Usability Testing?", options: ["Testing server speed", "Evaluating a product by testing it with representative users", "Testing code for bugs", "Checking database queries"], correctIndex: 1 },
      { id: 10, question: "What is Information Architecture?", options: ["Building physical structures", "Organizing and structuring content in an effective way", "Coding HTML", "Styling with CSS"], correctIndex: 1 },
      { id: 11, question: "What is accessibility (a11y) in UX?", options: ["Making site load faster", "Designing products usable by people with disabilities", "Making site cheaper", "Adding login systems"], correctIndex: 1 },
      { id: 12, question: "What is a Mockup?", options: ["A working website", "A static, high-fidelity visual representation of a design", "A code snippet", "A wireframe"], correctIndex: 1 },
      { id: 13, question: "What is contrast in design?", options: ["Difference in visual properties that makes elements distinguishable", "Making everything the same color", "A screen brightness setting", "A CSS bug"], correctIndex: 0 },
      { id: 14, question: "What does 'Responsive' mean in UX?", options: ["Loading quickly", "Adapting layout smoothly to different screen sizes", "Having animations", "Quick customer support"], correctIndex: 1 },
      { id: 15, question: "What is a prototype?", options: ["A production site", "An interactive simulation of a design", "A sketch", "A backend server"], correctIndex: 1 },
    ],
    "ai-engineer": [
      { id: 1, question: "What is Artificial Intelligence?", options: ["A robot", "Simulation of human intelligence by machines", "A database system", "A programming language"], correctIndex: 1 },
      { id: 2, question: "Which is a popular library for Deep Learning?", options: ["React", "PyTorch", "Django", "Tailwind"], correctIndex: 1 },
      { id: 3, question: "What is a Neural Network?", options: ["A biological brain", "A computing system inspired by the human brain", "A networking protocol", "A CSS grid"], correctIndex: 1 },
      { id: 4, question: "What does NLP stand for?", options: ["Natural Language Processing", "Non-Linear Programming", "Neural Logic Process", "Network Layer Protocol"], correctIndex: 0 },
      { id: 5, question: "What is Computer Vision?", options: ["A monitor display", "AI field that enables computers to derive info from images/video", "A graphics card", "VR goggles"], correctIndex: 1 },
      { id: 6, question: "What is Overfitting in an AI model?", options: ["Model is too complex and learns noise from training data", "Model is too simple", "Model trains too quickly", "Model uses too much RAM"], correctIndex: 0 },
      { id: 7, question: "What is an Epoch?", options: ["A time era", "One complete pass of the training dataset through the algorithm", "An AI company", "A data structure"], correctIndex: 1 },
      { id: 8, question: "What is an Activation Function?", options: ["A button to turn on AI", "Function that determines the output of a neural network node", "A python script", "A cloud server"], correctIndex: 1 },
      { id: 9, question: "What is Reinforcement Learning?", options: ["Learning by watching videos", "Learning through trial and error using rewards/punishments", "Reading books", "Learning from labeled data"], correctIndex: 1 },
      { id: 10, question: "What does LLM stand for?", options: ["Large Language Model", "Low Level Machine", "Logic Learning Method", "Local Layer Memory"], correctIndex: 0 },
      { id: 11, question: "What is Gradient Descent?", options: ["A UI gradient", "An optimization algorithm to minimize the loss function", "A data sorting method", "A hardware failure"], correctIndex: 1 },
      { id: 12, question: "What is a GPU primarily used for in AI?", options: ["Playing games", "Accelerating mathematical computations for training models", "Storing data", "Cooling the CPU"], correctIndex: 1 },
      { id: 13, question: "What is Supervised Learning?", options: ["Learning with a teacher present", "Training on labeled data", "Training on unlabeled data", "Reinforcement learning"], correctIndex: 1 },
      { id: 14, question: "What is a Prompt in Generative AI?", options: ["An error message", "Input text provided to guide model's output", "A terminal window", "A fast response"], correctIndex: 1 },
      { id: 15, question: "What is Data Augmentation?", options: ["Deleting data", "Technique to artificially increase the size of a training set", "Compressing files", "Visualizing numbers"], correctIndex: 1 },
    ],
    "cybersecurity": [
      { id: 1, question: "What is Phishing?", options: ["A water sport", "Fraudulent practice of sending emails to trick individuals into revealing sensitive info", "A network protocol", "A firewall"], correctIndex: 1 },
      { id: 2, question: "What does VPN stand for?", options: ["Visual Processing Node", "Virtual Private Network", "Very Private Name", "Variable Port Number"], correctIndex: 1 },
      { id: 3, question: "What is Malware?", options: ["Bad hardware", "Malicious software designed to cause damage", "A poorly written code", "A spam email"], correctIndex: 1 },
      { id: 4, question: "What does a Firewall do?", options: ["Stops physical fires", "Monitors and controls incoming and outgoing network traffic", "Encrypts data", "Cleans viruses"], correctIndex: 1 },
      { id: 5, question: "What is Encryption?", options: ["Deleting data", "Process of converting information into secret code to hide its meaning", "Hacking a system", "Compressing files"], correctIndex: 1 },
      { id: 6, question: "What is a DDOS attack?", options: ["Disk Data Operating System", "Distributed Denial of Service", "Direct Data Output Stream", "Domain Directory Object Security"], correctIndex: 1 },
      { id: 7, question: "What is Two-Factor Authentication (2FA)?", options: ["Typing password twice", "Security process requiring two different forms of identification", "Having two passwords", "Two people logging in"], correctIndex: 1 },
      { id: 8, question: "What is a Zero-Day Vulnerability?", options: ["A time-based bug", "A flaw that is unknown to the software vendor", "A bug fixed in zero days", "An empty database"], correctIndex: 1 },
      { id: 9, question: "What does SSL stand for?", options: ["Secure Sockets Layer", "System Security Level", "Super Secret Lock", "Standard Security Logic"], correctIndex: 0 },
      { id: 10, question: "What is Social Engineering in cybersecurity?", options: ["Building communities", "Manipulating people to give up confidential info", "Making social media sites", "Hiring engineers"], correctIndex: 1 },
      { id: 11, question: "What is Penetration Testing?", options: ["Testing writing pens", "Authorized simulated cyberattack on a system to evaluate its security", "Testing internet speed", "Checking server ping"], correctIndex: 1 },
      { id: 12, question: "What is Ransomware?", options: ["Software that demands payment to restore access to files", "Expensive software", "A server rental fee", "A type of antivirus"], correctIndex: 0 },
      { id: 13, question: "What is an IP Address?", options: ["Intellectual Property Address", "Internet Protocol Address", "Internal Port Address", "Internet Provider Address"], correctIndex: 1 },
      { id: 14, question: "What is a Hash Function?", options: ["A cooking recipe", "A function that converts data into a fixed size string of bytes", "A malware code", "A decryption tool"], correctIndex: 1 },
      { id: 15, question: "What is the principle of Least Privilege?", options: ["Giving no access", "Giving a user only the minimum levels of access necessary to complete tasks", "Using the cheapest software", "Having no admins"], correctIndex: 1 },
    ],
    "devops": [
      { id: 1, question: "What is DevOps?", options: ["A programming language", "A combination of software development and IT operations", "A database server", "A cloud provider"], correctIndex: 1 },
      { id: 2, question: "What does CI/CD stand for?", options: ["Continuous Integration / Continuous Deployment", "Code Inspection / Code Delivery", "Central Integration / Central Distribution", "Compute Instance / Cloud Database"], correctIndex: 0 },
      { id: 3, question: "What is Docker?", options: ["A shipping company", "A tool designed to make it easier to create, deploy, and run applications by using containers", "A version control system", "An OS"], correctIndex: 1 },
      { id: 4, question: "What is Kubernetes?", options: ["An open-source container orchestration system", "A greek god", "A cloud provider", "A testing framework"], correctIndex: 0 },
      { id: 5, question: "What is Infrastructure as Code (IaC)?", options: ["Writing code safely", "Managing infrastructure through machine-readable definition files", "Hosting code on AWS", "Building physical servers"], correctIndex: 1 },
      { id: 6, question: "What is Git?", options: ["A cloud service", "A version control system", "A container tool", "A monitoring software"], correctIndex: 1 },
      { id: 7, question: "What is AWS?", options: ["Amazon Web Services", "Automated Web System", "Application Workspace Service", "Advanced Working Structure"], correctIndex: 0 },
      { id: 8, question: "Which tool is commonly used for CI/CD pipelines?", options: ["Photoshop", "Jenkins", "Word", "Excel"], correctIndex: 1 },
      { id: 9, question: "What is scaling horizontally?", options: ["Upgrading the server RAM", "Adding more machines to the pool of resources", "Moving servers to a wider desk", "Turning a monitor sideways"], correctIndex: 1 },
      { id: 10, question: "What is a Microservice?", options: ["A tiny bug", "An architectural style structuring an application as a collection of small autonomous services", "A small server", "A slow service"], correctIndex: 1 },
      { id: 11, question: "What does SSH stand for?", options: ["Secure Shell", "System Server Host", "Simple Security Header", "Standard Security Hash"], correctIndex: 0 },
      { id: 12, question: "What is a Load Balancer?", options: ["A heavy weight", "A device acting as a reverse proxy to distribute network traffic", "A battery pack", "A CPU cooler"], correctIndex: 1 },
      { id: 13, question: "What is Terraform?", options: ["A game", "An open-source infrastructure as code software tool", "A cloud provider", "A type of database"], correctIndex: 1 },
      { id: 14, question: "What does a Monitor tool do in DevOps (like Prometheus)?", options: ["Displays the UI", "Observes systems and applications to report on their health and performance", "Writes code", "Compiles code"], correctIndex: 1 },
      { id: 15, question: "What is Bash?", options: ["A party", "A Unix shell and command language", "A container tool", "A database protocol"], correctIndex: 1 },
    ],
    "mobile-dev": [
      { id: 1, question: "What is iOS?", options: ["Apple's mobile operating system", "An internet protocol", "A programming language", "A framework"], correctIndex: 0 },
      { id: 2, question: "Which programming language is mainly used for native Android development?", options: ["Swift", "Kotlin", "Ruby", "TypeScript"], correctIndex: 1 },
      { id: 3, question: "Which language is used for native iOS development?", options: ["Kotlin", "Java", "Swift", "C#"], correctIndex: 2 },
      { id: 4, question: "What is React Native?", options: ["A native database", "A framework for building native apps using React", "A web browser", "An animation library"], correctIndex: 1 },
      { id: 5, question: "What is Flutter?", options: ["A UI toolkit from Google for building natively compiled applications", "An Apple SDK", "A CSS framework", "A database engine"], correctIndex: 0 },
      { id: 6, question: "What does 'Cross-Platform' development mean?", options: ["Writing an app that runs only on web", "Writing codebase once to run on multiple platforms (iOS and Android)", "Using multiple IDEs", "Building hardware"], correctIndex: 1 },
      { id: 7, question: "What is an APK?", options: ["Apple Package Kit", "Android Package Kit", "Application Programming Key", "Automated Program Kernel"], correctIndex: 1 },
      { id: 8, question: "What is the App Store?", options: ["A physical store", "Apple's digital distribution platform for mobile apps", "Google's market", "A grocery store"], correctIndex: 1 },
      { id: 9, question: "What is IDE?", options: ["Internal Device Emulator", "Integrated Development Environment", "Internet Data Exchange", "Intelligent Design Engine"], correctIndex: 1 },
      { id: 10, question: "What does UI stand for in mobile apps?", options: ["User Interface", "Universal Integrated", "United Internet", "User Identifier"], correctIndex: 0 },
      { id: 11, question: "What is a Simulator/Emulator used for?", options: ["Playing games", "Testing mobile apps on a computer without a physical device", "Writing code", "Designing icons"], correctIndex: 1 },
      { id: 12, question: "Which is a popular database for mobile apps (often used offline)?", options: ["SQLite", "Oracle", "Cassandra", "Access"], correctIndex: 0 },
      { id: 13, question: "What does API stand for?", options: ["Application Programming Interface", "Advanced Process Integration", "Automated Program Index", "App Project Internet"], correctIndex: 0 },
      { id: 14, question: "What is push notification?", options: ["A button press", "A message that pops up on a mobile device", "A Git command", "An error alert"], correctIndex: 1 },
      { id: 15, question: "What is state management in mobile development?", options: ["Managing device countries", "Handling the data and UI state within an app", "Controlling battery life", "Managing file storage"], correctIndex: 1 },
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
