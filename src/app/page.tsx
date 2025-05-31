"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import LoadingAnimation from '@/components/LoadingAnimation';

// Dynamically import the Scene component with no SSR
// This is important for Three.js which requires the browser environment
const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => null, // No loading indicator to avoid flash
});

export default function Home() {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [orbPosition, setOrbPosition] = useState({ x: 0, y: 0 });
  const [transitionState, setTransitionState] = useState({
    active: false,
    phase: 'orb' // 'orb', 'expanding', 'scene'
  });
  
  // Preload the scene component immediately
  const [sceneLoaded, setSceneLoaded] = useState(false);
  useEffect(() => {
    // Start loading the scene in the background immediately
    setSceneLoaded(true);
  }, []);
  
  const handleAnimationComplete = (position: { x: number, y: number }) => {
    // Store orb position for the transition
    setOrbPosition(position);
    
    // Start the transition
    setTransitionState({
      active: true,
      phase: 'expanding'
    });
    
    // Make the scene visible immediately as the fluid transition starts
    // This ensures there's no gap between transition and scene
    setIsAnimationComplete(true);
    
    // After a short delay, start fading out the overlay
    setTimeout(() => {
      setTransitionState({
        active: true,
        phase: 'scene'
      });
    }, 800);
  };
  
  return (
    <>
      {/* Always load the scene in the background, just with opacity 0 until needed */}
      <div 
        className="fixed inset-0 z-10"
        style={{
          opacity: isAnimationComplete ? 1 : 0,
          transition: 'opacity 1s ease-in',
        }}
      >
        {sceneLoaded && <Scene />}
      </div>
      
      {/* Loading animation layer */}
      {!isAnimationComplete && (
        <div className="fixed inset-0 z-30">
          <LoadingAnimation onComplete={handleAnimationComplete} />
        </div>
      )}
      
      {/* Fluid overlay from orb */}
      {transitionState.active && (
        <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden">
          {/* Main blob */}
          <div 
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${orbPosition.x}px`,
              top: `${orbPosition.y}px`,
              width: transitionState.phase === 'expanding' ? '300vmax' : '0vmax',
              height: transitionState.phase === 'expanding' ? '300vmax' : '0vmax',
              background: `radial-gradient(circle, #714DD7 0%, #714DD7 80%, transparent 100%)`,
              borderRadius: '50%',
              filter: 'blur(30px)',
              opacity: transitionState.phase === 'scene' ? 0 : 0.9,
              transition: `
                width 1.8s cubic-bezier(0.22, 1, 0.36, 1), 
                height 1.8s cubic-bezier(0.22, 1, 0.36, 1),
                opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1)
              `,
            }}
          />
          
          {/* Secondary blobs for fluid effect */}
          <div 
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${orbPosition.x + 100}px`,
              top: `${orbPosition.y - 50}px`,
              width: transitionState.phase === 'expanding' ? '200vmax' : '0vmax',
              height: transitionState.phase === 'expanding' ? '200vmax' : '0vmax',
              background: `radial-gradient(circle, #714DD7 0%, #714DD7 60%, transparent 100%)`,
              borderRadius: '50%',
              filter: 'blur(40px)',
              opacity: transitionState.phase === 'scene' ? 0 : 0.7,
              transition: `
                width 1.4s cubic-bezier(0.34, 1.56, 0.64, 1), 
                height 1.4s cubic-bezier(0.34, 1.56, 0.64, 1),
                opacity 1s cubic-bezier(0.22, 1, 0.36, 1)
              `,
              transitionDelay: '0.1s',
            }}
          />
          
          <div 
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${orbPosition.x - 80}px`,
              top: `${orbPosition.y + 70}px`,
              width: transitionState.phase === 'expanding' ? '250vmax' : '0vmax',
              height: transitionState.phase === 'expanding' ? '250vmax' : '0vmax',
              background: `radial-gradient(circle, #714DD7 0%, #714DD7 70%, transparent 100%)`,
              borderRadius: '50%',
              filter: 'blur(35px)',
              opacity: transitionState.phase === 'scene' ? 0 : 0.8,
              transition: `
                width 1.6s cubic-bezier(0.22, 1, 0.36, 1), 
                height 1.6s cubic-bezier(0.22, 1, 0.36, 1),
                opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1)
              `,
              transitionDelay: '0.05s',
            }}
          />
        </div>
      )}
    </>
  );
}
