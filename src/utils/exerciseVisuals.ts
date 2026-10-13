const exerciseGifs: Record<string, string> = {
  bench: '/assets/exercises/bench.gif',
  incline: '/assets/exercises/incline.gif',
  row: '/assets/exercises/row.gif',
  pulldown: '/assets/exercises/pulldown.gif',
  squat: '/assets/exercises/squat.gif',
  rdl: '/assets/exercises/rdl.gif',
  ohp: '/assets/exercises/ohp.gif',
  curl: '/assets/exercises/curl.gif',
  plank: '/assets/exercises/plank.gif',
};

export function getExerciseGif(exerciseId?: string) {
  return exerciseId ? exerciseGifs[exerciseId] : undefined;
}
