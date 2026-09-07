import wave
import math
import struct
import os

os.makedirs('public/assets/audio', exist_ok=True)
SAMPLE_RATE = 44100
DURATION = 8.0 # Exactly 8 seconds

def clamp(v):
    return max(-0.95, min(0.95, v))

def generate_naruto_theme():
    # Naruto: The Raising Fighting Spirit / Ninja Flute & Rock
    melody = [
        (440.0, 0.0, 0.4), (523.25, 0.4, 0.3), (587.33, 0.7, 0.5),
        (659.25, 1.2, 0.6), (587.33, 1.8, 0.3), (523.25, 2.1, 0.3), (440.0, 2.4, 0.8),
        (659.25, 3.2, 0.4), (783.99, 3.6, 0.4), (880.0, 4.0, 0.8),
        (783.99, 4.8, 0.3), (659.25, 5.1, 0.4), (587.33, 5.5, 0.5), (659.25, 6.0, 0.8),
        (880.0, 6.8, 1.1)
    ]
    
    samples = []
    total_frames = int(SAMPLE_RATE * DURATION)
    for i in range(total_frames):
        t = i / SAMPLE_RATE
        
        flute_sig = 0.0
        for freq, start, dur in melody:
            if start <= t < start + dur:
                rel_t = t - start
                env = math.sin(math.pi * min(1.0, rel_t / dur)) ** 0.8
                vib = 1.0 + 0.03 * math.sin(2 * math.pi * 6.5 * rel_t)
                f = freq * vib
                flute_sig += env * (
                    0.6 * math.sin(2 * math.pi * f * t) +
                    0.25 * math.sin(2 * math.pi * 2 * f * t) +
                    0.15 * math.sin(2 * math.pi * 3 * f * t)
                )
        
        beat_idx = int(t * 4.0) % 8
        chord_root = 110.0 if beat_idx < 4 else (87.31 if beat_idx < 6 else 98.0)
        gtr_env = max(0.0, 1.0 - (t * 4.0 % 1.0) * 0.7)
        dist_raw = math.sin(2 * math.pi * chord_root * t) + 0.7 * math.sin(2 * math.pi * chord_root * 1.5 * t)
        distorted = math.tanh(dist_raw * 3.0) * 0.4 * gtr_env
        
        drum_t = t * 2.0 % 1.0
        kick = math.sin(2 * math.pi * max(40.0, 150.0 * (1.0 - drum_t * 5.0)) * t) * max(0.0, 1.0 - drum_t * 3.0) if (int(t * 2.0) % 2 == 0) else 0.0
        snare_noise = (math.sin(t * 12345.67) % 1.0 - 0.5) * max(0.0, 1.0 - drum_t * 4.0) if (int(t * 2.0) % 2 == 1) else 0.0
        
        fade = 1.0 if t < 6.8 else max(0.0, 1.0 - (t - 6.8) / 1.2)
        l_mix = clamp((flute_sig * 0.55 + distorted * 0.35 + kick * 0.3 + snare_noise * 0.2) * fade)
        r_mix = clamp((flute_sig * 0.55 + distorted * 0.35 + kick * 0.3 + snare_noise * 0.2) * fade)
        samples.append((l_mix, r_mix))
        
    return samples

def generate_goku_theme():
    # Goku: Cha-La Head-Cha-La & Saiyan Heroic Fanfare
    melody = [
        (293.66, 0.0, 0.3), (392.00, 0.3, 0.4), (440.00, 0.7, 0.4), (493.88, 1.1, 0.6),
        (587.33, 1.7, 0.7), (493.88, 2.4, 0.4), (440.00, 2.8, 0.4), (392.00, 3.2, 0.8),
        (587.33, 4.0, 0.3), (659.25, 4.3, 0.3), (783.99, 4.6, 0.8),
        (880.00, 5.4, 0.4), (783.99, 5.8, 0.4), (987.77, 6.2, 1.6)
    ]
    
    samples = []
    total_frames = int(SAMPLE_RATE * DURATION)
    for i in range(total_frames):
        t = i / SAMPLE_RATE
        
        brass_sig = 0.0
        for freq, start, dur in melody:
            if start <= t < start + dur:
                rel_t = t - start
                env = math.sin(math.pi * min(1.0, rel_t / dur)) ** 0.6
                brass_sig += env * (
                    0.5 * math.sin(2 * math.pi * freq * t) +
                    0.3 * math.sin(2 * math.pi * 2 * freq * t) +
                    0.2 * math.sin(2 * math.pi * 3 * freq * t)
                )
        
        arp_notes = [196.0, 246.94, 293.66, 392.0]
        arp_idx = int(t * 8.0) % 4
        arp_freq = arp_notes[arp_idx]
        arp_env = max(0.0, 1.0 - (t * 8.0 % 1.0) * 0.8)
        synth_arp = (math.sin(2 * math.pi * arp_freq * t) + 0.3 * math.sin(2 * math.pi * arp_freq * 2 * t)) * arp_env * 0.25
        
        beat = (t * 2.5) % 1.0
        kick = math.sin(2 * math.pi * max(50.0, 180.0 * (1.0 - beat * 4.0)) * t) * max(0.0, 1.0 - beat * 2.5)
        
        fade = 1.0 if t < 6.8 else max(0.0, 1.0 - (t - 6.8) / 1.2)
        l_mix = clamp((brass_sig * 0.55 + synth_arp * 0.35 + kick * 0.35) * fade)
        r_mix = clamp((brass_sig * 0.55 + synth_arp * 0.35 + kick * 0.35) * fade)
        samples.append((l_mix, r_mix))
        
    return samples

def generate_po_theme():
    # Po (Kung Fu Panda): Kung Fu Fighting & Oogway Flute Theme
    melody = [
        (293.66, 0.0, 0.3), (369.99, 0.3, 0.3), (440.00, 0.6, 0.5), (587.33, 1.1, 0.7),
        (493.88, 1.8, 0.3), (440.00, 2.1, 0.4), (369.99, 2.5, 0.8),
        (440.00, 3.4, 0.3), (440.00, 3.7, 0.3), (493.88, 4.0, 0.3), (587.33, 4.3, 0.6),
        (659.25, 5.0, 0.4), (587.33, 5.4, 0.4), (493.88, 5.8, 0.5), (440.00, 6.3, 1.5)
    ]
    
    samples = []
    total_frames = int(SAMPLE_RATE * DURATION)
    for i in range(total_frames):
        t = i / SAMPLE_RATE
        
        flute_sig = 0.0
        for freq, start, dur in melody:
            if start <= t < start + dur:
                rel_t = t - start
                env = math.sin(math.pi * min(1.0, rel_t / dur)) ** 0.8
                flute_sig += env * (
                    0.65 * math.sin(2 * math.pi * freq * t) +
                    0.2 * math.sin(2 * math.pi * 2 * freq * t) +
                    0.15 * math.sin(2 * math.pi * 3 * freq * t)
                )
        
        gong1 = math.sin(2 * math.pi * 120.0 * t) * math.exp(-t * 0.9) if t < 3.4 else 0.0
        gong2 = math.sin(2 * math.pi * 140.0 * (t - 3.4)) * math.exp(-(t - 3.4) * 0.9) if t >= 3.4 else 0.0
        gong = (gong1 + gong2) * 0.4
        
        p_beat = (t * 3.0) % 1.0
        wood_tap = math.sin(2 * math.pi * 800.0 * t) * max(0.0, 1.0 - p_beat * 8.0) * 0.2
        
        fade = 1.0 if t < 6.8 else max(0.0, 1.0 - (t - 6.8) / 1.2)
        l_mix = clamp((flute_sig * 0.6 + gong * 0.35 + wood_tap * 0.2) * fade)
        r_mix = clamp((flute_sig * 0.6 + gong * 0.35 + wood_tap * 0.2) * fade)
        samples.append((l_mix, r_mix))
        
    return samples

def generate_ironman_theme():
    # Iron Man: Heavy Metal Driving Power Chords & Avengers Motif
    chords = [
        (82.41, 0.0, 0.8), (98.0, 0.8, 0.5), (110.0, 1.3, 0.6),
        (116.54, 1.9, 0.4), (110.0, 2.3, 0.4), (98.0, 2.7, 0.6), (82.41, 3.3, 1.0),
        (82.41, 4.3, 0.4), (98.0, 4.7, 0.4), (110.0, 5.1, 0.6), (146.83, 5.7, 0.9), (164.81, 6.6, 1.3)
    ]
    
    samples = []
    total_frames = int(SAMPLE_RATE * DURATION)
    for i in range(total_frames):
        t = i / SAMPLE_RATE
        
        gtr_sig = 0.0
        for freq, start, dur in chords:
            if start <= t < start + dur:
                rel_t = t - start
                env = max(0.0, 1.0 - (rel_t / dur) * 0.5)
                raw = math.sin(2 * math.pi * freq * t) + 0.8 * math.sin(2 * math.pi * freq * 1.5 * t) + 0.5 * math.sin(2 * math.pi * freq * 2.0 * t)
                gtr_sig += math.tanh(raw * 4.0) * env * 0.4
        
        horn_sig = 0.0
        if t >= 4.3:
            horn_f = 329.63 if t < 5.1 else (440.0 if t < 5.7 else 659.25)
            horn_sig = (math.sin(2 * math.pi * horn_f * t) + 0.4 * math.sin(2 * math.pi * 2 * horn_f * t)) * 0.35
            
        d_beat = (t * 3.2) % 1.0
        kick = math.sin(2 * math.pi * max(45.0, 160.0 * (1.0 - d_beat * 5.0)) * t) * max(0.0, 1.0 - d_beat * 3.0)
        
        fade = 1.0 if t < 6.8 else max(0.0, 1.0 - (t - 6.8) / 1.2)
        l_mix = clamp((gtr_sig * 0.55 + horn_sig * 0.35 + kick * 0.35) * fade)
        r_mix = clamp((gtr_sig * 0.55 + horn_sig * 0.35 + kick * 0.35) * fade)
        samples.append((l_mix, r_mix))
        
    return samples

def write_wav(filename, samples):
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(2)
        wav_file.setsampwidth(2)
        wav_file.setframerate(SAMPLE_RATE)
        packed = []
        for l, r in samples:
            l_val = max(-32767, min(32767, int(l * 32767)))
            r_val = max(-32767, min(32767, int(r * 32767)))
            packed.append(struct.pack('<hh', l_val, r_val))
        wav_file.writeframes(b''.join(packed))

print('Writing audio tracks...')
write_wav('public/assets/audio/theme_naruto.wav', generate_naruto_theme())
write_wav('public/assets/audio/theme_goku.wav', generate_goku_theme())
write_wav('public/assets/audio/theme_po.wav', generate_po_theme())
write_wav('public/assets/audio/theme_ironman.wav', generate_ironman_theme())
print('Generated all 4 character theme tracks successfully!')
