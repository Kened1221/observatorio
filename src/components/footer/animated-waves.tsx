"use client";

import { useEffect, useRef } from "react";

export default function AnimatedWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const disturbancesRef = useRef<
    Array<{
      x: number;
      y: number;
      radius: number;
      strength: number;
      age: number;
    }>
  >([]);
  const explosionsRef = useRef<
    Array<{
      x: number;
      y: number;
      particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        color: string;
        opacity: number;
      }>;
      age: number;
    }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 170;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Handle click events
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Add disturbance
      disturbancesRef.current.push({
        x,
        y,
        radius: 0,
        strength: 25,
        age: 0,
      });

      // Create explosion
      createExplosion(x, y);
    };

    // Create explosion particles
    const createExplosion = (x: number, y: number) => {
      const waveColors = ["#f9a8b4", "#ef4444", "#E30513"];
      const particleCount = 30 + Math.floor(Math.random() * 20);
      const particles = [];

      for (let i = 0; i < particleCount; i++) {
        // Random angle and speed for particle
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 2;

        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1, // Slight upward bias
          size: 1 + Math.random() * 4,
          color: waveColors[Math.floor(Math.random() * waveColors.length)],
          opacity: 0.8 + Math.random() * 0.2,
        });
      }

      explosionsRef.current.push({
        x,
        y,
        particles,
        age: 0,
      });
    };

    canvas.addEventListener("click", handleClick);

    // Wave properties with additional parameters for size variation
    const waves = [
      {
        y: canvas.height - 120,
        amplitude: 10,
        baseAmplitude: 15,
        amplitudeVariation: 10,
        wavelength: 0.03,
        baseWavelength: 0.03,
        wavelengthVariation: 0.01,
        speed: 0.05,
        sizeChangeSpeed: 0.03,
        color: "#f9a8b4",
      },
      {
        y: canvas.height - 80,
        amplitude: 10,
        baseAmplitude: 20,
        amplitudeVariation: 15,
        wavelength: 0.02,
        baseWavelength: 0.02,
        wavelengthVariation: 0.008,
        speed: 0.02,
        sizeChangeSpeed: 0.01,
        color: "#ef4444",
      },
      {
        y: canvas.height - 40,
        amplitude: 10,
        baseAmplitude: 10,
        amplitudeVariation: 8,
        wavelength: 0.04,
        baseWavelength: 0.04,
        wavelengthVariation: 0.015,
        speed: 0.06,
        sizeChangeSpeed: 0.02,
        color: "#E30513",
      },
    ];

    let animationFrame: number;
    let time = 0;

    // Animation loop
    const animate = () => {
      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and filter disturbances WITHOUT using setState
      disturbancesRef.current = disturbancesRef.current
        .map((d) => ({
          ...d,
          radius: d.radius + 2, // Expand radius
          strength: d.strength * 0.95, // Decrease strength over time
          age: d.age + 1, // Increase age
        }))
        .filter((d) => d.strength > 1 && d.age < 60); // Remove old/weak disturbances

      // Draw each wave with varying sizes and disturbances
      waves.forEach((wave, waveIndex) => {
        // Update wave properties to create size variations
        wave.amplitude =
          wave.baseAmplitude +
          Math.sin(time * wave.sizeChangeSpeed) * wave.amplitudeVariation;
        wave.wavelength =
          wave.baseWavelength +
          Math.cos(time * wave.sizeChangeSpeed * 0.7) *
            wave.wavelengthVariation;

        ctx.fillStyle = wave.color;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        // Draw wave path with updated properties
        for (let x = 0; x <= canvas.width; x++) {
          // Base wave calculation
          const positionFactor = Math.sin(x * 0.005 + time * 0.02) * 0.3 + 1;
          let y =
            wave.y +
            Math.sin(x * wave.wavelength + time * wave.speed) *
              (wave.amplitude * positionFactor);

          // Apply disturbance effects
          disturbancesRef.current.forEach((d) => {
            const distance = Math.sqrt(
              Math.pow(x - d.x, 2) + Math.pow(y - d.y, 2)
            );
            if (distance < d.radius) {
              // Apply more effect to waves closer to the surface (higher index)
              const waveEffect = 1 + waveIndex * 0.5;
              // Calculate disturbance based on distance from center
              const disturbanceFactor =
                (1 - distance / d.radius) * d.strength * waveEffect;
              // Create a wave-like effect from the disturbance
              const disturbanceWave =
                Math.sin(distance * 0.1 - d.age * 0.1) * disturbanceFactor;
              y += disturbanceWave;
            }
          });

          ctx.lineTo(x, y);
        }

        // Complete the wave shape
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
      });

      // Update and draw explosions
      explosionsRef.current = explosionsRef.current
        .map((explosion) => {
          // Update particle positions and properties
          explosion.particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.07; // Gravity
            particle.opacity -= 0.01; // Fade out
            particle.size *= 0.98; // Shrink
          });

          // Draw particles
          explosion.particles.forEach((particle) => {
            if (particle.opacity > 0) {
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fillStyle = particle.color
                .replace(")", `, ${particle.opacity})`)
                .replace("rgb", "rgba");
              ctx.fill();
            }
          });

          return {
            ...explosion,
            age: explosion.age + 1,
            // Filter out invisible particles
            particles: explosion.particles.filter(
              (p) => p.opacity > 0 && p.size > 0.2
            ),
          };
        })
        .filter((explosion) => explosion.particles.length > 0);

      // Draw disturbance indicators (small circles)
      disturbancesRef.current.forEach((d) => {
        if (d.age < 10) {
          // Only show indicator briefly
          ctx.beginPath();
          ctx.arc(d.x, d.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, " + (0.7 - d.age / 10) + ")";
          ctx.fill();
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="top-0 left-0 w-full h-full cursor-pointer"
      />
    </>
  );
}
