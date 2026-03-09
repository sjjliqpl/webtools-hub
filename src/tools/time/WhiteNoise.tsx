import { useState, useRef, useCallback } from 'react';

interface SoundOption {
  id: string;
  label: string;
  icon: string;
}

const SOUNDS: SoundOption[] = [
  { id: 'rain', label: 'Rain', icon: '🌧️' },
  { id: 'forest', label: 'Forest', icon: '🌲' },
  { id: 'fire', label: 'Fire', icon: '🔥' },
  { id: 'ocean', label: 'Ocean', icon: '🌊' },
  { id: 'night', label: 'Night', icon: '🦗' },
];

interface ActiveSound {
  source: AudioBufferSourceNode | OscillatorNode;
  gain: GainNode;
  extras: (AudioBufferSourceNode | OscillatorNode | BiquadFilterNode)[];
}

function createNoise(ctx: AudioContext, type: string, volume: number): ActiveSound {
  const gain = ctx.createGain();
  gain.gain.value = volume;
  gain.connect(ctx.destination);

  const extras: (AudioBufferSourceNode | OscillatorNode | BiquadFilterNode)[] = [];

  if (type === 'rain') {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 4000;
    source.connect(filter);
    filter.connect(gain);
    source.start();
    extras.push(filter);
    return { source, gain, extras };
  }

  if (type === 'forest') {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 220;
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.3;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 50;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    osc.connect(filter);
    filter.connect(gain);
    gain.gain.value = volume * 0.3;
    osc.start();
    extras.push(lfo, filter);
    return { source: osc, gain, extras };
  }

  if (type === 'fire') {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.7 ? 1 : 0.3);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 0.5;
    source.connect(filter);
    filter.connect(gain);
    source.start();
    extras.push(filter);
    return { source, gain, extras };
  }

  if (type === 'ocean') {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    source.connect(filter);
    filter.connect(gain);
    source.start();
    extras.push(lfo, filter);
    return { source, gain, extras };
  }

  // night
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1500;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 800;
  source.connect(filter);
  filter.connect(hp);
  hp.connect(gain);
  gain.gain.value = volume * 0.5;
  source.start();
  extras.push(filter, hp);
  return { source, gain, extras };
}

export default function WhiteNoise() {
  const [playing, setPlaying] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(0.5);
  const ctxRef = useRef<AudioContext | null>(null);
  const activeSounds = useRef<Map<string, ActiveSound>>(new Map());

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  const toggle = (id: string) => {
    if (playing.has(id)) {
      const sound = activeSounds.current.get(id);
      if (sound) {
        sound.source.stop();
        sound.extras.forEach((n) => {
          if ('stop' in n && typeof n.stop === 'function') n.stop();
        });
        sound.gain.disconnect();
        activeSounds.current.delete(id);
      }
      setPlaying((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      const ctx = getCtx();
      const sound = createNoise(ctx, id, volume);
      activeSounds.current.set(id, sound);
      setPlaying((prev) => new Set(prev).add(id));
    }
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    activeSounds.current.forEach((sound) => {
      sound.gain.gain.value = v;
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">🎵 White Noise</h2>

      <div className="grid grid-cols-5 gap-3">
        {SOUNDS.map((s) => {
          const active = playing.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-all cursor-pointer ${
                active
                  ? 'bg-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-105'
                  : 'bg-gradient-to-br from-indigo-50 to-purple-50 hover:scale-105'
              }`}
            >
              <span className={`text-3xl ${active ? 'animate-pulse' : ''}`}>{s.icon}</span>
              <span className="text-xs font-medium text-slate-700">{s.label}</span>
              {active && (
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">🔈</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => handleVolume(Number(e.target.value))}
          className="flex-1 accent-indigo-600"
        />
        <span className="text-sm text-slate-500">🔊</span>
      </div>
    </div>
  );
}
