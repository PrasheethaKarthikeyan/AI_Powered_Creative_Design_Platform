"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const GAME_DURATION = 45; // in seconds

export function FollowTheFirefly() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [isFinished, setIsFinished] = useState(false);
    const [fireflyPosition, setFireflyPosition] = useState({ x: 50, y: 50 });

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout>();
    const animationRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsPlaying(false);
            setIsFinished(true);
        }

        return () => {
            clearInterval(timerRef.current);
        };
    }, [isPlaying, timeLeft]);

    useEffect(() => {
        if (isPlaying) {
            moveFirefly();
        }
        return () => clearInterval(animationRef.current);
    }, [isPlaying]);

    const moveFirefly = () => {
        animationRef.current = setInterval(() => {
            if (gameAreaRef.current) {
                const rect = gameAreaRef.current.getBoundingClientRect();
                const x = Math.random() * (rect.width - 20) + 10;
                const y = Math.random() * (rect.height - 20) + 10;
                setFireflyPosition({ x, y });
            }
        }, 2000 + Math.random() * 1500); // Move every 2-3.5 seconds
    };

    const handleStartPause = () => {
        if (isFinished) return;
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setIsFinished(false);
        setTimeLeft(GAME_DURATION);
        setFireflyPosition({ x: 50, y: 50 });
        clearInterval(timerRef.current);
        clearInterval(animationRef.current);
    };

    return (
        <div className="flex justify-center items-start gap-8 flex-wrap">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold font-headline">🎯 Follow the Firefly</CardTitle>
                    <CardDescription>A gentle exercise to improve eye tracking and reduce screen fatigue.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">How to Play:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Keep your head still and relax your shoulders.</li>
                            <li>A glowing dot will move around the screen.</li>
                            <li>Follow it using only your eyes.</li>
                            <li>The dot will pause briefly—that's a good time to blink.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Benefits:</h3>
                        <ul className="list-none space-y-1 text-sm text-muted-foreground">
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Improves smooth pursuit eye tracking.</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Strengthens eye muscles.</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Helps reduce digital eye strain.</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                     <div className="flex items-center gap-2 text-lg font-medium text-primary">
                        <Clock className="h-5 w-5" />
                        <span>{timeLeft} seconds left</span>
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
                    <CardTitle>Game Area</CardTitle>
                </CardHeader>
                <CardContent>
                    <div ref={gameAreaRef} className="relative w-full h-80 bg-slate-900 rounded-lg overflow-hidden border border-primary/20">
                        {!isPlaying && !isFinished && (
                            <div className="absolute inset-0 flex items-center justify-center text-center text-slate-400 p-4">
                                <p>Press Start to begin the exercise.</p>
                            </div>
                        )}
                        {isFinished && (
                             <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-200 p-4">
                                <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
                                <h3 className="text-xl font-bold">Great Job!</h3>
                                <p className="text-slate-400">You've completed the exercise. Feel free to do it again later.</p>
                            </div>
                        )}
                        <div
                            className={cn(
                                "absolute w-5 h-5 bg-yellow-300 rounded-full shadow-[0_0_20px_5px] shadow-yellow-400/50 transition-all duration-1000 ease-in-out",
                                { 'opacity-0': !isPlaying }
                            )}
                            style={{
                                left: `${fireflyPosition.x}px`,
                                top: `${fireflyPosition.y}px`,
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
