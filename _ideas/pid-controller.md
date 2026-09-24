---
title: PID Control in a Mobile Robot
summary: Choosing the right error term for line following, wall following and object alignment — and a tuning procedure that works for all three.
date: 2022-10-30
tags: [control, robotics, embedded]
repo: https://github.com/sanjith1999/TIKIRI_MOLE_EN2532
math: true
toc: true
redirect_from:
  - /projects/pid-controller/
figure_width: 58%
---

Our team Tikiri-Mole built a mobile robot able to follow lines, follow walls, detect
objects, identify ball colours, and carry things with a pair of arms. These are a few of
the moments I enjoyed while designing its algorithms.

You have almost certainly heard about the role of a PID controller in actuator design.
What I want to focus on instead are the algorithms that need continuous monitoring of a
control signal, and whose performance improves once PID is in the loop. We will start
with the idea, then look at how it applies to some simple tasks a mobile robot has to do.

## Control systems, briefly

The basic idea behind a control system is to understand the state of a parameter through
some sensing device, compare it with the reference value, and adjust the actuators to
bring the state closer to that reference.

Achieving such a state is rarely as easy as specifying the reference. Changing a variable
abruptly produces a transient response, and there is a price to pay for it — the state
can only be reached gradually. Four parameters describe that transient response to a
unit step input: overshoot, rise time, settling time and steady-state error.

The goal is to minimise all four, by supplying a proper error signal at each cycle of
execution. The problem with using the plain difference as that signal is that it leaves
only **one** degree of freedom: the amplification applied to the error. Set it too high
and the response oscillates; set it too low and a significant steady-state error remains.
There is no value that fixes both. This is where PID becomes useful.

{% include figure.html src="/assets/images/pid-controller/pid.jpeg"
   alt="Step response of a control system showing overshoot, rise time, delay, settling time and steady-state error, with underdamped, critically damped and overdamped curves"
   caption="Unit step response of a control system: the transient parameters we are trying to minimise." %}

## PID control

The idea of PID control is to use the differential and integral terms of the error in
addition to the proportional term:

$$
\text{error signal} = K_p\,e + K_i \!\int\! e\,dt + K_d \frac{de}{dt}
$$

That gives three degrees of freedom — $$K_p$$, $$K_i$$ and $$K_d$$ — to shape the
response while keeping those unwanted transient parameters small.

## Tuning the parameters

More freedom makes tuning harder. This sequence keeps it manageable:

1. Set all three amplification factors to zero.
2. Increase $$K_p$$ until the response shows the desired amount of oscillation.
3. Increase $$K_i$$ until the average response has minimal steady-state error.
4. Finally increase $$K_d$$, until the oscillations are damped to a tolerable amount.

With that in hand, let's look at how the concept applies to the tasks a mobile robot is
actually asked to do.

## Application I: line following

The robot is given a black line of a specified width on a white background, and has to
follow it until it reaches a spot with no line. There are more complicated scenarios —
Y turns, L turns, loops — that will trip up a simple algorithm, and those are better
handled with a subsumption architecture. Let's not confuse things here; for now, a simple
sense-plan-act algorithm.

Algorithmically, if the axis of the robot is facing:

- **right of the line**, turn the robot left towards the line;
- **left of the line**, turn it right,

before continuing forward.

So we need to interpret the error. If the robot's axis is right of the black line, the
front *left* corner of the robot sits over the line. If the axis is left of it, the front
*right* corner does. An aligned axis exposes the front centre. So an IR sensor facing
downwards, able to tell black from white, tells us where the robot is relative to the
line.

Reading black as state 1 and white as 0, define the error as

$$
e = (1)\cdot s_{\text{right}} + (0)\cdot s_{\text{front}} + (-1)\cdot s_{\text{left}}
$$

The error is $$+1$$ when the robot has drifted left of the line, $$-1$$ when it has
drifted right, and $$0$$ when it is centred. Turning the robot proportionally — right on a
positive error, left on a negative one — does the job.

{% include figure.html src="/assets/images/pid-controller/line-following.png"
   alt="Three cases of a robot's three downward IR sensors over a black line, with the sensor detecting the line marked in green"
   width="72%"
   caption="The green dot marks the sensor that currently sees the line. Case 1 gives
            $$e = -1$$ (turn left), case 2 gives $$e = 0$$, case 3 gives $$e = +1$$
            (turn right)." %}

The success of something this simple depends on the overshoot — which can throw the body
of the robot clean off the line — and on delay in alignment, which walks it off the track
gradually. Dealing with those biases is exactly where PID comes in. Keep two more
variables: update the differential term from the difference between the previous and
current error each cycle, and the integral term by accumulating error over a time frame.
Then feed

$$
u = K_p\,e + K_i\,e_{\text{integral}} + K_d\,e_{\text{differential}}
$$

to the actuator, which turns right on a positive value and left on a negative one,
proportionally.

Map the tuning section onto this: oscillation to either side of the line is the
oscillation in the response, and the average separation between the robot's centre axis
and the line is the steady-state error. Follow the same procedure.

You can go further with an IR panel array of more sensors, defining the error from each
sensor's distance to the axis. That finer error definition, together with PID, is enough
to reach industrial standard.

> **Additional tip:** by adjusting the forward movement distance between alignments, you
> get dot-dot line following for free.

At this point you can see that applying PID differs only in **how the error is defined**
and how it is tuned. Rather than repeat the procedure, let's just look at the error
definitions for two more cases.

## Application II: wall following

{% include figure.html src="/assets/images/pid-controller/wall-following.jpg"
   alt="A robot angled relative to a wall, with distances d1 from the front corner and d2 from the rear corner marked"
   width="34%"
   caption="Two ultrasonic sensors: $$d_1$$ at the front corner, $$d_2$$ at the rear." %}

Here the robot has to hold the same distance from a wall throughout its journey, so it
needs to know how far its nearest corners are from that wall. Two ultrasonic sensors — one
at the nearest front corner, one at the rear — give us that. The error is simply

$$
e = d_1 - d_2
$$

For the configuration in the figure, a positive error means the front corner is further
from the wall than the rear one — the robot is facing away from the wall — so the actuator
should turn left on a positive error and right on a negative one, proportionally. Folding
PID into that error makes the system more robust.

> **Additional tip:** add a third ultrasonic sensor between the other two and refine the
> error accordingly, and you can hold a *specified* distance from the wall.

## Application III: aligning the robot with an object

In most mobile robot designs, giving the arm more degrees of freedom makes the system
complex. The consequence of reducing the arm's freedom is that the whole robot has to
align itself with the object as it approaches, so it is worth having a strategy for it.

Aligning means bringing the robot's face normal to the front face of the object, which
three distance sensors across the front can do: make the distances equal as the robot
approaches.

{% include figure.html src="/assets/images/pid-controller/object-alignment.jpg"
   alt="Three cases of a robot approaching an object, with distances d1, d2 and d3 from three front sensors; in case III the object presents a corner"
   width="70%"
   caption="Cases I and II are ordinary misalignment. Case III is the exception: the
            object presents a corner, not a face." %}

**Case III** above is the exception to this algorithm. It can be detected by comparing the
three sensor readings; once it is, simply turn towards one side of the object and run the
same function again. Otherwise, an error definition much like the wall-following one does
the job.

> **Additional tip:** when the robot is far from the object, a small sideways movement
> takes its sight completely off it; when it is close, the same movement may not be enough
> to align. Angling the side sensors convex towards the middle makes the error scale
> dynamically — the same misalignment produces less error far away, and gradually more as
> the robot closes in.

## In closing

Incorporating PID into a controller design is easy. It comes down to choosing the right
error term for your problem, then following the tuning procedure.

---

The robot and its simulation are at
[sanjith1999/TIKIRI_MOLE_EN2532](https://github.com/sanjith1999/TIKIRI_MOLE_EN2532).
