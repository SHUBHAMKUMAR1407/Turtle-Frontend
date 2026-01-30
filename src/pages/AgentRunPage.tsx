// import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import api from '@/services/api';
// import { parseLinkId } from '@/utils/linkUtils';
// import type { AgentLinkResponse, AgentRunResponse } from '@/types/agent';
// import { AgentInfoCard } from '@/components/agent/AgentInfoCard';
// import { AgentInputForm } from '@/components/agent/AgentInputForm';
// import { AgentOutputDisplay } from '@/components/agent/AgentOutputDisplay';
// import { PageLoader } from '@/components/shared/PageLoader';
// import { ErrorDisplay } from '@/components/shared/ErrorDisplay';
// import { useState, useEffect } from 'react';

// export function AgentRunPage() {
//     const { linkId } = useParams<{ linkId: string }>();
//     const navigate = useNavigate();
//     const [result, setResult] = useState<AgentRunResponse | null>(null);

//     const parsedLink = parseLinkId(linkId || '');
//     const { fullLinkId } = parsedLink;

//     useEffect(() => {
//         if (!linkId) {
//             navigate('/error?message=Missing link ID');
//         }
//     }, [linkId, navigate]);

//     const { data, isLoading, error } = useQuery<AgentLinkResponse, any>({
//         queryKey: ['agent', fullLinkId],
//         queryFn: async () => {
//             const response = await api.get(`/agent/public/agents/${fullLinkId}/run/`);
//             return response.data;
//         },
//         enabled: !!fullLinkId,
//         retry: false
//     });

//     const mutation = useMutation({
//         mutationFn: async (input: string) => {
//             const response = await api.post<AgentRunResponse>(`/agent/public/agents/${fullLinkId}/run/`, { input });
//             return response.data;
//         },
//         onSuccess: (data) => {
//             setResult(data);
//         },
//         onError: (err: any) => {
//             console.error("Agent execution failed:", err);
//         }
//     });

//     if (isLoading) return <PageLoader text="Loading agent details..." />;

//     if (error) {
//         // Handle specific error codes if needed
//         const status = error.response?.status;
//         if (status === 404) {
//             return <ErrorDisplay title="Agent Not Found" message="The agent link you provided does not exist." />;
//         }
//         if (status === 403 || status === 410) { // 410 Gone for expired
//             // We could redirect to /expired here
//             // navigate(`/expired?reason=expired`);
//             return <ErrorDisplay title="Link Inaccessible" message="This link is no longer valid or has expired." />;
//         }
//         return <ErrorDisplay message={error.message || "Failed to load agent."} retry={() => window.location.reload()} />;
//     }

//     if (!data) return <ErrorDisplay message="No data received." />;

//     return (
//         <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
//             <div className="max-w-6xl mx-auto space-y-6">
//                 {/* Header - Simple Logo/Name place holder */}
//                 <header className="mb-8">
//                     <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
//                         <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
//                             AI
//                         </div>
//                         {import.meta.env.VITE_APP_NAME || "AI Agent Chat"}
//                     </h1>
//                 </header>

//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//                     {/* Left Sidebar: Agent Info */}
//                     <div className="lg:col-span-4 space-y-6">
//                         <AgentInfoCard
//                             agent={data.agent}
//                             linkInfo={data.link_info}
//                             createdBy={data.created_by}
//                         />
//                     </div>

//                     {/* Right Content: Input & Output */}
//                     <div className="lg:col-span-8 space-y-6">
//                         <AgentInputForm
//                             onRun={(input) => mutation.mutate(input)}
//                             isLoading={mutation.isPending}
//                         />

//                         {mutation.isError && (
//                             <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
//                                 <p className="font-semibold">Execution Failed</p>
//                                 <p className="text-sm">{(mutation.error as any)?.response?.data?.error || mutation.error.message}</p>
//                             </div>
//                         )}

//                         {result && <AgentOutputDisplay result={result} />}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// src/pages/AgentRunPage.tsx

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { parseLinkId } from '@/utils/linkUtils';
import type { AgentLinkResponse, AgentRunResponse } from '@/types/agent';
import { AgentInfoCard } from '@/components/agent/AgentInfoCard';
import { AgentInputForm } from '@/components/agent/AgentInputForm';
import { AgentOutputDisplay } from '@/components/agent/AgentOutputDisplay';
import { PageLoader } from '@/components/shared/PageLoader';
import { ErrorDisplay } from '@/components/shared/ErrorDisplay';
import { useState, useEffect } from 'react';

export function AgentRunPage() {
    const { linkId } = useParams<{ linkId: string }>();
    const navigate = useNavigate();
    const [result, setResult] = useState<AgentRunResponse | null>(null);

    const parsedLink = parseLinkId(linkId || '');
    const { fullLinkId } = parsedLink;

    useEffect(() => {
        if (!linkId) {
            navigate('/error?message=Missing link ID');
        }
    }, [linkId, navigate]);

    const { data, isLoading, error } = useQuery<AgentLinkResponse, any>({
        queryKey: ['agent', fullLinkId],
        queryFn: async () => {
            const response = await api.get(`/agent/public/agents/${fullLinkId}/run/`);
            return response.data;
        },
        enabled: !!fullLinkId,
        retry: false
    });

    const mutation = useMutation({
        mutationFn: async (formData: Record<string, any>) => {
            // ✅ Send as object, not string
            const response = await api.post<AgentRunResponse>(
                `/agent/public/agents/${fullLinkId}/run/`, 
                { input: formData }
            );
            return response.data;
        },
        onSuccess: (data) => {
            setResult(data);
        },
        onError: (err: any) => {
            console.error("Agent execution failed:", err);
        }
    });

    if (isLoading) return <PageLoader text="Loading agent details..." />;

    if (error) {
        const status = error.response?.status;
        if (status === 404) {
            return <ErrorDisplay title="Agent Not Found" message="The agent link you provided does not exist." />;
        }
        if (status === 403 || status === 410) {
            return <ErrorDisplay title="Link Inaccessible" message="This link is no longer valid or has expired." />;
        }
        return <ErrorDisplay message={error.message || "Failed to load agent."} retry={() => window.location.reload()} />;
    }

    if (!data) return <ErrorDisplay message="No data received." />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <header className="mb-8">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            AI
                        </div>
                        {import.meta.env.VITE_APP_NAME || "AI Agent Chat"}
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar: Agent Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <AgentInfoCard
                            agent={data.agent}
                            linkInfo={data.link_info}
                            createdBy={data.created_by}
                        />
                    </div>

                    {/* Right Content: Dynamic Form & Output */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* ✅ Dynamic form based on input_params */}
                        <AgentInputForm
                            inputParams={data.agent.input_params}
                            onRun={(formData) => mutation.mutate(formData)}
                            isLoading={mutation.isPending}
                        />

                        {mutation.isError && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                                <p className="font-semibold">Execution Failed</p>
                                <p className="text-sm">
                                    {(mutation.error as any)?.response?.data?.error || mutation.error.message}
                                </p>
                            </div>
                        )}

                        {result && <AgentOutputDisplay result={result} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
