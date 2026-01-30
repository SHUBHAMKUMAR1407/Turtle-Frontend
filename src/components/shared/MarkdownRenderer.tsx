import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
    enableCopyCode?: boolean;
}

export function MarkdownRenderer({ content, className, enableCopyCode = true }: MarkdownRendererProps) {
    return (
        <div className={cn("prose prose-sm dark:prose-invert max-w-none break-words", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');
                        const [copied, setCopied] = useState(false);

                        const handleCopy = () => {
                            navigator.clipboard.writeText(codeString);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        };

                        return !inline && match ? (
                            <div className="relative group rounded-md overflow-hidden my-4">
                                {enableCopyCode && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute right-2 top-2 h-8 w-8 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 hover:bg-gray-700"
                                        onClick={handleCopy}
                                    >
                                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                )}
                                <SyntaxHighlighter
                                    {...props}
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{ margin: 0, borderRadius: '0.375rem' }}
                                >
                                    {codeString}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className={cn("bg-muted px-1.5 py-0.5 rounded text-sm font-mono", className)} {...props}>
                                {children}
                            </code>
                        );
                    },
                    // Enhance other elements
                    a: ({ node, ...props }) => <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-3 mt-5" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
