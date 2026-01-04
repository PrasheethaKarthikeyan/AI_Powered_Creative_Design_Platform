"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw, CheckCircle, Clock, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

const GAME_DURATION = 60; // in seconds

type Glimmer = {
    id: number;
    position: { top: string; left: string };
    size: number;
    duration: number;
};

export function GlimmeringVistas() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [isFinished, setIsFinished] = useState(false);
    const [glimmers, setGlimmers] = useState<Glimmer[]>([]);

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout>();
    const glimmerTimerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsPlaying(false);
            setIsFinished(true);
            clearInterval(glimmerTimerRef.current);
            setGlimmers([]);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, timeLeft]);
    
    useEffect(() => {
        if (isPlaying) {
            spawnGlimmer();
        } else {
            clearInterval(glimmerTimerRef.current);
            setGlimmers([]);
        }
        return () => clearInterval(glimmerTimerRef.current);
    }, [isPlaying]);

    const spawnGlimmer = () => {
        glimmerTimerRef.current = setInterval(() => {
            if (gameAreaRef.current) {
                const newGlimmer: Glimmer = {
                    id: Date.now(),
                    position: {
                        top: `${Math.random() * 90 + 5}%`,
                        left: `${Math.random() * 90 + 5}%`,
                    },
                    size: Math.random() * 15 + 10, // 10px to 25px
                    duration: Math.random() * 3 + 4, // 4s to 7s
                };
                setGlimmers(g => [...g, newGlimmer]);

                setTimeout(() => {
                    setGlimmers(g => g.filter(glimmer => glimmer.id !== newGlimmer.id));
                }, newGlimmer.duration * 1000);
            }
        }, 2000 + Math.random() * 2000); // New glimmer every 2-4 seconds
    };

    const handleStartPause = () => {
        if (isFinished) return;
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setIsFinished(false);
        setTimeLeft(GAME_DURATION);
        setGlimmers([]);
        clearInterval(timerRef.current);
        clearInterval(glimmerTimerRef.current);
    };

    return (
        <div className="flex justify-center items-start gap-8 flex-wrap">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold font-headline">🌬️ Glimmering Vistas</CardTitle>
                    <CardDescription>A calming exercise to relax your eyes and encourage wide-angle vision.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">How to Play:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Find a comfortable position and relax your gaze.</li>
                            <li>Soft, glowing glimmers will slowly appear and fade on the screen.</li>
                            <li>Allow your eyes to gently notice them without focusing directly.</li>
                            <li>Breathe deeply and let your visual field expand. No clicking needed.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Benefits:</h3>
                        <ul className="list-none space-y-1 text-sm text-muted-foreground">
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Promotes eye relaxation.</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Encourages wide-angle, "soft" focus.</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Helps reduce mental strain from focused tasks.</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <div className="flex items-center gap-2 text-lg font-medium text-primary">
                        <Clock className="h-5 w-5" />
                        <span>{timeLeft} s remaining</span>
                    </div>
                    <div className="flex w-full gap-2">
                        <Button onClick={handleStartPause} className="w-full" size="lg" disabled={isFinished}>
                            {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                            {isPlaying ? 'Pause' : isFinished ? 'Finished' : 'Start'}
                        </Button>
                        <Button onClick={handleReset} variant="outline" size="lg">
                            <RefreshCw />
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Relaxation Area</CardTitle>
                </CardHeader>
                <CardContent>
                    <div ref={gameAreaRef} className="relative w-full h-96 bg-slate-900 rounded-lg overflow-hidden border border-primary/20 flex items-center justify-center">
                        {!isPlaying && !isFinished && (
                            <div className="text-center text-slate-400 p-4">
                                <p>Press Start to begin the relaxation exercise.</p>
                            </div>
                        )}
                        {isFinished && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-200 p-4">
                                <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
                                <h3 className="text-xl font-bold">Session Complete</h3>
                                <p className="text-slate-400">Your eyes feel more relaxed. Feel free to practice again anytime.</p>
                            </div>
                        )}
                        {glimmers.map(glimmer => (
                            <div
                                key={glimmer.id}
                                className="absolute rounded-full animate-glimmer"
                                style={{
                                    top: glimmer.position.top,
                                    left: glimmer.position.left,
                                    width: `${glimmer.size}px`,
                                    height: `${glimmer.size}px`,
                                    backgroundColor: 'hsl(var(--accent) / 0.5)',
                                    boxShadow: `0 0 ${glimmer.size * 1.5}px hsl(var(--accent) / 0.7)`,
                                    animationDuration: `${glimmer.duration}s`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
