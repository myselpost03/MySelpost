import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera, Sky, Clouds, Cloud } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';

const SETTINGS = {
  speed: 0.2,
  trackWidth: 10,
  jumpForce: 0.16, // Initial pop
  gravity: -0.015, // Stronger pull (was -0.009)
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
  color: '#FFD700',
  metalness: 1,
  roughness: 0.2,
  emissive: '#FF8C00',
  emissiveIntensity: 0.4,
});

const starMat = new THREE.MeshStandardMaterial({
  color: '#FFFFFF',
  emissive: '#FFF',
  emissiveIntensity: 1,
  metalness: 1,
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
    ref.current.position.y =
      position[1] + Math.sin(time * 2 + randomOffset) * 0.15;

    // 2. World Movement
    ref.current.position.z += SETTINGS.speed;
    if (ref.current.position.z > 20) {
      ref.current.position.z = -SETTINGS.worldLength;
      setCollected(false);
    }

    // 3. Collision Logic
    const playerPos = state.scene.getObjectByName('playerGroup')?.position;
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
      <mesh
        geometry={coinGeom}
        material={goldMat}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      />

      {/* Rounded Outer Edge */}
      <mesh
        geometry={edgeGeom}
        material={goldMat}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Decorative Rims on faces */}
      <mesh
        geometry={rimGeom}
        material={goldMat}
        position={[0.07, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <mesh
        geometry={rimGeom}
        material={goldMat}
        position={[-0.07, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* The "Star" - Front Side */}
      <mesh
        geometry={starGeom}
        material={starMat}
        position={[0.08, 0, 0]}
        scale={[0.3, 1, 1]}
      />

      {/* The "Star" - Back Side */}
      <mesh
        geometry={starGeom}
        material={starMat}
        position={[-0.08, 0, 0]}
        scale={[0.3, 1, 1]}
      />
    </group>
  );
}

// --- GEOMETRIES (reused for performance) ---
const busBodyGeo = new THREE.BoxGeometry(2.8, 2.2, 8);
const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 12);
const bumperGeo = new THREE.BoxGeometry(2.9, 0.3, 0.5);
const sideWindowGeo = new THREE.BoxGeometry(2.85, 0.7, 7.5);
const frontWindshieldGeo = new THREE.BoxGeometry(2.5, 0.9, 0.5);
const headLightGeo = new THREE.SphereGeometry(0.2, 8, 8);

// --- MATERIALS ---
const busMat = new THREE.MeshStandardMaterial({
  color: '#c0392b',
  metalness: 0.6,
  roughness: 0.2,
});

const tireMat = new THREE.MeshStandardMaterial({ color: '#111' });

const sideGlassMat = new THREE.MeshStandardMaterial({
  color: '#a5d6e7',
  transparent: true,
  opacity: 0.6,
});

const frontGlassMat = new THREE.MeshStandardMaterial({
  color: '#00ffff',
  emissive: '#00ffff',
  emissiveIntensity: 0.5,
  transparent: true,
  opacity: 0.7,
});

// 🔥 Fake glow (VERY CHEAP)
const glowLightMat = new THREE.MeshStandardMaterial({
  color: 'white',
  emissive: 'white',
  emissiveIntensity: 10,
});

function Bus({ initialZ, lane = 0, hasLight = false }) {
  const mesh = useRef();

  useFrame((state, delta) => {
    if (!mesh.current) return;

    mesh.current.position.z += SETTINGS.speed * (delta * 160);

    if (mesh.current.position.z > 25) {
      mesh.current.position.z = -SETTINGS.worldLength;
    }
  });

  return (
    <group ref={mesh} position={[lane * 3.5, 0, initialZ]}>
      {/* MAIN BODY */}
      <mesh
        geometry={busBodyGeo}
        material={busMat}
        position={[0, 1.4, 0]}
        castShadow
      />

      {/* WINDOW STRIP */}
      <mesh
        geometry={sideWindowGeo}
        material={sideGlassMat}
        position={[0, 1.8, 0]}
      />

      {/* FRONT WINDSHIELD */}
      <mesh
        geometry={frontWindshieldGeo}
        material={frontGlassMat}
        position={[0, 1.8, 3.8]}
      />

      {/* WHEELS */}
      {[
        [-1.2, 0.5, 2.5],
        [1.2, 0.5, 2.5],
        [-1.2, 0.5, -2.5],
        [1.2, 0.5, -2.5],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos}
          rotation={[0, 0, Math.PI / 2]}
          geometry={wheelGeo}
          material={tireMat}
        />
      ))}

      {/* BUMPERS */}
      <mesh position={[0, 0.6, 4]} geometry={bumperGeo} material={tireMat} />
      <mesh position={[0, 0.6, -4]} geometry={bumperGeo} material={tireMat} />

      {/* HEADLIGHTS (FAKE GLOW) */}
      <mesh
        position={[0.9, 1, 4.01]}
        geometry={headLightGeo}
        material={glowLightMat}
      />
      <mesh
        position={[-0.9, 1, 4.01]}
        geometry={headLightGeo}
        material={glowLightMat}
      />

      {/* REAL LIGHTS (ONLY FOR ONE BUS) */}
      {hasLight && (
        <>
          <pointLight
            position={[0.8, 1, 4.5]}
            intensity={2}
            distance={8}
            color="white"
          />
          <pointLight
            position={[-0.8, 1, 4.5]}
            intensity={2}
            distance={8}
            color="white"
          />
        </>
      )}
    </group>
  );
}

// --- CAR GEOMETRIES ---
const carBaseGeo = new THREE.BoxGeometry(1.8, 0.5, 4);
const carTopGeo = new THREE.BoxGeometry(1.6, 0.5, 2);
const carWheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16);
const spoilerGeo = new THREE.BoxGeometry(1.8, 0.1, 0.4);
const spoilerLegGeo = new THREE.BoxGeometry(0.1, 0.3, 0.1);

// --- CAR MATERIALS ---
const windowMat = new THREE.MeshStandardMaterial({
  color: '#222',
  metalness: 1,
  roughness: 0.1,
});

function Car({ initialZ, lane = 0, color = '#e74c3c' }) {
  const mesh = useRef();

  // Create a unique material per car instance for different colors
  const carMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.7,
        roughness: 0.2,
      }),
    [color]
  );

  useFrame((state, delta) => {
    if (!mesh.current) return;
    // Cars move slightly faster than buses for variety
    mesh.current.position.z += SETTINGS.speed * 1.2 * (delta * 160);

    if (mesh.current.position.z > 25) {
      mesh.current.position.z = -SETTINGS.worldLength;
    }
  });

  return (
    <group ref={mesh} position={[lane * 2.5, 0, initialZ]}>
      {/* Lower Body */}
      <mesh
        geometry={carBaseGeo}
        material={carMat}
        position={[0, 0.6, 0]}
        castShadow
      />

      {/* Cabin/Top */}
      <mesh
        geometry={carTopGeo}
        material={windowMat}
        position={[0, 1.1, -0.2]}
        castShadow
      />

      {/* Wheels */}
      {[
        [-0.8, 0.35, 1.2],
        [0.8, 0.35, 1.2],
        [-0.8, 0.35, -1.2],
        [0.8, 0.35, -1.2],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos}
          rotation={[0, 0, Math.PI / 2]}
          geometry={carWheelGeo}
          material={tireMat}
        />
      ))}

      {/* Spoiler */}
      <group position={[0, 0.85, -1.7]}>
        <mesh geometry={spoilerGeo} material={carMat} position={[0, 0.3, 0]} />
        <mesh
          geometry={spoilerLegGeo}
          material={tireMat}
          position={[-0.7, 0.15, 0]}
        />
        <mesh
          geometry={spoilerLegGeo}
          material={tireMat}
          position={[0.7, 0.15, 0]}
        />
      </group>

      {/* Headlights */}
      <mesh
        position={[0.6, 0.7, 2.01]}
        geometry={headLightGeo}
        material={glowLightMat}
        scale={0.6}
      />
      <mesh
        position={[-0.6, 0.7, 2.01]}
        geometry={headLightGeo}
        material={glowLightMat}
        scale={0.6}
      />

      {/* Tail Lights */}
      <mesh
        position={[0.6, 0.7, -2.01]}
        geometry={headLightGeo}
        material={
          new THREE.MeshStandardMaterial({ color: 'red', emissive: 'red' })
        }
        scale={0.4}
      />
      <mesh
        position={[-0.6, 0.7, -2.01]}
        geometry={headLightGeo}
        material={
          new THREE.MeshStandardMaterial({ color: 'red', emissive: 'red' })
        }
        scale={0.4}
      />
    </group>
  );
}
// --- RURAL COMPONENTS ---
function Hut({ initialZ, side = 1 }) {
  const mesh = useRef();
  // Update this in Building, Hut, FarmPlot, and Coin
  useFrame((state, delta) => {
    if (mesh.current) {
      // Multiply by 60 to keep the '0.2' feeling like your original speed
      // but using delta ensures it matches the road's timing
      mesh.current.position.z += SETTINGS.speed * (delta * 60);

      if (mesh.current.position.z > 20) {
        mesh.current.position.z = -SETTINGS.worldLength + 20;
      }
    }
  });
  return (
    <group ref={mesh} position={[side * 10, 0, initialZ]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 4, 0]} castShadow>
        <coneGeometry args={[3.5, 2, 4]} />
        <meshStandardMaterial color="#C2B280" />
      </mesh>
    </group>
  );
}

function FarmPlot({ initialZ, side = 1 }) {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) {
      mesh.current.position.z += SETTINGS.speed;
      if (mesh.current.position.z > 20)
        mesh.current.position.z = -SETTINGS.worldLength + 20;
    }
  });
  return (
    <mesh
      ref={mesh}
      position={[side * 15, 0.05, initialZ]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#355E3B" />
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
    const pickedColor =
      urbanColors[Math.floor(Math.random() * urbanColors.length)];
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 128, 256);
    for (let y = 10; y < 240; y += 24) {
      for (let x = 15; x < 110; x += 30) {
        if (Math.random() > 0.4) {
          ctx.fillStyle = Math.random() > 0.5 ? '#ffd27d' : '#82ccdd';
          ctx.fillRect(x, y, 18, 16);
        }
      }
    }
    return {
      height: h,
      width: w,
      depth: d,
      color: pickedColor,
      windows: new THREE.CanvasTexture(canvas),
    };
  }, []);

  // Update this in Building, Hut, FarmPlot, and Coin
  useFrame((state, delta) => {
    if (mesh.current) {
      // Multiply by 60 to keep the '0.2' feeling like your original speed
      // but using delta ensures it matches the road's timing
      mesh.current.position.z += SETTINGS.speed * (delta * 60);

      if (mesh.current.position.z > 20) {
        mesh.current.position.z = -SETTINGS.worldLength + 20;
      }
    }
  });

  return (
    // Inside Building component
    // Change the '2' to '0.5' to bring them right up to the sidewalk
    <group
      ref={mesh}
      position={[
        side * (SETTINGS.trackWidth / 2 + width / 2 + 0.5),
        0,
        initialZ,
      ]}
    >
      {' '}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          emissiveMap={windows}
          emissiveIntensity={1.2}
          emissive="#fff"
        />
      </mesh>
    </group>
  );
}

function World() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <React.Fragment key={`city-${i}`}>
          <Building initialZ={i * -15} side={-1} />
          <Building initialZ={i * -15} side={1} />
        </React.Fragment>
      ))}
      {Array.from({ length: 10 }).map((_, i) => {
        const zPos = -150 + i * -15;
        return (
          <React.Fragment key={`farm-${i}`}>
            <Hut initialZ={zPos} side={-1} />
            <FarmPlot initialZ={zPos} side={1} />
          </React.Fragment>
        );
      })}
    </>
  );
}

function RacingTrack() {
  const trackWidth = 10;
  const sidewalkWidth = 2;

  const trackTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Base Asphalt Color
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, 512, 1024);

    // 2. Add "Grain/Noise" for realism
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 1024;
      const opacity = Math.random() * 0.05;
      ctx.fillStyle = `rgba(255,255,255,${opacity})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // 3. Lane Markings (Dash)
    ctx.setLineDash([120, 180]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 6;

    // Left Lane divider
    ctx.beginPath();
    ctx.moveTo(170, 0);
    ctx.lineTo(170, 1024);
    ctx.stroke();
    // Right Lane divider
    ctx.beginPath();
    ctx.moveTo(342, 0);
    ctx.lineTo(342, 1024);
    ctx.stroke();

    // 4. Solid Yellow Shoulder Lines
    ctx.setLineDash([]);
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(10, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(502, 0);
    ctx.lineTo(502, 1024);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 20); // Repeat over the long plane
    tex.anisotropy = 16; // Keeps texture sharp at distance
    return tex;
  }, []);

  // Move the texture offset for the "scrolling" effect
  // Inside RacingTrack
  useFrame((state, delta) => {
    // Increase '10' to '20' or '30' for a high-speed blur effect
    const worldUnitsPerSecond = SETTINGS.speed * (delta * 60);
    trackTexture.offset.y -= worldUnitsPerSecond * (20 / 1000);
  });

  return (
    <group>
      {/* Main Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[trackWidth, 1000]} />
        <meshStandardMaterial
          map={trackTexture}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Sidewalks / Curbs (Static) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-(trackWidth / 2 + sidewalkWidth / 2), 0.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[sidewalkWidth, 1000]} />
        <meshStandardMaterial color="#555" roughness={1} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[trackWidth / 2 + sidewalkWidth / 2, 0.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[sidewalkWidth, 1000]} />
        <meshStandardMaterial color="#555" roughness={1} />
      </mesh>
    </group>
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
        <Cloud
          segments={20}
          bounds={[10, 2, 2]}
          volume={6}
          color="#ffffff"
          position={[0, 20, -100]}
        />
      </Clouds>
    </group>
  );
}

function Player() {
  const group = useRef();
  const swipeProcessed = useRef(false);

  // 1. Load Assets
  const runFbx = useLoader(FBXLoader, '/models/Running.fbx');
  const jumpFbx = useLoader(FBXLoader, '/models/jump.fbx');
  const slideFbx = useLoader(FBXLoader, '/models/running-slide.fbx');

  const mixer = useRef();
  const actions = useRef({});
  const [isJumping, setIsJumping] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  const [lane, setLane] = useState(0);
  const laneWidth = 2.5;
  const velocity = useRef(0);
  const touchStart = useRef({ x: 0, y: 0 });

  // 2. Define Actions (Outside useEffect so they are accessible)
  const triggerJump = () => {
    if (group.current.position.y <= 0.51 && !isSliding) {
      velocity.current = SETTINGS.jumpForce;
      setIsJumping(true);
      actions.current.run?.fadeOut(0.2);
      actions.current.slide?.stop();
      actions.current.jump?.reset().fadeIn(0.2).play();
    }
  };

  const triggerSlide = () => {
    // REMOVE the "!isSliding" check to allow "re-sliding"
    if (group.current.position.y <= 0.51) {
      setIsSliding(true);

      // Stop other actions immediately
      actions.current.run?.fadeOut(0.05);
      actions.current.jump?.stop();

      // Reset and play slide from the beginning
      actions.current.slide?.reset().fadeIn(0.05).play();

      // Clear any existing timer so they don't stack
      if (window.slideTimer) clearTimeout(window.slideTimer);

      window.slideTimer = setTimeout(() => {
        setIsSliding(false);
        actions.current.slide?.fadeOut(0.2);
        actions.current.run?.reset().fadeIn(0.2).play();
      }, 800);
    }
  };

  // 3. Animation Setup
  useEffect(() => {
    mixer.current = new THREE.AnimationMixer(runFbx);

    const setupAction = (fbx, name, loop = true) => {
      if (fbx.animations.length > 0) {
        const clip = fbx.animations[0];
        clip.tracks = clip.tracks.filter((t) => !t.name.includes('position'));
        actions.current[name] = mixer.current.clipAction(clip);
        if (!loop) {
          actions.current[name].setLoop(THREE.LoopOnce);
          actions.current[name].clampWhenFinished = true;
        }
      }
    };

    setupAction(runFbx, 'run');
    setupAction(jumpFbx, 'jump', false);
    setupAction(slideFbx, 'slide', false);

    actions.current.run?.play();
  }, [runFbx, jumpFbx, slideFbx]);

  // 4. Input Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA')
        setLane((prev) => Math.max(prev - 1, -1));
      if (e.code === 'ArrowRight' || e.code === 'KeyD')
        setLane((prev) => Math.min(prev + 1, 1));
      if (e.code === 'Space' || e.code === 'ArrowUp') triggerJump();
      if (e.code === 'ArrowDown' || e.code === 'KeyS') triggerSlide();
    };

    const handleTouchStart = (e) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      swipeProcessed.current = false;
    };

    const handleTouchMove = (e) => {
      if (swipeProcessed.current) return;
      const dx = e.touches[0].clientX - touchStart.current.x;
      const dy = e.touches[0].clientY - touchStart.current.y;

      if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
        setLane((prev) =>
          dx > 0 ? Math.min(prev + 1, 1) : Math.max(prev - 1, -1)
        );
        swipeProcessed.current = true;
      } else if (Math.abs(dy) > 30) {
        if (dy < -30) triggerJump();
        else if (dy > 30) triggerSlide();
        swipeProcessed.current = true;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isSliding, isJumping]); // Dependencies ensure latest state for triggers

  // 5. Physics & Frame Loop
  useFrame((state, delta) => {
    if (!group.current) return;
    mixer.current?.update(delta);

    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      lane * laneWidth,
      0.15
    );

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
    <group ref={group} name="playerGroup" position={[0, 0.5, -2]}>
      <group position={[0, isSliding ? -0.2 : 0, 0]}>
        <primitive
          object={runFbx}
          scale={0.01}
          rotation={[0, Math.PI, 0]}
          castShadow
        />
      </group>
    </group>
  );
}

const redWhiteStripMat = (() => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = '#e74c3c'; // Red
  for (let i = 0; i < 256; i += 64) {
    ctx.fillRect(i, 0, 32, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4 });
})();

// 2. Yellow & Black Striped Texture (for the edge accents)
const yellowBlackStripMat = (() => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f1c40f'; // Yellow
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = '#111'; // Black
  for (let i = 0; i < 256; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 32, 0);
    ctx.lineTo(i + 64, 128);
    ctx.lineTo(i + 32, 128);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4 });
})();
// --- COOL, RUGGED BARRICADE ---
function Barricade({ initialZ, lane = 0 }) {
  const mesh = useRef();
  const lightRef = useRef();

  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.position.z += SETTINGS.speed * (delta * 160);
    if (mesh.current.position.z > 25)
      mesh.current.position.z = -SETTINGS.worldLength;

    // Blinking lights on the cones
    if (lightRef.current) {
      const pulse = (Math.sin(state.clock.getElapsedTime() * 12) + 1) / 2;
      lightRef.current.children.forEach(
        (l) => (l.material.emissiveIntensity = pulse * 4)
      );
    }

    // Collision (Must jump!)
    const player = state.scene.getObjectByName('playerGroup');
    if (
      player &&
      Math.abs(player.position.z - mesh.current.position.z) < 0.8 &&
      Math.abs(player.position.x - mesh.current.position.x) < 1.5
    ) {
      if (player.position.y < 1.4) console.log('CRASHED!');
    }
  });

  return (
    <group ref={mesh} position={[lane * 2.5, 0, initialZ]}>
      {/* 1. THE CONES (Left & Right) */}
      {[-1.4, 1.4].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Orange Cone Body */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <coneGeometry args={[0.4, 0.8, 16]} />
            <meshStandardMaterial color="#ff6600" roughness={0.3} />
          </mesh>
          {/* White Reflective Stripe on Cone */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.21, 0.25, 0.2, 16]} />
            <meshStandardMaterial
              color="#eee"
              emissive="#fff"
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Cone Base */}
          <mesh position={[0, 0.025, 0]}>
            <boxGeometry args={[0.6, 0.05, 0.6]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        </group>
      ))}

      {/* 2. THE MAIN PLANK (Red/White Stripes) */}
      <mesh position={[0, 0.65, 0]} castShadow material={redWhiteStripMat}>
        <boxGeometry args={[3.2, 0.35, 0.1]} />
      </mesh>

      {/* 3. ACCENT RAIL (Yellow/Black Stripes) */}
      <mesh position={[0, 0.4, 0]} castShadow material={yellowBlackStripMat}>
        <boxGeometry args={[2.8, 0.15, 0.08]} />
      </mesh>

      {/* 4. FLASHING HAZARD LIGHTS */}
      <group ref={lightRef}>
        <mesh position={[-1.4, 0.85, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="yellow" emissive="yellow" />
        </mesh>
        <mesh position={[1.4, 0.85, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="yellow" emissive="yellow" />
        </mesh>
      </group>
    </group>
  );
}

const bombGeometry = new THREE.SphereGeometry(0.6, 20, 20); // Lower segments for performance
const beltGeometry = new THREE.CylinderGeometry(0.61, 0.61, 0.25, 20, 1, true);
const capGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 12);

const bombMat = new THREE.MeshStandardMaterial({
  color: '#111',
  roughness: 0.8,
});
const capMat = new THREE.MeshStandardMaterial({ color: '#444', metalness: 1 });

// Create the Hazard Texture once
const hazardTexture = (() => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 20;
  for (let i = -128; i < 256; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 128, 128);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  return tex;
})();

const hazardMat = new THREE.MeshStandardMaterial({ map: hazardTexture });

export function Explosive({ position }) {
  const ref = useRef();
  const fuseRef = useRef();

  useFrame((state, delta) => {
    if (!ref.current) return;

    // Movement
    ref.current.position.z += SETTINGS.speed * (delta * 160);
    // Inside Explosive component's useFrame
    if (ref.current.position.z > 20) {
      // 1. Send it back to the end of the world
      ref.current.position.z = -SETTINGS.worldLength;

      // 2. Re-randomize the lane (Crucial!)
      const lanes = [-2.5, 0, 2.5];
      ref.current.position.x = lanes[Math.floor(Math.random() * 3)];

      // 3. Optional: Add a tiny random Z offset so they don't all
      // spawn at the exact same millisecond
      ref.current.position.z -= Math.random() * 10;
    }

    // Flicker Spark (Cheap math)
    if (fuseRef.current) {
      const s = Math.sin(state.clock.elapsedTime * 25);
      fuseRef.current.material.emissiveIntensity = s > 0 ? 15 : 5;
    }

    // Collision (Keep this lightweight)
    const player = state.scene.getObjectByName('playerGroup');
    if (player && Math.abs(player.position.z - ref.current.position.z) < 0.8) {
      if (
        Math.abs(player.position.x - ref.current.position.x) < 0.8 &&
        player.position.y < 1.5
      ) {
        // Trigger Game Over or Effect
      }
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Bomb Body */}
      <mesh
        geometry={bombGeometry}
        material={bombMat}
        castShadow
        position={[0, 0.6, 0]}
      />

      {/* Hazard Stripes */}
      <mesh
        geometry={beltGeometry}
        material={hazardMat}
        position={[0, 0.6, 0]}
      />

      {/* Metal Cap */}
      <mesh geometry={capGeometry} material={capMat} position={[0, 1.1, 0]} />

      {/* The Spark */}
      <mesh ref={fuseRef} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="white"
          emissive="#00ffff"
          emissiveIntensity={10}
        />
      </mesh>
    </group>
  );
}
// Pre-define these outside the component to save memory
// Keep these outside the component to save memory
const balloonGeo = new THREE.DodecahedronGeometry(2, 0);
const basketGeo = new THREE.BoxGeometry(0.8, 0.7, 0.8);
const ropeGeo = new THREE.CylinderGeometry(0.01, 0.01, 1.5, 3);

function HotAirBalloon({ initialPos, color, speedOffset }) {
  const mesh = useRef();

  // We increase the "Live Zone" so they don't disappear quickly
  const spawnDistance = -400; // Start way back in the fog
  const deleteDistance = 50; // Only disappear well after passing the player

  useFrame((state, delta) => {
    if (!mesh.current) return;

    // Slow, steady movement
    mesh.current.position.z +=
      (SETTINGS.speed * 0.3 + speedOffset) * (delta * 60);

    // Gentle swaying
    const t = state.clock.getElapsedTime() + initialPos[0] * 0.5;
    mesh.current.position.y = initialPos[1] + Math.sin(t * 0.3) * 2;
    mesh.current.rotation.z = Math.sin(t * 0.2) * 0.05;

    // Recycle Logic: If it passes the player, send it far back
    if (mesh.current.position.z > deleteDistance) {
      mesh.current.position.z = spawnDistance;
      // Slightly shift X so the pattern changes
      mesh.current.position.x = (Math.random() - 0.5) * 60;
    }
  });

  return (
    <group ref={mesh} position={initialPos}>
      <mesh geometry={balloonGeo}>
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh geometry={ropeGeo} position={[0, -1.5, 0]}>
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh geometry={basketGeo} position={[0, -2.2, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}

export default function Demo() {
  const [score, setScore] = useState(0);

  const items = useMemo(() => {
    const lanes = [-2.5, 0, 2.5];
    let lastExplosiveZ = 0; // Keep track of the last explosive's position
    const minExplosiveGap = 50; // Minimum distance (in Z units) between explosives

    return Array.from({ length: 40 }).map((_, i) => {
      const zPos = -20 - i * 10;

      // Check if we are allowed to spawn an explosive:
      // 1. Random chance is low (e.g., 10%)
      // 2. We haven't spawned one too recently (gap check)
      const canSpawnExplosive =
        Math.random() > 0.98 &&
        Math.abs(zPos - lastExplosiveZ) > minExplosiveGap;

      let type = 'coin';
      if (canSpawnExplosive) {
        type = 'explosive';
        lastExplosiveZ = zPos;
      }

      return {
        type,
        position: [lanes[Math.floor(Math.random() * 3)], 0.8, zPos],
      };
    });
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: SETTINGS.skyColor,
        position: 'relative',
      }}
    >
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 6, 12]} fov={45} />
        <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={2} />
        <CloudSystem />
        <World />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
        <fog attach="fog" args={[SETTINGS.skyColor, 30, 150]} />
        <RacingTrack />
        <Barricade initialZ={-60} lane={0} />
        <Barricade initialZ={-150} lane={-1} />
        <Barricade initialZ={-220} lane={1} />
        <Player />
        {/* Inside your Canvas */}
        {useMemo(() => {
          const colors = [
            '#ff4757',
            '#2e86de',
            '#ffa502',
            '#2ed573',
            '#ef5777',
          ];
          return Array.from({ length: 20 }).map((_, i) => (
            <HotAirBalloon
              key={i}
              // Spread them wide (-30 to 30) and far (-400 to 0)
              initialPos={[
                (Math.random() - 0.5) * 60,
                15 + Math.random() * 10,
                -i * 20,
              ]}
              color={colors[i % colors.length]}
              speedOffset={Math.random() * 0.02}
            />
          ));
        }, [])}
        {/* Render Coins */}
        {items.map((item, idx) =>
          item.type === 'coin' ? (
            <Coin
              key={idx}
              position={item.position}
              onCollect={() => setScore((s) => s + 1)}
            />
          ) : (
            <Explosive key={idx} position={item.position} />
          )
        )}
        <Bus initialZ={-80} lane={-1} />
        <Bus initialZ={-200} lane={1} />
        <Car initialZ={-40} lane={1} color="#f1c40f" /> {/* Yellow Sportscar */}
        <Car initialZ={-120} lane={0} color="#2ecc71" /> {/* Green Sportscar */}
        <Car initialZ={-250} lane={-1} color="#9b59b6" />{' '}
        {/* Purple Sportscar */}
      </Canvas>

      {/* UI Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          width: '100%',
          textAlign: 'center',
          color: '#222',
          fontFamily: 'Impact',
          pointerEvents: 'none',
        }}
      >
        <h1 style={{ fontSize: '3rem', margin: 0, textShadow: '2px 2px #fff' }}>
          METRO TO MEADOW
        </h1>
        <h2
          style={{
            fontSize: '2rem',
            color: '#ffd700',
            textShadow: '1px 1px #000',
          }}
        >
          COINS: {score}
        </h2>
      </div>
    </div>
  );
}
