import { useEffect, useMemo, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import {
  addOutline,
  barbellOutline,
  checkmarkOutline,
  closeOutline,
  copyOutline,
  playOutline,
  removeOutline,
  timeOutline,
  trashOutline,
} from 'ionicons/icons';
import AppTopBar from '../components/AppTopBar';
import {
  addRoutineExercise,
  addWorkoutSet,
  completedSetCount,
  createRoutine,
  discardWorkout,
  duplicateRoutine,
  finishWorkout,
  removeRoutine,
  removeRoutineExercise,
  removeWorkoutSet,
  snapshot,
  startWorkout,
  subscribe,
  totalSetCount,
  updateRoutine,
  updateRoutineItem,
  updateSet,
  workoutDurationMinutes,
  workoutVolume,
  type Routine,
  type Workout as WorkoutType,
} from '../services/tamsStore';
import { getExerciseGif } from '../utils/exerciseVisuals';

const categories = ['All', 'Upper Body', 'Lower Body', 'Full Body'];
const categoryChoices = ['Upper Body', 'Lower Body', 'Full Body'];

export default function Workout() {
  const [state, setState] = useState(snapshot());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [editing, setEditing] = useState<string | false>(false);
  const [draftName, setDraftName] = useState('');
  const [draftCategory, setDraftCategory] = useState('Upper Body');
  const [lastSummary, setLastSummary] = useState<WorkoutType | null>(null);

  useEffect(() => subscribe(() => setState({ ...snapshot() })), []);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (seconds === 0) setRunning(false);
  }, [seconds]);

  const active = state.workouts.find((w) => w.id === activeId && !w.completedAt);
  const completed = state.workouts.filter((w) => w.completedAt);
  const routines = useMemo(
    () => state.routines.filter((r) => filter === 'All' || r.category === filter),
    [state.routines, filter],
  );

  function createFromDraft() {
    const name = draftName.trim();
    if (!name) {
      alert('Enter a routine name first.');
      return;
    }
    const routine = createRoutine(name, draftCategory);
    setDraftName('');
    setDraftCategory('Upper Body');
    setFilter('All');
    setEditing(routine.id);
  }

  function start(id: string) {
    const routine = state.routines.find((r) => r.id === id);
    if (!routine?.items.length) {
      alert('Add at least one exercise before starting this routine.');
      setEditing(id);
      return;
    }
    const workoutId = startWorkout(id);
    if (workoutId) setActiveId(workoutId);
  }

  function finish(workout: WorkoutType) {
    const done = completedSetCount(workout);
    if (done === 0 && !confirm('No sets are marked done yet. Finish this workout anyway?')) return;
    finishWorkout(workout.id, prompt('Session note (optional)', '') ?? '');
    setLastSummary({ ...snapshot().workouts.find((w) => w.id === workout.id)! });
    setActiveId(null);
    setRunning(false);
    setSeconds(0);
  }

  function discard(id: string) {
    if (!confirm('Discard this active workout?')) return;
    discardWorkout(id);
    setActiveId(null);
    setRunning(false);
    setSeconds(0);
  }

  return (
    <IonPage>
      <IonContent fullscreen className="tams-screen">
        <main className="phone-shell">
          <AppTopBar />
          {active ? (
            <>
              <section className="active-hero">
                <div>
                  <p className="section-label">ACTIVE WORKOUT</p>
                  <h1>{active.routineName}</h1>
                  <p>
                    {completedSetCount(active)} / {totalSetCount(active)} sets done | {Math.round(workoutVolume(active)).toLocaleString()} kg
                  </p>
                </div>
                <img src="/assets/APPMASCOT.png" alt="TAMS mascot" />
              </section>

              <section className="rest-card">
                <div className="rest-ring">
                  {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
                </div>
                <div>
                  <p className="section-label">REST TIMER</p>
                  <strong>{running ? 'Timer running' : 'Recover between sets'}</strong>
                  <div className="timer-actions">
                    <button onClick={() => { setSeconds(90); setRunning(true); }}>90 sec</button>
                    <button onClick={() => { setSeconds(60); setRunning(true); }}>60 sec</button>
                    <button onClick={() => setRunning((v) => !v)}>{running ? 'Pause' : 'Start'}</button>
                  </div>
                </div>
              </section>

              {active.exercises.map((ex, i) => {
                const item = state.exercises.find((e) => e.id === ex.exerciseId);
                const visual = getExerciseGif(ex.exerciseId);
                return (
                  <section className="tracker-card" key={ex.exerciseId}>
                    <div className="exercise-line">
                      {visual ? <img className="mini-photo exercise-motion" src={visual} alt={`${item?.name ?? 'Exercise'} form animation`} /> : <div className="mini-photo bench-photo" />}
                      <div>
                        <h2>{i + 1}. {item?.name ?? 'Exercise'}</h2>
                        <p>{item?.muscle} | {item?.equipment}</p>
                      </div>
                    </div>
                    <div className="set-table">
                      <span>Set</span>
                      <span>Weight (kg)</span>
                      <span>Reps</span>
                      <span>Done</span>
                      {ex.sets.map((s) => (
                        <div className="set-row" key={s.set}>
                          <strong>{s.set}</strong>
                          <label>
                            <input type="number" inputMode="decimal" value={s.weight} onChange={(e) => updateSet(active.id, ex.exerciseId, s.set, 'weight', Number(e.target.value))} />
                            <em>KG</em>
                          </label>
                          <input type="number" inputMode="numeric" value={s.reps} onChange={(e) => updateSet(active.id, ex.exerciseId, s.set, 'reps', Number(e.target.value))} />
                          <button
                            className={`done-dot ${s.done ? 'complete' : ''}`}
                            onClick={() => {
                              updateSet(active.id, ex.exerciseId, s.set, 'done', !s.done);
                              if (!s.done) {
                                setSeconds(90);
                                setRunning(true);
                              }
                            }}
                          >
                            {s.done ? 'x' : ''}
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="workout-actions">
                      <button className="add-set" onClick={() => addWorkoutSet(active.id, ex.exerciseId)}>+ Add Set</button>
                      <button className="small-danger" onClick={() => removeWorkoutSet(active.id, ex.exerciseId, ex.sets[ex.sets.length - 1].set)}><IonIcon icon={removeOutline} /> Remove last</button>
                    </div>
                  </section>
                );
              })}

              <div className="finish-row">
                <button className="small-danger" onClick={() => discard(active.id)}><IonIcon icon={closeOutline} /> Discard</button>
                <IonButton expand="block" className="finish-button" onClick={() => finish(active)}>
                  <IonIcon icon={checkmarkOutline} slot="start" /> Finish Workout
                </IonButton>
              </div>
            </>
          ) : (
            <>
              <section className="routine-hero">
                <div>
                  <p className="section-label">WEEK 1-2 CORE</p>
                  <h1>Routines</h1>
                  <p>Build a plan, start a session, log every working set.</p>
                </div>
                <img src="/assets/APPMASCOT.png" alt="TAMS golden buffalo mascot" />
              </section>

              {lastSummary && <WorkoutSummary workout={lastSummary} />}

              <section className="routine-builder">
                <div>
                  <p className="section-label">CREATE ROUTINE</p>
                  <h2>New workout plan</h2>
                </div>
                <input value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="Routine name, e.g. Push Day" />
                <select value={draftCategory} onChange={(e) => setDraftCategory(e.target.value)}>
                  {categoryChoices.map((c) => <option key={c}>{c}</option>)}
                </select>
                <button onClick={createFromDraft}><IonIcon icon={addOutline} /> Create routine</button>
              </section>

              <div className="segmented">{categories.map((c) => <button key={c} className={filter === c ? 'active' : ''} onClick={() => setFilter(c)}>{c}</button>)}</div>

              <section className="card-list">
                {routines.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    routine={routine}
                    exercises={state.exercises}
                    editing={editing}
                    setEditing={setEditing}
                    onStart={start}
                  />
                ))}
              </section>

              <section className="history-panel">
                <div>
                  <p className="section-label">WORKOUT HISTORY</p>
                  <h2>Recent completed sessions</h2>
                </div>
                {completed.slice(0, 5).map((w) => (
                  <article className="history-card" key={w.id}>
                    <div>
                      <strong>{w.routineName}</strong>
                      <p>{new Date(w.completedAt!).toLocaleString()} | {workoutDurationMinutes(w)} min</p>
                    </div>
                    <span>{completedSetCount(w)} sets | {Math.round(workoutVolume(w)).toLocaleString()} kg</span>
                  </article>
                ))}
                {!completed.length && <article className="empty-state">Finish a workout to show session history here.</article>}
              </section>
            </>
          )}
        </main>
      </IonContent>
    </IonPage>
  );
}

function RoutineCard({
  routine,
  exercises,
  editing,
  setEditing,
  onStart,
}: {
  routine: Routine;
  exercises: ReturnType<typeof snapshot>['exercises'];
  editing: string | false;
  setEditing: (value: string | false) => void;
  onStart: (id: string) => void;
}) {
  const isEditing = editing === routine.id;
  const available = exercises.filter((e) => !routine.items.some((item) => item.exerciseId === e.id));
  return (
    <article className="routine-card">
      <div className="routine-photo full-photo" />
      <div>
        <h2>{routine.name}</h2>
        <p>{routine.category}</p>
        <div className="routine-meta">
          <span><IonIcon icon={barbellOutline} /> {routine.items.length} exercises</span>
          <span><IonIcon icon={timeOutline} /> {routine.items.reduce((n, x) => n + x.rest, 0) ? `${Math.round(routine.items.reduce((n, x) => n + x.rest, 0) / 60)} min rest` : 'Set up exercises'}</span>
        </div>
      </div>
      <div className="routine-card-actions">
        <button aria-label="Duplicate routine" onClick={() => duplicateRoutine(routine.id)}><IonIcon icon={copyOutline} /></button>
        <button aria-label="Delete routine" onClick={() => confirm(`Delete ${routine.name}?`) && removeRoutine(routine.id)}><IonIcon icon={trashOutline} /></button>
      </div>
      <IonButton className="start-pill" onClick={() => onStart(routine.id)}><IonIcon icon={playOutline} slot="start" />Start</IonButton>
      <button className="routine-edit" onClick={() => setEditing(isEditing ? false : routine.id)}>{isEditing ? 'Close editor' : 'Edit routine'}</button>
      {isEditing && (
        <div className="routine-editor">
          <div className="routine-name-row">
            <input defaultValue={routine.name} onBlur={(e) => updateRoutine(routine.id, e.target.value, routine.category)} />
            <select defaultValue={routine.category} onChange={(e) => updateRoutine(routine.id, routine.name, e.target.value)}>
              {categoryChoices.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="routine-editor-title">Exercise targets (sets, reps, kg, rest seconds)</div>
          {routine.items.map((target) => {
            const exercise = exercises.find((e) => e.id === target.exerciseId);
            return (
              <div className="target-row" key={target.exerciseId}>
                <span>{exercise?.name}</span>
                {(['sets', 'reps', 'weight', 'rest'] as const).map((field) => (
                  <label key={field}>
                    {field}
                    <input type="number" value={target[field]} onChange={(e) => updateRoutineItem(routine.id, target.exerciseId, field, Number(e.target.value))} />
                  </label>
                ))}
                <button className="small-danger icon-only" onClick={() => removeRoutineExercise(routine.id, target.exerciseId)}><IonIcon icon={trashOutline} /></button>
              </div>
            );
          })}
          <div className="routine-add-row">
            {available.map((exercise) => <button key={exercise.id} onClick={() => addRoutineExercise(routine.id, exercise.id)}>+ {exercise.name}</button>)}
          </div>
        </div>
      )}
    </article>
  );
}

function WorkoutSummary({ workout }: { workout: WorkoutType }) {
  return (
    <section className="workout-summary">
      <div>
        <p className="section-label">LAST WORKOUT SAVED</p>
        <h2>{workout.routineName}</h2>
        <p>{completedSetCount(workout)} sets | {Math.round(workoutVolume(workout)).toLocaleString()} kg | {workoutDurationMinutes(workout)} min</p>
      </div>
      <IonIcon icon={checkmarkOutline} />
    </section>
  );
}
