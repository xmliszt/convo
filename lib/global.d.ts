import { Database } from '@/supabase/database.types';

declare global {
  export type UserProfile = Database['public']['Tables']['users']['Row'];
  export type Scenario = Database['public']['Tables']['scenarios']['Row'];
  export type LlmRole = Database['public']['Tables']['llm_roles']['Row'];
  export type Goal = Database['public']['Tables']['goals']['Row'];
  export type TargetWords = Database['public']['Tables']['target_words']['Row'];
  export type Evaluation = Database['public']['Tables']['evaluations']['Row'];
  export type Conversation =
    Database['public']['Tables']['conversations']['Row'];
}
