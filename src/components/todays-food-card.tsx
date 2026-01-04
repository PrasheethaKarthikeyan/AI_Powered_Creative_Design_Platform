"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

type EyeFood = {
    food: string;
    why: string;
    nutrients: string[];
    tip: string;
    emoji: string;
};

const dailyFoods: EyeFood[] = [
    {
        food: 'Carrot & Spinach Salad',
        why: 'Improves night vision and reduces eye fatigue',
        nutrients: ['Vitamin A', 'Lutein', 'Zeaxanthin'],
        tip: 'Consume with a few drops of olive oil for better absorption.',
        emoji: '🥕',
    },
    {
        food: 'Grilled Salmon',
        why: 'Helps combat dry eyes and supports retinal health',
        nutrients: ['Omega-3', 'Vitamin D'],
        tip: 'Aim for at least two servings of fatty fish per week.',
        emoji: '🐟',
    },
    {
        food: 'Hard-Boiled Eggs',
        why: 'Protects against age-related macular degeneration',
        nutrients: ['Lutein', 'Zeaxanthin', 'Vitamin E', 'Zinc'],
        tip: 'A simple and portable snack for any time of day.',
        emoji: '🥚',
    },
    {
        food: 'Orange Slices',
        why: 'Reduces the risk of cataracts and macular degeneration',
        nutrients: ['Vitamin C', 'Antioxidants'],
        tip: 'Fresh oranges are better than juice to get the full fiber benefits.',
        emoji: '🍊',
    },
    {
        food: 'Handful of Almonds',
        why: 'Protects eye cells from damage by free radicals',
        nutrients: ['Vitamin E', 'Omega-3'],
        tip: 'A small handful is a perfect serving size for a healthy snack.',
        emoji: '🌰',
    },
    {
        food: 'Steamed Kale',
        why: 'Filters harmful blue light and protects the macula',
        nutrients: ['Lutein', 'Zeaxanthin', 'Vitamin K'],
        tip: 'Lightly steaming kale makes its nutrients easier to absorb.',
        emoji: '🥬',
    },
    {
        food: 'Sweet Potato',
        why: 'Supports good vision and protects against night blindness',
        nutrients: ['Vitamin A', 'Beta-carotene'],
        tip: 'Bake it whole for a simple and nutritious side dish.',
        emoji: '🍠',
    }
];

export function TodaysFoodCard() {
    const [todaysFood, setTodaysFood] = useState<EyeFood | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const dayOfMonth = new Date().getDate(); // Use getDate() for day of month
        const foodIndex = dayOfMonth % dailyFoods.length;
        setTodaysFood(dailyFoods[foodIndex]);
    }, []);

    if (!isClient) {
        return (
             <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="space-y-4">
                     <Skeleton className="h-10 w-1/2" />
                     <Skeleton className="h-8 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (!todaysFood) {
        return null;
    }

    return (
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    {todaysFood.emoji} Today’s Eye-Care Food: {todaysFood.food}
                </CardTitle>
                <CardDescription>{todaysFood.why}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold text-sm mb-2">Key Nutrients:</h4>
                    <div className="flex flex-wrap gap-2">
                        {todaysFood.nutrients.map(nutrient => (
                            <Badge key={nutrient} variant="secondary" className="bg-accent/50 text-accent-foreground">{nutrient}</Badge>
                        ))}
                    </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-amber-500"/>
                    <div>
                        <span className="font-semibold text-foreground">Tip:</span> {todaysFood.tip}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
