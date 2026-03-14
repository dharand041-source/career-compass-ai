import { supabase } from "@/integrations/supabase/client";

const sampleCourses = [
  {
    id: "web-dev-fundamentals",
    title: "Web Development Fundamentals",
    instructor: "freeCodeCamp",
    total_videos: 12,
    total_duration: 43200, // 12 hours in seconds
    level: "Beginner" as const,
    rating: 4.8,
    students: 125000,
  },
  {
    id: "react-masterclass",
    title: "React.js Masterclass",
    instructor: "Academind",
    total_videos: 18,
    total_duration: 64800, // 18 hours in seconds
    level: "Intermediate" as const,
    rating: 4.9,
    students: 89000,
  },
  {
    id: "data-science-python",
    title: "Data Science with Python",
    instructor: "freeCodeCamp",
    total_videos: 20,
    total_duration: 72000, // 20 hours in seconds
    level: "Intermediate" as const,
    rating: 4.7,
    students: 156000,
  },
];

const sampleLessons = [
  // Web Dev Fundamentals
  {
    course_id: "web-dev-fundamentals",
    title: "Introduction to HTML",
    youtube_id: "UB1O30fR-EE",
    duration: 5400, // 1.5 hours
    order_index: 1,
  },
  {
    course_id: "web-dev-fundamentals",
    title: "CSS Basics",
    youtube_id: "ieTHC78giGQ",
    duration: 7500, // 2.5 hours
    order_index: 2,
  },
  {
    course_id: "web-dev-fundamentals",
    title: "JavaScript Fundamentals",
    youtube_id: "PkZNo7MFNFg",
    duration: 10800, // 3 hours
    order_index: 3,
  },
  // React Masterclass
  {
    course_id: "react-masterclass",
    title: "Getting Started with React",
    youtube_id: "hQAHSlTtcmY",
    duration: 8100, // 2.25 hours
    order_index: 1,
  },
  {
    course_id: "react-masterclass",
    title: "React Hooks Deep Dive",
    youtube_id: "TNhaISOUy6Q",
    duration: 10800, // 3 hours
    order_index: 2,
  },
  // Data Science Python
  {
    course_id: "data-science-python",
    title: "Python for Data Science",
    youtube_id: "GPVsHOlRBBI",
    duration: 14400, // 4 hours
    order_index: 1,
  },
  {
    course_id: "data-science-python",
    title: "Pandas for Data Analysis",
    youtube_id: "vmEHCJofslg",
    duration: 9300, // 2.5 hours
    order_index: 2,
  },
  {
    course_id: "data-science-python",
    title: "Deep Learning Foundations",
    youtube_id: "VyWAvY2CF9c",
    duration: 10800, // 3 hours
    order_index: 3,
  },
];

export async function seedCourses() {
  try {
    console.log("Seeding courses...");

    // Insert courses
    const { error: coursesError } = await supabase
      .from("courses")
      .upsert(sampleCourses, { onConflict: "id" });

    if (coursesError) {
      console.error("Error seeding courses:", coursesError);
      return;
    }

    // Insert lessons
    const { error: lessonsError } = await supabase
      .from("course_lessons")
      .upsert(sampleLessons, { onConflict: "course_id,title" });

    if (lessonsError) {
      console.error("Error seeding lessons:", lessonsError);
      return;
    }

    console.log("Successfully seeded courses and lessons!");
  } catch (error) {
    console.error("Error in seedCourses:", error);
  }
}

// If using this file in a Node context (e.g., script), guard against browser execution.
if (typeof require !== "undefined" && require.main === module) {
  seedCourses();
}
