import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PasswordModalProps {
    isOpen: boolean;
    teamName: string;
    onVerify: (password: string) => void;
    isLoading: boolean;
    error: string | null;
}

export function PasswordModal({ isOpen, teamName, onVerify, isLoading, error }: PasswordModalProps) {
    const [password, setPassword] = useState('');
    const [shake, setShake] = useState(false);

    useEffect(() => {
        if (error) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    }, [error]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password) onVerify(password);
    };

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-md [&>button]:hidden"> {/* Hide close button */}
                <motion.div
                    animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <DialogHeader>
                        <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-4">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <DialogTitle className="text-center text-xl">Password Required</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            <span className="font-semibold block text-foreground mb-1">{teamName}</span>
                            This team requires a password to access.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                                className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {error && (
                                <div className="flex items-center text-sm text-red-500 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {error}
                                </div>
                            )}
                        </div>

                        <DialogFooter className="sm:justify-center">
                            <Button type="submit" className="w-full sm:w-full" disabled={!password || isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
                                    </>
                                ) : (
                                    "Verify Access"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
