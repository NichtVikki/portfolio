import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Orb from './Orb';

interface LoadingAnimationProps {
  onComplete: (position: { x: number, y: number }) => void;
}

export default function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [isInitialAnimation, setIsInitialAnimation] = useState(true);
  const [isOrbVisible, setIsOrbVisible] = useState(false);
  const [lines, setLines] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const orbContainerRef = useRef<HTMLDivElement>(null);
  
  // Create the pull-in line effect
  useEffect(() => {
    const lineCount = 30;
    const newLines = [];
    
    for (let i = 0; i < lineCount; i++) {
      const angle = (Math.PI * 2 * i) / lineCount;
      const length = Math.random() * 50 + 50; // Line length between 50-100% of max
      
      // Random starting position on the edge of the screen
      const startX = Math.cos(angle) * window.innerWidth;
      const startY = Math.sin(angle) * window.innerHeight;
      
      // Mid point is 60% of the way to center
      const midX = startX * 0.4;
      const midY = startY * 0.4;
      
      // Calculate direction for gradient
      let direction = 'right';
      if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
        direction = Math.cos(angle) > 0 ? 'left' : 'right';
      } else {
        direction = Math.sin(angle) > 0 ? 'top' : 'bottom';
      }
      
      // Calculate width and height based on angle
      const isVertical = Math.abs(Math.sin(angle)) > Math.abs(Math.cos(angle));
      const width = isVertical ? Math.random() * 2 + 1 : length;
      const height = isVertical ? length : Math.random() * 2 + 1;
      
      // Calculate delay for staggered effect
      const delay = Math.random() * 0.5;
      
      newLines.push({
        id: i,
        style: {
          width: `${width}%`,
          height: `${height}%`,
          left: `${50 + Math.cos(angle) * 50}%`,
          top: `${50 + Math.sin(angle) * 50}%`,
          transform: `translate(-50%, -50%) rotate(${angle}rad)`,
          '--direction': direction,
          '--start-x': `${startX}px`,
          '--start-y': `${startY}px`,
          '--mid-x': `${midX}px`,
          '--mid-y': `${midY}px`,
          animationDelay: `${delay}s`,
        } as React.CSSProperties,
      });
    }
    
    setLines(newLines);
    
    // After initial animation, show the orb
    animationTimeoutRef.current = setTimeout(() => {
      setIsOrbVisible(true);
    }, 1500);
    
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);
  
  const handleOrbExplode = () => {
    // Get the current position of the orb container for the transition origin
    const rect = orbContainerRef.current?.getBoundingClientRect();
    const position = {
      x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
      y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
    };
    
    // When orb explodes, transition to main content
    setIsInitialAnimation(false);
    
    // Pass the position to the parent component
    onComplete(position);
  };
  
  return (
    <div 
      className="loading-container"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0a0c',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      <div className="pull-lines">
        {lines.map(line => (
          <div 
            key={line.id} 
            className="pull-line"
            style={line.style}
          />
        ))}
      </div>
      
      {isOrbVisible && (
        <div 
          ref={orbContainerRef}
          className="orb-container"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100vw',
            height: '100vh',
            opacity: isOrbVisible ? 1 : 0,
            transition: 'opacity 1s ease-out',
            zIndex: 101
          }}
        >
          <Canvas 
            camera={{ position: [0, 0, 3.5], fov: 45 }}
            style={{ overflow: 'visible' }}
          >
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <Orb onExplode={handleOrbExplode} />
            <OrbitControls 
              enableZoom={false}
              enablePan={true}
              rotateSpeed={0.5}
              autoRotate
              autoRotateSpeed={0.5}
            />
            <Environment preset="night" />
          </Canvas>
        </div>
      )}
    </div>
  );
} 