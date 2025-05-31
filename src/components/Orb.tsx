import { useState, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

interface OrbProps {
  onExplode: () => void;
}

export default function Orb({ onExplode }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [distortLevel, setDistortLevel] = useState(0.3);
  const [metalness, setMetalness] = useState(0.9);
  const [roughness, setRoughness] = useState(0.1);

  const { camera, size } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const desiredPixelSize = 500; // diameter in px

  // Use a fixed world radius for the geometry
  const baseWorldRadius = 1.2;

  // Animate the orb
  useFrame((state) => {
    if (!clicked && meshRef.current) {
      // Keep the orb's projected size at 500px
      // Project the orb's position to screen space
      const vector = meshRef.current.position.clone();
      vector.project(camera);

      // Calculate distance from camera to orb
      const distance = camera.position.distanceTo(meshRef.current.position);

      // Calculate visible height at that distance
      const vFOV = (perspectiveCamera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFOV / 2) * distance;
      const worldPerPixel = visibleHeight / size.height;
      const targetWorldRadius = (desiredPixelSize * worldPerPixel) / 2;

      // Set the scale so the sphere appears as 500px diameter
      meshRef.current.scale.setScalar(targetWorldRadius / baseWorldRadius);

      // Animate rotation
      meshRef.current.rotation.x =
        Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
      meshRef.current.rotation.y += 0.003;
    }
  });

  // Handle hover/click/explode
  useEffect(() => {
    if (hovered && !clicked) {
      document.body.style.cursor = "pointer";
      if (meshRef.current) {
        gsap.to(meshRef.current.scale, {
          x: meshRef.current.scale.x * 1.1,
          y: meshRef.current.scale.y * 1.1,
          z: meshRef.current.scale.z * 1.1,
          duration: 0.8,
          ease: "power2.out"
        });
        gsap.to(meshRef.current.rotation, {
          y: meshRef.current.rotation.y + 0.3,
          duration: 0.8,
        });
      }
      
      // Animate distortLevel with GSAP for smoother transition
      const distortTween = { value: distortLevel };
      gsap.to(distortTween, {
        value: 0.5,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => setDistortLevel(distortTween.value),
      });
    } else {
      document.body.style.cursor = "auto";
      if (!clicked && meshRef.current) {
        gsap.to(meshRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.8,
          ease: "power2.out"
        });
      }
      if (!clicked) {
        // Animate distortLevel back with GSAP
        const distortTween = { value: distortLevel };
        gsap.to(distortTween, {
          value: 0.3,
          duration: 0.8,
          ease: "power2.out",
          onUpdate: () => setDistortLevel(distortTween.value),
        });
      }
    }
  }, [hovered, clicked, distortLevel]);

  useEffect(() => {
    if (clicked && meshRef.current) {
      // Set metalness to 0 and increase roughness when exploding
      const materialTween = { metalness: 0.9, roughness: 0.1 };
      gsap.to(materialTween, {
        metalness: 0,
        roughness: 0.5,
        duration: 0.3,
        onUpdate: () => {
          setMetalness(materialTween.metalness);
          setRoughness(materialTween.roughness);
        }
      });

      // Phase 1: Initial expansion
      gsap.to(meshRef.current.scale, {
        x: meshRef.current.scale.x * 3.0,
        y: meshRef.current.scale.y * 3.0,
        z: meshRef.current.scale.z * 3.0,
        duration: 0.3,
        ease: "power1.inOut",
      });

      // Animate distort level
      const distortTween = { value: distortLevel };
      gsap.to(distortTween, {
        value: 1.2,
        duration: 0.3,
        onUpdate: () => setDistortLevel(distortTween.value),
      });

      // Phase 2: Violent distortion before collapse
      const distortTween2 = { value: 1.2 };
      gsap
        .timeline({ delay: 0.4 })
        .to(distortTween2, {
          value: 2.5,
          duration: 0.4,
          onUpdate: () => setDistortLevel(distortTween2.value),
        })
        .to(meshRef.current.scale, {
          x: meshRef.current.scale.x * 5.0,
          y: meshRef.current.scale.y * 5.0,
          z: meshRef.current.scale.z * 5.0,
          duration: 0.3,
          ease: "power2.out",
        })
        .to(meshRef.current.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.6,
          delay: 0.2,
          ease: "power4.in",
          onComplete: () => {
            onExplode();
            if (meshRef.current) {
              meshRef.current.visible = false;
            }
          },
        });
    }
  }, [clicked, onExplode, distortLevel]);

  return (
    <Sphere
      args={[baseWorldRadius, 64, 64]}
      ref={meshRef}
      onClick={() => !clicked && setClicked(true)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <MeshDistortMaterial
        color={"#714DD7"}
        attach="material"
        distort={distortLevel}
        speed={4}
        roughness={roughness}
        metalness={metalness}
        emissive={"#714DD7"}
        emissiveIntensity={clicked ? 1 : 0.5}
      />
    </Sphere>
  );
}