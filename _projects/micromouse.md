---
title: MicroMouse
summary: An autonomous maze-solving robot — hardware, wall-following control, and flood-fill navigation.
date: 2024-03-18
cover: /assets/images/micromouse/mouse.jpeg
cover_alt: The assembled MicroMouse robot
cover_caption: The assembled robot, built to fit a standard 180 mm maze cell.
tags: [robotics, embedded, control]
math: true
toc: true
---

<!-- TODO(sanjith): the structure and figures are in place; replace the prose in each
     section with the real numbers, part choices and results from your build notes. -->

MicroMouse is a classic competition problem: a small robot is placed in an unknown maze
and has to find the centre, then drive the fastest route it can. It is a satisfying
problem because it refuses to stay in one discipline — mechanical layout, sensing,
control and search all have to work at once, and a weakness in any of them shows up as
the robot grinding along a wall.

## Hardware

{% include figure.html src="/assets/images/micromouse/hardware_intro.jpeg"
   alt="The robot's hardware layout and main subsystems"
   caption="Layout of the main subsystems: drive, sensing, power and control." wide=true %}

The chassis had to fit comfortably inside a maze cell while leaving room for the sensors
to see the walls on both sides. Everything else followed from that constraint.

- **Drive** — geared DC motors with quadrature encoders, giving both closed-loop speed
  control and the odometry the navigation layer needs.
- **Sensing** — infrared emitter/receiver pairs aimed left, right and forward for wall
  detection and lateral alignment.
- **Control** — a single microcontroller running the sensing, control and search loops.
- **Power** — a battery pack sized for a full run, with the motor supply kept separate
  from the logic rail so switching noise stays out of the sensor readings.

## First phase: making it move predictably

{% include figure.html src="/assets/images/micromouse/phase1.jpeg"
   alt="Early prototype during the first build phase"
   caption="The first phase: get it driving straight before asking it to be clever." %}

Nothing about maze solving matters until the robot can travel one cell and stop where it
intended to. The first milestone was therefore boring on purpose: drive forward a fixed
distance, turn ninety degrees, repeat, and measure the drift.

## Staying centred

{% include figure.html src="/assets/images/micromouse/align.jpeg"
   alt="Side sensors used to keep the robot centred in a corridor"
   caption="The side sensors give an error signal proportional to lateral offset." %}

With a wall on each side, the difference between the two side readings is an error
signal: zero when centred, positive or negative when drifting. Feeding that difference
into the steering correction keeps the robot in the middle of the corridor without any
explicit position estimate.

The awkward case is a corridor with only one wall, where the difference is meaningless.
There the controller falls back to holding a fixed distance from the single wall it can
see, and to encoder-based heading when it can see neither.

## The control loop

{% include figure.html src="/assets/images/micromouse/controller.jpeg"
   alt="Block diagram of the control loop"
   caption="Sensor error into the controller, controller output into differential wheel speeds." %}

Steering and speed are both handled by PID control. For an error $$e(t)$$ the controller
output is

$$
u(t) = K_p\,e(t) + K_i \int_0^{t} e(\tau)\,d\tau + K_d \frac{de(t)}{dt}
$$

which, discretised at the loop rate $$T_s$$, becomes the form that actually runs on the
microcontroller:

$$
u[n] = K_p e[n] + K_i T_s \sum_{k=0}^{n} e[k] + \frac{K_d}{T_s}\bigl(e[n] - e[n-1]\bigr)
$$

Two practical details mattered more than the gains themselves: clamping the integral term
so it cannot wind up while the robot is held against a wall, and running the loop at a
fixed, known rate so $$T_s$$ is a constant rather than whatever the main loop happened to
take.

{% include figure.html src="/assets/images/micromouse/response.jpeg"
   alt="Measured step response of the tuned controller"
   caption="Step response after tuning — fast enough to correct within a cell, damped enough not to weave." %}

Tuning was done in the usual order: raise $$K_p$$ until the robot oscillates, add $$K_d$$
to damp it, then add just enough $$K_i$$ to remove the steady-state offset caused by
mismatched motors.

## Navigation

{% include figure.html src="/assets/images/micromouse/navigation.jpeg"
   alt="The maze represented as a grid of cells with walls"
   caption="The maze as the robot sees it: a grid of cells, each with four wall flags." %}

The robot holds the maze as a grid of cells, each carrying four wall flags and a distance
value. Search is flood fill: every cell is labelled with its distance from the goal, and
the robot always steps to the neighbouring cell with the lowest value it can legally
reach. Discovering a new wall invalidates those distances, so the flood is recomputed and
the robot simply continues downhill.

This is what makes the approach pleasant to implement — exploration and route-following
are the same rule, applied to a map that keeps improving.

{% include figure.html src="/assets/images/micromouse/path.jpeg"
   alt="The solved path from start to maze centre"
   caption="The route after exploration: the fast run follows the flood-fill gradient." %}

Once the centre has been reached and enough of the maze is known, the speed run uses the
same gradient with a higher velocity profile and straight-line segments merged so the
robot accelerates through runs of cells instead of stopping at each one.

## What I would do differently

- Log to flash during runs. Debugging control behaviour from the outside, by watching,
  is far harder than reading back what the robot thought was happening.
- Calibrate the IR sensors against ambient light at startup rather than trusting
  fixed thresholds.
- Separate the control loop from the search loop properly, with the search running at a
  much lower rate, instead of letting both share one main loop.
