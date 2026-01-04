"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeSymptoms } from '@/ai/flows/ai-symptom-analysis';
import type { SymptomLog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Glasses, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';

const formSchema = z.object({
  eyeDryness: z.number().min(0).max(10),
  itching: z.number().min(0).max(10),
  roughness: z.number().min(0).max(10),
  headache: z.number().min(0).max(10),
  eyeStrain: z.number().min(0).max(10),
  glassesUser: z.boolean(),
});

type DailyCheckFormValues = z.infer<typeof formSchema>;

type DailyCheckProps = {
  onLogAdded: (log: SymptomLog) => void;
};

const symptomFields: { name: keyof Omit<DailyCheckFormValues, 'glassesUser'>; label: string }[] = [
    { name: 'eyeDryness', label: 'Eye Dryness' },
    { name: 'itching', label: 'Itching' },
    { name: 'roughness', label: 'Roughness' },
    { name: 'headache', label: 'Headache' },
    { name: 'eyeStrain', label: 'Eye Strain' },
];

export function DailyCheck({ onLogAdded }: DailyCheckProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<DailyCheckFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eyeDryness: 0,
      itching: 0,
      roughness: 0,
      headache: 0,
      eyeStrain: 0,
      glassesUser: false,
    },
  });

  async function onSubmit(data: DailyCheckFormValues) {
    setIsLoading(true);
    setAiAdvice(null);
    setError(null);
    try {
      const result = await analyzeSymptoms(data);
      setAiAdvice(result.advice);
      const newLog: SymptomLog = {
        id: new Date().toISOString(),
        date: new Date(),
        symptoms: data,
        advice: result.advice,
      };
      onLogAdded(newLog);
    } catch (e) {
      console.error(e);
      setError('Failed to get AI advice. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Daily Eye Health Check</CardTitle>
        <CardDescription>Log your symptoms on a scale of 0 (none) to 10 (severe) to receive personalized advice.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {symptomFields.map(({ name, label }) => (
                <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel>{label}</FormLabel>
                            <span className="text-sm font-medium text-primary">{field.value}</span>
                        </div>
                        <FormControl>
                        <Slider
                            min={0}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            disabled={isLoading}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                ))}
            </div>

            <Separator />
            
            <FormField
              control={form.control}
              name="glassesUser"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center gap-2">
                      <Glasses className="h-4 w-4" />
                      Do you wear glasses?
                    </FormLabel>
                    <FormDescription>
                      This helps in providing tailored advice for spectacle users.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Symptoms...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Get AI Advice
                </>
              )}
            </Button>
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            {aiAdvice && !isLoading && (
              <Alert className="border-primary/50">
                <Bot className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Personalized Advice</AlertTitle>
                <AlertDescription className="text-foreground">
                  {aiAdvice}
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
