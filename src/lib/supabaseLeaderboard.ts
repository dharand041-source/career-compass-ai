import { supabase } from "@/integrations/supabase/client";

export type LeaderboardUser = {
  id: string;
  username: string;
  email?: string | null;
  points: number;
  streak: number;
  longest_streak: number;
  assessments_completed: number;
  videos_watched: number;
  resumes_created: number;
  jobs_applied: number;
  last_active: string | null;
  created_at: string;
  updated_at: string;
};

export async function getLeaderboard(): Promise<LeaderboardUser[]> {
  const { data, error } = await supabase
    .from<LeaderboardUser>("users")
    .select("*")
    .order("points", { ascending: false })
    .order("streak", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch leaderboard:", error);
    return [];
  }

  return data ?? [];
}

export type LeaderboardListener = (data: LeaderboardUser[]) => void;

export function subscribeLeaderboard(onChange: LeaderboardListener) {
  const channel = supabase
    .channel("public:users")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "users" },
      async () => {
        const leaderboard = await getLeaderboard();
        onChange(leaderboard);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function ensureUserProfile(user: { id: string; email?: string | null; user_metadata?: { full_name?: string; username?: string; [key: string]: unknown } }, usernameOverride?: string) {
  if (!user?.id) return null;

  const username =
    usernameOverride ||
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.username as string) ||
    user.email?.split("@")[0] ||
    "Learner";

  const { data, error } = await supabase
    .from<LeaderboardUser>("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116: No rows found
    console.error("Error checking user profile:", error);
  }

  if (data) {
    return data;
  }

  const insertResult = await supabase.from<LeaderboardUser>("users").insert({
    id: user.id,
    username,
    email: user.email ?? null,
    points: 0,
    streak: 0,
    longest_streak: 0,
    assessments_completed: 0,
    videos_watched: 0,
    resumes_created: 0,
    jobs_applied: 0,
  });

  if (insertResult.error) {
    console.error("Error creating user profile:", insertResult.error);
    return null;
  }

  return insertResult.data?.[0] ?? null;
}

export async function recordActivity(activity: "assessment" | "video" | "resume" | "job", points = 0) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error checking session for activity:", sessionError);
    return;
  }

  const user = session?.user;
  if (!user) return;

  const fieldsToIncrement: Record<string, number> = {};

  switch (activity) {
    case "assessment":
      fieldsToIncrement.assessments_completed = 1;
      break;
    case "video":
      fieldsToIncrement.videos_watched = 1;
      break;
    case "resume":
      fieldsToIncrement.resumes_created = 1;
      break;
    case "job":
      fieldsToIncrement.jobs_applied = 1;
      break;
  }

  const { data: existing, error: fetchError } = await supabase
    .from<LeaderboardUser>("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (fetchError) {
    console.error("Error fetching user record for activity:", fetchError);
    return;
  }

  const updatedData: Partial<LeaderboardUser> = {
    points: (existing?.points ?? 0) + points,
    last_active: new Date().toISOString(),
  };

  // handle streak logic (simplified: if last_active is within 24h, increment streak else reset to 1)
  if (existing?.last_active) {
    const lastActive = new Date(existing.last_active);
    const now = new Date();
    const diffMs = now.getTime() - lastActive.getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (diffMs <= oneDayMs) {
      updatedData.streak = (existing.streak ?? 0) + 1;
    } else {
      updatedData.streak = 1;
    }

    updatedData.longest_streak = Math.max(existing.longest_streak ?? 0, updatedData.streak);
  } else {
    updatedData.streak = 1;
    updatedData.longest_streak = 1;
  }

  // increment the correct counter
  if (fieldsToIncrement.assessments_completed) {
    updatedData.assessments_completed = (existing?.assessments_completed ?? 0) + 1;
  }
  if (fieldsToIncrement.videos_watched) {
    updatedData.videos_watched = (existing?.videos_watched ?? 0) + 1;
  }
  if (fieldsToIncrement.resumes_created) {
    updatedData.resumes_created = (existing?.resumes_created ?? 0) + 1;
  }
  if (fieldsToIncrement.jobs_applied) {
    updatedData.jobs_applied = (existing?.jobs_applied ?? 0) + 1;
  }

  const { error: updateError } = await supabase
    .from<LeaderboardUser>("users")
    .update(updatedData)
    .eq("id", user.id);

  if (updateError) {
    console.error("Error recording activity:", updateError);
  }
}
