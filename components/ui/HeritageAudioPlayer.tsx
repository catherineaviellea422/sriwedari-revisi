'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// Javanese Slendro and Pelog traditional pentatonic frequencies (Hz)
const PRESETS = [
  {
    id: 'slendro',
    name: 'Ladrang Wilujeng (Slendro)',
    description: 'Suasana damai peneduh jiwa khas pendopo kraton',
    notes: [275, 312, 355, 415, 470, 550],
    gongFreq: 55,
    intervalMs: 1400,
  },
  {
    id: 'pelog',
    name: 'Ketawang Subakastawa (Pelog)',
    description: 'Nada agung nan khidmat untuk ritual tari keraton',
    notes: [260, 280, 330, 392, 420, 520],
    gongFreq: 65,
    intervalMs: 1800,
  },
  {
    id: 'sriwedari',
    name: 'Ayak-Ayak Sriwedari',
    description: 'Alunan dinamis mengiringi pagelaran wayang wong',
    notes: [312, 355, 470, 550, 624, 710],
    gongFreq: 78,
    intervalMs: 1000,
  },
];

export default function HeritageAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPresetIndex, setCurrentPresetIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const noteStepRef = useRef(0);

  const preset = PRESETS[currentPresetIndex];

  // Initialize or get AudioContext
  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.setValueAtTime(volume, ctx.currentTime);
      master.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = master;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Synthesize single resonant metallic gamelan strike
  const playGamelanTone = (freq: number, duration = 2.5, isGong = false) => {
    try {
      const ctx = getAudioContext();
      if (!ctx || !masterGainRef.current) return;

      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Filter settings for warm bronze resonance
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isGong ? 300 : 1800, ctx.currentTime);
      filter.Q.setValueAtTime(isGong ? 4 : 2, ctx.currentTime);

      // Frequencies: Fundamental and slight overtone detune typical of Javanese bronze (perunggu)
      osc.type = isGong ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      oscHarmonic.type = 'sine';
      oscHarmonic.frequency.setValueAtTime(freq * (isGong ? 2.02 : 2.75), ctx.currentTime);

      // Envelope
      const now = ctx.currentTime;
      const initialGain = isGong ? 0.6 : 0.25;
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(initialGain, now + 0.03); // Quick metallic strike attack
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration); // Long gentle gong/saron sustain

      // Routing
      osc.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(masterGainRef.current);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + duration);
      oscHarmonic.stop(now + duration);
    } catch {
      // AudioContext might be blocked or inactive
    }
  };

  const startPlayback = () => {
    setIsPlaying(true);
    getAudioContext();

    if (loopTimerRef.current) clearInterval(loopTimerRef.current);

    // Initial note strike
    playGamelanTone(preset.gongFreq, 4.0, true);

    loopTimerRef.current = setInterval(() => {
      noteStepRef.current += 1;
      const step = noteStepRef.current;

      // Every 8 beats, play the deep soothing Gong Ageng
      if (step % 8 === 0) {
        playGamelanTone(preset.gongFreq, 4.5, true);
      }

      // Play melodic saron / bonang notes
      const noteIndex = step % preset.notes.length;
      const freq = preset.notes[noteIndex];
      playGamelanTone(freq, 2.0, false);

      // Random soft panembung harmonic
      if (step % 3 === 0) {
        playGamelanTone(preset.notes[(noteIndex + 2) % preset.notes.length] * 0.5, 3.0, false);
      }
    }, preset.intervalMs);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (loopTimerRef.current) {
      clearInterval(loopTimerRef.current);
      loopTimerRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  // Update volume
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const target = isMuted ? 0 : volume;
      masterGainRef.current.gain.setValueAtTime(target, audioCtxRef.current.currentTime);
    }
  }, [volume, isMuted]);

  // Restart when preset changes during active playback
  useEffect(() => {
    if (isPlaying) {
      stopPlayback();
      setTimeout(() => startPlayback(), 100);
    }
  }, [currentPresetIndex]);

  // Page Visibility API to save battery and mobile CPU
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (isPlaying) {
          if (loopTimerRef.current) clearInterval(loopTimerRef.current);
          if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
            audioCtxRef.current.suspend();
          }
        }
      } else {
        if (isPlaying) {
          if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
          }
          startPlayback();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  // Close the panel on outside click or Escape
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!isExpanded) return;
    const handlePointer = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isExpanded]);

  return (
    <div ref={containerRef} className="relative">
      {/* Header trigger: shows live equalizer while playing */}
      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        aria-expanded={isExpanded}
        aria-label="Musik gamelan"
        title={isPlaying ? `Memutar: ${preset.name}` : 'Musik gamelan'}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
          isPlaying || isExpanded
            ? 'bg-brand-gold/15 text-brand-gold'
            : 'text-brand-gold/80 hover:text-brand-gold hover:bg-white/10'
        }`}
      >
        {isPlaying ? (
          <span className="flex items-end gap-[3px] h-4" aria-hidden="true">
            {[0, 150, 300, 450].map((delay) => (
              <span
                key={delay}
                className="w-[3px] h-full rounded-full bg-brand-gold origin-bottom animate-[eq_900ms_ease-in-out_infinite]"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </span>
        ) : (
          <span className="material-symbols-outlined text-[20px]">music_note</span>
        )}
      </button>

      {/* Dropdown panel */}
      {isExpanded && (
        <div className="absolute top-12 right-0 w-[min(18rem,calc(100vw-1.5rem))] bg-[#102c22] border border-brand-gold/25 text-canvas rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Now playing */}
          <div className="p-4 flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Jeda' : 'Putar'}
              className="w-11 h-11 shrink-0 rounded-full bg-brand-gold text-brand-green-dark flex items-center justify-center hover:brightness-110 active:scale-95 transition"
            >
              <span className="material-symbols-outlined text-[26px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wider text-brand-gold/70">
                {isPlaying ? 'Sedang diputar' : 'Gamelan ambient'}
              </p>
              <p className="text-sm font-semibold text-white truncate">{preset.name}</p>
            </div>
            <button
              type="button"
              aria-label="Tutup"
              onClick={() => setIsExpanded(false)}
              className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-canvas/50 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" strokeWidth={2.25} aria-hidden="true" />
            </button>
          </div>

          {/* Presets */}
          <div className="px-2 pb-2">
            <p className="px-2 pb-1.5 text-[10px] uppercase tracking-wider text-canvas/45">Gendhing</p>
            <ul className="space-y-0.5">
              {PRESETS.map((p, idx) => {
                const active = currentPresetIndex === idx;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setCurrentPresetIndex(idx)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition ${
                        active ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className={`block text-xs font-semibold ${active ? 'text-brand-gold' : 'text-canvas/85'}`}>
                        {p.name}
                      </span>
                      <span className="block text-[11px] text-canvas/50 truncate">{p.description}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Volume */}
          <div className="px-4 py-3 border-t border-white/5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? 'Bunyikan' : 'Bisukan'}
              className="text-canvas/60 hover:text-white transition flex items-center"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              aria-label="Volume"
              className="flex-1 accent-brand-gold cursor-pointer"
            />
            <span className="w-9 text-right text-[11px] tabular-nums text-canvas/60">
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
