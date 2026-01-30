// export interface Agent {
//     id: number;
//     name: string;
//     description: string;
//     role: string;
// }

// export interface AgentLinkInfo {
//     link_id: string;
//     is_active: boolean;
//     expires_at: string | null;
//     run_count: number;
//     max_runs: number | null;
//     is_valid: boolean;
//     is_expired: boolean;
// }

// export interface AgentLinkResponse {
//     agent: Agent;
//     link_info: AgentLinkInfo;
//     created_by: string;
//     created_at: string;
// }

// export interface AgentRunRequest {
//     input: string;
// }

// export interface AgentRunResponse {
//     success: boolean;
//     result: string;
//     run_type: string;
//     link_id: string;
//     metadata?: {
//         execution_time_seconds?: number;
//         tokens_used?: number;
//     };
// }

// src/types/agent.ts

// ================================
// Input Parameter Types
// ================================

export interface InputParam {
  key: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'file';
  title: string;
  integration: string;
  is_required: boolean;
  extra_credits: number;
  options?: string[]; // For select type
  placeholder?: string;
  description?: string;
}

// ================================
// Agent Types
// ================================

export interface Agent {
    id: number;
    name: string;
    description: string;
    role: string;
    input_params: InputParam[]; // ✅ ADDED - Dynamic form fields
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

// ================================
// Agent Run Types
// ================================

export interface AgentRunRequest {
    input: Record<string, any>; // ✅ CHANGED - From string to object for dynamic form data
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

// ================================
// Helper Types
// ================================

export type InputValue = string | number | boolean | null;

export type FormData = Record<string, InputValue>;

export interface ValidationError {
    field: string;
    message: string;
}
