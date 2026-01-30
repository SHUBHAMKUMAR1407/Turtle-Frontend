import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { Button } from '@/components/ui/button';
import { Copy, Check, Clock, Cpu } from 'lucide-react';
import { useState } from 'react';
import type { AgentRunResponse } from '@/types/agent';

interface AgentOutputDisplayProps {
    result: AgentRunResponse | null;
}

export function AgentOutputDisplay({ result }: AgentOutputDisplayProps) {
    const [copied, setCopied] = useState(false);

    if (!result) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(result.result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="border-t-4 border-t-green-500 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-green-700 flex items-center">
                    <Check className="w-5 h-5 mr-2" /> Execution Successful
                </CardTitle>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied" : "Copy Result"}
                </Button>
            </CardHeader>

            <CardContent>
                <div className="bg-muted/30 p-4 rounded-lg border min-h-[100px]">
                    <MarkdownRenderer content={result.result} />
                </div>

                {result.metadata && (
                    <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
                        {result.metadata.execution_time_seconds && (
                            <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" /> {result.metadata.execution_time_seconds}s
                            </span>
                        )}
                        {result.metadata.tokens_used && (
                            <span className="flex items-center">
                                <Cpu className="w-3 h-3 mr-1" /> {result.metadata.tokens_used} tokens
                            </span>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
