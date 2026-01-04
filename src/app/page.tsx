"use client";

import { useState } from 'react';
import type { SymptomLog } from '@/lib/types';

import { AppHeader } from '@/components/app-header';
import { DailyCheck } from '@/components/daily-check';
import { EyeExercises } from '@/components/eye-exercises';
import { FoodReminders } from '@/components/food-reminders';
import { LogHistory } from '@/components/log-history';
import { FollowTheFirefly } from '@/components/follow-the-firefly';

import { CalendarCheck, Apple, Dumbbell, History, Gamepad2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [logs, setLogs] = useState<SymptomLog[]>([]);

  const handleLogAdded = (newLog: SymptomLog) => {
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Tabs defaultValue="daily-check" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto md:h-10">
            <TabsTrigger value="daily-check">
              <CalendarCheck className="mr-2 h-4 w-4" /> Daily Check
            </TabsTrigger>
            <TabsTrigger value="exercises">
              <Dumbbell className="mr-2 h-4 w-4" /> Exercises
            </TabsTrigger>
            <TabsTrigger value="food-care">
              <Apple className="mr-2 h-4 w-4" /> Food Care
            </TabsTrigger>
             <TabsTrigger value="game">
              <Gamepad2 className="mr-2 h-4 w-4" /> Game
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" /> Log History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily-check" className="mt-6">
            <DailyCheck onLogAdded={handleLogAdded} />
          </TabsContent>
          
          <TabsContent value="exercises" className="mt-6">
            <EyeExercises />
          </TabsContent>

          <TabsContent value="food-care" className="mt-6">
            <FoodReminders />
          </TabsContent>

          <TabsContent value="game" className="mt-6">
            <FollowTheFirefly />
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <LogHistory logs={logs} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
