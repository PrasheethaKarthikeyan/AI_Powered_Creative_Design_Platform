"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from "date-fns";
import { 
  scheduleCheckup,
  type AICheckupSchedulerInput,
  type AICheckupSchedulerOutput,
} from '@/ai/flows/ai-checkup-scheduler';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Calendar as CalendarIcon, CheckCircle, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';

const VisionStatusSchema = z.enum([
  'normal',
  'refractive-error',
  'dry-eye',
  'eye-strain',
  'other',
]);

const SymptomsSchema = z.object({
  headache: z.boolean(),
  dryness: z.boolean(),
  blurredVision: z.boolean(),
  screenFatigue: z.boolean(),
});

const AICheckupSchedulerInputSchema = z.object({
  lastCheckupDate: z.string().describe('Date of the last eye checkup in YYYY-MM-DD format.'),
  visionStatus: VisionStatusSchema.describe('The user\'s current vision status.'),
  prescriptionChanged: z.boolean().describe('Whether the prescription changed at the last checkup.'),
  symptoms: SymptomsSchema.describe('Symptoms the user is experiencing.'),
  ageGroup: z.string().describe('The age group of the user (e.g., 20-30).'),
  screenTime: z.number().describe('Average daily screen time in hours.'),
});

const FormSchema = AICheckupSchedulerInputSchema.extend({
    screenTime: z.coerce.number().min(0).max(24),
});

type CheckupFormValues = z.infer<typeof FormSchema>;

const symptoms: { id: keyof z.infer<typeof SymptomsSchema>; label: string }[] = [
  { id: 'headache', label: 'Headaches' },
  { id: 'dryness', label: 'Dry Eyes' },
  { id: 'blurredVision', label: 'Blurred Vision' },
  { id: 'screenFatigue', label: 'Screen Fatigue' },
];

export function CheckupScheduler() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AICheckupSchedulerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CheckupFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lastCheckupDate: new Date().toISOString().split('T')[0],
      visionStatus: 'normal',
      prescriptionChanged: false,
      symptoms: {
        headache: false,
        dryness: false,
        blurredVision: false,
        screenFatigue: false,
      },
      ageGroup: '20-30',
      screenTime: 8,
    },
  });

  async function onSubmit(data: CheckupFormValues) {
    setIsLoading(true);
    setAiResponse(null);
    setError(null);
    try {
      const result = await scheduleCheckup(data);
      setAiResponse(result);
    } catch (e) {
      console.error(e);
      setError('Failed to get AI recommendation. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Checkup Scheduler</CardTitle>
        <CardDescription>Get a personalized eye checkup recommendation based on your details.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="lastCheckupDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Last Checkup</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visionStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vision Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your vision status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {VisionStatusSchema.options.map(status => (
                            <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ageGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Group</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your age group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="under-18">Under 18</SelectItem>
                        <SelectItem value="18-39">18-39</SelectItem>
                        <SelectItem value="40-60">40-60</SelectItem>
                        <SelectItem value="61+">61+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="screenTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Daily Screen Time (hours)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="prescriptionChanged"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Prescription Change</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormItem>
                <FormLabel>Reported Symptoms (if any)</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {symptoms.map((item) => (
                    <FormField
                    key={item.id}
                    control={form.control}
                    name={`symptoms.${item.id}`}
                    render={({ field }) => (
                        <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                        >
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <FormLabel className="font-normal">
                            {item.label}
                        </FormLabel>
                        </FormItem>
                    )}
                    />
                ))}
                </div>
            </FormItem>

          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Recommendation...</>
              ) : (
                <><Bot className="mr-2 h-4 w-4" /> Get AI Recommendation</>
              )}
            </Button>
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            {aiResponse && !isLoading && (
              <Alert className="border-primary/50">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Your Personalized Recommendation</AlertTitle>
                <AlertDescription className="text-foreground mt-2 space-y-3">
                    <p><strong>Next Recommended Checkup:</strong> {aiResponse.nextCheckupDate}</p>
                    <p><strong>Frequency:</strong> {aiResponse.frequency}</p>
                    <p><strong>Why:</strong> {aiResponse.reason}</p>
                    <div>
                        <p className="font-semibold">Until then:</p>
                        <ul className="list-none space-y-1 mt-1">
                            {aiResponse.selfCareReminders.map((reminder, index) => (
                                <li key={index} className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> {reminder}</li>
                            ))}
                        </ul>
                    </div>
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
