// client/src/App.jsx
import React, { useState } from 'react';
import CapyCanvas from './CapyCanvas';
import './App.css';

function App() {
  const [state, setState] = useState('idle');

  const trigger = async (s) => {
    try {
      await fetch(`http://localhost:4000/trigger/${s}`);
      setState(s);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Capy Demo (web)</h2>
      <CapyCanvas state={state} width={128} height={128} />
      <div style={{ marginTop: 10 }}>
        <button onClick={() => trigger('celebrate')}>Celebrate</button>
        <button onClick={() => trigger('idle')}>Idle</button>
        <button onClick={() => trigger('walk')}>Walk</button>
        <button onClick={() => trigger('eat')}>Eat</button>
        <button onClick={() => trigger('sick')}>Sick</button>
      </div>
    </div>
  );
}

export default App;
