import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
  PerspectiveCamera,
  Sky,
  Clouds,
  Cloud,
  Environment,
} from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';

const SETTINGS = {
  speed: 0.3,
  trackWidth: 10,
  jumpForce: 0.18,
  gravity: -0.012,
  worldLength: 300,
  skyColor: '#e0f7ff', // Added this to prevent fog error
};

// --- GEOMETRIES & MATERIALS (Pre-defined for performance) ---
const coinGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 12);
const edgeGeom = new THREE.TorusGeometry(0.5, 0.05, 12, 32);
const starGeom = new THREE.OctahedronGeometry(0.3, 0);
const rimGeom = new THREE.TorusGeometry(0.42, 0.02, 8, 32);

// Cone Geometries
const coneBaseGeom = new THREE.BoxGeometry(0.8, 0.1, 0.8);
const coneBodyGeom = new THREE.CylinderGeometry(0.1, 0.4, 1.2, 16);
const coneStripGeom = new THREE.CylinderGeometry(0.22, 0.28, 0.3, 16);

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
const orangeMat = new THREE.MeshStandardMaterial({
  color: '#ff4500',
  roughness: 0.5,
});
const whiteMat = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  emissive: '#ffffff',
  emissiveIntensity: 0.2,
});

// --- BUS COMPONENT ---
function MovingBus({ initialZ, isGameOver, speed }) {
  const ref = useRef();

  const fbx = useLoader(FBXLoader, 'models/scene.fbx');
  const busModel = useMemo(() => fbx.clone(), [fbx]);

  const lanes = [-2.5, 0, 2.5];
  const [currentLane] = useState(lanes[Math.floor(Math.random() * 3)]);

  // 👉 FIX: compute bounding box height
  const [yOffset, setYOffset] = useState(0);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(busModel);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Half height so bottom sits on road
    setYOffset(size.y / 2);
  }, [busModel]);

  useFrame((state) => {
    if (!ref.current || isGameOver) return;

    ref.current.position.z += speed * 3;

    if (ref.current.position.z > 20) {
      ref.current.position.z = -150 - Math.random() * 100;
      ref.current.position.x = lanes[Math.floor(Math.random() * lanes.length)];
    }

    // 👉 use computed offset instead of hardcoded 1.6
    ref.current.position.y = yOffset;
  });

  return (
    <group
      ref={ref}
      position={[currentLane, yOffset, initialZ]}
      userData={{ type: 'bus' }}
    >
      <primitive
        object={busModel}
        scale={0.7} // 🔥 increased from 0.03 → 0.3 (10x bigger)
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
      />
    </group>
  );
}

const carBaseGeom = new THREE.BoxGeometry(1.5, 0.5, 3.5);
const carTopGeom = new THREE.BoxGeometry(1.2, 0.4, 1.8);
const carWheelGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
// A simple plane that will look like a glowing beam in front of the car
const beamGeom = new THREE.PlaneGeometry(1, 4);
// A small circle for the light source "bulb"
const bulbGeom = new THREE.PlaneGeometry(0.4, 0.2);
function MovingCar({ initialZ, color = '#ff2222', isGameOver, speed }) {
  const ref = useRef();
  const lanes = [-2.5, 0, 2.5];
  const currentLane = useMemo(() => lanes[Math.floor(Math.random() * 3)], []);

  useFrame((state) => {
    if (!ref.current || isGameOver) return;
    ref.current.position.z += speed * 2.5;

    // Respawn logic
    if (ref.current.position.z > 20) {
      ref.current.position.z = -200 - Math.random() * 100;
      ref.current.position.x = lanes[Math.floor(Math.random() * lanes.length)];
    }
  });

  return (
    <group
      ref={ref}
      position={[currentLane, 0.4, initialZ]}
      userData={{ type: 'car' }}
    >
      {' '}
      {/* Car Body - Standard material is okay for the body itself */}
      <mesh geometry={carBaseGeom}>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh geometry={carTopGeom} position={[0, 0.4, -0.2]}>
        <meshStandardMaterial color={color} />
      </mesh>
      {/* --- FAKE HEADLIGHTS (Zero Lag) --- */}
      <group position={[0, 0, 1.76]}>
        {/* Left Bulb */}
        <mesh position={[-0.5, 0, 0]} geometry={bulbGeom}>
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Right Bulb */}
        <mesh position={[0.5, 0, 0]} geometry={bulbGeom}>
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* FAKE BEAM: A flat plane floating slightly above the road */}
        {/* It has no shadow and does not affect the road texture */}
        <mesh
          position={[0, -0.38, 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={beamGeom}
        >
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
            depthWrite={false} // Prevents "z-fighting" flickering with the road
          />
        </mesh>
      </group>
      {/* Tail Lights */}
      <mesh position={[-0.5, 0, -1.8]} geometry={bulbGeom}>
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0.5, 0, -1.8]} geometry={bulbGeom}>
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      {/* Wheels - Using BasicMaterial for maximum FPS */}
      {[
        [-0.7, -0.2, 1],
        [0.7, -0.2, 1],
        [-0.7, -0.2, -1],
        [0.7, -0.2, -1],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos}
          rotation={[0, 0, Math.PI / 2]}
          geometry={carWheelGeom}
        >
          <meshBasicMaterial color="#111" />
        </mesh>
      ))}
    </group>
  );
}

// --- TRAFFIC CONE COMPONENT ---
function TrafficCone({ initialPos, isGameOver, speed }) {
  const ref = useRef();
  const lanes = [-3, 0, 3]; // Left, Center, Right

  useFrame(() => {
    if (!ref.current || isGameOver) return;
   ref.current.position.z += speed * 2;
    if (ref.current.position.z > 20) {
      ref.current.position.z = -150 - Math.random() * 50;
      ref.current.position.x = lanes[Math.floor(Math.random() * lanes.length)];
    }
  });

  return (
    <group ref={ref} position={initialPos} userData={{ type: 'cone' }}>
      {' '}
      {/* Black base */}
      <mesh geometry={coneBaseGeom} position={[0, 0.05, 0]} castShadow>
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Orange Body */}
      <mesh
        geometry={coneBodyGeom}
        position={[0, 0.6, 0]}
        material={orangeMat}
        castShadow
      />
      {/* Reflective Strip */}
      <mesh
        geometry={coneStripGeom}
        position={[0, 0.7, 0]}
        material={whiteMat}
      />
    </group>
  );
}
function OilBarrel({ initialPos, isGameOver, score, speed }) {
  const ref = useRef();
  const lanes = [-3, 0, 3];

  useFrame(() => {
    if (!ref.current || isGameOver) return;

    ref.current.position.z += speed * (2 + score / 2000);
    if (ref.current.position.z > 20) {
      const spawnChance = 0.2 + score / 5000;
      if (Math.random() < spawnChance) {
        // ✅ Spawn barrel
        ref.current.position.z = -150 - Math.random() * 100;
        ref.current.position.x =
          lanes[Math.floor(Math.random() * lanes.length)];
      } else {
        // ❌ Skip spawn (push it far away)
        ref.current.position.z = -300 - Math.random() * 200;
      }
    }
  });

  return (
    <group ref={ref} position={initialPos} userData={{ type: 'obstacle' }}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 12]} />
        <meshStandardMaterial color="#d32f2f" />
      </mesh>

      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.51, 0.51, 0.2, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.51, 0.51, 0.2, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.05, 12]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}
//--- COIN COMPONENT ---
function Coin({ position, onCollect, isGameOver, speed }) {
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

    if (!isGameOver) {
     ref.current.position.z += speed * 2;// Respawn logic
      if (ref.current.position.z > 20) {
        ref.current.position.z = -SETTINGS.worldLength;
        setCollected(false);
      }
    }

    if (isGameOver) return;

    // 2. Collision Logic
    // Important: Player must have name='playerGroup' in its component
    const playerPos = state.scene.getObjectByName('playerGroup')?.position;
    if (playerPos && Math.abs(ref.current.position.z - playerPos.z) < 1) {
      if (ref.current.position.distanceTo(playerPos) < 2) {
        setCollected(true);
        onCollect();
      }
    }
  });

  if (collected) return null;

  return (
    <group ref={ref} position={position}>
      <mesh
        geometry={coinGeom}
        material={goldMat}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      />
      <mesh
        geometry={edgeGeom}
        material={goldMat}
        rotation={[0, Math.PI / 2, 0]}
      />
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
      <mesh
        geometry={starGeom}
        material={starMat}
        position={[0.08, 0, 0]}
        scale={[0.3, 1, 1]}
      />
      <mesh
        geometry={starGeom}
        material={starMat}
        position={[-0.08, 0, 0]}
        scale={[0.3, 1, 1]}
      />
    </group>
  );
}
const balloonGeo = new THREE.DodecahedronGeometry(2, 0);
const basketGeo = new THREE.BoxGeometry(0.8, 0.7, 0.8);
const ropeGeo = new THREE.CylinderGeometry(0.01, 0.01, 1.5, 3);

function HotAirBalloon({ initialPos, color, speedOffset, speed }) {
  const mesh = useRef();

  // We increase the "Live Zone" so they don't disappear quickly
  const spawnDistance = -400; // Start way back in the fog
  const deleteDistance = 50; // Only disappear well after passing the player

  useFrame((state, delta) => {
    if (!mesh.current) return;

    // Slow, steady movement
   mesh.current.position.z += (speed * 0.3 + speedOffset) * (delta * 60);
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

// --- PLAYER COMPONENT (Added name="playerGroup") ---
function Player({ isGameOver, onCollide, speed }) {
  const group = useRef();
  const swipeProcessed = useRef(false);

  // Assets
  const runFbx = useLoader(FBXLoader, '/models/Running.fbx');
  const jumpFbx = useLoader(FBXLoader, '/models/jump.fbx');
  const slideFbx = useLoader(FBXLoader, '/models/running-slide.fbx');
  const deathFbx = useLoader(FBXLoader, '/models/death.fbx');

  const mixer = useRef();
  const actions = useRef({});

  const [isJumping, setIsJumping] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  const [lane, setLane] = useState(0);
  const laneWidth = 2.5;

  const velocity = useRef(0);
  const touchStart = useRef({ x: 0, y: 0 });

  // ----------------------------
  // ACTIONS
  // ----------------------------
  const triggerJump = () => {
    if (group.current.position.y <= 0.51 && !isSliding) {
      velocity.current = SETTINGS.jumpForce * (1 + speed * 0.25);

      setIsJumping(true);

      actions.current.run?.fadeOut(0.15);
      actions.current.slide?.stop();
      actions.current.jump?.reset().fadeIn(0.15).play();
    }
  };

  const triggerSlide = () => {
    if (group.current.position.y <= 0.51) {
      setIsSliding(true);

      actions.current.run?.fadeOut(0.05);
      actions.current.jump?.stop();

      actions.current.slide?.reset().fadeIn(0.05).play();

      if (window.slideTimer) clearTimeout(window.slideTimer);

      window.slideTimer = setTimeout(() => {
        setIsSliding(false);
        actions.current.slide?.fadeOut(0.15);
        actions.current.run?.reset().fadeIn(0.15).play();
      }, 700); // slightly faster
    }
  };

  // ----------------------------
  // ANIMATION SETUP
  // ----------------------------
  useEffect(() => {
    mixer.current = new THREE.AnimationMixer(runFbx);

    const setup = (fbx, name, loop = true) => {
      if (!fbx.animations.length) return;

      const clip = fbx.animations[0];
      clip.tracks = clip.tracks.filter((t) => !t.name.includes('position'));

      const action = mixer.current.clipAction(clip);

      if (!loop) {
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
      }

      actions.current[name] = action;
    };

    setup(runFbx, 'run');
    setup(jumpFbx, 'jump', false);
    setup(slideFbx, 'slide', false);
    setup(deathFbx, 'death', false);

    actions.current.run?.play();
  }, []);

  useEffect(() => {
    if (isGameOver) {
      actions.current.run?.fadeOut(0.2);
      actions.current.jump?.stop();
      actions.current.slide?.stop();
      actions.current.death?.reset().fadeIn(0.1).play();
    }
  }, [isGameOver]);

  // ----------------------------
  // INPUT
  // ----------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA')
        setLane((p) => Math.max(p - 1, -1));

      if (e.code === 'ArrowRight' || e.code === 'KeyD')
        setLane((p) => Math.min(p + 1, 1));

      if (e.code === 'Space' || e.code === 'ArrowUp') triggerJump();
      if (e.code === 'ArrowDown' || e.code === 'KeyS') triggerSlide();
    };

    const handleTouchStart = (e) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      swipeProcessed.current = false;
    };

    const handleTouchMove = (e) => {
      if (swipeProcessed.current) return;

      const dx = e.touches[0].clientX - touchStart.current.x;
      const dy = e.touches[0].clientY - touchStart.current.y;

      if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
        setLane((p) =>
          dx > 0 ? Math.min(p + 1, 1) : Math.max(p - 1, -1)
        );
        swipeProcessed.current = true;
      } else if (Math.abs(dy) > 30) {
        dy < 0 ? triggerJump() : triggerSlide();
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
  }, [isSliding, isJumping]);

  // ----------------------------
  // FRAME LOOP
  // ----------------------------
  useFrame((state, delta) => {
    if (!group.current) return;

    // 🎬 Animation speed scales with game speed
    mixer.current?.update(delta * (1 + speed * 0.6));

    if (isGameOver) return;

    const player = group.current;

    // 🚀 Smooth lane switching (speed responsive)
    const lerpSpeed = 0.12 + Math.min(speed * 0.08, 0.35);

    player.position.x = THREE.MathUtils.lerp(
      player.position.x,
      lane * laneWidth,
      lerpSpeed
    );

    // 🌍 Gravity scaling
    const gravityScale = 1 + speed * 0.4;

    velocity.current += SETTINGS.gravity * gravityScale;
    player.position.y += velocity.current * (1 + speed * 0.3);

    // Ground clamp
    if (player.position.y < 0.5) {
      player.position.y = 0.5;
      velocity.current = 0;

      if (isJumping) {
        setIsJumping(false);
        actions.current.jump?.fadeOut(0.15);
        actions.current.run?.reset().fadeIn(0.15).play();
      }
    }

    // ----------------------------
    // COLLISION (optimized)
    // ----------------------------
    state.scene.traverse((obj) => {
      if (
        obj.type !== 'Group' ||
        !['bus', 'car', 'cone'].includes(obj.userData.type)
      )
        return;

      const dz = Math.abs(player.position.z - obj.position.z);
      const dx = Math.abs(player.position.x - obj.position.x);

      if (dz < 1.5 && dx < 1.5) {
        if (obj.userData.type === 'cone' && player.position.y > 1.2) return;

        onCollide();
      }
    });
  });

  return (
    <group ref={group} name="playerGroup" position={[0, 0.5, -2]}>
      <group position={[0, isSliding ? -0.25 : 0, 0]}>
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

// --- OTHER COMPONENTS (CloudSystem, StreetWall, etc. remain the same as your code) ---
function CloudSystem({ isGameOver }) {
  const group = useRef();
  useFrame(() => {
    if (!group.current || isGameOver) return;

    group.current.position.z += SETTINGS.speed * 0.4;
    if (group.current.position.z > 50) group.current.position.z = -150;
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
        <Cloud
          segments={20}
          bounds={[10, 2, 2]}
          volume={6}
          color="#f0f0f0"
          position={[40, 25, -150]}
        />
        <Cloud
          segments={20}
          bounds={[10, 2, 2]}
          volume={6}
          color="#ffffff"
          position={[-40, 22, -120]}
        />
      </Clouds>
    </group>
  );
}

function StreetWall({ side = 1, isGameOver }) {
  const wallTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 1. Create a Gritty Base (Mortar)
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 512, 512);

    // Add "grit" to mortar
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.5})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
    }

    const rows = 10;
    const rowHeight = 512 / rows;

    for (let r = 0; r < rows; r++) {
      const stonesInRow = 4;
      const colWidth = 512 / stonesInRow;

      for (let c = 0; c < stonesInRow; c++) {
        // Stagger rows and add random jitter to stone widths
        const xOffset = (r % 2) * (colWidth / 2);
        const jitter = (Math.random() - 0.5) * 20;
        const x = c * colWidth + xOffset - colWidth / 2 + jitter;
        const y = r * rowHeight;

        // 2. Realistic Stone Shading
        // Mix of greys, browns, and dark blues for "cold stone"
        const baseHue = 20 + Math.random() * 20; // Earthy tones
        const lightness = 25 + Math.random() * 15;
        const grad = ctx.createLinearGradient(
          x,
          y,
          x + colWidth,
          y + rowHeight
        );
        grad.addColorStop(0, `hsl(${baseHue}, 5%, ${lightness + 10}%)`);
        grad.addColorStop(1, `hsl(${baseHue}, 5%, ${lightness - 10}%)`);

        ctx.fillStyle = grad;

        // Draw stone with irregular "hand-cut" edges
        ctx.beginPath();
        ctx.moveTo(x + 5, y + 5);
        ctx.lineTo(x + colWidth - 5, y + 2);
        ctx.lineTo(x + colWidth - 2, y + rowHeight - 5);
        ctx.lineTo(x + 8, y + rowHeight - 2);
        ctx.closePath();
        ctx.fill();

        // 3. Add Highlights/Cracks
        ctx.strokeStyle = `rgba(255,255,255,0.05)`;
        ctx.strokeRect(x + 6, y + 6, colWidth - 12, rowHeight - 12);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 8); // Scale the texture so stones look heavy
    tex.anisotropy = 16; // Keeps it sharp at a distance
    return tex;
  }, []);

  useFrame((state, delta) => {
    if (isGameOver) return;
    wallTexture.offset.y -= SETTINGS.speed * delta * 0.8;
  });
  const WALL_HEIGHT = 2.5;
  return (
    <group
      position={[side * (SETTINGS.trackWidth / 2 + 0.6), WALL_HEIGHT / 2, 0]}
    >
      {' '}
      {/* The Main Wall */}
      <mesh>
        <boxGeometry args={[1.2, WALL_HEIGHT, 300]} />{' '}
        <meshStandardMaterial
          map={wallTexture}
          roughness={1}
          metalness={0}
          bumpScale={0.05} // Subtle depth
        />
      </mesh>
      {/* Optional: Add a "Coping Stone" (Top ledge) for extra realism */}
      <mesh position={[0, WALL_HEIGHT / 2 + 0.1, 0]}>
        {' '}
        <boxGeometry args={[1.5, 0.3, 300]} />
        <meshStandardMaterial color="#333" roughness={1} />
      </mesh>
    </group>
  );
}

function StreetLight({ initialZ, side = 1, isGameOver, speed }) {
  const group = useRef();
  const fbx = useLoader(FBXLoader, '/models/Lamp.fbx');
  const modelClone = useMemo(() => fbx.clone(), [fbx]);
  useFrame(() => {
    if (isGameOver) return;

    if (group.current) {
      group.current.position.z += speed;
      if (group.current.position.z > 20) group.current.position.z = -100;
    }
  });
  return (
    <group ref={group} position={[side * 5.5, 0, initialZ]}>
      <primitive
        object={modelClone}
        scale={0.01}
        rotation={[0, side === 1 ? 0 : Math.PI, 0]}
        castShadow
      />
    </group>
  );
}

function RacingTrack({ isGameOver, speed }) {
  const trackTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Asphalt Base
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, 512, 1024);

    // 2. White Side Lines
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 15, 1024); // Left edge
    ctx.fillRect(497, 0, 15, 1024); // Right edge

    // 3. Yellow Dashed Center Line
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 20;
    ctx.setLineDash([80, 80]); // 80px line, 80px gap
    ctx.lineDashOffset = 0;
    ctx.beginPath();
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 1024);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    // We repeat it 10 times over the 200 unit length for high detail
    tex.repeat.set(1, 10);
    return tex;
  }, []);

  useFrame((state, delta) => {
    if (isGameOver) return;

    // Scroll the texture based on speed
    // Higher multiplier (e.g., 2) makes the dashes move faster
    trackTexture.offset.y -= speed * delta * 2;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, -50]}>
      {/* Increased length to 300 to match SETTINGS.worldLength 
         so the road doesn't end abruptly 
      */}
      <planeGeometry args={[SETTINGS.trackWidth, 300]} />
      <meshStandardMaterial
        map={trackTexture}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

// Define geometries OUTSIDE the component so they are created only ONCE in memory
// This is the biggest performance boost!
const lowPolyBunGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 8);
const lowPolyMeatGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.15, 8);
const lowPolyCheeseGeo = new THREE.BoxGeometry(0.9, 0.04, 0.9);
const lowPolyLettuceGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.05, 8);
// Top bun as a slightly thinner cylinder instead of a sphere
const lowPolyTopBunGeo = new THREE.CylinderGeometry(0.4, 0.5, 0.25, 8);
const cheeseMat = new THREE.MeshStandardMaterial({
  color: '#FFD700',
  emissive: '#ffaa00',
  emissiveIntensity: 0.6,
});

const bunMat = new THREE.MeshStandardMaterial({
  color: '#D3A36A',
  emissive: '#553300',
  emissiveIntensity: 0.2,
});
const meatMat = new THREE.MeshStandardMaterial({ color: '#4E342E' });
const lettuceMat = new THREE.MeshStandardMaterial({ color: '#4CAF50' });

function Burger({ position, onCollect, isGameOver, energy, score, speed }) {
  const ref = useRef();
  const floatOffset = useRef(Math.random() * Math.PI * 2);
  const respawnCooldown = useRef(0);
  const [collected, setCollected] = useState(false);

  useFrame((state, delta) => {
    if (!ref.current) return;

    ref.current.visible = !collected;

    if (isGameOver) return;

    // ⏱ time for animation
    floatOffset.current += delta;

    // ✨ GLOW PULSE (ADD HERE ✅)
    const pulse = (Math.sin(floatOffset.current * 3) + 1) / 2;

    ref.current.children.forEach((child) => {
      if (child.material && child.material.emissiveIntensity !== undefined) {
        child.material.emissiveIntensity = 0.2 + pulse * 0.6;
      }
    });

    // ❗ movement (only when active)
    if (!collected) {
      // forward movement
     ref.current.position.z += speed * (delta * 160);
      // 🔥 FLOATING EFFECT
      ref.current.position.y =
        position[1] + Math.sin(floatOffset.current * 2) * 0.3;

      // 🔥 ROTATION
      ref.current.rotation.y += 0.05;
      ref.current.rotation.x = Math.sin(floatOffset.current) * 0.1;
    }

    respawnCooldown.current -= delta;

    // respawn logic
    if (ref.current.position.z > 20 || collected) {
      if (respawnCooldown.current > 0) return;

      let spawnChance = 0.25;

      if (energy < 40) spawnChance += 0.4;
      if (energy > 80) spawnChance -= 0.1;

      spawnChance -= Math.min(score / 5000, 0.15);

      if (Math.random() < spawnChance) {
        ref.current.position.z = -120 - Math.random() * 120;
        ref.current.position.x = [-3, 0, 3][Math.floor(Math.random() * 3)];

        setCollected(false);
        respawnCooldown.current = 1.5 + Math.random() * 2.5;
      } else {
        ref.current.position.z = -400 - Math.random() * 200;
        respawnCooldown.current = 2 + Math.random() * 3;
      }
    }

    // collision
    if (!collected) {
      const player = state.scene.getObjectByName('playerGroup');

      if (
        player &&
        Math.abs(player.position.z - ref.current.position.z) < 1 &&
        Math.abs(player.position.x - ref.current.position.x) < 1
      ) {
        setCollected(true);
        if (onCollect) onCollect();
      }
    }
  });

  return (
    <group ref={ref} position={position} scale={0.8}>
      {/* Bottom Bun - Using pre-defined geometry */}
      <mesh position={[0, 0.1, 0]} geometry={lowPolyBunGeo} material={bunMat} />

      {/* Meat Patty */}
      <mesh
        position={[0, 0.25, 0]}
        geometry={lowPolyMeatGeo}
        material={meatMat}
      />

      {/* Cheese Slice */}
      <mesh
        position={[0, 0.32, 0]}
        geometry={lowPolyCheeseGeo}
        material={cheeseMat}
      />

      {/* Lettuce */}
      <mesh
        position={[0, 0.4, 0]}
        geometry={lowPolyLettuceGeo}
        material={lettuceMat}
      />

      {/* Top Bun - Now a 8-sided cylinder (much lighter than a sphere) */}
      <mesh
        position={[0, 0.55, 0]}
        geometry={lowPolyTopBunGeo}
        material={bunMat}
      />
    </group>
  );
}

// --- MAIN DEMO COMPONENT ---
export default function Demo() {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  // Inside your Demo component
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [energy, setEnergy] = useState(100); // max 100
  const energyBoostRef = useRef(0);
const baseSpeed = SETTINGS.speed;
const gameSpeed = baseSpeed * speedMultiplier;
  const handleBurgerCollect = () => {
    setEnergy((prev) => Math.min(100, prev + 25));
    energyBoostRef.current = 2; // 2 seconds no drain
  };
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setEnergy((prev) => {
        if (energyBoostRef.current > 0) {
          energyBoostRef.current -= 0.1;
          return prev; // 🚫 no drain during boost
        }

        const drain = 0.5 + speedMultiplier * 0.2;
        const newEnergy = prev - drain;

        if (newEnergy <= 0) {
          setIsGameOver(true);
          return 0;
        }

        return newEnergy;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [speedMultiplier, isGameOver]);
  // Increase speed as score increases
  useEffect(() => {
    const newMultiplier = 1 + Math.floor(score / 150) * 0.2; // +20% speed every 150 points
    setSpeedMultiplier(newMultiplier);
  }, [score]);

  // Pass this speedMultiplier to all components (Player, RacingTrack, MovingCar, etc.)
  const balloons = useMemo(() => {
    const colors = [
      '#ff6b6b',
      '#4ecdc4',
      '#ffe66d',
      '#ff9f43',
      '#a29bfe',
      '#fd79a8',
    ];
    const count = 15; // More balloons for a denser sky

    return Array.from({ length: count }).map((_, i) => {
      // Wave grouping: 5 balloons per cluster
      const waveIndex = Math.floor(i / 5);

      // START POSITIONS:
      // We start them closer (Z: -30 to -150) so they are immediately visible
      const zBase = -30 - waveIndex * 60;

      return {
        id: i,
        initialPos: [
          (Math.random() - 0.5) * 60, // Wide X range (-30 to 30) includes the center!
          12 + Math.random() * 15, // Varying heights (12m to 27m)
          zBase + Math.random() * 30, // Random depth within the wave
        ],
        color: colors[i % colors.length],
        speedOffset: Math.random() * 0.02,
      };
    });
  }, []);
  const carPositions = useMemo(() => [-50, -150, -200], []);
  const conePositions = useMemo(
    () => [
      [-3, 0, -30],
      [0, 0, -60],
      [3, 0, -90],
      [-3, 0, -120],
    ],
    []
  );
  const burgerPositions = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => [
      [-3, 0, 3][Math.floor(Math.random() * 3)], // random lane
      1,
      -50 - i * 60 - Math.random() * 40, // spaced out
    ]);
  }, []);
  const busPositions = useMemo(() => [-80, -160, -240], []);
  // Generate initial coin positions
  const coinPositions = useMemo(() => {
  const lanes = [-2.5, 0, 2.5];
  const coins = [];

  let z = -20;

 for (let i = 0; i < 25; i++){
    const patternType = Math.random();

    // 1️⃣ Straight line coins
    if (patternType < 0.4) {
      const lane = lanes[Math.floor(Math.random() * 3)];
      for (let j = 0; j < 6; j++) {
        coins.push([lane, 1, z]);
        z -= 6;
      }
    }

    // 2️⃣ Zig-zag (lane switching)
    else if (patternType < 0.7) {
      for (let j = 0; j < 6; j++) {
        const lane = lanes[j % 3];
        coins.push([lane, 1, z]);
        z -= 6;
      }
    }

    // 3️⃣ Jump arc (curve)
    else {
      for (let j = 0; j < 6; j++) {
        coins.push([
          0,
          1 + Math.sin(j / 5 * Math.PI) * 2, // arc
          z,
        ]);
        z -= 6;
      }
    }

    z -= 10; // gap between patterns
  }

  return coins;
}, []);

  const handleCollect = () => {
    setScore((prev) => prev + 10);
  };

  return (
    <div
      style={{ width: '100vw', height: '100vh', background: SETTINGS.skyColor }}
    >
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 6, 12]} fov={45} />
        <Environment preset="city" />
        <Sky
          sunPosition={[100, 20, 100]}
          turbidity={0.1}
          rayleigh={2}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />

        <CloudSystem />

        {balloons.map((b) => (
          <HotAirBalloon
            key={b.id}
            initialPos={b.initialPos}
            color={b.color}
            speedOffset={b.speedOffset}
            speed={gameSpeed}
          />
        ))}

        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight
          position={[10, 20, 10]}
          intensity={2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <hemisphereLight
          intensity={0.5}
          color="#ffffff"
          groundColor="#7ec0ee"
        />
        <fog attach="fog" args={[SETTINGS.skyColor, 30, 130]} />

        <RacingTrack isGameOver={isGameOver}  speed={gameSpeed}/>
        <Player isGameOver={isGameOver} onCollide={() => setIsGameOver(true)}  speed={gameSpeed} />
        {busPositions.map((z, i) => (
          <MovingBus key={`bus-${i}`} initialZ={z} isGameOver={isGameOver}  speed={gameSpeed}/>
        ))}
        {burgerPositions.map((pos, i) => (
          <Burger
            key={i}
            position={pos}
            onCollect={handleBurgerCollect}
            isGameOver={isGameOver}
            energy={energy}
            score={score}
             speed={gameSpeed}
          />
        ))}
        {carPositions.map((z, i) => (
          <MovingCar
            key={`car-${i}`}
            initialZ={z}
            color={i % 2 === 0 ? '#ff2222' : '#33ff33'}
            isGameOver={isGameOver}
             speed={gameSpeed}
          />
        ))}
        {conePositions.map((pos, idx) => (
          <TrafficCone
            key={`cone-${idx}`}
            initialPos={pos}
            isGameOver={isGameOver}
             speed={gameSpeed}
          />
        ))}
        <OilBarrel
          initialPos={[0, 0, -120]}
          isGameOver={isGameOver}
          score={score}
           speed={gameSpeed}
        />
        {/* Render Coins */}
        {coinPositions.map((pos, idx) => (
          <Coin
            key={idx}
            position={pos}
            onCollect={handleCollect}
            isGameOver={isGameOver}
             speed={gameSpeed}
          />
        ))}
        <StreetWall side={1} isGameOver={isGameOver}  speed={gameSpeed}/>
        <StreetWall side={-1} isGameOver={isGameOver}  speed={gameSpeed}/>
        <StreetLight initialZ={0} side={1}  speed={gameSpeed}/>
        <StreetLight initialZ={-25} side={-1}  speed={gameSpeed}/>
        <StreetLight initialZ={-50} side={1}  speed={gameSpeed}/>
        <StreetLight initialZ={-75} side={-1}  speed={gameSpeed}/>
        
      </Canvas>

      {/* UI Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          width: '100%',
          textAlign: 'center',
          color: '#333',
          fontFamily: 'Impact',
          pointerEvents: 'none',
        }}
      >
        <h1 style={{ fontSize: '3rem', margin: 0 }}>MORNING SPRINT</h1>
        <h2
          style={{
            fontSize: '2rem',
            color: '#FFD700',
            textShadow: '2px 2px #000',
          }}
        >
          Coins: {score}
        </h2>
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            height: '20px',
            background: '#333',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${energy}%`,
              height: '100%',
              background:
                energy > 60 ? '#4CAF50' : energy > 30 ? '#FFC107' : '#F44336',
              transition: 'width 0.2s',
            }}
          />
        </div>
      </div>
    </div>
  );
}
