import { Loader2 } from 'lucide-react';

export function PageLoader({ text = "Loading..." }: { text?: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p className="text-sm font-medium animate-pulse">{text}</p>
        </div>
    );
}
