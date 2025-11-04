// Generate alarm sounds using Web Audio API
export const generateAlarmSound = (type: 'bell' | 'chime' | 'beep' | 'melody'): AudioBuffer | null => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  
  let duration: number;
  let frequencies: number[];
  
  switch (type) {
    case 'bell':
      duration = 1.5;
      frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      break;
    case 'chime':
      duration = 1.2;
      frequencies = [440, 554.37, 659.25]; // A4, C#5, E5
      break;
    case 'beep':
      duration = 0.3;
      frequencies = [800];
      break;
    case 'melody':
      duration = 2;
      frequencies = [523.25, 587.33, 659.25, 783.99]; // C5, D5, E5, G5
      break;
  }
  
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  
  // Generate waveform
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    let sample = 0;
    
    frequencies.forEach((freq, index) => {
      const startTime = (duration / frequencies.length) * index;
      const endTime = startTime + (duration / frequencies.length);
      
      if (t >= startTime && t < endTime) {
        // Sine wave with envelope
        const localT = t - startTime;
        const envelope = Math.exp(-3 * localT);
        sample += Math.sin(2 * Math.PI * freq * localT) * envelope * 0.3;
      }
    });
    
    data[i] = sample;
  }
  
  return buffer;
};

export const playGeneratedSound = async (type: 'bell' | 'chime' | 'beep' | 'melody', volume: number = 0.7) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const buffer = generateAlarmSound(type);
    
    if (!buffer) {
      throw new Error('Failed to generate audio buffer');
    }
    
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    
    source.buffer = buffer;
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    source.start(0);
    
    return new Promise<void>((resolve) => {
      source.onended = () => resolve();
    });
  } catch (error) {
    console.error('Audio generation failed:', error);
    throw error;
  }
};
