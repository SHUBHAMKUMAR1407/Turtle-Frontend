import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputBoxProps {
    onSend: (message: string) => void;
    isLoading: boolean;
    disabled?: boolean;
    maxLength?: number;
}

export function ChatInputBox({ onSend, isLoading, disabled = false, maxLength = 5000 }: ChatInputBoxProps) {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
        }
    }, [input]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading || disabled) return;

        onSend(input);
        setInput('');
        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="relative bg-white border-t p-4 pb-6 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto relative flex gap-2 items-end">
                <div className="relative flex-1">
                    <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="min-h-[50px] max-h-[150px] resize-none pr-12 py-3 shadow-none focus-visible:ring-1"
                        disabled={disabled || isLoading}
                        maxLength={maxLength}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400 select-none">
                        {input.length} / {maxLength}
                    </div>
                </div>

                <Button
                    onClick={() => handleSubmit()}
                    disabled={!input.trim() || isLoading || disabled}
                    size="icon"
                    className="h-[50px] w-[50px] shrink-0 rounded-xl"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </Button>
            </div>
        </div>
    );
}
