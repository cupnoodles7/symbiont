import React, { useState } from 'react';
import CapyCanvas from './CapyCanvas';

// This matches your original App.jsx example exactly
export default function CapyDemo() {
  const [state, setState] = useState('idle');

  return (
    <div>
      <CapyCanvas state={state} />

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setState('idle')}>Idle</button>
        <button onClick={() => setState('walk')}>Walk</button>
        <button onClick={() => setState('eat')}>Eat</button>
        <button onClick={() => setState('celebrate')}>Celebrate</button>
        <button onClick={() => setState('sick')}>Sick</button>
      </div>
    </div>
  );
}
