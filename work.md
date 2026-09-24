---
title: Work with me
permalink: /work/
subtitle: Algorithms that have to run in real time, on real hardware.
---

I work on high-speed physical-layer systems — the kind that live or die on their signal
processing.

A system like that is more than one person's work. What I bring is the design of the
signal-processing core, and the technical lead to carry your engineers through the rest:
the architecture, the decisions that are expensive to get wrong, and the review that
keeps each stage honest against the one before it. Most of the cost in these projects
hides in the handovers between those stages, and that is the seam I am there to hold.

## What I take on

- **Algorithm design** — detection, acquisition, synchronisation and equalization, worked
  out with the implementation already in mind.
- **End-to-end models** — the whole chain in MATLAB, then the fixed-point mapping that
  decides whether the RTL will match the paper.
- **RTL** — VHDL for FPGA, written against that fixed-point model and verified to it,
  inside the timing and resource budget you actually have.
- **Hardware** — bring-up and debug on the board, data movement between processor and
  fabric, drivers, and the C or C++ that sits on top.
- **Technical leadership** — setting the architecture, dividing the work across your
  team, reviewing what comes back, and mentoring the engineers who will own it after I
  am gone.

Any one of those works on its own — a fixed-point model handed to your RTL team, a
feasibility review before you commit to a part, a single block to specification. Where I
am worth most is across the whole path: one person holding the design together while your
team builds it.

## Where I have done this

- **Zak-OTFS** — novel delay-Doppler waveform based PHY design.
  - End-to-end model in MATLAB, with performance simulated over TDL channels.
  - Linear-complexity equalizer, designed to stay implementable — the differentiator in
    systems this complex.
  - Ettus **E320** driven directly from MATLAB, for over-the-air experiments.
  - System-level validation now in progress: link budget, power-amplifier nonlinearity
    and in-band distortion, and a channel emulator.

- **MIL-STD-188-110B** — feedback Kalman equalizer for an HF modem.
  - Modelled in MATLAB over Watterson-fading channels, benchmarked against the standard.
  - Implemented in C++ on an Arm Cortex-A53, validated against the MATLAB vectors.

- **DVB-RCS2** — modulator and demodulator for a satellite communication modem.
  - **32+ waveforms** of differing size.
  - Sampling rates from a fraction of a MHz up to the order of 100 MSa/s.
  - Carrier frequency offsets of a few kHz, acquired and tracked.

- **Spread spectrum** — the anti-jam side of the same system.
  - Burst detection, acquisition and synchronisation at negative SNR, on the order of
    **−10 dB**.
  - Jammer detection holding up to **30 dB JSR**.

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
