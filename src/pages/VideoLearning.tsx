import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, CheckCircle, Clock, Users, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { recordActivity } from "@/lib/supabaseLeaderboard";
import { useToast } from "@/components/ui/use-toast";
import { seedCourses } from "@/lib/seedCourses";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { 
  getCourses, 
  getUserCourseProgress, 
  getCourseLessons, 
  getUserLessonProgress, 
  enrollInCourse as enrollUserInCourse, 
  updateLessonProgress, 
  subscribeCourseProgress,
  Course,
  CourseLesson
} from "@/lib/supabaseCourses";

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  duration: number;
  completed: boolean;
  rating: number;
}

interface CourseWithLessons extends Course {
  lessons: CourseLesson[];
  enrolled: boolean;
  progress: number;
  completedLessons: number;
}

const VideoLearning = () => {
  const { user } = useSupabaseAuth();
  const [courses, setCourses] = useState<CourseWithLessons[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithLessons | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  const { toast } = useToast();

  const loadCourses = useCallback(async () => {
    if (!user) return;

    try {
      const [coursesData, userProgress] = await Promise.all([
        getCourses(),
        getUserCourseProgress(user.id),
      ]);

      const coursesWithProgress = await Promise.all(
        coursesData.map(async (course) => {
          const lessons = await getCourseLessons(course.id);
          const progress = userProgress.find(p => p.course_id === course.id);
          const lessonProgress = await getUserLessonProgress(user.id);

          const completedLessons = lessonProgress.filter(lp =>
            lessons.some(l => l.id === lp.lesson_id && lp.completed)
          ).length;

          return {
            ...course,
            lessons,
            enrolled: !!progress,
            progress: progress?.progress_percentage || 0,
            completedLessons,
          };
        })
      );

      setCourses(coursesWithProgress);

      const totalProgress = coursesWithProgress
        .filter(c => c.enrolled)
        .reduce((sum, course) => sum + course.progress, 0);
      const enrolledCount = coursesWithProgress.filter(c => c.enrolled).length;
      setOverallProgress(enrolledCount > 0 ? Math.round(totalProgress / enrolledCount) : 0);

    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadCourses();
    } else {
      setLoading(false);
    }
  }, [user, loadCourses]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeCourseProgress(user.id, async () => {
      await loadCourses();
    });

    return unsubscribe;
  }, [user, loadCourses]);

  const enrollInCourse = async (courseId: string) => {
    if (!user) return;

    try {
      await enrollUserInCourse(user.id, courseId);
      await loadCourses(); // Reload to update enrolled status
      toast({
        title: "Enrolled successfully!",
        description: "You can now start learning this course.",
      });
    } catch (error) {
      console.error("Failed to enroll:", error);
      toast({
        title: "Enrollment failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const markVideoComplete = async (courseId: string, lessonId: string) => {
    if (!user) return;

    try {
      const lesson = selectedCourse?.lessons.find(l => l.id === lessonId);
      if (!lesson) return;

      await updateLessonProgress(user.id, lessonId, lesson.duration, true);

      // Record activity for points
      await recordActivity("video", 20);
      toast({
        title: "Great job!",
        description: "You earned 20 points for completing a video.",
      });

      await loadCourses(); // Reload to update progress
    } catch (error) {
      console.error("Failed to mark video complete:", error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:00`;
    }
    return `${minutes}:00`;
  };

  if (currentVideo) {
    return (
      <div className="min-h-screen animated-gradient-bg">
        <Navbar />
        <div className="container mx-auto max-w-7xl px-6 pt-32 pb-12">
          <BackButton className="mb-4" />
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{currentVideo.title}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center relative">
                {currentVideo.youtubeId ? (
                  <iframe
                    className="w-full h-full absolute inset-0"
                    src={`https://www.youtube.com/embed/${currentVideo.youtubeId}`}
                    title={currentVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                    <Clock className="h-10 w-10 mb-3 opacity-50" />
                    <p className="text-lg font-medium">Video content coming soon.</p>
                    <p className="text-sm mt-1 opacity-70">This lesson is currently a Text Module.</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{formatDuration(currentVideo.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{currentVideo.rating}</span>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    if (selectedCourse) {
                      markVideoComplete(selectedCourse.id, currentVideo.id);
                    }
                  }}
                  disabled={currentVideo.completed}
                >
                  {currentVideo.completed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    "Mark as Complete"
                  )}
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Course Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedCourse?.lessons.map((lesson, index) => {
                      const lessonProgress = selectedCourse.completedLessons > index; // For now, simple sequential completion
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentVideo({
                            id: lesson.id,
                            title: lesson.title,
                            youtubeId: lesson.youtube_id,
                            duration: lesson.duration,
                            completed: lessonProgress,
                            rating: 4.5,
                          })}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            currentVideo.id === lesson.id
                              ? 'bg-primary/10 border-primary'
                              : 'hover:bg-gray-50'
                          } border`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              lessonProgress ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {lessonProgress ? <CheckCircle className="h-4 w-4" /> : index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${
                                lessonProgress ? 'line-through text-gray-500' : ''
                              }`}>
                                {lesson.title}
                              </p>
                              <p className="text-xs text-muted-foreground">{formatDuration(lesson.duration)}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="min-h-screen animated-gradient-bg">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-6 pt-32 pb-12">
          <BackButton className="mb-4" />

          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{selectedCourse.title}</h1>
                <div className="flex items-center gap-4 text-sm mb-4">
                  <span>By {selectedCourse.instructor}</span>
                  <Badge className={getLevelColor(selectedCourse.level)}>
                    {selectedCourse.level}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDuration(selectedCourse.total_duration)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {selectedCourse.students.toLocaleString()} students
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary mb-1">
                  {selectedCourse.progress}%
                </div>
                <Progress value={selectedCourse.progress} className="w-32" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCourse.lessons.map((lesson, index) => {
              const lessonProgress = selectedCourse.completedLessons > index; // Simple check for now
              return (
                <Card
                  key={lesson.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    lessonProgress ? 'border-green-200 bg-green-50' : ''
                  }`}
                  onClick={() => setCurrentVideo({
                    id: lesson.id,
                    title: lesson.title,
                    youtubeId: lesson.youtube_id,
                    duration: lesson.duration,
                    completed: lessonProgress,
                    rating: 4.5, // Default rating for now
                  })}
                >
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <Play className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        lessonProgress ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {lessonProgress ? <CheckCircle className="h-3 w-3" /> : index + 1}
                      </div>
                      <h3 className={`font-medium text-sm flex-1 ${
                        lessonProgress ? 'line-through text-gray-500' : ''
                      }`}>
                        {lesson.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDuration(lesson.duration)}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        4.5
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen animated-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto max-w-6xl px-6 pt-32 pb-12">
        <BackButton />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Video Learning Modules
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Curated YouTube tutorials organized into structured courses.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-sm text-muted-foreground">Overall Progress:</span>
            <Progress value={overallProgress} className="w-32" />
            <span className="text-sm font-medium">{overallProgress}%</span>
            {process.env.NODE_ENV === 'development' && (
              <Button
                onClick={async () => {
                  try {
                    await seedCourses();
                    await loadCourses();
                    toast({
                      title: "Database seeded!",
                      description: "Sample courses and lessons have been added.",
                    });
                  } catch (error) {
                    toast({
                      title: "Seeding failed",
                      description: "Check console for details.",
                      variant: "destructive",
                    });
                  }
                }}
                variant="outline"
                size="sm"
              >
                Seed DB
              </Button>
            )}
          </div>
        </motion.div>

        <Tabs defaultValue="enrolled" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="enrolled">My Courses ({courses.filter(c => c.enrolled).length})</TabsTrigger>
            <TabsTrigger value="available">Available Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .filter(course => course.enrolled)
                .map((course) => (
                  <Card
                    key={course.id}
                    className="cursor-pointer transition-all hover:shadow-lg"
                    onClick={() => setSelectedCourse(course)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-medium">{course.progress}%</div>
                          <Progress value={course.progress} className="w-16 mt-1" />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span>{course.instructor}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatDuration(course.total_duration)}</span>
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="available" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .filter(course => !course.enrolled)
                .map((course) => (
                  <Card key={course.id} className="transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span>{course.instructor}</span>
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(course.total_duration)}</span>
                      </div>
                      <Button
                        onClick={() => enrollInCourse(course.id)}
                        className="w-full"
                      >
                        Enroll Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VideoLearning;