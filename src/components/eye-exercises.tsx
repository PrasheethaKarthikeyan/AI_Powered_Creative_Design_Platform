import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const exercises = [
  {
    title: 'The 20-20-20 Rule',
    description:
      'Every 20 minutes, take a 20-second break and focus on something 20 feet away. This helps reduce digital eye strain.',
  },
  {
    title: 'Eye Rotation',
    description:
      'Sit or stand with your head still. Look up, then slowly circle your eyes clockwise 10 times. Reverse the direction and circle counter-clockwise 10 times. This helps improve flexibility of eye muscles.',
  },
  {
    title: 'Palming',
    description:
      'Rub your hands together to warm them up. Close your eyes and gently place your palms over them, without applying pressure. Breathe deeply and relax for a few minutes. This soothes tired eyes.',
  },
  {
    title: 'Focus Shifting',
    description:
      'Hold a finger a few inches from your eye. Focus on your finger, then slowly move it away. Focus on a distant object, then back to your finger. Repeat this 3-5 times. This exercise trains your focusing muscles.',
  },
];

export function EyeExercises() {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold font-headline">Guided Eye Exercises</h2>
        <p className="text-muted-foreground">
          Perform these simple exercises to relax your eyes and reduce strain.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {exercises.map((exercise, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-lg hover:no-underline">{exercise.title}</AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              {exercise.description}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
