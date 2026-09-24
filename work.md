---
title: Work with me
permalink: /work/
subtitle: Algorithms that have to run in real time, on real hardware.
---

I work on high-speed physical-layer systems — the kind that live or die on their signal
processing.

A system like that is more than one person's work. I design the signal-processing core
and lead your engineers through the rest — the architecture, the decisions that are
expensive to get wrong, and the handovers between stages where most of the cost hides.

## What I take on

- **Algorithm design** — detection, synchronisation and equalization, validated for
  performance against the requirements they have to meet.
- **Fixed-point conversion** — floating-point models mapped to fixed point, with the
  strategy chosen for the hardware and the performance cost measured and kept small.
- **RTL implementation** — VHDL written to be debugged, and to still make sense to
  whoever maintains it.
- **System-level work** — balancing resources, integration and bring-up against what
  the whole system needs.
- **Consulting and mentorship** — helping your engineers build systems they can carry
  on without me.

Any one of those works on its own — a fixed-point model handed to your RTL team, a
feasibility review before you commit to a part, a single block to specification. Where I
am worth most is across the whole path: one person holding the design together while your
team builds it.

## Where I have done this

- **Zak-OTFS** — novel delay-Doppler waveform based PHY design.
  - End-to-end model at **1 MHz** BW, with performance simulated over
    TDL channels.
  - Linear-complexity equalizer, designed to stay implementable — the differentiator.
  - Ettus **E320** driven directly from MATLAB, for over-the-air experiments.
  - System-level validation now in progress: link budget, power-amplifier nonlinearity
    and in-band distortion, and a channel emulator.

- **DVB-RCS2** based secure communication system — PHY layer development.
  - Owned the modulator and demodulator architecture through to implementation,
    supporting **32+ waveforms** and frequency-hopped streams — carrier recovery and
    turbo FEC designed in house, the remaining blocks split across the team.
  - Brought the burst detector up on DDR-backed deep buffering, taking acquisition and
    synchronisation to negative SNR, on the order of **−10 dB**.
  - Jammer detector implementation for protected waveforms, supporting up to
    **30 dB JSR**, with per-hop metrics reported to higher layers.

- **Feedback Kalman equalizer** — communication system based on **MIL-STD-188-110B**.
  - Original design, simulated over Watterson-fading channels and tuned to the figures
    in the standard.
  - Fixed-point model for implementation, with the performance validated.
  - C++ on an **Arm Cortex-A53**, supporting PS-based modem development.

Day to day that means MATLAB, VHDL, C and C++, Vivado, and Linux.

## How I work

Remote, and comfortable with the hours difference. Deliverables are written down —
models, vectors and documentation handed over with the RTL, so your own team can verify
the work independently rather than take my word for it. I am happy to work under an NDA,
and to stay inside whatever export or classification constraints your programme sits
under.

I take on a small number of engagements a year, which means I would rather turn something
down than take it on badly.

## Getting in touch

Tell me the rough scope, the timeline you have in mind and the target device — enough
for me to say honestly whether I am the right person for it.

<p class="contact-email"><a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a></p>
