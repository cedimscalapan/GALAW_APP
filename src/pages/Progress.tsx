import { useEffect, useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import AppTopBar from '../components/AppTopBar';
import { addMeasurement, snapshot, subscribe, workoutVolume } from '../services/tamsStore';

export default function Progress() {
  const [state, setState] = useState(snapshot());
  useEffect(() => subscribe(() => setState({ ...snapshot() })), []);

  const done = state.workouts.filter((w) => w.completedAt);
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);
  const week = done.filter((w) => new Date(w.completedAt!) >= since);
  const bars = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const value = done
      .filter((w) => new Date(w.completedAt!).toDateString() === d.toDateString())
      .reduce((n, w) => n + workoutVolume(w), 0);
    return { label: d.toLocaleDateString(undefined, { weekday: 'short' }), value };
  });
  const max = Math.max(1, ...bars.map((b) => b.value));
  const volume = week.reduce((n, w) => n + workoutVolume(w), 0);

  function weigh() {
    const weight = Number(prompt('Body weight (kg)'));
    if (weight > 0) {
      const waist = prompt('Waist in cm (optional)');
      addMeasurement(weight, waist ? Number(waist) : undefined);
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen className="tams-screen">
        <main className="phone-shell">
          <AppTopBar />
          <header className="screen-title compact-title app-hero">
            <div>
              <p className="section-label">PERFORMANCE</p>
              <h1>Progress</h1>
              <p>Workout history, volume, and body measurements.</p>
            </div>
            <img src="/assets/APPLOGO.png" alt="TAMS logo" />
          </header>
          <section className="stat-grid">
            <article>
              <p className="section-label">THIS WEEK</p>
              <span>{week.length}</span>
              <p>completed sessions</p>
            </article>
            <article>
              <p className="section-label">WEEKLY VOLUME</p>
              <span>{Math.round(volume).toLocaleString()}</span>
              <p>kg lifted</p>
            </article>
          </section>
          <section className="load-card">
            <p className="section-label">DAILY TRAINING VOLUME | 7 DAYS</p>
            <div className="bar-chart">
              {bars.map((b) => (
                <div className="chart-day" key={b.label}>
                  <span style={{ height: `${Math.max(5, (b.value / max) * 100)}%` }} />
                  <small>{b.label}</small>
                </div>
              ))}
            </div>
          </section>
          <section className="measurement-head">
            <div>
              <p className="section-label">BODY MEASUREMENTS</p>
              <h2>Weight & waist</h2>
            </div>
            <button onClick={weigh}>+ Add entry</button>
          </section>
          <section className="measurement-list">
            {state.measurements.map((m) => (
              <article className="info-row" key={m.id}>
                <strong>
                  {m.weight} kg{m.waist ? ` | ${m.waist} cm waist` : ''}
                </strong>
                <span>{new Date(m.date).toLocaleDateString()}</span>
              </article>
            ))}
            {!state.measurements.length && <article className="empty-state">Measurements are optional. Add a weigh-in to follow changes.</article>}
          </section>
          <section className="measurement-head">
            <div>
              <p className="section-label">WORKOUT HISTORY</p>
              <h2>Recent sessions</h2>
            </div>
          </section>
          <section className="history-list">
            {done.map((w) => (
              <article className="info-row" key={w.id}>
                <div>
                  <strong>{w.routineName}</strong>
                  <p>{new Date(w.completedAt!).toLocaleString()}</p>
                </div>
                <span>{Math.round(workoutVolume(w)).toLocaleString()} kg</span>
              </article>
            ))}
            {!done.length && <article className="empty-state">Complete workouts to build history and real progress charts.</article>}
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
}
