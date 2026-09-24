---
title: Firmware Design for a Micro-mouse
summary: Controller design, a 1 ms response budget, and the alignment tricks that keep it off the walls.
date: 2024-08-22
cover: /assets/images/micromouse/mouse.jpeg
cover_alt: The assembled micro-mouse, a round PCB with two wheels, an OLED display and IR sensors
cover_caption: Our design for RoboFest-2023.
cover_width: 82%
tags: [robotics, embedded, control, firmware]
repo: https://github.com/sanjith1999/SINDiB-MicroMouse
math: true
toc: true
---

Last December I had the opportunity to lead a team designing a micro-mouse for
RoboFest-2023. We had a blast planning and implementing robust firmware for it, and this
is the write-up I finally got round to.

Rather than going over the basics or the traditional ways to solve a maze — which you can
find easily enough online — I want to dig into the implementation strategies we used to
lift our game. We did use flood fill, but what follows is the creative side: the choices
that set our micro-mouse apart. Most of it applies to both the search run and the fast
run.

Feel free to skip to whichever section catches your interest.

## Intro to the hardware

{% include figure.html src="/assets/images/micromouse/hardware_intro.jpeg"
   alt="Diagram of sensor placement: IR1 and IR4 angled outward, IR2 and IR3 angled forward, a gyroscope, and left and right wheel encoders"
   caption="Sensor placement. IR1 and IR4 look diagonally out to the side walls; IR2 and IR3 look forward." %}

For sensing walls and working out the mouse's position relative to them, we used the
standard four-IR-sensor configuration, together with a gyroscope module and two precise
wheel encoders.

The two wheels run as a differential drive. For debugging we had 9 LEDs, an OLED display
and a Bluetooth module on board. This article covers the basic run, but the hardware
choices were made with a diagonal run in mind.

If you want the rationale behind the individual choices, the project lives at
[sanjith1999/SINDiB-MicroMouse](https://github.com/sanjith1999/SINDiB-MicroMouse).

## Controller design

The controller is the man behind the wheels, adjusting their speeds to steer the robot
through the maze. To keep the robot on track it needs to know exactly where it is
relative to its starting point.

Even with precise sensors this gets tricky. Small jerks in the movement and little slides
of the wheels accumulate, and it becomes very easy to clip a wall. Keeping every movement
as smooth as possible is the whole game.

{% include figure.html src="/assets/images/micromouse/controller.jpeg"
   alt="Speed against time, showing expected and actual profiles, with the speed controller governing the ramps and the alignment controller the constant-speed section"
   caption="The speed profile. The speed controller owns the ramps at each end; the alignment controller owns the constant-speed section in the middle." %}

We used two kinds of PD controller to hold that profile.

### C#01: Speed controller

The speed controller keeps things smooth — a gentle acceleration profile with no jerks as
the mouse speeds up and slows down — and makes sure it stops precisely where we want it
to. When the mouse is turning, the gyroscope tells us where it needs to end up; for
straight movements the wheel encoders get us to the right spot. Parameter tuning is what
buys the precision here.

### C#02: Alignment controller

The alignment controller kicks in during the constant-speed phase. Depending on the
situation it uses either the wheel encoders or the IR sensors to keep the robot properly
aligned as it moves forward. It is really two separate PD controllers, each with four
sets of parameters covering different speed ranges — more on that under alignment
strategies.

So each controller has the familiar form

$$
u(t) = K_p\,e(t) + K_d \frac{de(t)}{dt}
$$

**Why PD and not PID?** We left the integral term out because of stability problems.

## Response time allocation

When it comes to driving fast, the question is how responsive your driver is. From the
outset we wanted the controller to be very responsive.

After working through the numbers we settled on a **1 ms response time**: the speed of
each wheel is updated every 1 ms as the mouse moves through the maze. In firmware terms,
at the end of each main loop — configured at 1 kHz — the wheel speeds are updated from
the sensor readings. Sense, plan, act.

{% include figure.html src="/assets/images/micromouse/response.jpeg"
   alt="Timeline of one 1 ms update cycle divided into three phases, with boundaries at 0.5 ms and 0.8 ms"
   caption="One update cycle: IR sampling to 0.5 ms, gyro to 0.8 ms, calculation to 1 ms." %}

Each update cycle has three phases.

### Phase #01: IR data update

Say we run the microcontroller at 72 MHz. An ADC takes on average around 96 cycles to
sample one value, so a single sensor reading costs about 1.33 µs, and all four come to
roughly 6 µs. So why allocate a full 500 µs?

{% include figure.html src="/assets/images/micromouse/phase1.jpeg"
   alt="Diagram showing IR1's receiver picking up rays emitted by IR2 after reflecting off a wall"
   caption="Interference: IR1's receiver picking up the rays from IR2's transmitter." %}

Consider the case where the receiver of sensor I picks up rays from sensor II. We do not
want that. The fix is to switch on only the relevant transmitter while sampling a given
receiver.

The chance of interference between sensors II and III is very low, so those two can be
fired together. That gives:

- Fire sensor I's transmitter for about **60 µs**, buffering the readings from its
  receiver. Switch it off and wait another **80 µs**.
- Do the same for sensor IV — transmitter on for 60 µs, buffer, off, wait 80 µs.
- Finally fire the transmitters of sensors II and III together for 60 µs, buffer the
  relevant readings, switch off, wait 80 µs.

Those timings look magical until you work them back. The ADC needs about 2 µs per sample,
so allowing for transition times, 60 µs collects around **20 valid samples**, buffered in
shift-register fashion. As for the off time, anything beyond 10 µs is plenty.

### Phase #02: Gyro data update

Gather enough samples from the gyro to determine the facing angle.

That was the plan, anyway. The SPI communication speed limit of our gyro module caused
congestion, so in the final implementation the gyro value is updated by an interrupt
routine running at half the rate of the update cycle. An analog gyro is the better choice
here.

### Phase #03: Calculation phase

Sensing is done — now plan and act. In plain terms: calculate and set the wheel speeds.

You might be wondering how the encoder values get updated. We feed the encoder signals
into two timers, so the counts update automatically without us lifting a finger. The best
part is that the readings are always sitting in registers, available whenever we need
them.

## Box-to-box navigation strategy

{% include figure.html src="/assets/images/micromouse/navigation.jpeg"
   alt="A maze junction showing a decision point, the next decision point, and the left, straight and right moves between them"
   caption="Every movement is defined between one decision point and the next." %}

The strategy here is straightforward: keep every movement restricted to the space between
two adjacent decision points. During the search run, when we hit a decision point we sense
the walls and evaluate the algorithm to work out which point to move to next. In a fast
run those decision points become a virtual concept — movements still happen relative to
them, but the focus is speed rather than stopping and evaluating at each one.

Our current setup uses only 90° turns, which means moving to the centre, turning, then
heading for the next decision point. It works, but curved turns between decision points
would make the movement far more fluid.

## Alignment strategies

The alignment controller is the key player during the constant-speed phase. For 90° turns
it relies on the wheel encoders to make a precise point turn, and the same goes for 180°
turns. It is the straight movements where you can really make a difference.

{% include figure.html src="/assets/images/micromouse/align.jpeg"
   alt="A robot trajectory through five numbered maze cells with different wall configurations"
   caption="The same straight run passes through cells with quite different wall configurations." %}

Take the mouse moving through the maze as shown above.

- **Cell 1** — both diagonal IR sensors are usable, so align to the centre of the cell
  while moving.
- **Cell 2** — use the diagonal IR sensor on the wall side to hold a safe distance from
  that wall. This one is tricky: it depends on a pre-determined distance value, and that
  value shifts with the lighting. Take the time to set it accurately at the start of the
  competition.
- **Cell 3** — no wall to work with, so the wheel encoders are the only option.
- **Cell 4** — watch out moving forward here. It is *not* the same as cell 2: the
  non-symmetric reflection from the front wall causes trouble. Moving backward through
  cell 4 behaves like cell 2, so that direction is fine.
- **Cell 5** — same as cell 1.

Although I have described configurations cell by cell, it makes more sense to think in
terms of movement between two decision points, especially when using the diagonal IR
sensors.

For the theory-minded: the alignment controller is a PD controller with a **subsumption
architecture**. In priority order, the cell 1 configuration comes first, then cell 2, then
cell 3. Each PD controller carries four sets of $$(K_p, K_d)$$ covering different speed
ranges. Honestly, the best way to get a feel for it is to play with it yourself — don't
get caught up in the fancy terms.

Even with all this, there are two places where the controller's judgement can slip:

- the distance between the robot's face and the centre of the square it is in;
- the angle the robot faces relative to the centre axis of the maze path.

{% include figure.html src="/assets/images/micromouse/path.jpeg"
   alt="Three wall configurations labelled A, B and C where the front-facing sensors can both see a wall"
   caption="The jackpot configurations: both front sensors see a wall, so angle and distance can be fixed at once." %}

For those, use the jackpot configurations shown in figure A above. You will obviously
need to make a 180° turn — before you do, use the two front-facing IR sensors to correct
both the angle and the distance from the wall. The same applies to B and C, though watch
for reflections off non-symmetric walls: the robot is not aligned yet, and may be facing
one before it gets properly aligned.

A pro tip: use the gyroscope to set a limit, so the alignment controller cannot adjust the
facing angle beyond a predetermined threshold. That avoids overcompensation and keeps
things on track.

## Take it to the next level

Three things that would make it faster:

1. **Curved turns** — as mentioned in the box-to-box strategy, use curved turns between
   decision points.
2. **Diagonal run** — I don't want to complicate things here.
3. **Air suction** — increases friction and gives more grip for taking sharp turns at very
   high speed.

You can plan for everything, and then on competition day they throw in some yellow lights
and suddenly you are in a whole new ballgame. But that is all part of the fun. 😆

---

All kinds of criticism are welcome.
