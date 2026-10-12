export type WorkoutRoutine = {
  id: string;
  name: string;
  focus: string;
  duration: string;
  category: 'Upper Body' | 'Lower Body' | 'Full Body';
  exerciseCount: number;
  imageClass: string;
  exercises: string[];
};

export type Exercise = {
  id: string;
  name: string;
  muscle: string;
  category: string;
  equipment: string[];
  mistakes: string[];
  steps: string[];
  cue: string;
};

export const routines: WorkoutRoutine[] = [
  {
    id: 'push-day',
    name: 'Push Day',
    focus: 'Chest, shoulders, triceps',
    duration: '~45 min',
    category: 'Upper Body',
    exerciseCount: 6,
    imageClass: 'bench-photo',
    exercises: ['Bench Press', 'Shoulder Press', 'Cable Fly', 'Triceps Pushdown'],
  },
  {
    id: 'pull-day',
    name: 'Pull Day',
    focus: 'Back and biceps',
    duration: '~45 min',
    category: 'Upper Body',
    exerciseCount: 6,
    imageClass: 'pull-photo',
    exercises: ['Lat Pulldown', 'Seated Row', 'Face Pull', 'Dumbbell Curl'],
  },
  {
    id: 'leg-day',
    name: 'Leg Day',
    focus: 'Quads, hamstrings, glutes',
    duration: '~50 min',
    category: 'Lower Body',
    exerciseCount: 7,
    imageClass: 'leg-photo',
    exercises: ['Squat', 'Romanian Deadlift', 'Leg Press', 'Calf Raise'],
  },
  {
    id: 'full-body',
    name: 'Full Body',
    focus: 'Chest, back, legs, shoulders, arms, core',
    duration: '~60 min',
    category: 'Full Body',
    exerciseCount: 8,
    imageClass: 'full-photo',
    exercises: ['Deadlift', 'Dumbbell Press', 'Goblet Squat', 'Farmer Carry'],
  },
];

export const exercises: Exercise[] = [
  {
    id: 'bench',
    name: 'Bench Press',
    muscle: 'Chest',
    category: 'Strength',
    equipment: ['Barbell', 'Flat Bench'],
    cue: 'Control the movement.',
    mistakes: ['Flaring elbows too wide', 'Bouncing the bar off the chest', 'Arching the lower back excessively', 'Using too much weight'],
    steps: [
      'Lie on a flat bench with your eyes under the bar.',
      'Grip the bar slightly wider than shoulder width.',
      'Unrack the bar and lower it slowly to your mid-chest.',
      'Keep your elbows at about 45 degrees and your core tight.',
      'Press the bar up in a controlled motion until your arms are almost fully extended.',
    ],
  },
  {
    id: 'squat',
    name: 'Squat',
    muscle: 'Legs',
    category: 'Strength',
    equipment: ['Barbell', 'Rack'],
    cue: 'Brace first, then drive.',
    mistakes: ['Knees collapsing inward', 'Rushing the descent', 'Lifting heels from the floor'],
    steps: ['Set the bar securely on your upper back.', 'Brace your core.', 'Sit down under control.', 'Drive through your mid-foot to stand.'],
  },
  {
    id: 'row',
    name: 'Seated Row',
    muscle: 'Back',
    category: 'Strength',
    equipment: ['Cable Machine'],
    cue: 'Pull with your elbows.',
    mistakes: ['Shrugging shoulders', 'Leaning too far back', 'Rushing each rep'],
    steps: ['Sit tall at the cable station.', 'Reach forward with control.', 'Pull elbows back.', 'Pause, then return slowly.'],
  },
  {
    id: 'press',
    name: 'Overhead Press',
    muscle: 'Shoulders',
    category: 'Strength',
    equipment: ['Barbell'],
    cue: 'Stack wrists, elbows, and shoulders.',
    mistakes: ['Overarching the back', 'Pressing forward', 'Skipping warm-up sets'],
    steps: ['Start with the bar at shoulder height.', 'Brace your core.', 'Press straight overhead.', 'Lower with control.'],
  },
];

export const weeklyProgress = {
  completed: 2,
  target: 4,
  streak: 3,
  recent: 'Pull Day completed yesterday',
};
