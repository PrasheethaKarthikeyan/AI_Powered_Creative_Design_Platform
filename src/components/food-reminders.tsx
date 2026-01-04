import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Fish, Carrot, Sun } from 'lucide-react';

const foods = [
  {
    title: 'Vitamin A Rich Foods',
    description: 'Carrots, sweet potatoes, and leafy green vegetables are excellent sources of Vitamin A, which is crucial for good vision.',
    icon: <Carrot className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Omega-3 Fatty Acids',
    description: 'Found in fatty fish like salmon, tuna, and mackerel. Omega-3s can help with dry eyes and promote overall eye health.',
    icon: <Fish className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Lutein & Zeaxanthin',
    description: 'These antioxidants are found in leafy greens like spinach and kale, as well as eggs. They help protect the eyes from harmful high-energy light waves.',
    icon: <Leaf className="h-6 w-6 text-primary" />,
  },
    {
    title: 'Vitamins C & E',
    description: 'Citrus fruits, berries, almonds, and sunflower seeds are packed with these vitamins. They are antioxidants that help protect your eyes from damage.',
    icon: <Sun className="h-6 w-6 text-primary" />,
  },
];

export function FoodReminders() {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold font-headline">Nourish Your Eyes</h2>
        <p className="text-muted-foreground">
          Incorporate these eye-healthy foods into your diet for better vision wellness.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {foods.map((food, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="rounded-lg bg-primary/10 p-3">{food.icon}</div>
                <CardTitle className="text-lg font-semibold">{food.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{food.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
