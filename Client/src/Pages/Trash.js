import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera, Sky, Clouds, Cloud } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';

const SETTINGS = {
  speed: 0.45,
  trackWidth: 10,
  jumpForce: 0.16,   // Initial pop
  gravity: -0.015,   // Stronger pull (was -0.009)
  skyColor: '#e0f7ff',
  worldLength: 300,
};

// --- COIN COMPONENT ---
// --- PRE-DEFINED GEOMETRIES FOR PERFORMANCE ---
const coinGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 24);
const edgeGeom = new THREE.TorusGeometry(0.5, 0.05, 12, 32);
const starGeom = new THREE.OctahedronGeometry(0.3, 0); // Octahedron looks like a sharp 3D star/diamond
const rimGeom = new THREE.TorusGeometry(0.42, 0.02, 8, 32);

const goldMat = new THREE.MeshStandardMaterial({ 
  color: "#FFD700", 
  metalness: 1, 
  roughness: 0.2, 
  emissive: "#FF8C00", 
  emissiveIntensity: 0.4 
});

const starMat = new THREE.MeshStandardMaterial({ 
  color: "#FFFFFF", 
  emissive: "#FFF", 
  emissiveIntensity: 1,
  metalness: 1
});

function Coin({ position, onCollect }) {
  const ref = useRef();
  const [collected, setCollected] = useState(false);
  const randomOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    
    if (!ref.current || collected) return;

    const time = state.clock.getElapsedTime();

    // 1. Animation: Rotation & Floating
    ref.current.rotation.y += 0.06;
    ref.current.position.y = position[1] + Math.sin(time * 2 + randomOffset) * 0.15;

    // 2. World Movement
    ref.current.position.z += SETTINGS.speed;
    if (ref.current.position.z > 20) {
      ref.current.position.z = -SETTINGS.worldLength;
      setCollected(false);
    }

    // 3. Collision Logic
    const playerPos = state.scene.getObjectByName("playerGroup")?.position;
    if (playerPos && Math.abs(ref.current.position.z - playerPos.z) < 1) {
      if (ref.current.position.distanceTo(playerPos) < 1.6) {
        setCollected(true);
        onCollect();
      }
    }
  });

  if (collected) return null;

  return (
    <group ref={ref} position={position}>
      {/* Main Coin Body */}
      <mesh geometry={coinGeom} material={goldMat} rotation={[0, 0, Math.PI / 2]} castShadow />
      
      {/* Rounded Outer Edge */}
      <mesh geometry={edgeGeom} material={goldMat} rotation={[0, Math.PI / 2, 0]} />

      {/* Decorative Rims on faces */}
      <mesh geometry={rimGeom} material={goldMat} position={[0.07, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <mesh geometry={rimGeom} material={goldMat} position={[-0.07, 0, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* The "Star" - Front Side */}
      <mesh geometry={starGeom} material={starMat} position={[0.08, 0, 0]} scale={[0.3, 1, 1]} />
      
      {/* The "Star" - Back Side */}
      <mesh geometry={starGeom} material={starMat} position={[-0.08, 0, 0]} scale={[0.3, 1, 1]} />
    </group>
  );
}

// --- BUS COMPONENT ---
const busBodyGeo = new THREE.BoxGeometry(2.5, 1.8, 8);
const busBodyMat = new THREE.MeshStandardMaterial({ color: '#1a1a1a', metalness: 0.5, roughness: 0.2 });
const lightMat = new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#00ffff', emissiveIntensity: 5 });

function Bus({ initialZ, lane = 0 }) {
  const mesh = useRef();
  
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.position.z += (SETTINGS.speed + 0.1) * (delta * 60);
      if (mesh.current.position.z > 20) {
        mesh.current.position.z = -SETTINGS.worldLength;
      }
    }
  });

  return (
    <group ref={mesh} position={[lane * 3.5, 0, initialZ]}>
      <mesh geometry={busBodyGeo} material={busBodyMat} position={[0, 1.2, 0]} castShadow />
      <mesh position={[0, 1.6, 3.8]}>
        <boxGeometry args={[2.3, 0.8, 0.5]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.8, 0.7, 4.01]} geometry={new THREE.BoxGeometry(0.6, 0.3, 0.1)} material={lightMat} />
      <mesh position={[0, 0.7, 4.01]} geometry={new THREE.BoxGeometry(0.6, 0.3, 0.1)} material={lightMat} />
    </group>
  );
}

// --- RURAL COMPONENTS ---
function Hut({ initialZ, side = 1 }) {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) {
      mesh.current.position.z += SETTINGS.speed;
      if (mesh.current.position.z > 20) mesh.current.position.z = -SETTINGS.worldLength + 20;
    }
  });
  return (
    <group ref={mesh} position={[side * 10, 0, initialZ]}>
      <mesh position={[0, 1.5, 0]} castShadow><boxGeometry args={[4, 3, 4]} /><meshStandardMaterial color="#8B4513" /></mesh>
      <mesh position={[0, 4, 0]} castShadow><coneGeometry args={[3.5, 2, 4]} /><meshStandardMaterial color="#C2B280" /></mesh>
    </group>
  );
}

function FarmPlot({ initialZ, side = 1 }) {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) {
      mesh.current.position.z += SETTINGS.speed;
      if (mesh.current.position.z > 20) mesh.current.position.z = -SETTINGS.worldLength + 20;
    }
  });
  return (
    <mesh ref={mesh} position={[side * 15, 0.05, initialZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} /><meshStandardMaterial color="#355E3B" />
    </mesh>
  );
}

// --- URBAN BUILDING ---
function Building({ initialZ, side = 1 }) {
  const mesh = useRef();
  const { height, width, depth, color, windows } = useMemo(() => {
    const h = 12 + Math.random() * 25;
    const w = 5 + Math.random() * 4;
    const d = 5 + Math.random() * 4;
    const urbanColors = ['#2c3e50', '#4a4a4a', '#7f8c8d', '#5d4037', '#232b2b'];
    const pickedColor = urbanColors[Math.floor(Math.random() * urbanColors.length)];
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 128, 256);
    for (let y = 10; y < 240; y += 24) {
      for (let x = 15; x < 110; x += 30) {
        if (Math.random() > 0.4) {
          ctx.fillStyle = Math.random() > 0.5 ? '#ffd27d' : '#82ccdd';
          ctx.fillRect(x, y, 18, 16);
        }
      }
    }
    return { height: h, width: w, depth: d, color: pickedColor, windows: new THREE.CanvasTexture(canvas) };
  }, []);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.position.z += SETTINGS.speed;
      if (mesh.current.position.z > 20) mesh.current.position.z = -SETTINGS.worldLength + 20;
    }
  });

  return (
    <group ref={mesh} position={[side * (SETTINGS.trackWidth / 2 + width / 2 + 2), 0, initialZ]}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} emissiveMap={windows} emissiveIntensity={1.2} emissive="#fff" />
      </mesh>
    </group>
  );
}

function World() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <React.Fragment key={`city-${i}`}>
          <Building initialZ={i * -15} side={-1} /><Building initialZ={i * -15} side={1} />
        </React.Fragment>
      ))}
      {Array.from({ length: 10 }).map((_, i) => {
        const zPos = -150 + i * -15;
        return (
          <React.Fragment key={`farm-${i}`}>
            <Hut initialZ={zPos} side={-1} /><FarmPlot initialZ={zPos} side={1} />
          </React.Fragment>
        );
      })}
    </>
  );
}

function RacingTrack() {
  const trackTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#222'; ctx.fillRect(0, 0, 512, 1024);
    ctx.fillStyle = '#888'; ctx.fillRect(0, 0, 60, 1024); ctx.fillRect(452, 0, 60, 1024);
    ctx.setLineDash([40, 40]); ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(256, 0); ctx.lineTo(256, 1024); ctx.stroke();
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1, 15);
    return tex;
  }, []);

  useFrame((state, delta) => { trackTexture.offset.y -= SETTINGS.speed * delta * 15; });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[14, 500]} />
      <meshStandardMaterial map={trackTexture} roughness={0.9} />
    </mesh>
  );
}

function CloudSystem() {
  const group = useRef();
  useFrame(() => {
    if (group.current) {
      group.current.position.z += SETTINGS.speed * 0.4;
      if (group.current.position.z > 50) group.current.position.z = -150;
    }
  });
  return (
    <group ref={group}>
      <Clouds material={THREE.MeshLambertMaterial}>
        <Cloud segments={20} bounds={[10, 2, 2]} volume={6} color="#ffffff" position={[0, 20, -100]} />
      </Clouds>
    </group>
  );
}

function Player() {
  const group = useRef();
  
  // 1. Load animations
  const runFbx = useLoader(FBXLoader, '/models/Running.fbx');
  const jumpFbx = useLoader(FBXLoader, '/models/jump.fbx');
  
  const mixer = useRef();
  const actions = useRef({});
  const [isJumping, setIsJumping] = useState(false);
  
  // --- LANE LOGIC ---
  // Lanes: -1 (Left), 0 (Center), 1 (Right)
  const [lane, setLane] = useState(0); 
  const laneWidth = 2.5; // Matches your track/bus spacing
  
  const velocity = useRef(0);
  const keys = useRef({});
  const touchStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    mixer.current = new THREE.AnimationMixer(runFbx);
    
    if (runFbx.animations.length > 0) {
      const runClip = runFbx.animations[0];
      runClip.tracks = runClip.tracks.filter((t) => !t.name.includes('position'));
      actions.current.run = mixer.current.clipAction(runClip);
      actions.current.run.play();
    }

    if (jumpFbx.animations.length > 0) {
      const jumpClip = jumpFbx.animations[0];
      jumpClip.tracks = jumpClip.tracks.filter((t) => !t.name.includes('position'));
      actions.current.jump = mixer.current.clipAction(jumpClip);
      actions.current.jump.setLoop(THREE.LoopOnce);
      actions.current.jump.clampWhenFinished = true;
    }

    const triggerJump = () => {
      if (group.current.position.y <= 0.51) {
        velocity.current = SETTINGS.jumpForce;
        setIsJumping(true);
        actions.current.run?.fadeOut(0.2);
        actions.current.jump?.reset().fadeIn(0.2).play();
      }
    };

    // --- UPDATED INPUT HANDLERS ---
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') setLane(prev => Math.max(prev - 1, -1));
      if (e.code === 'ArrowRight' || e.code === 'KeyD') setLane(prev => Math.min(prev + 1, 1));
      if (e.code === 'Space' || e.code === 'ArrowUp') triggerJump();
    };

    const handleTouchStart = (e) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

   const handleTouchEnd = (e) => {
  const dx = e.changedTouches[0].clientX - touchStart.current.x;
  const dy = e.changedTouches[0].clientY - touchStart.current.y;

  // Swipe sensitivity threshold
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
    if (dx > 0) {
      // Right swipe: Increment lane, max 1
      setLane(prev => Math.min(prev + 1, 1));
    } else {
      // Left swipe: Decrement lane, min -1
      setLane(prev => Math.max(prev - 1, -1));
    }
  } else if (dy < -30) {
    triggerJump();
  }
};

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [runFbx, jumpFbx]);

  useFrame((state, delta) => {
    if (!group.current) return;
    mixer.current?.update(delta);

    // --- SMOOTH LANE TRANSITION ---
    // Calculate target X based on current lane
    const targetX = lane * laneWidth;
    // Lerp (Linear Interpolation) for smooth side-to-side movement
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x, 
      targetX, 
      0.15 // Speed of the side-step
    );

    // Gravity Logic
    velocity.current += SETTINGS.gravity;
    group.current.position.y += velocity.current;

    if (group.current.position.y < 0.5) {
      group.current.position.y = 0.5;
      velocity.current = 0;
      if (isJumping) {
        setIsJumping(false);
        actions.current.jump?.fadeOut(0.2);
        actions.current.run?.reset().fadeIn(0.2).play();
      }
    }
  });

  return (
    <group ref={group} name="playerGroup" position={[0, 0.5, 0]}>
      <primitive object={runFbx} scale={0.01} rotation={[0, Math.PI, 0]} castShadow />
    </group>
  );
}
export default function Demo() {
  const [score, setScore] = useState(0);
  
  // Generate a set of coin positions
// Inside export default function Demo()
const coinPositions = useMemo(() => {
  const lanes = [-2.5, 0, 2.5]; // Must match (lane * laneWidth)
  return Array.from({ length: 40 }).map((_, i) => [
    lanes[Math.floor(Math.random() * 3)], // Pick a real lane X
    1,                                    // Height
    -20 - i * 10                          // Z spacing
  ]);
}, []);
  return (
    <div style={{ width: '100vw', height: '100vh', background: SETTINGS.skyColor, position: 'relative' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 6, 12]} fov={45} />
        <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={2} />

        <CloudSystem />
        <World />

        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
        <fog attach="fog" args={[SETTINGS.skyColor, 30, 150]} />

        <RacingTrack />
        <Player />
        
        {/* Render Coins */}
        {coinPositions.map((pos, idx) => (
          <Coin key={idx} position={pos} onCollect={() => setScore(s => s + 1)} />
        ))}

        <Bus initialZ={-80} lane={-1} />
        <Bus initialZ={-200} lane={1} />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute', top: '5%', width: '100%', textAlign: 'center',
        color: '#222', fontFamily: 'Impact', pointerEvents: 'none',
      }}>
        <h1 style={{ fontSize: '3rem', margin: 0, textShadow: '2px 2px #fff' }}>METRO TO MEADOW</h1>
        <h2 style={{ fontSize: '2rem', color: '#ffd700', textShadow: '1px 1px #000' }}>COINS: {score}</h2>
      </div>
    </div>
  );
}