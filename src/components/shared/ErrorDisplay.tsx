import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface ErrorDisplayProps {
    title?: string;
    message?: string;
    code?: number;
    retry?: () => void;
}

export function ErrorDisplay({
    title = "Something went wrong",
    message = "An unexpected error occurred. Please try again later.",
    code,
    retry
}: ErrorDisplayProps) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <Card className="w-full max-w-md border-destructive/20 shadow-lg">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-4">
                        <XCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <CardTitle className="text-xl text-red-700">{title}</CardTitle>
                    {code && <p className="text-sm text-gray-400 font-mono mt-1">Error Code: {code}</p>}
                </CardHeader>
                <CardContent className="text-center text-gray-600">
                    <p>{message}</p>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                    {retry && (
                        <Button onClick={retry}>
                            Try Again
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
