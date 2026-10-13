import { useEffect, useMemo, useState } from 'react';
import { IonContent, IonIcon, IonPage, IonSearchbar } from '@ionic/react';
import { addOutline, barbellOutline, chevronForwardOutline } from 'ionicons/icons';
import AppTopBar from '../components/AppTopBar';
import { createExercise, snapshot, subscribe, type Exercise } from '../services/tamsStore';
import { getExerciseGif } from '../utils/exerciseVisuals';

export default function Exercises() {
  const [state, setState] = useState(snapshot());
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState('All');
  const [selected, setSelected] = useState<Exercise | null>(null);

  useEffect(() => subscribe(() => setState({ ...snapshot() })), []);

  const muscles = ['All', ...Array.from(new Set(state.exercises.map((e) => e.muscle)))];
  const visible = useMemo(
    () =>
      state.exercises.filter(
        (e) =>
          (muscle === 'All' || e.muscle === muscle) &&
          `${e.name} ${e.muscle} ${e.equipment}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [state.exercises, muscle, query],
  );

  function add() {
    const name = prompt('Exercise name');
    if (!name?.trim()) return;
    const target = prompt('Primary muscle group', 'Chest') || 'Other';
    const equipment = prompt('Equipment', 'Dumbbell') || 'Bodyweight';
    const instructions = prompt('Short exercise instructions', 'Move with control and use a comfortable range of motion.') || '';
    createExercise(name, target, equipment, instructions);
  }

  return (
    <IonPage>
      <IonContent fullscreen className="tams-screen">
        <main className="phone-shell">
          <AppTopBar />
          {selected ? (
            <>
              <button className="back-link" onClick={() => setSelected(null)}>
                &lt; Exercise library
              </button>
              <section className="guide-hero">
                <div>
                  <p className="section-label">{selected.muscle} | {selected.equipment}</p>
                  <h2>{selected.name}</h2>
                </div>
                <img src={getExerciseGif(selected.id) ?? '/assets/APPMASCOT.png'} alt={`${selected.name} form animation`} />
              </section>
              <section className="how-card">
                <p className="section-label">HOW TO</p>
                <p>{selected.instructions}</p>
                <p>Choose a comfortable load, move with control, and stop if you feel pain.</p>
              </section>
              <section className="tip-card">
                <IonIcon icon={barbellOutline} />
                <h3>Training cue</h3>
                <p>Keep your setup repeatable. Log every set so TAMS can show real progress from your work.</p>
              </section>
            </>
          ) : (
            <>
              <header className="screen-title compact-title no-indent library-head app-hero">
                <div>
                  <p className="section-label">MOVEMENT GUIDE</p>
                  <h1>Exercise Library</h1>
                  <p>Find a movement and review its form cues.</p>
                </div>
                <img src="/assets/APPLOGO.png" alt="TAMS logo" />
                <button aria-label="Add custom exercise" onClick={add}>
                  <IonIcon icon={addOutline} />
                </button>
              </header>
              <IonSearchbar value={query} onIonInput={(e) => setQuery(e.detail.value ?? '')} placeholder="Search exercises" />
              <div className="segmented muscle-filter">
                {muscles.map((m) => (
                  <button key={m} className={muscle === m ? 'active' : ''} onClick={() => setMuscle(m)}>
                    {m}
                  </button>
                ))}
              </div>
              <section className="library-list">
                {visible.map((ex) => (
                  <button key={ex.id} onClick={() => setSelected(ex)}>
                    <span className="exercise-glyph">
                      {getExerciseGif(ex.id) ? <img src={getExerciseGif(ex.id)} alt="" /> : <IonIcon icon={barbellOutline} />}
                    </span>
                    <div>
                      <strong>{ex.name}</strong>
                      <p>
                        {ex.muscle} | {ex.equipment}
                        {ex.custom ? ' | Custom' : ''}
                      </p>
                    </div>
                    <IonIcon icon={chevronForwardOutline} />
                  </button>
                ))}
                {!visible.length && <article className="empty-state">No exercises match this search.</article>}
              </section>
            </>
          )}
        </main>
      </IonContent>
    </IonPage>
  );
}
