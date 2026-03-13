import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ensureUserProfile } from "@/lib/supabaseLeaderboard";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export type SupabaseUser = {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    username?: string;
    [key: string]: unknown;
  };
};

export function useSupabaseAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let authSubscription: { data: { subscription: { unsubscribe: () => void } } } | null = null;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;

      if (sessionUser) {
        setUser({
          id: sessionUser.id,
          email: sessionUser.email,
          user_metadata: sessionUser.user_metadata,
        });
        await ensureUserProfile(sessionUser);
      }

      setLoading(false);

      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const nextUser = session?.user;
        if (nextUser) {
          setUser({
            id: nextUser.id,
            email: nextUser.email,
            user_metadata: nextUser.user_metadata,
          });
          await ensureUserProfile(nextUser);
        } else {
          setUser(null);
        }
      });

      authSubscription = listener;
    };

    init();

    return () => {
      authSubscription?.unsubscribe?.();
    };
  }, []);

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUp = (email: string, password: string) =>
    supabase.auth.signUp({ email, password });

  const signOut = () => supabase.auth.signOut();

  return { user, loading, signIn, signUp, signOut };
}
