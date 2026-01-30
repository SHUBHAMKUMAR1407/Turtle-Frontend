import type { Agent, AgentLinkInfo } from '@/types/agent';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { User, Calendar, Activity } from 'lucide-react';

interface AgentInfoCardProps {
    agent: Agent;
    linkInfo: AgentLinkInfo;
    createdBy: string;
}

export function AgentInfoCard({ agent, linkInfo, createdBy }: AgentInfoCardProps) {
    const isExpired = linkInfo.is_expired;
    const runPercentage = linkInfo.max_runs
        ? (linkInfo.run_count / linkInfo.max_runs) * 100
        : 0;

    return (
        <Card className="h-full border-l-4 border-l-primary">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-bold">{agent.name}</CardTitle>
                    <Badge variant={isExpired ? "destructive" : "default"}>
                        {isExpired ? "Expired" : "Active"}
                    </Badge>
                </div>
                <CardDescription>{agent.description}</CardDescription>
                <Badge variant="outline" className="w-fit mt-2 bg-blue-50 text-blue-700 border-blue-200">
                    {agent.role}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-2" />
                        <span className="truncate">Created by: {createdBy}</span>
                    </div>

                    {linkInfo.expires_at && (
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Expires: {format(new Date(linkInfo.expires_at), "MMM d, yyyy")}</span>
                        </div>
                    )}
                </div>

                {linkInfo.max_runs && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className="flex items-center"><Activity className="w-3 h-3 mr-1" /> Usage</span>
                            <span>{linkInfo.run_count} / {linkInfo.max_runs} runs</span>
                        </div>
                        <Progress value={runPercentage} className="h-2" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
