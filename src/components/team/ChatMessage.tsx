import type { ChatMessage as ChatMessageType } from '@/types/chat';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Bot, User, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ChatMessageProps {
    message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.sender === 'user';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn(
            "flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
            isUser ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "flex max-w-[85%] md:max-w-[75%] gap-3",
                isUser ? "flex-row-reverse" : "flex-row"
            )}>
                {/* Avatar */}
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                    isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                )}>
                    {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className={cn(
                    "flex flex-col",
                    isUser ? "items-end" : "items-start"
                )}>
                    <div className={cn(
                        "relative px-4 py-3 shadow-sm group",
                        isUser
                            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                            : "bg-white border rounded-2xl rounded-tl-sm dark:bg-gray-800"
                    )}>
                        {/* Copy button for AI messages */}
                        {!isUser && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-gray-400 hover:text-gray-600"
                                onClick={handleCopy}
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        )}

                        {isUser ? (
                            <div className="whitespace-pre-wrap">{message.content}</div>
                        ) : (
                            <MarkdownRenderer content={message.content} />
                        )}
                    </div>

                    {/* Metadata */}
                    <div className={cn(
                        "flex items-center gap-2 mt-1 text-xs text-gray-400",
                        isUser ? "justify-end" : "justify-start"
                    )}>
                        <span>
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                        </span>

                        {!isUser && message.metadata?.agent_used && (
                            <>
                                <span>•</span>
                                <span className="font-medium text-blue-500">
                                    {message.metadata.agent_used}
                                </span>
                            </>
                        )}

                        {!isUser && message.execution_mode && (
                            <Badge variant="secondary" className="text-[10px] h-4 px-1">
                                {message.execution_mode}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
