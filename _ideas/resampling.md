---
title: Resampling
layout: topic
topic: resampling
summary: Changing the rate at which a signal is sampled, without quietly changing the signal.
date: 2026-10-11
tags: [dsp, resampling]
toc: false
---

Almost every real system runs at more than one sample rate. The converter picks one,
the algorithm wants another, and the hardware has opinions of its own. Resampling is
the machinery in between — and the place where a design that looked clean in
floating point starts to cost resources, latency, or accuracy.

What keeps me coming back to it is that resampling looks like bookkeeping and behaves
like signal processing. Every rate change is a filter, whether or not anyone wrote one,
and the interesting questions are about what that filter does to the information you
were trying to keep.

I will add to this as I go.
