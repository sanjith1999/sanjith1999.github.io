---
title: Work with me
permalink: /work/
subtitle: Signal-processing systems, carried from requirements to working hardware.
---

I build high-speed physical-layer systems — the kind that live or die on their signal
processing — and take them from the first conversation about requirements through to
hardware that works.

What I prefer is to own that whole path, because most of the cost in these projects hides
in the handovers between its stages.

## What I take on

- **Algorithm design** — detection, acquisition, synchronisation and equalization, worked
  out with the implementation already in mind.
- **End-to-end models** — the whole chain in MATLAB, then the fixed-point mapping that
  decides whether the RTL will match the paper.
- **RTL** — VHDL for FPGA, written against that fixed-point model and verified to it,
  inside the timing and resource budget you actually have.
- **Hardware** — bring-up and debug on the board, data movement between processor and
  fabric, drivers, and the C or C++ that sits on top.

Any one of those works on its own — a fixed-point model handed to your RTL team, a
feasibility review before you commit to a part, a single block to specification. What I
add is worth most carried across all four.

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

Day to day that means MATLAB, VHDL, C and C++, Vivado, and PetaLinux on the processor
side.

## How I work

Remote, and comfortable with the hours difference. Deliverables are written down —
models, vectors and documentation handed over with the RTL, so your own team can verify
the work independently rather than take my word for it. I am happy to work under an NDA,
and to stay inside whatever export or classification constraints your programme sits
under.

I take on a small number of engagements a year, which means I would rather turn something
down than take it on badly.

## Getting in touch

Email me at [{{ site.author.email }}](mailto:{{ site.author.email }}). It helps to
mention the standard or waveform, the target device, and roughly when you need it —
enough for me to say honestly whether I am the right person.
