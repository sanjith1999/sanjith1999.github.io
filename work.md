---
title: Work with me
permalink: /work/
subtitle: Contract work on physical-layer communication systems.
---

I build physical-layer communication systems — satellite and HF modems, spread-spectrum
waveforms, the receivers that have to keep working at low SNR — and take them from a
MATLAB model through to RTL running on real hardware.

I take on a small number of contract engagements a year.

## What I take on

- **Algorithm to RTL** — a waveform or DSP block carried from floating-point model,
  through fixed-point, to verified and timing-closed RTL.
- **Architecture and feasibility review** — whether a design will close on the part you
  already have, what it will cost in resources, and where the risk actually sits. Days,
  not months.
- **Modelling and simulation** — system and channel models in MATLAB, bit-accurate
  references, and the verification vectors your RTL team checks against.

## Where I have done this

- Spread-spectrum waveforms for a **DVB-RCS2** secure TDMA system: modulator and
  demodulator architecture, with burst detection and synchronisation working down to
  **−11 dB SNR**.
- An RTL **jammer detector** for protected waveforms, operating at up to **30 dB JSR**
  and built for **120 MSa/s**.
- A **DVB-RCS2** MF-TDMA modem covering **32+ waveforms** — **80 MSym/s** demodulation,
  **100 Mb/s** output, and **under 50 µs** modulator latency.
- A feedback **Kalman equalizer** for **MIL-STD-188-110B** over Watterson-fading HF
  channels, from MATLAB model through to C++ on an Arm core.
- **Zak-OTFS** taken over the air: delay-Doppler acquisition and blind detection,
  validated on USRP hardware.

## How I work

Remote, and comfortable with the hours difference. Deliverables are written down —
models, vectors and documentation handed over with the RTL, so your own team can verify
the work independently rather than take my word for it. I am happy to work under an NDA,
and to stay inside whatever export or classification constraints your programme sits
under.

## Getting in touch

Email me at [{{ site.author.email }}](mailto:{{ site.author.email }}). It helps to
mention the standard or waveform, the target device, and roughly when you need it —
enough for me to say honestly whether I am the right person.
