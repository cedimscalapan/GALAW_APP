export type Exercise = { id: string; name: string; muscle: string; equipment: string; instructions: string; custom?: boolean };
export type RoutineExercise = { exerciseId: string; sets: number; reps: number; weight: number; rest: number };
export type Routine = { id: string; name: string; category: string; items: RoutineExercise[]; updatedAt: string };
export type SetLog = { set: number; reps: number; weight: number; done: boolean };
export type Workout = { id: string; routineId: string; routineName: string; startedAt: string; completedAt?: string; notes: string; exercises: { exerciseId: string; sets: SetLog[] }[] };
export type Food = { id: string; name: string; meal: string; calories: number; protein: number; carbs: number; fat: number; date: string };
export type Measurement = { id: string; date: string; weight: number; waist?: number; note?: string };
type State = { routines: Routine[]; exercises: Exercise[]; workouts: Workout[]; foods: Food[]; measurements: Measurement[]; pending: boolean; syncedAt?: string };

const key = 'tams.v1';
const now = () => new Date().toISOString();
const starterExercises: Exercise[] = [
  { id: 'bench', name: 'Barbell Bench Press', muscle: 'Chest', equipment: 'Barbell', instructions: 'Set your feet, retract your shoulders, lower the bar with control, and press up without bouncing.' },
  { id: 'incline', name: 'Incline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell', instructions: 'Keep your shoulder blades set and lower dumbbells to either side of your upper chest.' },
  { id: 'row', name: 'Seated Cable Row', muscle: 'Back', equipment: 'Cable', instructions: 'Sit tall, brace your torso, pull toward your waist, then extend your arms slowly.' },
  { id: 'pulldown', name: 'Lat Pulldown', muscle: 'Back', equipment: 'Cable', instructions: 'Brace your torso and draw the bar toward your upper chest without leaning far back.' },
  { id: 'squat', name: 'Barbell Back Squat', muscle: 'Quads', equipment: 'Barbell', instructions: 'Brace, sit between your hips, keep your feet planted, then stand through the whole foot.' },
  { id: 'rdl', name: 'Romanian Deadlift', muscle: 'Hamstrings', equipment: 'Barbell', instructions: 'Push hips back with a soft knee bend and keep the bar close to your legs.' },
  { id: 'ohp', name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Barbell', instructions: 'Brace your midsection, press overhead, and finish with the bar stacked over your shoulders.' },
  { id: 'curl', name: 'Dumbbell Curl', muscle: 'Biceps', equipment: 'Dumbbell', instructions: 'Keep elbows near your sides and curl without swinging your torso.' },
  { id: 'plank', name: 'Plank', muscle: 'Core', equipment: 'Bodyweight', instructions: 'Keep a straight line from shoulders to heels and breathe steadily.' },
];
const starterRoutines: Routine[] = [
  { id: 'upper-a', name: 'Upper Body A', category: 'Upper Body', updatedAt: now(), items: [{ exerciseId: 'bench', sets: 4, reps: 8, weight: 50, rest: 90 }, { exerciseId: 'row', sets: 4, reps: 10, weight: 35, rest: 75 }, { exerciseId: 'ohp', sets: 3, reps: 8, weight: 25, rest: 75 }, { exerciseId: 'curl', sets: 3, reps: 12, weight: 10, rest: 60 }] },
  { id: 'lower-a', name: 'Lower Body A', category: 'Lower Body', updatedAt: now(), items: [{ exerciseId: 'squat', sets: 4, reps: 8, weight: 50, rest: 120 }, { exerciseId: 'rdl', sets: 3, reps: 10, weight: 40, rest: 90 }, { exerciseId: 'plank', sets: 3, reps: 40, weight: 0, rest: 45 }] },
  { id: 'full-a', name: 'Full Body', category: 'Full Body', updatedAt: now(), items: [{ exerciseId: 'squat', sets: 3, reps: 8, weight: 45, rest: 90 }, { exerciseId: 'bench', sets: 3, reps: 8, weight: 40, rest: 90 }, { exerciseId: 'row', sets: 3, reps: 10, weight: 30, rest: 75 }] },
];
function seed(): State { return { routines: starterRoutines, exercises: starterExercises, workouts: [], foods: [], measurements: [], pending: false }; }
function load(): State { try { const raw = localStorage.getItem(key); return raw ? { ...seed(), ...JSON.parse(raw) } : seed(); } catch { return seed(); } }
let state = load();
const listeners = new Set<() => void>();
function publish() { localStorage.setItem(key, JSON.stringify(state)); listeners.forEach((f) => f()); window.dispatchEvent(new CustomEvent('tams-state')); }
export function subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }
export function snapshot() { return state; }
export function ensureClientId(){let id=localStorage.getItem('tams.clientId');if(!id){id=crypto.randomUUID();localStorage.setItem('tams.clientId',id)}return id}
export function createRoutine(name: string, category = 'Upper Body') { const routine = { id: crypto.randomUUID(), name: name.trim(), category, updatedAt: now(), items: [] as RoutineExercise[] }; state.routines = [routine, ...state.routines]; state.pending = true; publish(); return routine; }
export function removeRoutine(id: string) { state.routines = state.routines.filter((x) => x.id !== id); state.pending = true; publish(); }
export function updateRoutine(routineId:string, name:string, category:string){const routine=state.routines.find(r=>r.id===routineId);if(routine){routine.name=name.trim()||routine.name;routine.category=category;routine.updatedAt=now();state.pending=true;publish()}}
export function duplicateRoutine(routineId:string){const original=state.routines.find(r=>r.id===routineId);if(!original)return;const copy={...original,id:crypto.randomUUID(),name:`${original.name} copy`,items:original.items.map(i=>({...i})),updatedAt:now()};state.routines.unshift(copy);state.pending=true;publish();return copy}
export function addRoutineExercise(routineId: string, exerciseId: string) { const routine = state.routines.find((r) => r.id === routineId); if (!routine || routine.items.some((i) => i.exerciseId === exerciseId)) return; routine.items.push({ exerciseId, sets: 3, reps: 10, weight: 0, rest: 90 }); routine.updatedAt = now(); state.pending = true; publish(); }
export function updateRoutineItem(routineId: string, exerciseId: string, field: 'sets'|'reps'|'weight'|'rest', value: number) { const item = state.routines.find((r) => r.id === routineId)?.items.find((x) => x.exerciseId === exerciseId); if (item) { item[field] = Math.max(0, value); state.pending = true; publish(); } }
export function createExercise(name: string, muscle: string, equipment: string, instructions: string) { const exercise = { id: crypto.randomUUID(), name: name.trim(), muscle, equipment, instructions, custom: true }; state.exercises.push(exercise); state.pending = true; publish(); }
export function removeExercise(id: string) { if (!state.exercises.find((e) => e.id === id)?.custom) return; state.exercises = state.exercises.filter((e) => e.id !== id); state.pending = true; publish(); }
export function startWorkout(routineId: string) { const routine = state.routines.find((r) => r.id === routineId); if (!routine) return undefined; const workout: Workout = { id: crypto.randomUUID(), routineId, routineName: routine.name, startedAt: now(), notes: '', exercises: routine.items.map((i) => ({ exerciseId: i.exerciseId, sets: Array.from({ length: i.sets }, (_, n) => ({ set: n + 1, reps: i.reps, weight: i.weight, done: false })) })) }; state.workouts = [workout, ...state.workouts]; publish(); return workout.id; }
export function updateSet(workoutId: string, exerciseId: string, setNo: number, field: 'reps'|'weight'|'done', value: number|boolean) { const set = state.workouts.find((w) => w.id === workoutId)?.exercises.find((e) => e.exerciseId === exerciseId)?.sets.find((s) => s.set === setNo); if (set) { (set as any)[field] = value; state.pending = true; publish(); } }
export function addWorkoutSet(workoutId: string, exerciseId: string) { const sets = state.workouts.find((w) => w.id === workoutId)?.exercises.find((e) => e.exerciseId === exerciseId)?.sets; if (sets) { const last = sets[sets.length - 1]; sets.push({ set: sets.length + 1, reps: last?.reps ?? 8, weight: last?.weight ?? 0, done: false }); state.pending = true; publish(); } }
export function finishWorkout(id: string, notes = '') { const w = state.workouts.find((x) => x.id === id); if (w) { w.completedAt = now(); w.notes = notes; state.pending = true; publish(); } }
export function discardWorkout(id:string){state.workouts=state.workouts.filter(w=>w.id!==id);state.pending=true;publish()}
export function logFood(food: Omit<Food, 'id'|'date'>) { state.foods.unshift({ ...food, id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10) }); state.pending = true; publish(); }
export function deleteFood(id: string) { state.foods = state.foods.filter((f) => f.id !== id); state.pending = true; publish(); }
export function addMeasurement(weight: number, waist?: number, note?: string) { state.measurements.unshift({ id: crypto.randomUUID(), date: now(), weight, waist, note }); state.pending = true; publish(); }
export function totalsFor(date = new Date().toISOString().slice(0, 10)) { return state.foods.filter((f) => f.date === date).reduce((a, f) => ({ calories: a.calories + f.calories, protein: a.protein + f.protein, carbs: a.carbs + f.carbs, fat: a.fat + f.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 }); }
export function workoutVolume(w: Workout) { return w.exercises.reduce((total, e) => total + e.sets.filter((s) => s.done).reduce((sum, s) => sum + s.weight * s.reps, 0), 0); }
export async function syncPending() { const base = import.meta.env.VITE_API_URL as string | undefined; if (!base || !navigator.onLine || !state.pending) return { ok: false, reason: !navigator.onLine ? 'offline' : 'not-configured' }; try { const clientId=ensureClientId(); const r = await fetch(`${base.replace(/\/$/, '')}/sync`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId, state }) }); if (!r.ok) throw new Error(`Sync failed (${r.status})`); state.pending = false; state.syncedAt = now(); localStorage.setItem(key, JSON.stringify(state)); notify(); return { ok: true, reason: 'synced' }; } catch { return { ok: false, reason: 'failed' }; } }
export function exportBackup() { const blob = new Blob([JSON.stringify({ schemaVersion: 1, exportedAt: now(), state }, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `tams-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(a.href); }
export async function restoreBackup(file: File) { const parsed = JSON.parse(await file.text()); if (parsed.schemaVersion !== 1 || !parsed.state?.routines || !parsed.state?.workouts) throw new Error('This is not a valid TAMS backup.'); state = { ...seed(), ...parsed.state, pending: true }; publish(); }
function notify(){for(const fn of listeners)fn()}

export function installAutoSync(){
  const run = () => { void syncPending(); };
  window.addEventListener('online', run);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) run(); });
  if (navigator.onLine) window.setTimeout(run, 1500);
  return () => window.removeEventListener('online', run);
}