export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      conversation_dialogs: {
        Row: {
          conversation_id: string | null
          created_by: string | null
          message: string | null
          role: Database["public"]["Enums"]["role"]
          timestamp: string
        }
        Insert: {
          conversation_id?: string | null
          created_by?: string | null
          message?: string | null
          role: Database["public"]["Enums"]["role"]
          timestamp?: string
        }
        Update: {
          conversation_id?: string | null
          created_by?: string | null
          message?: string | null
          role?: Database["public"]["Enums"]["role"]
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_dialogs_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_dialogs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          bonus_score: number
          created_at: string
          created_by: string | null
          id: string
          scenario_id: string
        }
        Insert: {
          bonus_score?: number
          created_at?: string
          created_by?: string | null
          id?: string
          scenario_id: string
        }
        Update: {
          bonus_score?: number
          created_at?: string
          created_by?: string | null
          id?: string
          scenario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluations: {
        Row: {
          ai_evaluation: string
          ai_score: number
          conversation_id: string
          created_at: string
          id: string
          suggestions: string[]
        }
        Insert: {
          ai_evaluation: string
          ai_score?: number
          conversation_id: string
          created_at?: string
          id?: string
          suggestions?: string[]
        }
        Update: {
          ai_evaluation?: string
          ai_score?: number
          conversation_id?: string
          created_at?: string
          id?: string
          suggestions?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: true
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          id: string
          long_description: string | null
          points: number
          scenario_id: string
          short_description: string
        }
        Insert: {
          id?: string
          long_description?: string | null
          points?: number
          scenario_id: string
          short_description: string
        }
        Update: {
          id?: string
          long_description?: string | null
          points?: number
          scenario_id?: string
          short_description?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      llm_roles: {
        Row: {
          avatar_url: string
          code_of_conduct: string
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          role: string
          starting_prompt: string
        }
        Insert: {
          avatar_url: string
          code_of_conduct: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          role: string
          starting_prompt: string
        }
        Update: {
          avatar_url?: string
          code_of_conduct?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          role?: string
          starting_prompt?: string
        }
        Relationships: []
      }
      scenarios: {
        Row: {
          categories: string[]
          created_at: string
          description: string
          id: string
          image_url: string
          llm_id: string
          name: string
          player_role: string
        }
        Insert: {
          categories?: string[]
          created_at?: string
          description: string
          id?: string
          image_url: string
          llm_id: string
          name: string
          player_role: string
        }
        Update: {
          categories?: string[]
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          llm_id?: string
          name?: string
          player_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenarios_llm_id_fkey"
            columns: ["llm_id"]
            isOneToOne: false
            referencedRelation: "llm_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      target_words: {
        Row: {
          id: string
          scenario_id: string
          words: string[]
        }
        Insert: {
          id?: string
          scenario_id: string
          words: string[]
        }
        Update: {
          id?: string
          scenario_id?: string
          words?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "target_words_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: true
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string | null
          first_login_at: string | null
          id: string
          is_anonymous: boolean
          last_login_at: string | null
          login_times: number
          name: string | null
          password: string | null
          photo_url: string | null
        }
        Insert: {
          email?: string | null
          first_login_at?: string | null
          id: string
          is_anonymous?: boolean
          last_login_at?: string | null
          login_times?: number
          name?: string | null
          password?: string | null
          photo_url?: string | null
        }
        Update: {
          email?: string | null
          first_login_at?: string | null
          id?: string
          is_anonymous?: boolean
          last_login_at?: string | null
          login_times?: number
          name?: string | null
          password?: string | null
          photo_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gender: "male" | "female"
      role: "user" | "model" | "error"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
