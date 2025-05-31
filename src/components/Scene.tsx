import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import PortfolioContent from './PortfolioContent';

// Background scene component with more visual elements
function EnhancedBackground() {
  const { scene } = useThree();
  const particlesRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    // Create a particle system
    const particleCount = 800;
    const particles = new THREE.Group();
    
    // Create particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Create a field of particles, more on the right side
      const radius = 10 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      // Bias towards right side (positive x values)
      const phi = Math.acos((Math.random() * 1.5) - 0.5);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      sizes[i] = Math.random() * 3 + 1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x714DD7,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(geometry, material);
    particles.add(particleSystem);
    
    scene.add(particles);
    
    if (particlesRef.current) {
      particlesRef.current = particles;
    }
    
    // Cleanup
    return () => {
      scene.remove(particles);
      geometry.dispose();
      material.dispose();
    };
  }, [scene]);
  
  // Rotation animation
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      // Slower, more subtle rotation
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      particlesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.1;
    }
  });
  
  return null;
}

export default function Scene() {
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  
  useEffect(() => {
    // Preload the scene
    setSceneLoaded(true);
    
    // Trigger the content animation with a slight delay
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <div className="canvas-container fixed inset-0 -z-10">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={['#111111']} />
          <ambientLight intensity={0.4} />
          <EnhancedBackground />
          <Stars
            radius={50}
            depth={50}
            count={1000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            autoRotate
            autoRotateSpeed={0.1}
          />
        </Canvas>
      </div>
      <div className={`relative z-10 ${contentVisible ? 'spurt-animation' : 'opacity-0'}`}>
        {sceneLoaded && <PortfolioContent />}
      </div>
    </>
  );
} 