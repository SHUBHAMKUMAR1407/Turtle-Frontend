import type { ParsedLink } from '@/types/link';

export const parseLinkId = (linkId: string): ParsedLink => {
    if (linkId.startsWith('pu_')) {
        return {
            fullLinkId: linkId,
            cleanLinkId: linkId.substring(3),
            linkType: 'public',
            requiresPassword: false,
            prefix: 'pu'
        };
    } else if (linkId.startsWith('pr_')) {
        return {
            fullLinkId: linkId,
            cleanLinkId: linkId.substring(3),
            linkType: 'private',
            requiresPassword: true,
            prefix: 'pr'
        };
    } else {
        // Legacy links without prefix (fallback) or invalid format
        return {
            fullLinkId: linkId,
            cleanLinkId: linkId,
            linkType: 'unknown',
            requiresPassword: false, // Will be determined by API if needed, but 'unknown' usually implies error or legacy
            prefix: null
        };
    }
};
