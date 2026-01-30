import type { Team, TeamLinkInfo } from '@/types/team';
import { Badge } from '@/components/ui/badge';
import { Users, Lock, Unlock } from 'lucide-react';

// Actually, HoverCard is standard shadcn, but I didn't create it. I'll stick to simple layout.

interface TeamHeaderProps {
    team: Team;
    linkInfo: TeamLinkInfo;
}

export function TeamHeader({ team, linkInfo }: TeamHeaderProps) {
    return (
        <div className="bg-white border-b px-4 py-3 md:px-8 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        {team.name}
                        {linkInfo.is_private ? (
                            <Lock className="w-4 h-4 text-orange-500" aria-label="Private Team" />
                        ) : (
                            <Unlock className="w-4 h-4 text-green-500" aria-label="Public Team" />
                        )}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {team.description}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {team.members_count} Agents
                    </Badge>

                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
                        {team.mode}
                    </Badge>

                    {linkInfo.is_private && (
                        <Badge variant="outline" className="border-orange-200 text-orange-600 bg-orange-50">
                            Private Access
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
}
