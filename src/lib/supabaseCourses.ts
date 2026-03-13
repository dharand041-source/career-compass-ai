import { supabase } from "@/integrations/supabase/client";

export type Course = {
  id: string;
  title: string;
  instructor: string;
  total_videos: number;
  total_duration: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  students: number;
  created_at: string;
};

export type CourseLesson = {
  id: string;
  course_id: string;
  title: string;
  youtube_id: string;
  duration: number;
  order_index: number;
  created_at: string;
};

export type UserCourseProgress = {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress_percentage: number;
  completed_lessons: number;
  total_watched_duration: number;
  updated_at: string;
};

export type UserLessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  started: boolean;
  watched_duration: number;
  completed: boolean;
  quiz_score?: number | null;
  last_watched_at: string;
  updated_at: string;
};

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from<Course>("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }

  return data ?? [];
}

export async function getCourseLessons(courseId: string): Promise<CourseLesson[]> {
  const { data, error } = await supabase
    .from<CourseLesson>("course_lessons")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Failed to fetch course lessons:", error);
    return [];
  }

  return data ?? [];
}

export async function getUserCourseProgress(userId: string): Promise<UserCourseProgress[]> {
  const { data, error } = await supabase
    .from<UserCourseProgress>("user_course_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to fetch user course progress:", error);
    return [];
  }

  return data ?? [];
}

export async function getUserLessonProgress(userId: string, lessonId?: string): Promise<UserLessonProgress[]> {
  let query = supabase
    .from<UserLessonProgress>("user_lesson_progress")
    .select("*")
    .eq("user_id", userId);

  if (lessonId) {
    query = query.eq("lesson_id", lessonId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch user lesson progress:", error);
    return [];
  }

  return data ?? [];
}

export async function enrollInCourse(userId: string, courseId: string): Promise<void> {
  const { error } = await supabase
    .from<UserCourseProgress>("user_course_progress")
    .insert({
      user_id: userId,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      progress_percentage: 0,
      completed_lessons: 0,
      total_watched_duration: 0,
    });

  if (error) {
    console.error("Failed to enroll in course:", error);
  }
}

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  watchedDuration: number,
  completed: boolean = false
): Promise<void> {
  const existing = await getUserLessonProgress(userId, lessonId);
  const now = new Date().toISOString();

  if (existing.length > 0) {
    const { error } = await supabase
      .from<UserLessonProgress>("user_lesson_progress")
      .update({
        started: true,
        watched_duration: Math.max(existing[0].watched_duration, watchedDuration),
        completed: completed || existing[0].completed,
        last_watched_at: now,
        updated_at: now,
      })
      .eq("user_id", userId)
      .eq("lesson_id", lessonId);

    if (error) {
      console.error("Failed to update lesson progress:", error);
    }
  } else {
    const { error } = await supabase
      .from<UserLessonProgress>("user_lesson_progress")
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        started: true,
        watched_duration: watchedDuration,
        completed,
        last_watched_at: now,
      });

    if (error) {
      console.error("Failed to create lesson progress:", error);
    }
  }

  // Update course progress
  await updateCourseProgress(userId, lessonId.split('-')[0]); // Assuming lessonId starts with courseId
}

export async function updateCourseProgress(userId: string, courseId: string): Promise<void> {
  const lessons = await getCourseLessons(courseId);
  const lessonProgress = await getUserLessonProgress(userId);

  const courseLessonIds = lessons.map(l => l.id);
  const userLessonProgress = lessonProgress.filter(lp => courseLessonIds.includes(lp.lesson_id));

  const completedLessons = userLessonProgress.filter(lp => lp.completed).length;
  const totalWatchedDuration = userLessonProgress.reduce((sum, lp) => sum + lp.watched_duration, 0);
  const totalCourseDuration = lessons.reduce((sum, l) => sum + l.duration, 0);

  const progressPercentage = totalCourseDuration > 0
    ? Math.round((totalWatchedDuration / totalCourseDuration) * 100)
    : 0;

  const existing = await supabase
    .from<UserCourseProgress>("user_course_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (existing.data) {
    const { error } = await supabase
      .from<UserCourseProgress>("user_course_progress")
      .update({
        progress_percentage: progressPercentage,
        completed_lessons: completedLessons,
        total_watched_duration: totalWatchedDuration,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("course_id", courseId);

    if (error) {
      console.error("Failed to update course progress:", error);
    }
  } else {
    // Enroll if not already enrolled
    await enrollInCourse(userId, courseId);
  }
}

export async function getOverallProgress(userId: string): Promise<number> {
  const courseProgress = await getUserCourseProgress(userId);
  if (courseProgress.length === 0) return 0;

  const totalProgress = courseProgress.reduce((sum, cp) => sum + cp.progress_percentage, 0);
  return Math.round(totalProgress / courseProgress.length);
}

export function subscribeCourseProgress(userId: string, onChange: (data: UserCourseProgress[]) => void) {
  const channel = supabase
    .channel(`user_course_progress_${userId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "user_course_progress", filter: `user_id=eq.${userId}` },
      async () => {
        const progress = await getUserCourseProgress(userId);
        onChange(progress);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
