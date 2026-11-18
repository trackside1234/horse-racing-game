import { useEffect, useRef, useState } from 'react';
import { createRacingScene, type RaceTelemetry } from './game/scene';
import { Flag, Gauge, Play, RotateCcw, Trophy } from 'lucide-react';

const initial: RaceTelemetry = {
  position: 6, speed: 0, stamina: 100, distance: 0, totalDistance: 1600,
  state: 'READY', horseName: 'Southern Comet'
};

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [telemetry, setTelemetry] = useState(initial);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [camera, setCamera] = useState<'chase' | 'jockey'>('chase');

  useEffect(() => {
    if (!mountRef.current) return;
    const game = createRacingScene(mountRef.current, (data) => {
      setTelemetry(data);
      if (data.state === 'FINISHED') setFinished(true);
    });
    game.setCamera(camera);
    const onKey = (event: KeyboardEvent) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(event.key)) event.preventDefault();
      game.keyDown(event.key);
      if (event.key.toLowerCase() === 'c') setCamera(v => v === 'chase' ? 'jockey' : 'chase');
      if (event.key.toLowerCase() === 'r') { game.reset(); setStarted(false); setFinished(false); }
    };
    const onUp = (event: KeyboardEvent) => game.keyUp(event.key);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onUp);
      game.dispose();
    };
  }, []);

  useEffect(() => {
    // Camera selection is also available via the on-screen control.
    (window as any).__ajCamera?.(camera);
  }, [camera]);

  const start = () => {
    (window as any).__ajStart?.();
    setStarted(true);
  };
  const reset = () => {
    (window as any).__ajReset?.();
    setStarted(false); setFinished(false); setTelemetry(initial);
  };

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark">AJ</div><div><div className="brand-name">AUSTRALASIAN JOCKEY</div><div className="brand-sub">RACING SIMULATOR · PROTOTYPE 0.1</div></div></div>
      <div className="top-status"><span className="live-dot" /> DEVELOPMENT BUILD <span className="divider-dot">/</span> FLEMINGTON</div>
    </header>

    <section className="game-layout">
      <div className="viewport-wrap">
        <div className="viewport" ref={mountRef}>
          <div className="viewport-vignette" />
          <div className="race-label"><span className="race-kicker">TEST RACE</span><strong>FLEMINGTON · 1600M</strong></div>
          <div className="track-hint">W / ↑ PACE &nbsp;·&nbsp; S / ↓ SETTLE &nbsp;·&nbsp; A / D POSITION &nbsp;·&nbsp; SPACE URGE</div>
          {!started && <div className="start-overlay">
            <div className="start-card"><span className="eyebrow">YOUR MOUNT IS READY</span><h1>Take your<br/><em>position.</em></h1><p>Six runners. One mile. Ride your own race.</p><button className="primary-button" onClick={start}><Play size={17} fill="currentColor"/> START RACE</button></div>
          </div>}
          {finished && <div className="finish-overlay"><div className="finish-card"><Trophy size={28}/><span className="eyebrow">RACE COMPLETE</span><h2>Across the line.</h2><p>Your prototype race has finished.</p><button className="primary-button" onClick={reset}><RotateCcw size={16}/> RACE AGAIN</button></div></div>}
        </div>
        <div className="viewport-footer"><span><i className="keycap">C</i> CAMERA: {camera.toUpperCase()}</span><span><i className="keycap">R</i> RESTART</span><button onClick={() => setCamera(v => v === 'chase' ? 'jockey' : 'chase')}>SWITCH CAMERA</button></div>
      </div>

      <aside className="race-panel">
        <div className="panel-heading"><div><span className="eyebrow">RACE CONTROL</span><h2>Race day</h2></div><Flag size={20}/></div>
        <div className="horse-card"><div className="horse-avatar">SC</div><div><span className="eyebrow">YOUR HORSE</span><h3>{telemetry.horseName}</h3><span className="horse-meta">BAY · 5YO · NZ BRED</span></div></div>
        <div className="metric-block"><div className="metric-head"><span><Gauge size={14}/> SPEED</span><strong>{Math.round(telemetry.speed)} <small>KM/H</small></strong></div><div className="meter"><div className="meter-fill speed-fill" style={{width:`${Math.min(100, telemetry.speed / 65 * 100)}%`}}/></div></div>
        <div className="metric-block"><div className="metric-head"><span>STAMINA</span><strong>{Math.round(telemetry.stamina)}<small>%</small></strong></div><div className="meter"><div className="meter-fill stamina-fill" style={{width:`${telemetry.stamina}%`}}/></div></div>
        <div className="race-stats"><div><span>POSITION</span><strong>{telemetry.position}<small> / 6</small></strong></div><div><span>DISTANCE LEFT</span><strong>{Math.max(0, telemetry.totalDistance - telemetry.distance).toFixed(0)}<small> M</small></strong></div></div>
        <div className="panel-section"><span className="eyebrow">RIDE COMMANDS</span><div className="command-row"><kbd>W</kbd><span>Build pace</span></div><div className="command-row"><kbd>S</kbd><span>Ease / settle</span></div><div className="command-row"><kbd>A</kbd><kbd>D</kbd><span>Change position</span></div><div className="command-row"><kbd>SPACE</kbd><span>Urge forward</span></div><div className="command-row"><kbd>SHIFT</kbd><span>Conserve energy</span></div></div>
        <button className="secondary-button" onClick={reset}><RotateCcw size={15}/> RESET RACE</button>
      </aside>
    </section>
    <footer className="bottom-bar"><span>EARLY PLAYABLE PROTOTYPE</span><span>SIMULATION & VISUALS SUBJECT TO DEVELOPMENT</span><span>BUILD 0.1.0</span></footer>
  </main>;
}