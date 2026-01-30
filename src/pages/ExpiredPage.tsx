import { ErrorDisplay } from '@/components/shared/ErrorDisplay';
import { useSearchParams } from 'react-router-dom';

export function ExpiredPage() {
    const [searchParams] = useSearchParams();
    const reason = searchParams.get('reason');

    let message = "This link is no longer valid.";
    let title = "Link Expired";

    switch (reason) {
        case 'expired':
            message = "The validity period for this link has ended.";
            break;
        case 'disabled':
            message = "This link has been manually disabled by the owner.";
            title = "Link Disabled";
            break;
        case 'max_runs':
            message = "This link has reached its maximum usage limit.";
            title = "Usage Limit Reached";
            break;
        case 'max_chats':
            message = "This link has reached the maximum number of allowed chat sessions.";
            title = "Session Limit Reached";
            break;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <ErrorDisplay
                title={title}
                message={message}
                retry={() => window.location.href = '/'}
            />
        </div>
    );
}
