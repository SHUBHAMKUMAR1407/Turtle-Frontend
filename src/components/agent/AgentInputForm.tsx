import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AgentInputFormProps {
    onRun: (input: string) => void;
    isLoading: boolean;
    maxLength?: number;
}

export function AgentInputForm({ onRun, isLoading, maxLength = 5000 }: AgentInputFormProps) {
    const [input, setInput] = useState('');

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;
        onRun(input);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit();
        }
    };

    return (
        <Card className="border-t-4 border-t-primary">
            <CardContent className="pt-6 space-y-4">
                <div className="relative">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your query or task for this agent..."
                        className="min-h-[120px] resize-y pr-2 pb-6"
                        maxLength={maxLength}
                        disabled={isLoading}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                        {input.length} / {maxLength}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInput('')}
                        disabled={!input || isLoading}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Clear
                    </Button>

                    <Button
                        onClick={() => handleSubmit()}
                        disabled={!input.trim() || isLoading}
                        className="min-w-[120px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" /> Run Agent
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
