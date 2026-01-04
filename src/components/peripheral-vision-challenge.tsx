"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw, CheckCircle, Clock, Eye, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const GAME_DURATION = 30; // in seconds

type Cue = {
  id: number;
  position: { top: string; left: string };
  visible: boolean;
};

export function PeripheralVisionChallenge() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isFinished, setIsFinished] = useState(false);
  const [cues, setCues] = useState<Cue[]>([]);
  const [score, setScore] = useState(0);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const cueTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setIsFinished(true);
      clearInterval(cueTimerRef.current);
      setCues([]);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (isPlaying) {
      spawnCue();
    }
    return () => clearInterval(cueTimerRef.current);
  }, [isPlaying]);

  const spawnCue = () => {
    cueTimerRef.current = setInterval(() => {
      if (gameAreaRef.current) {
        const side = Math.floor(Math.random() * 4);
        let top, left;
        const offset = '5%';
        const position = `${Math.random() * 80 + 10}%`;

        switch (side) {
          case 0: // top
            top = offset;
            left = position;
            break;
          case 1: // right
            top = position;
            left = `calc(100% - ${offset})`;
            break;
          case 2: // bottom
            top = `calc(100% - ${offset})`;
            left = position;
            break;
          default: // left
            top = position;
            left = offset;
            break;
        }

        const newCue: Cue = {
          id: Date.now(),
          position: { top, left },
          visible: true,
        };
        setCues([newCue]);

        // Hide cue after a short duration
        setTimeout(() => {
          setCues(c => c.filter(cue => cue.id !== newCue.id));
        }, 1200);
      }
    }, 2000 + Math.random() * 1500);
  };

  const handleCueClick = (cueId: number) => {
    if(!isPlaying) return;
    setScore(s => s + 1);
    setCues(c => c.filter(cue => cue.id !== cueId));
  };

  const handleStartPause = () => {
    if (isFinished) return;
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsFinished(false);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setCues([]);
    clearInterval(timerRef.current);
    clearInterval(cueTimerRef.current);
  };

  return (
    <div className="flex justify-center items-start gap-8 flex-wrap">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline">👁️ Peripheral Vision Challenge</CardTitle>
          <CardDescription>Train your peripheral awareness and eye coordination.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Keep your eyes focused on the central target.</li>
              <li>A smaller dot will briefly appear at the edge of the screen.</li>
              <li>Click the dot using your peripheral vision, without moving your eyes from the center.</li>
              <li>Remember to blink regularly and keep your eyes relaxed.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Benefits:</h3>
            <ul className="list-none space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Expands peripheral awareness.</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Improves eye-hand coordination.</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Enhances reaction time.</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div className='flex justify-between w-full items-center'>
            <div className="flex items-center gap-2 text-lg font-medium text-primary">
              <Clock className="h-5 w-5" />
              <span>{timeLeft} s</span>
            </div>
            <Badge variant="outline" className='text-lg'>Score: {score}</Badge>
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
          <div ref={gameAreaRef} className="relative w-full h-96 bg-slate-900 rounded-lg overflow-hidden border border-primary/20 flex items-center justify-center">
            {!isPlaying && !isFinished && (
              <div className="text-center text-slate-400 p-4">
                <p>Keep your eyes on the central target <br/> and click the dots that appear at the edges.</p>
              </div>
            )}
            {isFinished && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-200 p-4">
                <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
                <h3 className="text-xl font-bold">Good work!</h3>
                <p className="text-slate-400">You scored {score}. Rest your eyes and play again later.</p>
              </div>
            )}
            
            <Target className="h-8 w-8 text-red-500/70" />
            
            {cues.map(cue => (
                <div
                    key={cue.id}
                    onClick={() => handleCueClick(cue.id)}
                    className={cn(
                        "absolute w-6 h-6 bg-accent rounded-full shadow-[0_0_15px_3px] shadow-accent/50 transition-opacity duration-200 ease-in-out cursor-pointer",
                        { 'opacity-0': !cue.visible || !isPlaying }
                    )}
                    style={{
                        left: cue.position.left,
                        top: cue.position.top,
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
