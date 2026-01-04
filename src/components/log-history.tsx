"use client";

import type { SymptomLog } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';

type LogHistoryProps = {
  logs: SymptomLog[];
};

export function LogHistory({ logs }: LogHistoryProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center h-96">
        <h3 className="text-lg font-semibold text-muted-foreground">No Logs Yet</h3>
        <p className="text-sm text-muted-foreground">
          Start by submitting your daily check-up to see your history here.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Log History</CardTitle>
        <CardDescription>A record of your daily symptom logs and the AI advice you received.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Date</TableHead>
                <TableHead>Dryness</TableHead>
                <TableHead>Itching</TableHead>
                <TableHead>Roughness</TableHead>
                <TableHead>Headache</TableHead>
                <TableHead>Strain</TableHead>
                <TableHead>Glasses</TableHead>
                <TableHead className="min-w-[300px]">AI Advice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {format(log.date, 'PP')}
                  </TableCell>
                  <TableCell>{log.symptoms.eyeDryness}</TableCell>
                  <TableCell>{log.symptoms.itching}</TableCell>
                  <TableCell>{log.symptoms.roughness}</TableCell>
                  <TableCell>{log.symptoms.headache}</TableCell>
                  <TableCell>{log.symptoms.eyeStrain}</TableCell>
                  <TableCell>{log.symptoms.glassesUser ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{log.advice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
