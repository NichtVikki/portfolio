import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Engine } from "@tsparticles/engine";

interface ConfettiProps {
  isExploded: boolean;
}

export default function ParticlesEffect({ isExploded }: ConfettiProps) {
  const [opacity, setOpacity] = useState(0);
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  useEffect(() => {
    if (isExploded) {
      setOpacity(1);
      
      // Fade particles after a few seconds
      const timer = setTimeout(() => {
        setOpacity(0.2);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isExploded]);

  if (!init) return null;

  return (
    <div 
      className="w-full h-full" 
      style={{ 
        position: "absolute", 
        top: 0, 
        left: 0, 
        opacity: opacity,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      <Particles
        id="tsparticles"
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } },
          fpsLimit: 120,
          particles: {
            color: {
              value: ["#ca50ff", "#ff44bd", "#bd00ff", "#7000ff", "#ff00c8"]
            },
            links: { enable: false },
            move: {
              enable: true,
              random: true,
              speed: 3,
              direction: "none",
              outModes: "out"
            },
            number: {
              value: 160
            },
            opacity: {
              value: { min: 0.3, max: 0.8 }
            },
            shape: {
              type: ["circle", "triangle", "star"]
            },
            size: {
              value: { min: 1, max: 6 }
            }
          },
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push"
              },
              onHover: {
                enable: true,
                mode: "repulse"
              }
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 100, duration: 0.4 }
            }
          },
          detectRetina: true
        }}
      />
    </div>
  );
} 