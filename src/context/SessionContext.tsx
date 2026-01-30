import { createContext, useContext, useState, type ReactNode } from 'react';

interface SessionContextValue {
    sessionId: string | null;
    setSessionId: (id: string | null) => void;
    messageCount: number;
    setMessageCount: (count: number) => void;
    maxMessages: number;
    setMaxMessages: (max: number) => void;
    isPasswordVerified: boolean;
    setPasswordVerified: (verified: boolean) => void;
    resetSession: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [sessionId, setSessionIdState] = useState<string | null>(null);
    const [messageCount, setMessageCount] = useState(0);
    const [maxMessages, setMaxMessages] = useState(50);
    const [isPasswordVerified, setPasswordVerified] = useState(false);

    // Helper to sync with sessionStorage could go here, but doing it in the Page component 
    // or a custom hook is often cleaner for per-link logic. 
    // However, simple persistence for the current active session:

    const setSessionId = (id: string | null) => {
        setSessionIdState(id);
        if (id) {
            // We might want to save it with a key related to the linkId, 
            // but the Context is global. usage in Page will handle specific keys.
        }
    };

    const resetSession = () => {
        setSessionId(null);
        setMessageCount(0);
        setPasswordVerified(false);
    };

    return (
        <SessionContext.Provider value={{
            sessionId,
            setSessionId,
            messageCount,
            setMessageCount,
            maxMessages,
            setMaxMessages,
            isPasswordVerified,
            setPasswordVerified,
            resetSession
        }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
