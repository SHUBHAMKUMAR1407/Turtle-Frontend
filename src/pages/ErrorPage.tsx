import { ErrorDisplay } from '@/components/shared/ErrorDisplay';
import { useSearchParams } from 'react-router-dom';

export function ErrorPage() {
    const [searchParams] = useSearchParams();
    const message = searchParams.get('message') || 'An unexpected error occurred.';
    const code = searchParams.get('code') ? parseInt(searchParams.get('code')!, 10) : undefined;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <ErrorDisplay
                title="Error"
                message={message}
                code={code}
                retry={() => window.history.back()}
            />
        </div>
    );
}
