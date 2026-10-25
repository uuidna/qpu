# Quantum Echoes

Quantum Echoes runs the operations forward, perturbs one qubit, runs them back, and measures. Without a perturbation the echo returns to the start with certainty. A perturbation that reaches the measured qubits disturbs it: the out-of-time-order correlator the protocol measures. The code is `src/quantum/echo.ts`.

Google's blog states the result: the protocol ran on the 105-qubit array of Willow and was 13,000× faster than the fastest supercomputers, on molecules of 15 and 28 atoms.
