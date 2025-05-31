"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import LoadingAnimation from '@/components/LoadingAnimation';

// Dynamically import the Scene component with no SSR
// This is important for Three.js which requires the browser environment
const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
});

export default function Home() {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [orbPosition, setOrbPosition] = useState({ x: 0, y: 0 });
  const [transitionState, setTransitionState] = useState({
    active: false,
    progress: 0,
    phase: 'orb' // 'orb', 'expanding', 'scene'
  });
  
  const handleAnimationComplete = (position: { x: number, y: number }) => {
    // Store orb position for the transition
    setOrbPosition(position);
    
    // Start the transition
    setTransitionState({
      active: true,
      progress: 0,
      phase: 'expanding'
    });
    
    // After a short delay to ensure smooth animation flow
    setTimeout(() => {
      // Show main scene, but keep the purple overlay
      setIsAnimationComplete(true);
      
      // Allow a brief moment for the scene to render behind the overlay
      setTimeout(() => {
        // Now gradually fade out the purple overlay
        setTransitionState(prev => ({
          ...prev,
          phase: 'scene'
        }));
      }, 200);
    }, 800);
  };
  
  return (
    <>
      {/* Loading animation layer */}
      {!isAnimationComplete && (
        <div className="fixed inset-0 z-30">
          <LoadingAnimation onComplete={handleAnimationComplete} />
        </div>
      )}
      
      {/* Purple fluid overlay that expands from orb position */}
      {transitionState.active && (
        <div 
          className="fixed inset-0 z-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${orbPosition.x}px ${orbPosition.y}px, #714DD7 0%, #714DD7 100%)`,
            opacity: transitionState.phase === 'scene' ? 0 : 1,
            transition: 'opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      )}
      
      {/* Scene that emerges as the overlay fades */}
      <div 
        className="fixed inset-0 z-10"
        style={{
          opacity: isAnimationComplete ? 1 : 0,
          transition: 'opacity 0.5s ease-in',
        }}
      >
        <Scene />
      </div>
    </>
  );
}
