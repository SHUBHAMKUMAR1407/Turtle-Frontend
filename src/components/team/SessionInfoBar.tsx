import { Button } from '@/components/ui/button';
import { Copy, Hash, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface SessionInfoBarProps {
    sessionId: string;
    messageCount: number;
    maxMessages: number;
}

export function SessionInfoBar({ sessionId, messageCount, maxMessages }: SessionInfoBarProps) {
    const [copied, setCopied] = useState(false);
    const percentage = Math.min((messageCount / maxMessages) * 100, 100);

    const copySession = () => {
        navigator.clipboard.writeText(sessionId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-muted/30 border-b px-4 py-2 text-xs md:text-sm">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <Hash className="w-3 h-3" />
                    <span className="font-mono">{sessionId.substring(0, 8)}...</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1"
                        onClick={copySession}
                    >
                        <Copy className={cn("w-3 h-3", copied ? "text-green-500" : "")} />
                    </Button>
                </div>

                <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                    <div className="flex flex-col w-full items-end">
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{messageCount} / {maxMessages}</span>
                        </div>
                        <Progress value={percentage} className={cn("h-1.5", percentage > 90 ? "bg-red-100 [&>div]:bg-red-500" : "")} />
                    </div>
                </div>
            </div>
        </div>
    );
}
