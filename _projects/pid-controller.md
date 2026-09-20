---
title: A PID Controller, from the Equation to the Hardware
summary: What each term actually does, how to discretise it, and the details that decide whether it works on a microcontroller.
date: 2023-11-02
cover: /assets/images/pid-controller/pid.jpeg
cover_alt: Block diagram of a PID control loop
cover_caption: "The loop: measure, compare against the setpoint, correct, repeat."
tags: [control, embedded, dsp]
math: true
toc: true
---

<!-- TODO(sanjith): this is the general write-up. If this page was originally tied to a
     specific rig (motor, temperature, the MicroMouse), add that context and its plots. -->

PID is the first controller most people meet and the one they keep reaching for, because
it asks almost nothing of you: no model of the plant, three numbers, and a measurement.
What it does ask is that you understand what each of those numbers is buying.

## The continuous form

Given a setpoint $$r(t)$$ and a measurement $$y(t)$$, the error is
$$e(t) = r(t) - y(t)$$ and the control output is

$$
u(t) = K_p\,e(t) + K_i \int_0^{t} e(\tau)\,d\tau + K_d \frac{de(t)}{dt}
$$

Three terms, three jobs:

- **Proportional** reacts to the error right now. Raising $$K_p$$ makes the response
  faster and, past a point, oscillatory. Alone, it leaves a standing offset whenever a
  constant disturbance — friction, gravity, heat loss — has to be fought.
- **Integral** accumulates past error, so any persistent offset keeps growing the output
  until it is gone. It is what removes steady-state error, and it is also what makes the
  loop sluggish and overshoot-prone if overdone.
- **Derivative** responds to how fast the error is changing, which damps the approach and
  lets you get away with a larger $$K_p$$. It also amplifies measurement noise, so it is
  the term most often filtered or dropped.

## Discretising it

A microcontroller samples. With a fixed sample period $$T_s$$, the integral becomes a sum
and the derivative a difference:

$$
u[n] = K_p e[n] + K_i T_s \sum_{k=0}^{n} e[k] + \frac{K_d}{T_s}\bigl(e[n] - e[n-1]\bigr)
$$

The word doing the work in that sentence is *fixed*. If the loop runs whenever the main
loop gets around to it, $$T_s$$ varies, and the integral and derivative gains vary with
it. Run the controller from a timer interrupt, or at minimum measure the elapsed time and
use it explicitly.

```c
typedef struct {
    float kp, ki, kd;
    float ts;            /* sample period, seconds   */
    float integral;      /* accumulated error        */
    float prev_measured; /* for derivative-on-measurement */
    float out_min, out_max;
} pid_t;

float pid_update(pid_t *c, float setpoint, float measured)
{
    float error = setpoint - measured;

    float p = c->kp * error;

    /* Derivative on the measurement, not the error: a step change in the
       setpoint then does not produce a derivative spike. */
    float d = -c->kd * (measured - c->prev_measured) / c->ts;

    /* Provisional output, used to decide whether integrating is useful. */
    float candidate = p + c->integral + d;

    /* Conditional integration: stop accumulating while saturated and the
       error would push further into the limit. */
    if (candidate < c->out_max && candidate > c->out_min) {
        c->integral += c->ki * error * c->ts;
    }

    float out = p + c->integral + d;
    if (out > c->out_max) out = c->out_max;
    if (out < c->out_min) out = c->out_min;

    c->prev_measured = measured;
    return out;
}
```

## The three details that decide whether it works

**Integral windup.** While the actuator is saturated, the error persists but the output
cannot grow to meet it — yet the integral keeps accumulating. When the plant finally
moves, that stored value has to be unwound, and the result is a long overshoot that looks
nothing like the tuning you tested. The fix above is conditional integration: only
accumulate while the output is inside its limits.

**Derivative kick.** Differentiating the error means a step in the setpoint produces an
enormous momentary derivative. Differentiating the *measurement* instead gives the same
damping with no spike, which is why the code above tracks `prev_measured` rather than
`prev_error`.

**Noise.** The derivative term multiplies high-frequency noise by $$K_d / T_s$$. If the
output chatters, low-pass the measurement or the derivative term before you reach for a
smaller $$K_d$$ — the damping is usually worth keeping.

## Tuning, practically

Model-based tuning is better when you have a model. When you do not:

1. Set $$K_i = K_d = 0$$. Raise $$K_p$$ until the response sustains a steady oscillation.
2. Back $$K_p$$ off to roughly half that, then add $$K_d$$ until the overshoot is damped
   to something you are happy with.
3. Add $$K_i$$ last, slowly, only as much as is needed to erase the remaining
   steady-state offset. Most instability that appears late in tuning is too much
   integral.

Record the step response at each stage. "It feels better" is not a measurement, and the
plots are what tell you whether you are actually converging.

## Where it stops being enough

PID assumes the plant is roughly linear and roughly time-invariant near the operating
point. When it is not — significant transport delay, strong coupling between axes, a
plant whose gain changes across its range — no amount of tuning rescues it, and the
honest move is gain scheduling, feed-forward, or a model-based controller. Knowing that
boundary is most of the skill in using PID well.
