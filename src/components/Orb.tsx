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
  const [frozen, setFrozen] = useState(false);
  const [distortLevel, setDistortLevel] = useState(0.3);
  const [metalness, setMetalness] = useState(0.9);
  const [roughness, setRoughness] = useState(0.1);
  const [emissiveIntensity, setEmissiveIntensity] = useState(0.5);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const animatingRef = useRef(false);
  const [exploding, setExploding] = useState(false);
  const initialScaleRef = useRef({ x: 1, y: 1, z: 1 });

  const { camera, size } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const desiredPixelSize = 500; // diameter in px
  const baseWorldRadius = 1.2;

  // Animate the orb
  useFrame((state) => {
    if (!clicked && !frozen && meshRef.current) {
      // Keep the orb's projected size at 500px
      const vector = meshRef.current.position.clone();
      vector.project(camera);
      const distance = camera.position.distanceTo(meshRef.current.position);
      const vFOV = (perspectiveCamera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFOV / 2) * distance;
      const worldPerPixel = visibleHeight / size.height;
      const targetWorldRadius = (desiredPixelSize * worldPerPixel) / 2;
      meshRef.current.scale.setScalar(targetWorldRadius / baseWorldRadius);
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
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
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  const handleClick = () => {
    if (!clicked && !animatingRef.current && meshRef.current) {
      // Lock the scale and freeze before any animation
      setClicked(true);
      setFrozen(true);
      animatingRef.current = true;
      setExploding(true);

      // Store the initial scale at the moment of click
      const currentScale = {
        x: meshRef.current.scale.x,
        y: meshRef.current.scale.y,
        z: meshRef.current.scale.z
      };
      initialScaleRef.current = currentScale;
      meshRef.current.scale.set(currentScale.x, currentScale.y, currentScale.z);

      // Calculate the world radius needed to cover the screen diagonal
      const distance = camera.position.distanceTo(meshRef.current.position);
      const vFOV = (perspectiveCamera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFOV / 2) * distance;
      const visibleWidth = visibleHeight * (size.width / size.height);
      const screenDiagonal = Math.sqrt(visibleWidth ** 2 + visibleHeight ** 2);
      // Add a buffer so the orb always covers the corners
      const buffer = 1.12; // 12% extra
      const neededWorldRadius = (screenDiagonal / 2) * buffer;
      let targetScale = neededWorldRadius / baseWorldRadius;
      // Clamp so the orb never engulfs the camera (surface stays at least margin in front of near plane)
      const margin = 0.15; // 15% of the distance between near and orb
      const minSurfaceDist = perspectiveCamera.near + (distance - perspectiveCamera.near) * margin;
      const maxSafeRadius = distance - minSurfaceDist;
      const maxSafeScale = maxSafeRadius / baseWorldRadius;
      if (targetScale > maxSafeScale) targetScale = maxSafeScale;
      // If targetScale is negative or zero, clamp to current scale
      if (targetScale <= 0) targetScale = Math.max(currentScale.x, 1);

      // Create tweens
      const distortTween = { value: distortLevel };
      const materialTween = { metalness, roughness };
      const emissiveTween = { value: emissiveIntensity };

      const timeline = gsap.timeline({
        defaults: { ease: "sine.inOut" },
        onComplete: () => {
          if (meshRef.current) {
            meshRef.current.visible = false;
          }
          animatingRef.current = false;
          setExploding(false);
        }
      });
      timelineRef.current = timeline;

      // Animate from the current scale to the target scale (absolute, not relative)
      timeline.to(meshRef.current.scale, {
        x: targetScale,
        y: targetScale * 0.97,
        z: targetScale * 1.04,
        duration: 2.5,
        ease: "sine.inOut"
      });
      // Animate distortion and material
      timeline.to(distortTween, {
        value: 1.2,
        duration: 2.5,
        ease: "sine.inOut",
        onUpdate: () => setDistortLevel(distortTween.value)
      }, 0);
      timeline.to(materialTween, {
        metalness: 0.4,
        roughness: 0.5,
        duration: 2.5,
        ease: "sine.inOut",
        onUpdate: () => {
          setMetalness(materialTween.metalness);
          setRoughness(materialTween.roughness);
        }
      }, 0);
      timeline.to(emissiveTween, {
        value: 1.2,
        duration: 2.5,
        ease: "sine.inOut",
        onUpdate: () => setEmissiveIntensity(emissiveTween.value),
        onComplete: () => {
          onExplode();
        }
      }, 0);
      // Fade out
      timeline.to(emissiveTween, {
        value: 0,
        duration: 1.2,
        ease: "sine.out",
        onUpdate: () => setEmissiveIntensity(emissiveTween.value)
      });
      timeline.to(materialTween, {
        metalness: 0.1,
        roughness: 0.7,
        duration: 1.2,
        ease: "sine.out",
        onUpdate: () => {
          setMetalness(materialTween.metalness);
          setRoughness(materialTween.roughness);
        }
      }, "+=0");
    }
  };

  return (
    <Sphere
      args={[baseWorldRadius, 64, 64]}
      ref={meshRef}
      onClick={handleClick}
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
        emissiveIntensity={emissiveIntensity}
      />
    </Sphere>
  );
}