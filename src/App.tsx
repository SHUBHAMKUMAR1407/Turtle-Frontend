import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AgentRunPage } from '@/pages/AgentRunPage';
import { TeamChatPage } from '@/pages/TeamChatPage';
import { ExpiredPage } from '@/pages/ExpiredPage';
import { ErrorPage } from '@/pages/ErrorPage';
import { SessionProvider } from '@/context/SessionContext';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/public/agent/:linkId" element={<AgentRunPage />} />

        {/* Wrap Team Chat in Session Provider */}
        <Route path="/shared/team/:linkId" element={
          <SessionProvider>
            <TeamChatPage />
          </SessionProvider>
        } />

        <Route path="/expired" element={<ExpiredPage />} />
        <Route path="/error" element={<ErrorPage />} />

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/error?message=No link provided" replace />} />
        <Route path="*" element={<Navigate to="/error?message=Page not found" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
