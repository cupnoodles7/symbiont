// client/src/CapyCanvas.jsx
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SERVER = 'http://localhost:4000';
const socket = io(SERVER);

export default function CapyCanvas({ state: externalState = 'idle', width = 128, height = 128 }) {
  const canvasRef = useRef(null);
  const atlasUrl = `${SERVER}/assets/capy_atlas.png`;
  const jsonUrl = `${SERVER}/assets/capy_atlas.json`;
  const [atlas, setAtlas] = useState(null);
  const [map, setMap] = useState(null);
  const animRef = useRef({ frames: [], idx: 0, last: 0, fps: 8, state: 'idle' });

  useEffect(() => {
    fetch(jsonUrl).then(r => r.json()).then(j => setMap(j)).catch(console.error);
    const img = new Image();
    img.src = atlasUrl;
    img.onload = () => setAtlas(img);
  }, [atlasUrl, jsonUrl]);

  useEffect(() => {
    socket.emit('join', { userId: 'demo' });
    socket.on('pet_update', (payload) => {
      const newState = payload.state || 'idle';
      setAnimationForState(newState);
    });

    return () => socket.off('pet_update');
  }, [map]);

  useEffect(() => {
    if (!externalState) return;
    setAnimationForState(externalState);
  }, [externalState, map]);

  function setAnimationForState(s) {
    if (!map) return;
    const a = map.animations[s] || map.animations.idle;
    const start = a.start_index;
    const count = a.count;
    const frames = [];
    for (let i = 0; i < count; i++) frames.push(start + i);
    animRef.current.frames = frames;
    animRef.current.idx = 0;
    animRef.current.fps = a.fps || 8;
    animRef.current.state = s;
  }

  useEffect(() => {
    let raf;
    const ctx = canvasRef.current.getContext('2d');
    const draw = (t) => {
      if (!atlas || !map || !animRef.current.frames.length) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const msPerFrame = 1000 / animRef.current.fps;
      if (t - animRef.current.last > msPerFrame) {
        animRef.current.last = t;
        animRef.current.idx = (animRef.current.idx + 1) % animRef.current.frames.length;
      }
      const frameIndex = animRef.current.frames[animRef.current.idx];
      const col = frameIndex % map.columns;
      const row = Math.floor(frameIndex / map.columns);
      const sx = col * map.frame_size[0];
      const sy = row * map.frame_size[1];
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(atlas, sx, sy, map.frame_size[0], map.frame_size[1], 0, 0, width, height);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [atlas, map, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ imageRendering: 'pixelated', width, height }} />;
}
