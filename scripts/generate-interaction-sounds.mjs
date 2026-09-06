import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(root, 'assets', 'sounds');
const sampleRate = 22050;

const sounds = {
  'ui-click': {
    duration: 0.06,
    voices: [{ start: 0, duration: 0.055, from: 575, to: 515, level: 0.34 }]
  },
  'ui-open': {
    duration: 0.13,
    voices: [
      { start: 0, duration: 0.095, from: 475, to: 535, level: 0.23 },
      { start: 0.035, duration: 0.09, from: 675, to: 710, level: 0.2 }
    ]
  },
  'ui-close': {
    duration: 0.12,
    voices: [
      { start: 0, duration: 0.085, from: 620, to: 555, level: 0.22 },
      { start: 0.028, duration: 0.085, from: 420, to: 385, level: 0.18 }
    ]
  },
  'ui-transition': {
    duration: 0.13,
    voices: [
      { start: 0, duration: 0.105, from: 425, to: 475, level: 0.19 },
      { start: 0.028, duration: 0.095, from: 535, to: 575, level: 0.17 }
    ]
  },
  'ui-success': {
    duration: 0.2,
    voices: [
      { start: 0, duration: 0.135, from: 510, to: 530, level: 0.19 },
      { start: 0.058, duration: 0.135, from: 755, to: 790, level: 0.22 }
    ]
  },
  'ui-warning': {
    duration: 0.19,
    voices: [
      { start: 0, duration: 0.125, from: 395, to: 375, level: 0.2 },
      { start: 0.072, duration: 0.11, from: 335, to: 315, level: 0.18 }
    ]
  },
  'ui-error': {
    duration: 0.2,
    voices: [
      { start: 0, duration: 0.12, from: 250, to: 225, level: 0.21 },
      { start: 0.068, duration: 0.125, from: 205, to: 180, level: 0.23 }
    ]
  },
  'ui-notification': {
    duration: 0.18,
    voices: [
      { start: 0, duration: 0.115, from: 630, to: 660, level: 0.17 },
      { start: 0.052, duration: 0.12, from: 825, to: 865, level: 0.2 }
    ]
  },
  'ui-destructive': {
    duration: 0.2,
    voices: [
      { start: 0, duration: 0.12, from: 285, to: 250, level: 0.2 },
      { start: 0.06, duration: 0.13, from: 190, to: 165, level: 0.22 }
    ]
  },
  'ui-complete': {
    duration: 0.25,
    voices: [
      { start: 0, duration: 0.14, from: 455, to: 475, level: 0.14 },
      { start: 0.05, duration: 0.145, from: 610, to: 635, level: 0.17 },
      { start: 0.102, duration: 0.14, from: 770, to: 805, level: 0.2 }
    ]
  }
};

function envelope(time, duration) {
  const attack = Math.min(0.009, duration * 0.18);
  const release = Math.min(0.055, duration * 0.48);
  if (time < attack) return Math.sin((time / attack) * Math.PI * 0.5) ** 2;
  if (time > duration - release) {
    const remaining = Math.max(0, (duration - time) / release);
    return Math.sin(remaining * Math.PI * 0.5) ** 2;
  }
  return 1;
}

function synthesize(definition) {
  const sampleCount = Math.ceil(definition.duration * sampleRate);
  const samples = new Float64Array(sampleCount);

  definition.voices.forEach((voice) => {
    let phase = 0;
    const startSample = Math.floor(voice.start * sampleRate);
    const voiceSamples = Math.ceil(voice.duration * sampleRate);
    for (let offset = 0; offset < voiceSamples && startSample + offset < sampleCount; offset += 1) {
      const localTime = offset / sampleRate;
      const progress = localTime / voice.duration;
      const frequency = voice.from + (voice.to - voice.from) * progress;
      phase += (Math.PI * 2 * frequency) / sampleRate;
      const fundamental = Math.sin(phase);
      const harmonic = Math.sin(phase * 2 + 0.18) * 0.11;
      samples[startSample + offset] += (fundamental + harmonic) * voice.level * envelope(localTime, voice.duration);
    }
  });

  let peak = 0;
  for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
  const scale = peak > 0 ? 0.72 / peak : 1;
  return Int16Array.from(samples, (sample) => Math.round(Math.max(-1, Math.min(1, sample * scale)) * 32767));
}

function wavBuffer(samples) {
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * bytesPerSample, 28);
  buffer.writeUInt16LE(bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  samples.forEach((sample, index) => buffer.writeInt16LE(sample, 44 + index * bytesPerSample));
  return buffer;
}

fs.mkdirSync(outputDirectory, { recursive: true });
for (const [name, definition] of Object.entries(sounds)) {
  fs.writeFileSync(path.join(outputDirectory, `${name}.wav`), wavBuffer(synthesize(definition)));
}

console.log(`Generated ${Object.keys(sounds).length} original interaction sounds in ${path.relative(root, outputDirectory)}.`);
