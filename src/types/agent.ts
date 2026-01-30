export interface Agent {
    id: number;
    name: string;
    description: string;
    role: string;
}

export interface AgentLinkInfo {
    link_id: string;
    is_active: boolean;
    expires_at: string | null;
    run_count: number;
    max_runs: number | null;
    is_valid: boolean;
    is_expired: boolean;
}

export interface AgentLinkResponse {
    agent: Agent;
    link_info: AgentLinkInfo;
    created_by: string;
    created_at: string;
}

export interface AgentRunRequest {
    input: string;
}

export interface AgentRunResponse {
    success: boolean;
    result: string;
    run_type: string;
    link_id: string;
    metadata?: {
        execution_time_seconds?: number;
        tokens_used?: number;
    };
}
