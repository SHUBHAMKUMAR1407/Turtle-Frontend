export interface TeamMember {
    id: number;
    name: string;
    role: string;
    description: string;
    avatar?: string;
}

export interface Team {
    team_id: string;
    name: string;
    description: string;
    mode: 'hierarchical' | 'sequential' | 'collaborative' | 'routing';
    members: TeamMember[];
    members_count: number;
}

export interface TeamLinkInfo {
    link_id: string;
    link_type: 'public' | 'private';
    link_name: string;
    is_active: boolean;
    is_private: boolean;
    requires_password: boolean;
    require_email: boolean;
    expires_at: string | null;
    max_chats: number | null;
    chat_count: number;
    max_messages_per_session: number;
    total_messages: number;
    is_valid: boolean;
    is_expired: boolean;
    collect_feedback: boolean;
}

export interface TeamLinkResponse {
    team: Team;
    link_info: TeamLinkInfo;
    created_by: string;
    created_at: string;
}
