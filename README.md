# Learn2Hire – AI-Powered Career Development Platform

Learn2Hire is a web-based platform designed to guide learners from beginner to professional level by evaluating their skills, generating personalized learning paths, and helping them build career-ready portfolios.

## Key Features

- **AI Career Assessment**: Evaluate your skills and get personalized career guidance based on your strengths.
- **Personalized Learning Roadmap**: Follow a structured pathway of courses and milestones to reach your goals.
- **Video Learning Modules**: Access curated video tutorials and courses matched to your skill level.
- **AI Resume Builder**: Create professional, ATS-friendly resumes effortlessly.
- **Smart Job Matching**: Discover job opportunities perfectly aligned with your current skills and experience.
- **Gamification and Leaderboard**: Stay motivated by earning points, unlocking achievements, and competing with peers.
- **Project Portfolio**: Build and showcase real-world projects to demonstrate your practical abilities to employers.
- **AI Career Mentor Chatbot**: Get 24/7 instant guidance, interview preparation, and answers to your career questions.

## Technology Stack

- **Frontend**: React
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **Backend & Database**: Supabase
- **Authentication**: Supabase Auth

## Getting Started

To get a local copy up and running, follow these steps.

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd learn2hire
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```
   The development server will start locally.

## Environment Setup

You must configure Supabase environment variables for the backend and authentication to function properly. Create an environment file (e.g., `.env`) and add your project's keys:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

*(Note: Depending on your Vite configuration, you may need to prefix these variables with `VITE_`)*

## Project Structure

A quick overview of the main project folders:
- **src/**: Main source code for the application.
- **components/**: Reusable user interface elements and widgets.
- **pages/**: Application routes and main view components.
- **services/**: API functions, Supabase integrations, and logic.
- **assets/**: Static files such as images, icons, and global stylesheets.

## Deployment

The project can be deployed easily using modern hosting platforms such as Vercel, Netlify, or other Node-based deployment services. Simply link your repository, set the build command (typically `npm run build`), specify the output directory (`dist`), and add your environment variables to the platform's settings.

## Contribution

We welcome contributions to Learn2Hire! Any improvements, bug fixes, or feature suggestions are greatly appreciated. Feel free to fork the repository, make your changes, and submit a pull request to help us build a better career development platform. 

## License

This project is licensed under the MIT License.
