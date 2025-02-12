export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      /** Junction table linking comments to files */
      comment_files: {
        Row: {
          /** Reference to the associated comment */
          comment_id: string;
          /** Reference to the associated file */
          file_id: string;
          /** Unique identifier for the comment-file association */
          id: string;
        };
        Insert: {
          /** Reference to the associated comment */
          comment_id: string;
          /** Reference to the associated file */
          file_id: string;
          /** Unique identifier for the comment-file association */
          id?: string;
        };
        Update: {
          /** Reference to the associated comment */
          comment_id?: string;
          /** Reference to the associated file */
          file_id?: string;
          /** Unique identifier for the comment-file association */
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comment_filesToreport_comments";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "report_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comment_filesTofiles";
            columns: ["file_id"];
            isOneToOne: false;
            referencedRelation: "files";
            referencedColumns: ["id"];
          },
        ];
      };
      /** File metadata for uploaded files */
      files: {
        Row: {
          /** Timestamp when the file was uploaded */
          created_at: string;
          /** Unique identifier for the file */
          id: string;
          /** Public URL of the file */
          url: string;
          user_id: string;
        };
        Insert: {
          /** Timestamp when the file was uploaded */
          created_at?: string;
          /** Unique identifier for the file */
          id?: string;
          /** Public URL of the file */
          url: string;
          user_id: string;
        };
        Update: {
          /** Timestamp when the file was uploaded */
          created_at?: string;
          /** Unique identifier for the file */
          id?: string;
          /** Public URL of the file */
          url?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "filesTousers";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      /** Geographic locations for incidents */
      geolocations: {
        Row: {
          /** Timestamp when the location was created */
          created_at: string;
          /** Unique identifier for the location */
          id: string;
          /** Latitude coordinate */
          latitude: number;
          /** Longitude coordinate */
          longitude: number;
        };
        Insert: {
          /** Timestamp when the location was created */
          created_at?: string;
          /** Unique identifier for the location */
          id?: string;
          /** Latitude coordinate */
          latitude: number;
          /** Longitude coordinate */
          longitude: number;
        };
        Update: {
          /** Timestamp when the location was created */
          created_at?: string;
          /** Unique identifier for the location */
          id?: string;
          /** Latitude coordinate */
          latitude?: number;
          /** Longitude coordinate */
          longitude?: number;
        };
        Relationships: [];
      };
      /** Simple notification model for user alerts */
      notification: {
        Row: {
          /** When the notification was created */
          created_at: string;
          /** Unique identifier for the notification */
          id: string;
          /** Notification message */
          message: string;
          /** Whether the notification has been read */
          read: boolean;
          /** Notification title */
          title: string;
          /** User who receives the notification */
          user_id: string;
        };
        Insert: {
          /** When the notification was created */
          created_at?: string;
          /** Unique identifier for the notification */
          id?: string;
          /** Notification message */
          message: string;
          /** Whether the notification has been read */
          read?: boolean;
          /** Notification title */
          title: string;
          /** User who receives the notification */
          user_id: string;
        };
        Update: {
          /** When the notification was created */
          created_at?: string;
          /** Unique identifier for the notification */
          id?: string;
          /** Notification message */
          message?: string;
          /** Whether the notification has been read */
          read?: boolean;
          /** Notification title */
          title?: string;
          /** User who receives the notification */
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notificationTousers";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      /** User notifications */
      notifications: {
        Row: {
          comment_id: string | null;
          /** Notification content/message */
          content: string;
          /** Timestamp when the notification was created */
          created_at: string;
          /** Unique identifier for the notification */
          id: string;
          /** Whether the notification has been read */
          read: boolean;
          report_id: string | null;
          /** Notification title */
          title: string;
          /** Type of notification
           * - comment: Notification for new comments
           * - vote: Notification for votes on reports
           * - admin_action: Notification for administrative actions
           */
          type: Database["public"]["Enums"]["notification_type"];
          user_id: string;
        };
        Insert: {
          comment_id?: string | null;
          /** Notification content/message */
          content: string;
          /** Timestamp when the notification was created */
          created_at?: string;
          /** Unique identifier for the notification */
          id?: string;
          /** Whether the notification has been read */
          read?: boolean;
          report_id?: string | null;
          /** Notification title */
          title: string;
          /** Type of notification
           * - comment: Notification for new comments
           * - vote: Notification for votes on reports
           * - admin_action: Notification for administrative actions
           */
          type: Database["public"]["Enums"]["notification_type"];
          user_id: string;
        };
        Update: {
          comment_id?: string | null;
          /** Notification content/message */
          content?: string;
          /** Timestamp when the notification was created */
          created_at?: string;
          /** Unique identifier for the notification */
          id?: string;
          /** Whether the notification has been read */
          read?: boolean;
          report_id?: string | null;
          /** Notification title */
          title?: string;
          /** Type of notification
           * - comment: Notification for new comments
           * - vote: Notification for votes on reports
           * - admin_action: Notification for administrative actions
           */
          type?: Database["public"]["Enums"]["notification_type"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notificationsToreport_comments";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "report_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notificationsToreports";
            columns: ["report_id"];
            isOneToOne: false;
            referencedRelation: "reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notificationsTousers";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      /** Comments on incident reports */
      report_comments: {
        Row: {
          /** Text content of the comment */
          content: string;
          /** Timestamp when the comment was created */
          created_at: string;
          /** Unique identifier for the comment */
          id: string;
          /** Reference to the report being commented on */
          report_id: string;
          /** Timestamp when the comment was last updated */
          updated_at: string;
          /** Reference to the user who created the comment */
          user_id: string;
        };
        Insert: {
          /** Text content of the comment */
          content: string;
          /** Timestamp when the comment was created */
          created_at?: string;
          /** Unique identifier for the comment */
          id?: string;
          /** Reference to the report being commented on */
          report_id: string;
          /** Timestamp when the comment was last updated */
          updated_at: string;
          /** Reference to the user who created the comment */
          user_id: string;
        };
        Update: {
          /** Text content of the comment */
          content?: string;
          /** Timestamp when the comment was created */
          created_at?: string;
          /** Unique identifier for the comment */
          id?: string;
          /** Reference to the report being commented on */
          report_id?: string;
          /** Timestamp when the comment was last updated */
          updated_at?: string;
          /** Reference to the user who created the comment */
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "report_commentsToreports";
            columns: ["report_id"];
            isOneToOne: false;
            referencedRelation: "reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "report_commentsTousers";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      /** Junction table linking reports to files */
      report_files: {
        Row: {
          /** Reference to the associated file */
          file_id: string;
          /** Unique identifier for the report-file association */
          id: string;
          /**
           * - low
           * - medium
           * - high
           * - original
           */
          quality: Database["public"]["Enums"]["file_quality"];
          /** Reference to the associated report */
          report_id: string;
        };
        Insert: {
          /** Reference to the associated file */
          file_id: string;
          /** Unique identifier for the report-file association */
          id?: string;
          /**
           * - low
           * - medium
           * - high
           * - original
           */
          quality?: Database["public"]["Enums"]["file_quality"];
          /** Reference to the associated report */
          report_id: string;
        };
        Update: {
          /** Reference to the associated file */
          file_id?: string;
          /** Unique identifier for the report-file association */
          id?: string;
          /**
           * - low
           * - medium
           * - high
           * - original
           */
          quality?: Database["public"]["Enums"]["file_quality"];
          /** Reference to the associated report */
          report_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "filesToreport_files";
            columns: ["file_id"];
            isOneToOne: false;
            referencedRelation: "files";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "report_filesToreports";
            columns: ["report_id"];
            isOneToOne: false;
            referencedRelation: "reports";
            referencedColumns: ["id"];
          },
        ];
      };
      /** User reactions on reports */
      report_reactions: {
        Row: {
          /** Timestamp when the reaction was created */
          created_at: string;
          /** Unique identifier for the reaction */
          id: string;
          report_id: string;
          /** Type of reaction (upvote/downvote)
           * - upvote: Positive reaction to a report
           * - downvote: Negative reaction to a report
           */
          type: Database["public"]["Enums"]["report_reaction_type"];
          user_id: string;
        };
        Insert: {
          /** Timestamp when the reaction was created */
          created_at?: string;
          /** Unique identifier for the reaction */
          id?: string;
          report_id: string;
          /** Type of reaction (upvote/downvote)
           * - upvote: Positive reaction to a report
           * - downvote: Negative reaction to a report
           */
          type: Database["public"]["Enums"]["report_reaction_type"];
          user_id: string;
        };
        Update: {
          /** Timestamp when the reaction was created */
          created_at?: string;
          /** Unique identifier for the reaction */
          id?: string;
          report_id?: string;
          /** Type of reaction (upvote/downvote)
           * - upvote: Positive reaction to a report
           * - downvote: Negative reaction to a report
           */
          type?: Database["public"]["Enums"]["report_reaction_type"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "report_reactionsToreports";
            columns: ["report_id"];
            isOneToOne: false;
            referencedRelation: "reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "report_reactionsTousers";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      /** Incident reports submitted by users */
      reports: {
        Row: {
          /** Timestamp when the report was created */
          created_at: string;
          /** Detailed description of the incident */
          description: string;
          /** Reference to the location where the incident occurred */
          golocation_id: string;
          /** Unique identifier for the report */
          id: string;
          /** Date and time when the incident occurred */
          incident_at: string;
          /** Title of the incident report */
          title: string;
          /** Timestamp when the report was last updated */
          updated_at: string;
          user_id: string;
          /** Verification status of the report */
          verified: boolean;
        };
        Insert: {
          /** Timestamp when the report was created */
          created_at?: string;
          /** Detailed description of the incident */
          description: string;
          /** Reference to the location where the incident occurred */
          golocation_id: string;
          /** Unique identifier for the report */
          id?: string;
          /** Date and time when the incident occurred */
          incident_at: string;
          /** Title of the incident report */
          title: string;
          /** Timestamp when the report was last updated */
          updated_at: string;
          user_id: string;
          /** Verification status of the report */
          verified?: boolean;
        };
        Update: {
          /** Timestamp when the report was created */
          created_at?: string;
          /** Detailed description of the incident */
          description?: string;
          /** Reference to the location where the incident occurred */
          golocation_id?: string;
          /** Unique identifier for the report */
          id?: string;
          /** Date and time when the incident occurred */
          incident_at?: string;
          /** Title of the incident report */
          title?: string;
          /** Timestamp when the report was last updated */
          updated_at?: string;
          user_id?: string;
          /** Verification status of the report */
          verified?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "geolocationsToreports";
            columns: ["golocation_id"];
            isOneToOne: false;
            referencedRelation: "geolocations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reportsTousers";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      /** User notification preferences */
      user_preferences: {
        Row: {
          /** Unique identifier for the preference settings */
          id: string;
          /** Image quality
           * - low
           * - medium
           * - high
           * - original
           */
          image_quality: Database["public"]["Enums"]["file_quality"];
          /** Types of notifications the user wants to receive
           * - comment: Notification for new comments
           * - vote: Notification for votes on reports
           * - admin_action: Notification for administrative actions
           */
          notification_types: Database["public"]["Enums"]["notification_type"];
          /** Reference to the user */
          user_id: string;
          /** Post image watermark */
          watermark: string | null;
        };
        Insert: {
          /** Unique identifier for the preference settings */
          id?: string;
          /** Image quality
           * - low
           * - medium
           * - high
           * - original
           */
          image_quality?: Database["public"]["Enums"]["file_quality"];
          /** Types of notifications the user wants to receive
           * - comment: Notification for new comments
           * - vote: Notification for votes on reports
           * - admin_action: Notification for administrative actions
           */
          notification_types: Database["public"]["Enums"]["notification_type"];
          /** Reference to the user */
          user_id: string;
          /** Post image watermark */
          watermark?: string | null;
        };
        Update: {
          /** Unique identifier for the preference settings */
          id?: string;
          /** Image quality
           * - low
           * - medium
           * - high
           * - original
           */
          image_quality?: Database["public"]["Enums"]["file_quality"];
          /** Types of notifications the user wants to receive
           * - comment: Notification for new comments
           * - vote: Notification for votes on reports
           * - admin_action: Notification for administrative actions
           */
          notification_types?: Database["public"]["Enums"]["notification_type"];
          /** Reference to the user */
          user_id?: string;
          /** Post image watermark */
          watermark?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_preferencesTousers";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      /** User account information and authentication details */
      users: {
        Row: {
          /** URL to user's profile picture */
          avatar_url: string;
          /** Timestamp when the user account was created */
          created_at: string;
          /** User's email address, must be unique */
          email: string;
          /** FCM token */
          fcm_token: string | null;
          /** User's full name */
          full_name: string;
          /** Unique identifier for the user */
          id: string;
          /** Hashed password for user authentication */
          password: string;
          /** User's phone number, must be unique */
          phone: string;
          /** User's role in the system
           * - member: Regular user with standard permissions
           * - admin: Administrator with full system access
           */
          role: Database["public"]["Enums"]["user_role"];
          /** Current status of the user account
           * - active: User account is active and can use the system
           * - inactive: User account is temporarily disabled
           * - banned: User account is permanently blocked
           */
          status: Database["public"]["Enums"]["user_status"];
          /** Timestamp when the user account was last updated */
          updated_at: string;
        };
        Insert: {
          /** URL to user's profile picture */
          avatar_url: string;
          /** Timestamp when the user account was created */
          created_at?: string;
          /** User's email address, must be unique */
          email: string;
          /** FCM token */
          fcm_token?: string | null;
          /** User's full name */
          full_name: string;
          /** Unique identifier for the user */
          id?: string;
          /** Hashed password for user authentication */
          password: string;
          /** User's phone number, must be unique */
          phone: string;
          /** User's role in the system
           * - member: Regular user with standard permissions
           * - admin: Administrator with full system access
           */
          role?: Database["public"]["Enums"]["user_role"];
          /** Current status of the user account
           * - active: User account is active and can use the system
           * - inactive: User account is temporarily disabled
           * - banned: User account is permanently blocked
           */
          status?: Database["public"]["Enums"]["user_status"];
          /** Timestamp when the user account was last updated */
          updated_at: string;
        };
        Update: {
          /** URL to user's profile picture */
          avatar_url?: string;
          /** Timestamp when the user account was created */
          created_at?: string;
          /** User's email address, must be unique */
          email?: string;
          /** FCM token */
          fcm_token?: string | null;
          /** User's full name */
          full_name?: string;
          /** Unique identifier for the user */
          id?: string;
          /** Hashed password for user authentication */
          password?: string;
          /** User's phone number, must be unique */
          phone?: string;
          /** User's role in the system
           * - member: Regular user with standard permissions
           * - admin: Administrator with full system access
           */
          role?: Database["public"]["Enums"]["user_role"];
          /** Current status of the user account
           * - active: User account is active and can use the system
           * - inactive: User account is temporarily disabled
           * - banned: User account is permanently blocked
           */
          status?: Database["public"]["Enums"]["user_status"];
          /** Timestamp when the user account was last updated */
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      /* Views are within tables */
    };
    Functions: {
      /* No support for functions */
    };
    Enums: {
      /** Quality of the file
       * - low
       * - medium
       * - high
       * - original
       */
      file_quality: "low" | "medium" | "high" | "original";
      /** Types of notifications that can be sent to users
       * - comment: Notification for new comments
       * - vote: Notification for votes on reports
       * - admin_action: Notification for administrative actions
       */
      notification_type: "comment" | "vote" | "admin_action";
      /** Types of reactions that can be made on reports
       * - upvote: Positive reaction to a report
       * - downvote: Negative reaction to a report
       */
      report_reaction_type: "upvote" | "downvote";
      /** User role enum defining access levels in the system
       * - member: Regular user with standard permissions
       * - admin: Administrator with full system access
       */
      user_role: "member" | "admin";
      /** User account status
       * - active: User account is active and can use the system
       * - inactive: User account is temporarily disabled
       * - banned: User account is permanently blocked
       */
      user_status: "active" | "inactive" | "banned";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
