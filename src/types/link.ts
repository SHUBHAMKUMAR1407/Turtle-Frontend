export interface ParsedLink {
    fullLinkId: string; // "pu_uuid" or "pr_uuid"
    cleanLinkId: string; // "uuid"
    linkType: 'public' | 'private' | 'unknown';
    requiresPassword: boolean;
    prefix: 'pu' | 'pr' | null;
}
