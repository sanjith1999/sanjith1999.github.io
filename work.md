---
title: Work with me
permalink: /work/
subtitle: High-speed DSP for physical-layer systems — algorithm, RTL, hardware.
---

I build the signal-processing core of physical-layer communication systems: detection,
synchronisation and equalization, carried through to high-throughput RTL on FPGA and the
Linux or bare-metal software that drives it.

What I prefer is to own that whole path, from the requirements conversation to a
delivered system — because in projects like these, most of the cost hides in the
handovers between stages.

## The path I take a system down

1. **Design.** The requirements first: rates, latency, the channel it has to live in,
   the device it has to fit on, and what "working" will mean when we test it. Then the
   detection, acquisition, synchronisation and equalization algorithms to meet them —
   designed with the implementation already in mind, because an elegant algorithm that
   cannot be built is not a solution.
2. **Model.** The whole chain in MATLAB, transmitter through channel to receiver, so
   performance is measured rather than assumed. Then the fixed-point mapping: word
   lengths, scaling, and the quantisation each block can absorb. This is the step most
   often skipped, and the one that decides whether the RTL matches the paper.
3. **RTL.** VHDL, written against the fixed-point model and verified to it, for the
   device and the timing budget you actually have.
4. **Hardware.** Onto the board, through the integration failures that only appear with
   real signals — then the software side: data movement between processor and fabric,
   drivers, and the C or C++ on top. Delivered with the models, test vectors and
   documentation your own engineers need to take it forward without me.

Any one of those works as an engagement on its own: a fixed-point model handed to your
RTL team, a feasibility review before you commit to a part, a single block written to a
specification. But what I add is worth most when I carry a system across all four.

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
