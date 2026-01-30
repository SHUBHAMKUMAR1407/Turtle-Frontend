export interface ChatMessage {
    id: number;
    sender: 'user' | 'agent';
    content: string;
    execution_mode?: string | null;
    metadata?: {
        agent_used?: string;
        execution_time?: number;
    };
    created_at: string;
}

export interface ChatMessageRequest {
    query: string;
    session_id?: string;
    password?: string;
    user_email?: string;
    user_name?: string;
}

export interface ChatMessageResponse {
    response: string;
    session_id: string;
    execution_mode: string;
    metadata?: {
        agent_used?: string;
        execution_time?: number;
    };
    message_count: number;
    max_messages: number;
    link_type: 'public' | 'private';
    success: boolean;
}

export interface ChatHistoryResponse {
    session_id: string;
    team: {
        team_id: string;
        name: string;
    };
    messages: ChatMessage[];
    message_count: number;
    created_at: string;
    user_email?: string;
    user_name?: string;
}
