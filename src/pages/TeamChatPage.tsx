import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import { parseLinkId } from '@/utils/linkUtils';
import type { TeamLinkResponse } from '@/types/team';
import type { ChatMessage, ChatMessageRequest, ChatMessageResponse, ChatHistoryResponse } from '@/types/chat';
import { TeamHeader } from '@/components/team/TeamHeader';
import { SessionInfoBar } from '@/components/team/SessionInfoBar';
import { PasswordModal } from '@/components/team/PasswordModal';
import { ChatMessage as ChatMessageComponent } from '@/components/team/ChatMessage';
import { ChatInputBox } from '@/components/team/ChatInputBox';
import { PageLoader } from '@/components/shared/PageLoader';
import { ErrorDisplay } from '@/components/shared/ErrorDisplay';
import { useSession } from '@/context/SessionContext';
import { Loader2 } from 'lucide-react';

export function TeamChatPage() {
    const { linkId } = useParams<{ linkId: string }>();
    const navigate = useNavigate();
    const {
        sessionId, setSessionId,
        messageCount, setMessageCount,
        setMaxMessages,
        isPasswordVerified, setPasswordVerified
    } = useSession();

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [password, setPassword] = useState<string>('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const parsedLink = parseLinkId(linkId || '');
    const { fullLinkId, requiresPassword } = parsedLink;

    useEffect(() => {
        if (!linkId) {
            navigate('/error?message=Missing link ID');
        }
    }, [linkId, navigate]);

    // Session Storage Persistence logic
    useEffect(() => {
        if (fullLinkId) {
            const savedSession = sessionStorage.getItem(`session_${fullLinkId}`);
            if (savedSession && savedSession !== sessionId) {
                setSessionId(savedSession);
            }
        }
    }, [fullLinkId, setSessionId]);

    useEffect(() => {
        if (sessionId && fullLinkId) {
            sessionStorage.setItem(`session_${fullLinkId}`, sessionId);
        }
    }, [sessionId, fullLinkId]);


    // 1. Initial Link Validation & Team Info
    const { data: teamData, error: teamError } = useQuery<TeamLinkResponse>({
        queryKey: ['team', fullLinkId],
        queryFn: async () => {
            const response = await api.get(`/agenticai/shared/team/${fullLinkId}/chat/`);
            return response.data;
        },
        enabled: !!fullLinkId && (!requiresPassword || isPasswordVerified),
        retry: false
    });

    // Handle Password Modal trigger
    useEffect(() => {
        if (requiresPassword && !isPasswordVerified) {
            setShowPasswordModal(true);
        }
    }, [requiresPassword, isPasswordVerified]);

    // 2. Chat History (if session exists)
    const { data: historyData, isLoading: isHistoryLoading } = useQuery<ChatHistoryResponse>({
        queryKey: ['history', fullLinkId, sessionId],
        queryFn: async () => {
            const response = await api.get(`/agenticai/shared/team/${fullLinkId}/session/${sessionId}/history/`);
            return response.data;
        },
        enabled: !!sessionId && !!fullLinkId && (!requiresPassword || isPasswordVerified),
    });

    // Load history into messages
    useEffect(() => {
        if (historyData) {
            setMessages(historyData.messages);
            setMessageCount(historyData.message_count);
        }
    }, [historyData, setMessageCount]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);


    // Send Message Mutation
    const sendMessageMutation = useMutation({
        mutationFn: async (content: string) => {
            const payload: ChatMessageRequest = {
                query: content,
                session_id: sessionId || undefined,
                password: (requiresPassword && !sessionId) ? password : undefined,
            };

            const response = await api.post<ChatMessageResponse>(
                `/agenticai/shared/team/${fullLinkId}/chat/`,
                payload
            );
            return response.data;
        },
        onSuccess: (data) => {
            // Update session
            if (!sessionId) {
                setSessionId(data.session_id);
            }

            setMessageCount(data.message_count);
            setMaxMessages(data.max_messages);

            // Add AI response
            const aiMessage: ChatMessage = {
                id: Date.now(), // Temporary ID
                sender: 'agent',
                content: data.response,
                execution_mode: data.execution_mode,
                metadata: data.metadata,
                created_at: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);

            // Clear password from state if it was used
            if (password) setPassword('');
        },
        onError: (error) => {
            setIsTyping(false);
            console.error("Failed to send message", error);
        }
    });

    const handleVerifyPassword = (pwd: string) => {
        setPassword(pwd);
        setShowPasswordModal(false);
        setPasswordVerified(true); // Allow fetch to run
    };

    const handleSendMessage = (text: string) => {
        // Optimistically add user message
        const userMessage: ChatMessage = {
            id: Date.now(),
            sender: 'user',
            content: text,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        sendMessageMutation.mutate(text);
    };

    const handleNewSession = () => {
        setSessionId(null);
        setMessageCount(0);
        setMessages([]);
        sessionStorage.removeItem(`session_${fullLinkId}`);
        window.location.reload();
    };

    if (teamError) {
        if ((teamError as any).response?.status === 404) {
            return <ErrorDisplay title="Team Not Found" message="The team link you provided does not exist." />;
        }
        return <ErrorDisplay message="Failed to load team info." retry={() => window.location.reload()} />;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
            {/* Password Modal */}
            <PasswordModal
                isOpen={showPasswordModal}
                teamName={teamData?.team.name || "Private Team"}
                onVerify={handleVerifyPassword}
                isLoading={false}
                error={null}
            />

            {/* Main Chat Interface */}
            {(!requiresPassword || isPasswordVerified) && teamData ? (
                <>
                    <TeamHeader team={teamData.team} linkInfo={teamData.link_info} />

                    {sessionId && (
                        <SessionInfoBar
                            sessionId={sessionId}
                            messageCount={messageCount}
                            maxMessages={teamData.link_info.max_messages_per_session}
                        />
                    )}

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                        {isHistoryLoading && <div className="flex justify-center py-4"><Loader2 className="animate-spin text-gray-400" /></div>}

                        {messages.length === 0 && !isHistoryLoading && (
                            <div className="text-center text-gray-400 mt-10">
                                <p>Start the conversation with {teamData.team.name}!</p>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <ChatMessageComponent key={msg.id || index} message={msg} />
                        ))}

                        {isTyping && (
                            <div className="flex items-center gap-1 text-gray-400 text-sm ml-4 mb-4">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <ChatInputBox
                        onSend={handleSendMessage}
                        isLoading={sendMessageMutation.isPending}
                        disabled={messageCount >= teamData.link_info.max_messages_per_session}
                    />

                    {messageCount >= teamData.link_info.max_messages_per_session && (
                        <div className="bg-orange-100 text-orange-800 p-2 text-center text-sm flex justify-center items-center gap-4">
                            Maximum messages reached.
                            <button onClick={handleNewSession} className="underline font-semibold hover:text-orange-900">Start New Session</button>
                        </div>
                    )}
                </>
            ) : (
                <PageLoader text="Verifying access..." />
            )}
        </div>
    );
}
