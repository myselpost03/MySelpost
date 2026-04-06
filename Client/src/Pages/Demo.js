import React, { useState, Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera, Sky, useFBX, useProgress } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';

const SETTINGS = {
  speed: 0.5,
  trackWidth: 10,
  jumpForce: 0.19,
  gravity: -0.03,
  worldLength: 300,
  skyColor: '#e0f7ff', // Added this to prevent fog error
};

const CHARACTER_MODELS = {
  'cigar-man': {
    id: 'cigar-man',
    name: 'Cigar Man',
    path: '/models/Cigar-man.fbx',
    image: '/Characters/Cigar-man.png',
    price: 0,
  },
  'jenny': {
    id: 'jenny',
    name: 'Jenny',
    path: '/models/Jenny.fbx',
    image: '/Characters/Jenny.png',
    price: 5000,
  },
  'remy': {
    id: 'remy',
    name: 'Remy',
    path: '/models/Remy.fbx',
    image: '/Characters/Remy.png',
    price: 18000,
  },
  'big-vegus': {
    id: 'big-vegus',
    name: 'Big Vegus',
    path: '/models/Big-vegus.fbx',
    image: '/Characters/Big-vegus.png',
    price: 25000,
  },
  'vanguard': {
    id: 'vanguard',
    name: 'Vanguard',
    path: '/models/Vanguard.fbx',
    image: '/Characters/Vanguard.png',
    price: 50000,
  },
  'kachujin': {
    id: 'kachujin',
    name: 'Kachujin',
    path: '/models/Kachujin.fbx',
    image: '/Characters/Kachujin.png',
    price: 12000,
  },
  'swat-guy': {
    id: 'swat-guy',
    name: 'Swat Guy',
    path: '/models/Swat-guy.fbx',
    image: '/Characters/Swat-guy.png',
    price: 150000,
  },
  'rabbit': {
    id: 'rabbit',
    name: 'Rabbit',
    path: '/models/Rabbit.fbx',
    image: '/Characters/Rabbit.png',
    price: 200000,
  },
  'mutant': {
    id: 'mutant',
    name: 'Mutant',
    path: '/models/Mutant.fbx',
    image: '/Characters/Mutant.png',
    price: 500000,
  },
  'zombie': {
    id: 'zombie',
    name: 'Zombie',
    path: '/models/Zombie.fbx',
    image: '/Characters/Zombie.png',
    price: 550000,
  },
  // Coming Soon Section
  'elon': {
    id: 'elon',
    name: 'Elon',
    path: null,
    image: '/Characters/Elon.png',
    price: 99999,
    comingSoon: true,
  },
  'trump': {
    id: 'trump',
    name: 'Trump',
    path: null,
    image: '/Characters/Trump.png',
    price: 99999,
    comingSoon: true,
  },
  'putin': {
    id: 'putin',
    name: 'Putin',
    path: null,
    image: '/Characters/Putin.png',
    price: 99999,
    comingSoon: true,
  },
  'xi-jinping': {
    id: 'xi-jinping',
    name: 'Xi Jinping',
    path: null,
    image: '/Characters/Xi-jinping.png',
    price: 99999,
    comingSoon: true,
  },
};
// Key for LocalStorage
const STORAGE_KEYS = {
  COINS: 'morning_sprint_total_coins',
  UNLOCKED: 'morning_sprint_unlocked_chars',
  SELECTED: 'morning_sprint_selected_char',
};

// --- THEMES SYSTEM ---
const THEME_STORAGE_KEY = 'morning_sprint_unlocked_themes';

function getThemes() {
  return {
    road: {
      id: 'road',
      name: 'Road',
      skyColor: '#e0f7ff',
      fog: '#e0f7ff',
      price: 0,
      image: '/Themes/road.png',
      unlocked: true,
    },

    night: {
      id: 'night',
      name: 'Night',
      skyColor: '#0b0f2a',
      fog: '#0b0f2a',
      price: 5000,
      image: '/Themes/night.png',
    },

    monsoon: {
      id: 'monsoon',
      name: 'Monsoon',
      skyColor: '#5f6f7a',
      fog: '#5f6f7a',
      price: 8000,
      image: '/Themes/monsoon.png',
    },

    desert: {
      id: 'desert',
      name: 'Desert',
      skyColor: '#f7c873',
      fog: '#f7c873',
      price: 12000,
      image: '/Themes/desert.png',
    },

    snow: {
      id: 'snow',
      name: 'Snow',
      skyColor: '#f7c873',
      fog: '#f7c873',
      price: 12000,
      image: '/Themes/snow.png',
    },

    lava: {
      id: 'lava',
      name: 'Lava',
      skyColor: '#f7c873',
      fog: '#f7c873',
      price: 12000,
      image: '/Themes/lava.png',
    },

    space: {
      id: 'space',
      name: 'Space',
      skyColor: '#f7c873',
      fog: '#f7c873',
      price: 12000,
      image: '/Themes/space.png',
    },

    candy: {
      id: 'candy',
      name: 'Candy',
      skyColor: '#f7c873',
      fog: '#f7c873',
      price: 12000,
      image: '/Themes/candy.png',
    },

    forest: {
      id: 'forest',
      name: 'Forest',
      skyColor: '#f7c873',
      fog: '#f7c873',
      price: 12000,
      image: '/Themes/forest.png',
    },

    underwater: {
      id: 'underwater',
      name: 'Underwater',
      skyColor: '#f7c873',
      fog: '#f7c873',
      price: 12000,
      image: '/Themes/underwater.png',
    },

    fantasy: {
      id: 'fantasy',
      name: 'Fantasy',
      skyColor: '#f7c873',
      fog: '#f7c873',
      price: 12000,
      image: '/Themes/fantasy.png',
    },
  };
}

function ThemeShop({
  totalCoins,
  onPurchase,
  selectedTheme,
  onSelect,
  unlockedThemes,
  setUnlockedThemes,
  onClose,
  sound,
}) {
  const themes = Object.values(getThemes());
  const [index, setIndex] = useState(0);

  const current = themes[index];

  const isComingSoon = current.id !== 'road';
  const isUnlocked = unlockedThemes.includes(current.id);

  const handleBuy = () => {
    if (isComingSoon) return; // block interaction

    if (isUnlocked) {
      onSelect(current.id);
    } else if (totalCoins >= current.price) {
      const updated = [...unlockedThemes, current.id];
      setUnlockedThemes(updated);
      sound.play('purchase');
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(updated));
      onPurchase(current.price);
    }
  };

  return (
    <div className="theme-shop">
      <button onClick={onClose}>❌</button>

      <h2>{current.name}</h2>

      <div className="theme-preview">
        <img src={current.image} alt={current.name} />

        {!isUnlocked && (
          <div className="locked-overlay">
            🔒 LOCKED <br />
            {current.price} coins
          </div>
        )}
      </div>

      <button
        onClick={handleBuy}
        className={isComingSoon ? 'coming-soon-btn' : ''}
        disabled={isComingSoon}
      >
        {isComingSoon
          ? 'UPCOMING'
          : isUnlocked
          ? selectedTheme === current.id
            ? 'SELECTED'
            : 'SELECT'
          : `BUY ${current.price}`}
      </button>

      <div>
        <button
          onClick={() => {
            setIndex((i) => (i - 1 + themes.length) % themes.length);
            sound.play('click');
          }}
        >
          ◀
        </button>
        <button
          onClick={() => {
            setIndex((i) => (i + 1) % themes.length);
            sound.play('click');
          }}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

function Shop({
  totalCoins,
  onPurchase,
  onSelect,
  selectedId,
  onClose,
  sound,
}) {
  const characters = Object.values(CHARACTER_MODELS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.UNLOCKED);
    // Use 'cigar-man' as the default starting ID
    return saved ? JSON.parse(saved) : ['cigar-man'];
  });

  const currentChar = characters[currentIndex];
  const isUnlocked = unlocked.includes(currentChar.id);
  const isEquipped = selectedId === currentChar.id;
  const isComingSoon = currentChar.comingSoon;

  const nextChar = () => {
    sound.play('click');
    setCurrentIndex((prev) => (prev + 1) % characters.length);
  };

  const prevChar = () => {
    sound.play('click');
    setCurrentIndex(
      (prev) => (prev - 1 + characters.length) % characters.length
    );
  };
  const [showAlert, setShowAlert] = useState(false);

  const handleAction = () => {
    if (isComingSoon) return;

    if (isUnlocked) {
      sound.play('click');
      onSelect(currentChar.id);
    } else if (totalCoins >= currentChar.price) {
      sound.play('purchase');
      const newUnlocked = [...unlocked, currentChar.id];
      setUnlocked(newUnlocked);
      localStorage.setItem(STORAGE_KEYS.UNLOCKED, JSON.stringify(newUnlocked));
      onPurchase(currentChar.price, currentChar.id);
    } else {
      //sound.play('error'); // Maybe add a "buzz" or "fail" sound!
      setShowAlert(true); // Trigger our funky CSS modal

      // Auto-hide after 2 seconds
      if (window.alertTimeout) clearTimeout(window.alertTimeout);

      window.alertTimeout = setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };

  return (
    <>
      <div className="subway-shop-overlay">
        <div className="subway-header">
          <button
            className="subway-back-btn"
            onClick={() => {
              sound.play('click');
              onClose();
            }}
          >
            ◀
          </button>
          <div className="subway-coin-pill">
            <div className="coin-wrapper">
              <span className="realistic-coin"></span>
            </div>
            <span className="coin-count">{totalCoins}</span>
          </div>{' '}
        </div>

        <div className="shop-carousel-container">
          <button className="nav-arrow left" onClick={prevChar}>
            ◀
          </button>

          <div className="main-preview-area">
            <h2 className="char-name">{currentChar.name}</h2>

            <div
              className="canvas-wrapper"
              style={{
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* FAST LOADING IMAGE INSTEAD OF 3D CANVAS */}
              <img
                src={currentChar.image}
                alt={currentChar.name}
                className={`char-preview-img ${
                  isComingSoon ? 'grayscale' : ''
                }`}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto', // Forces horizontal centering
                }}
              />
              {isComingSoon && (
                <div className="coming-soon-badge">COMING SOON</div>
              )}
            </div>

            <div className="shop-controls">
              <button
                disabled={isComingSoon}
                className={`subway-btn ${
                  isComingSoon
                    ? 'btn-locked'
                    : isEquipped
                    ? 'btn-equipped'
                    : isUnlocked
                    ? 'btn-select'
                    : 'btn-buy'
                }`}
                onClick={handleAction}
              >
                {isComingSoon
                  ? 'LOCKED'
                  : isEquipped
                  ? 'SELECTED'
                  : isUnlocked
                  ? 'SELECT'
                  : `BUY: ${currentChar.price} 🟡`}
              </button>
            </div>
          </div>

          <button className="nav-arrow right" onClick={nextChar}>
            ▶
          </button>
        </div>

        <div className="dots-indicator">
          {characters.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
      {showAlert && (
        <div className="coin-alert-overlay">
          <div className="coin-alert-card">
            <h2 className="alert-title" data-text="NOT ENOUGH!">
              NOT ENOUGH!
            </h2>
            <p className="alert-msg">
              Go run some more to get{' '}
              <span className="needed-coins">
                {currentChar.price - totalCoins}
              </span>{' '}
              more coins!
            </p>
            <button
              className="btn-funky btn-grab-coins"
              onClick={() => setShowAlert(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Loader({ onLoaded }) {
  const { progress } = useProgress();
  const sound = useRef(null);

  useEffect(() => {
    sound.current = new Audio('/Sounds/Loading.mp3');
    sound.current.loop = true;
    sound.current.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (progress === 100) {
      sound.current.pause();

      setTimeout(() => onLoaded(), 500);
    }
  }, [progress, onLoaded]);

  

  return (
    <div className="game-loading-overlay">
      <div className="loading-content">
        {/* Sprint Title */}
        <h1 className="loading-title-funky">MORNING SPRINT...</h1>

        <div className="loader-energy-bar-container">
          {/* Replaced Burger with Sprint Icon */}
          <div className="sprint-icon">🏃‍♂️</div>
          <div
            className="loader-energy-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="loading-percentage">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}

const EnergyBar = React.memo(({ energy, isPaused }) => {
  // ✅ Memoized color

  const barColor = useMemo(() => {
    if (energy > 60) return '#2ecc71';
    if (energy > 30) return '#f1c40f';
    return '#e74c3c';
  }, [energy]);

  // ✅ Memoized style object
  const barStyle = useMemo(() => {
    return {
      width: `${energy}%`,
      backgroundColor: barColor,
    };
  }, [energy, barColor]);
  if (isPaused) return;
  return (
    <div className="energy-bar-container">
      <div className="burger-icon">🍔</div>

      <div className="energy-bar-fill" style={barStyle} />

      {energy <= 30 && <div className="low-energy-pulse" />}
    </div>
  );
});

// --- BUS COMPONENT ---
function MovingBus({
  initialZ,
  isGameOver,
  speedMultiplier,
  register,
  isPaused,
}) {
  const ref = useRef();

  const fbx = useLoader(FBXLoader, 'models/scene.fbx');
  const busModel = useMemo(() => fbx.clone(), [fbx]);

  const lanes = [-2.5, 0, 2.5];
  const [currentLane] = useState(lanes[Math.floor(Math.random() * 3)]);

  // 👉 FIX: compute bounding box height
  const [yOffset, setYOffset] = useState(0);
  useEffect(() => {
    if (ref.current) {
      register(ref.current);
    }
  }, []);
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(busModel);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Half height so bottom sits on road
    setYOffset(size.y / 2);
  }, [busModel]);

  useFrame((state) => {
    if (!ref.current || isGameOver || isPaused) return;

    ref.current.position.z += SETTINGS.speed * speedMultiplier * 3;

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

function MovingCar({
  initialZ,
  isGameOver,
  speedMultiplier,
  register,
  isPaused,
}) {
  const ref = useRef();

  // 1. Load the FBX model instead of GLTF
  const fbx = useFBX('/models/Car.fbx');

  // 2. Clone the model so each instance of MovingCar has its own geometry
  const modelCopy = useMemo(() => fbx.clone(), [fbx]);

  const lanes = [-2.5, 0, 2.5];
  const currentLane = useMemo(() => lanes[Math.floor(Math.random() * 3)], []);

  useEffect(() => {
    if (ref.current) {
      register(ref.current);
    }
  }, [register]);

  useFrame(() => {
    if (!ref.current || isGameOver || isPaused) return;

    // Movement logic
    ref.current.position.z += SETTINGS.speed * speedMultiplier * 5;

    // Respawn logic
    if (ref.current.position.z > 20) {
      ref.current.position.z = -200 - Math.random() * 100;
      ref.current.position.x = lanes[Math.floor(Math.random() * lanes.length)];
    }
  });

  return (
    <primitive
      ref={ref}
      object={modelCopy} // Use the cloned FBX object
      position={[currentLane, 0.4, initialZ]}
      scale={[0.009, 0.009, 0.009]} // FBX models are often 100x larger than GLB/GLTF
      userData={{ type: 'car' }}
    />
  );
}
// --- TRAFFIC CONE COMPONENT ---
function TrafficCone({
  initialPos,
  isGameOver,
  speedMultiplier,
  register,
  isPaused,
}) {
  const ref = useRef();
  const lanes = [-3, 0, 3];

  // Load the cone texture
  const texture = useLoader(THREE.TextureLoader, '/Sprites/cone.png');
  useEffect(() => {
    if (ref.current) {
      register(ref.current);
    }
  }, []);
  useFrame((state) => {
    if (!ref.current || isGameOver || isPaused) return;
    // 1. Billboard effect: Make the cone always face the camera
    ref.current.lookAt(state.camera.position);

    // 2. Movement logic
    ref.current.position.z += SETTINGS.speed * speedMultiplier * 2.5;

    // 3. Respawn logic
    if (ref.current.position.z > 20) {
      ref.current.position.z = -150 - Math.random() * 50;
      ref.current.position.x = lanes[Math.floor(Math.random() * lanes.length)];
    }
  });
  const coneHeight = 2.5;
  return (
    <mesh
      ref={ref}
      position={[initialPos[0], coneHeight / 2, initialPos[2]]}
      userData={{ type: 'cone' }}
    >
      {/* Using PlaneGeometry for the sprite. 
          Adjust args [width, height] to match your cone's aspect ratio. 
      */}
      <planeGeometry args={[2, coneHeight]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        alphaTest={0.5} // Helps with edge clipping/transparency artifacts
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function OilBarrel({
  initialPos,
  isGameOver,
  score,
  speedMultiplier,
  register,
  isPaused,
}) {
  const ref = useRef();
  const lanes = [-3, 0, 3];

  // 1. Set Barrel dimensions (A bit wider/taller than the cone)
  const barrelWidth = 1.8;
  const barrelHeight = 2;

  const texture = useLoader(THREE.TextureLoader, '/Sprites/oil-barrel.png');
  useEffect(() => {
    if (ref.current) {
      register(ref.current);
    }
  }, []);
  useFrame((state) => {
    if (!ref.current || isGameOver || isPaused) return;
    // Billboard effect: Keep the sprite facing the player
    ref.current.lookAt(state.camera.position);

    ref.current.position.z += SETTINGS.speed * speedMultiplier * 2;

    // Respawn & Difficulty logic
    if (ref.current.position.z > 20) {
      const spawnChance = 0.2 + score / 5000;
      if (Math.random() < spawnChance) {
        ref.current.position.z = -150 - Math.random() * 100;
        ref.current.position.x =
          lanes[Math.floor(Math.random() * lanes.length)];
        // Ensure Y stays at the grounded offset
        ref.current.position.y = barrelHeight / 2;
      } else {
        ref.current.position.z = -300 - Math.random() * 200;
      }
    }
  });

  return (
    <mesh
      ref={ref}
      // Lift by half height to keep it on the ground
      position={[initialPos[0], barrelHeight / 2, initialPos[2]]}
      userData={{ type: 'barrel' }}
    >
      <planeGeometry args={[barrelWidth, barrelHeight]} />
      <meshBasicMaterial map={texture} transparent={true} alphaTest={0.5} />
    </mesh>
  );
}

//--- COIN COMPONENT ---
function Coin({ position, onCollect, isGameOver, speedMultiplier, isPaused }) {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, '/Sprites/coin.png');

  const frames = 8; // number of frames in sprite
  const currentFrame = useRef(0);
  const frameTime = useRef(0);

  // Setup texture tiling
  useMemo(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1 / frames, 1);
  }, [texture]);

  useFrame((state, delta) => {
    if (!ref.current || isGameOver || isPaused) return;
    ref.current.lookAt(state.camera.position);
    // Move forward
    ref.current.position.z += SETTINGS.speed * speedMultiplier * 2;

    // Respawn
    if (ref.current.position.z > 20) {
      ref.current.position.z = -SETTINGS.worldLength;
      ref.current.visible = true;
    }

    // 🎞 Animate sprite
    frameTime.current += delta;
    if (frameTime.current > 0.08) {
      frameTime.current = 0;
      currentFrame.current = (currentFrame.current + 1) % frames;

      texture.offset.x = currentFrame.current / frames;
    }

    // 💥 Collision
    const player = state.scene.getObjectByName('playerGroup');
    if (player && ref.current.visible) {
      if (
        Math.abs(player.position.z - ref.current.position.z) < 1 &&
        Math.abs(player.position.x - ref.current.position.x) < 1
      ) {
        ref.current.visible = false;
        onCollect();
      }
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[1.5, 1.5]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

const balloonGeo = new THREE.DodecahedronGeometry(2, 0);
const basketGeo = new THREE.BoxGeometry(0.8, 0.7, 0.8);
const ropeGeo = new THREE.CylinderGeometry(0.01, 0.01, 1.5, 3);

function HotAirBalloon({ initialPos, color, speedOffset }) {
  const mesh = useRef();

  const spawnDistance = -400;
  const deleteDistance = 50;

  // 🔧 Cache random X offset instead of recalculating too often
  const randomX = useRef((Math.random() - 0.5) * 60);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    const t = state.clock.elapsedTime; // ✅ faster than getElapsedTime()

    // ✅ Proper frame-independent movement
    mesh.current.position.z += (SETTINGS.speed * 0.3 + speedOffset) * delta;

    // ✅ Smooth floating animation
    mesh.current.position.y =
      initialPos[1] + Math.sin(t * 0.3 + initialPos[0]) * 2;

    mesh.current.rotation.z = Math.sin(t * 0.2 + initialPos[0]) * 0.05;

    // 🔁 Recycling
    if (mesh.current.position.z > deleteDistance) {
      mesh.current.position.z = spawnDistance;

      // Update random X only when recycled
      randomX.current = (Math.random() - 0.5) * 60;
      mesh.current.position.x = randomX.current;
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
function Player({ isGameOver, onCollide, selectedCharacter, isPaused }) {
  const group = useRef();
  const swipeProcessed = useRef(false);

  // --- ROBUST INVULNERABILITY ---
  const [isInvulnerable, setIsInvulnerable] = useState(false);
  const blinkRef = useRef(0);
  const lastGameOverState = useRef(isGameOver);

  // Detect the EXACT moment of revival
  useEffect(() => {
    // If it WAS game over, and now it is NOT (Revived)
    if (lastGameOverState.current === true && isGameOver === false) {
      setIsInvulnerable(true);
      blinkRef.current = 0;

      const timer = setTimeout(() => {
        setIsInvulnerable(false);
        if (group.current) group.current.visible = true;
      }, 3000); // Increased to 3s to give the player time to move past the obstacle

      return () => clearTimeout(timer);
    }
    lastGameOverState.current = isGameOver;
  }, [isGameOver]);
  // Inside Player component
  const modelPath =
    selectedCharacter && CHARACTER_MODELS[selectedCharacter]
      ? CHARACTER_MODELS[selectedCharacter].path
      : CHARACTER_MODELS['cigar-man'].path; // Use 'cigar-man' as the specific fallback key
  const animationSource = useLoader(FBXLoader, '/models/Cigar-man.fbx');
  const runAnimation = animationSource.animations[0];
  const runFbx = useLoader(FBXLoader, modelPath);
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
  // 2. Define Actions (Outside useEffect so they are accessible)
  const triggerJump = () => {
    // Check if on ground and not already sliding/jumping
    if (group.current.position.y <= 0.51 && !isSliding && !isJumping) {
      velocity.current = SETTINGS.jumpForce;
      setIsJumping(true);

      // Snappy transition: stop slide immediately, fade out run quickly
      actions.current.run?.fadeOut(0.05);
      actions.current.slide?.stop();

      // Play jump immediately
      const jumpAction = actions.current.jump;
      if (jumpAction) {
        jumpAction.reset().setEffectiveTimeScale(1.2).fadeIn(0.05).play();
        // Note: setEffectiveTimeScale(1.2) makes the animation 20% faster
        // to match the "force" of a quick jump.
      }
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
    const clip = runAnimation.clone();

    // remove root motion (good you already do this)
    clip.tracks = clip.tracks.filter((t) => !t.name.includes('position'));

    actions.current.run = mixer.current.clipAction(clip);
    actions.current.run.play();
    setupAction(jumpFbx, 'jump', false);
    setupAction(slideFbx, 'slide', false);
    setupAction(deathFbx, 'death', false);
    actions.current.run?.play();
  }, [runFbx, jumpFbx, slideFbx, deathFbx]);

  useEffect(() => {
    if (isGameOver) {
      actions.current.run?.fadeOut(0.2);
      actions.current.death?.reset().fadeIn(0.1).play();
    } else {
      actions.current.death?.fadeOut(0.2);
      actions.current.run?.reset().fadeIn(0.2).play();
    }
  }, [isGameOver]);
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
    if (!isPaused) {
      mixer.current?.update(delta);
    }
    // --- Visual Blinking Logic ---
    if (isInvulnerable) {
      blinkRef.current += delta * 15; // Faster blink for better feedback
      group.current.visible = Math.floor(blinkRef.current) % 2 === 0;
    } else {
      if (!isGameOver) group.current.visible = true;
    }

    if (isGameOver || isPaused) return;

    const player = group.current;

    // 1. Movement
    player.position.x = THREE.MathUtils.lerp(
      player.position.x,
      lane * laneWidth,
      0.15
    );
    velocity.current += SETTINGS.gravity;
    player.position.y += velocity.current;

    if (player.position.y <= 0.5) {
      player.position.y = 0.5;
      velocity.current = 0;
      if (isJumping) {
        setIsJumping(false);
        actions.current.jump?.fadeOut(0.1);
        actions.current.run?.reset().fadeIn(0.1).play();
      }
    }

    // 2. COLLISION DETECTION
    // STAGE 1: Check invulnerability first
    if (isInvulnerable) return;

    // STAGE 2: If not invulnerable, run collision
    const obstacles = [];
    state.scene.traverse((obj) => {
      if (['bus', 'car', 'cone', 'barrel'].includes(obj.userData?.type)) {
        obstacles.push(obj);
      }
    });

    for (let obs of obstacles) {
      const dz = Math.abs(player.position.z - obs.position.z);
      const dx = Math.abs(player.position.x - obs.position.x);

      // Wider detection for heavy vehicles, tighter for cones
      if (dz < 1.5 && dx < 1.4) {
        const type = obs.userData.type;

        if (type === 'bus' || type === 'car') {
          onCollide();
          break;
        }

        if (type === 'cone' || type === 'barrel') {
          // If we aren't high enough or jumping, we die
          if (!(isJumping || player.position.y > 1.1)) {
            onCollide();
            break;
          }
        }
      }
    }
  });
  return (
    <group ref={group} name="playerGroup" position={[0, 0.5, -2]}>
      <group position={[0, isSliding ? -0.2 : 0, 0]}>
        <primitive
          key={modelPath}
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
function IndividualCloud({ position, texture, scale = 1 }) {
  const ref = useRef();

  // Clouds move slower than the ground to create parallax depth
  useFrame((state) => {
    if (!ref.current) return;

    // Always face camera
    ref.current.lookAt(state.camera.position);

    // Parallax movement (clouds move at 40% of game speed)
    ref.current.position.z += SETTINGS.speed * 0.4;

    // Respawn logic for individual cloud
    if (ref.current.position.z > 50) {
      ref.current.position.z = -200 - Math.random() * 100;
      ref.current.position.x = (Math.random() - 0.5) * 100; // Spread them out wide
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <planeGeometry args={[25, 12]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.8} // Clouds look better slightly see-through
        depthWrite={false}
      />
    </mesh>
  );
}

function CloudSystem({ isGameOver }) {
  // Load one cloud texture and reuse it for all instances
  const cloudTexture = useLoader(THREE.TextureLoader, '/Sprites/cloud.png');

  if (isGameOver) return null;

  return (
    <group>
      {/* Cloud 1 - Center High */}
      <IndividualCloud
        texture={cloudTexture}
        position={[0, 20, -100]}
        scale={1.2}
      />

      {/* Cloud 2 - Right Far */}
      <IndividualCloud
        texture={cloudTexture}
        position={[40, 25, -150]}
        scale={1.5}
      />

      {/* Cloud 3 - Left Mid */}
      <IndividualCloud
        texture={cloudTexture}
        position={[-40, 22, -120]}
        scale={1}
      />

      {/* Cloud 4 - Extra for more "Fullness" */}
      <IndividualCloud
        texture={cloudTexture}
        position={[20, 18, -180]}
        scale={0.8}
      />
    </group>
  );
}

function StreetWall({ side = 1, isGameOver, speedMultiplier, isPaused }) {
  const materialRef = useRef();

  const wallTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 1. Base
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 512, 512);

    // 🔧 Reduce grit density (performance win)
    for (let i = 0; i < 800; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
    }

    const rows = 8; // 🔧 reduced from 10
    const rowHeight = 512 / rows;

    for (let r = 0; r < rows; r++) {
      const stonesInRow = 4;
      const colWidth = 512 / stonesInRow;

      for (let c = 0; c < stonesInRow; c++) {
        const xOffset = (r % 2) * (colWidth / 2);
        const jitter = (Math.random() - 0.5) * 10; // 🔧 reduced jitter
        const x = c * colWidth + xOffset - colWidth / 2 + jitter;
        const y = r * rowHeight;

        // 🔧 Simplified shading (remove gradient = BIG win)
        const lightness = 25 + Math.random() * 10;
        ctx.fillStyle = `hsl(30, 5%, ${lightness}%)`;

        ctx.fillRect(x + 4, y + 4, colWidth - 8, rowHeight - 8);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 8);

    // 🔧 PERFORMANCE OPTIMIZATION
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    // 🔥 Reduce anisotropy (huge impact)
    tex.anisotropy = 2;

    tex.needsUpdate = true;

    return tex;
  }, []);

  // 🧹 Cleanup
  useEffect(() => {
    return () => {
      wallTexture.dispose();
    };
  }, [wallTexture]);

  useFrame((state, delta) => {
    if (isGameOver || !materialRef.current || isPaused) return;

    const map = materialRef.current.map;

    map.offset.y -= SETTINGS.speed * delta * 0.8;

    // 🔒 Prevent precision lag over time
    map.offset.y %= 1;
  });

  const WALL_HEIGHT = 2.5;

  return (
    <group
      position={[side * (SETTINGS.trackWidth / 2 + 0.6), WALL_HEIGHT / 2, 0]}
    >
      {/* Main Wall */}
      <mesh>
        <boxGeometry args={[1.2, WALL_HEIGHT, 300]} />
        <meshStandardMaterial
          ref={materialRef}
          map={wallTexture}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Top ledge */}
      <mesh position={[0, WALL_HEIGHT / 2 + 0.1, 0]}>
        <boxGeometry args={[1.5, 0.3, 300]} />
        <meshStandardMaterial color="#333" roughness={1} />
      </mesh>
    </group>
  );
}

function StreetLight({
  initialZ,
  side = 1,
  isGameOver,
  speedMultiplier,
  isPaused,
}) {
  const group = useRef();

  const fbx = useLoader(FBXLoader, '/models/Lamp.fbx');

  // 🔥 Clone ONCE and reuse efficiently
  const modelClone = useMemo(() => {
    const clone = fbx.clone();

    // Optional: optimize meshes inside model
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = false;

        // 🔧 PERFORMANCE: simplify material
        if (child.material) {
          child.material = child.material.clone();
          child.material.flatShading = true;
        }
      }
    });

    return clone;
  }, [fbx]);

  // 🧹 Cleanup to prevent memory leaks
  useEffect(() => {
    return () => {
      modelClone.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    };
  }, [modelClone]);

  useFrame((state, delta) => {
    if (isGameOver || !group.current || isPaused) return;

    // ✅ Frame-rate independent movement
    group.current.position.z += SETTINGS.speed * speedMultiplier * delta * 60;

    // 🔁 Reset position efficiently
    if (group.current.position.z > 20) {
      group.current.position.z = -100;
    }
  });

  return (
    <group ref={group} position={[side * 5.5, 0, initialZ]}>
      <primitive
        object={modelClone}
        scale={0.01}
        rotation={[0, side === 1 ? 0 : Math.PI, 0]}
      />
    </group>
  );
}

function RacingTrack({ isGameOver, speedMultiplier, isPaused }) {
  const textureRef = useRef();

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
    ctx.setLineDash([80, 80]);
    ctx.lineDashOffset = 0;
    ctx.beginPath();
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 1024);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 10);

    // 🔧 PERFORMANCE OPTIMIZATION
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;

    return tex;
  }, []);

  // 🧹 CLEANUP (prevents memory leaks)
  useEffect(() => {
    return () => {
      trackTexture.dispose();
    };
  }, [trackTexture]);

  useFrame((state, delta) => {
    if (isGameOver || !textureRef.current || isPaused) return;

    // 🚀 Smooth scrolling
    textureRef.current.map.offset.y -=
      SETTINGS.speed * speedMultiplier * delta * 2;

    // 🔒 Prevent floating-point overflow lag
    textureRef.current.map.offset.y %= 1;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, -50]}>
      <planeGeometry args={[SETTINGS.trackWidth, 300]} />
      <meshStandardMaterial
        ref={textureRef}
        map={trackTexture}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

function Burger({
  position,
  onCollect,
  isGameOver,
  energy,
  score,
  speedMultiplier,
  isPaused,
}) {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, '/Sprites/burger.png');

  const floatOffset = useRef(Math.random() * Math.PI * 2);
  const respawnCooldown = useRef(0);
  const [collected, setCollected] = useState(false);

  useFrame((state, delta) => {
    if (!ref.current || isPaused || isGameOver) return;

    ref.current.visible = !collected;
    if (isGameOver) return;

    floatOffset.current += delta;

    // 🚀 Movement
    const moveStep = SETTINGS.speed * speedMultiplier * 2.5;
    const previousZ = ref.current.position.z;
    ref.current.position.z += moveStep;

    // ✨ Floating animation
    ref.current.position.y =
      position[1] + Math.sin(floatOffset.current * 2) * 0.3;

    // 🎯 Always face camera (billboard)
    ref.current.lookAt(state.camera.position);

    // ✨ Fake glow pulse (scale instead of emissive)
    const pulse = (Math.sin(floatOffset.current * 3) + 1) / 2;
    const scale = 1 + pulse * 0.2;
    ref.current.scale.set(scale, scale, scale);

    // 🎯 Collision (your improved logic kept)
    if (!collected) {
      const player = state.scene.getObjectByName('playerGroup');

      if (player) {
        const dx = Math.abs(player.position.x - ref.current.position.x);

        const isCurrentlyOverlapping =
          Math.abs(player.position.z - ref.current.position.z) < 1.5;

        const didJustPassPlayer = previousZ < -2 && ref.current.position.z > -2;

        if (dx < 1.2 && (isCurrentlyOverlapping || didJustPassPlayer)) {
          setCollected(true);
          if (onCollect) onCollect();
        }
      }
    }

    // 🔁 Respawn logic (unchanged)
    respawnCooldown.current -= delta;

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
  });

  return (
    <mesh ref={ref} position={position} userData={{ type: 'pickup' }}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

// --- SOUND SYSTEM ---
const useSoundManager = () => {
  const sounds = useRef({});

  useEffect(() => {
    sounds.current = {
      bg: new Audio('/Sounds/Background.mp3'),
      gameOverBg: new Audio('/Sounds/Game-over.mp3'),
      shopBg: new Audio('/Sounds/shop-background.mp3'),

      coin: new Audio('/Sounds/coin.mp3'),
      burger: new Audio('/Sounds/Burger.mp3'),
      collision: new Audio('/Sounds/Collision.mp3'),
      dead: new Audio('/Sounds/Dead.mp3'),

      click: new Audio('/Sounds/Button-click.mp3'),
      purchase: new Audio('/Sounds/Purchase.mp3'),
      loading: new Audio('/Sounds/Loading.mp3'),
    };

    // Loop background music
    sounds.current.bg.loop = true;
    sounds.current.gameOverBg.loop = false;
    sounds.current.shopBg.loop = true;

    // Volume tuning
    sounds.current.bg.volume = 0.4;
    sounds.current.shopBg.volume = 0.4;
    sounds.current.gameOverBg.volume = 0.5;

    Object.values(sounds.current).forEach((audio) => {
      audio.preload = 'auto';
    });
  }, []);

  const play = (name) => {
    const sound = sounds.current[name];
    if (!sound) return;

    if (!sound.paused) sound.currentTime = 0;
    sound.play().catch(() => {});
  };
  const loop = (name) => {
    const sound = sounds.current[name];
    if (!sound) return;
    sound.play().catch(() => {});
  };

  const stop = (name) => {
    const sound = sounds.current[name];
    if (!sound) return;
    sound.pause();
    sound.currentTime = 0;
  };

  const stopAll = () => {
    Object.values(sounds.current).forEach((s) => {
      s.pause();
      s.currentTime = 0;
    });
  };

  return { play, loop, stop, stopAll };
};

// --- MAIN DEMO COMPONENT ---
export default function Demo() {
  const [isLoading, setIsLoading] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showGameOverScreen, setShowGameOverScreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [isThemeShopOpen, setIsThemeShopOpen] = useState(false);
  const [reviveCount, setReviveCount] = useState(3);
  const [distance, setDistance] = useState(0);
  const [bestDistance, setBestDistance] = useState(() => {
  return parseFloat(localStorage.getItem('BEST_DISTANCE')) || 0;
});
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [energy, setEnergy] = useState(100);
  const energyBoostRef = useRef(0);
  const obstaclesRef = useRef([]);
  const THEMES = useMemo(() => getThemes(), []);

  const [selectedTheme, setSelectedTheme] = useState('road');

  const [unlockedThemes, setUnlockedThemes] = useState(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved ? JSON.parse(saved) : ['road'];
  });

  const registerObstacle = (obj, removeObj) => {
    if (obj) {
      if (!obstaclesRef.current.includes(obj)) {
        obstaclesRef.current.push(obj);
      }
    }

    if (removeObj) {
      obstaclesRef.current = obstaclesRef.current.filter(
        (o) => o !== removeObj
      );
    }
  };

  const [totalCoins, setTotalCoins] = useState(
    () => parseInt(localStorage.getItem(STORAGE_KEYS.COINS)) || 0
  );
  const [selectedCharacter, setSelectedCharacter] = useState(
    () => localStorage.getItem(STORAGE_KEYS.SELECTED) || 'default'
  );

  const sound = useSoundManager();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 🔇 App is minimized / switched
        sound.stopAll();
      } else {
        // 🔊 App is back
        if (!isGameOver && !isShopOpen) {
          sound.loop('bg');
        } else if (isGameOver) {
          sound.play('gameOverBg');
        } else if (isShopOpen) {
          sound.loop('shopBg');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isGameOver, isShopOpen]);

  useEffect(() => {
    if (isGameOver) {
      const newTotal = totalCoins + score;
      setTotalCoins(newTotal);
      localStorage.setItem(STORAGE_KEYS.COINS, newTotal);
      setBestDistance((prevBest) => {
      if (distance > prevBest) {
        localStorage.setItem('BEST_DISTANCE', distance);
        return distance;
      }
      return prevBest;
    });
    }
  }, [isGameOver]);

  // Start game music
  useEffect(() => {
    if (!isLoading && !isGameOver && !isShopOpen) {
      sound.stopAll();
      sound.loop('bg');
    }
  }, [isLoading, isGameOver, isShopOpen]);

  // Game Over music
  useEffect(() => {
    if (isGameOver) {
      sound.stopAll();

      sound.play('dead');
      sound.loop('gameOverBg');
    }
  }, [isGameOver]);

  // Shop music
  useEffect(() => {
    if (isShopOpen) {
      sound.stopAll();
      sound.loop('shopBg');
    }
  }, [isShopOpen]);

  useEffect(() => {
    if (isGameOver) {
      const timer = setTimeout(() => {
        setShowGameOverScreen(true);
      }, 1500); // ⏱ match your death animation duration

      return () => clearTimeout(timer);
    }
  }, [isGameOver]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

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
  }, [speedMultiplier, isGameOver, isPaused]);

  // Increase speed as score increases
  useEffect(() => {
    const newMultiplier = 1 + Math.floor(score / 150) * 0.2; // +20% speed every 150 points
    setSpeedMultiplier(newMultiplier);
  }, [score]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const interval = setInterval(() => {
      setDistance((prev) => {
        // base increment per 100ms (tweak for pacing)
        const increment = 1 * speedMultiplier; // 1 meter per tick times speed multiplier
        return prev + increment;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [speedMultiplier, isGameOver, isPaused]);

  useEffect(() => {
    if (isPaused) {
      sound.stopAll();
    } else {
      if (!isGameOver && !isShopOpen) {
        sound.loop('bg');
      }
    }
  }, [isPaused, isGameOver, isShopOpen]);

  const handleStartGame = () => {
    sound.play('click');

    setHasStarted(true); // show loader
    setIsLoading(true); // trigger loading screen

    // Reset game before starting
    setIsGameOver(false);
    setShowGameOverScreen(false);
    setScore(0);
    setDistance(0);
    setSpeedMultiplier(1);
    setEnergy(100);
    setReviveCount(3);
  };

  const handlePurchase = (price, charId) => {
    sound.play('purchase');

    const newBalance = totalCoins - price;
    setTotalCoins(newBalance);
    localStorage.setItem(STORAGE_KEYS.COINS, newBalance);
    setSelectedCharacter(charId);
    localStorage.setItem(STORAGE_KEYS.SELECTED, charId);
  };

  const handleSelect = (charId) => {
    setSelectedCharacter(charId);
    localStorage.setItem(STORAGE_KEYS.SELECTED, charId);
  };

  const handleTryAgain = () => {
    sound.play('click');

    // Reset core game states
    setIsGameOver(false);
    setShowGameOverScreen(false);
    setIsPaused(false);

    // Reset gameplay stats
    setScore(0);
    setDistance(0);
    setSpeedMultiplier(1);
    setEnergy(100);

    // Reset revive count (optional: or keep it if you want)
    setReviveCount(3);

    // Reset temporary boosts
    energyBoostRef.current = 0;

    // Clear obstacles (important to avoid instant death)
    obstaclesRef.current = [];
  };

  const handleBurgerCollect = () => {
    sound.play('burger');
    setEnergy((prev) => Math.min(100, prev + 25));
    energyBoostRef.current = 2;
  };

  const handleCollect = () => {
    sound.play('coin');
    setScore((prev) => prev + 10);
  };

  const handleRevive = () => {
    if (reviveCount > 0) {
      // 1. Deduct a life
      setReviveCount((prev) => prev - 1);

      // 2. Hide the death screens
      setIsGameOver(false);
      setShowGameOverScreen(false);

      // 3. Reset survival resources
      setEnergy(100);
      energyBoostRef.current = 2; // Give 2 seconds of invulnerability/no drain

      // NOTE: We do NOT call setScore(0) or setDistance(0) here.
      // This ensures the player stays at the same "wp" (world position).
    }
  };

  const balloons = useMemo(() => {
    const colors = [
      '#ff6b6b',
      '#4ecdc4',
      '#ffe66d',
      '#ff9f43',
      '#a29bfe',
      '#fd79a8',
    ];
    const count = 10; // More balloons for a denser sky

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
    return [
      [0, 1, -20],
      [2, 1, -40],
      [-2, 1, -60],
      [0, 2.5, -80], // High coin requires jump
      [3, 1, -100],
    ];
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: THEMES[selectedTheme].skyColor,
      }}
    >
      {hasStarted && isLoading && (
        <Loader onLoaded={() => setIsLoading(false)} />
      )}
      {isThemeShopOpen && (
        <ThemeShop
          totalCoins={totalCoins}
          selectedTheme={selectedTheme}
          unlockedThemes={unlockedThemes}
          setUnlockedThemes={setUnlockedThemes}
          onSelect={(id) => setSelectedTheme(id)}
          onPurchase={(price) => {
            setTotalCoins((prev) => prev - price);
          }}
          sound={sound}
          onClose={() => {
            setIsThemeShopOpen(false);
            setHasStarted(false);
            sound.play('click');
          }}
        />
      )}
      {isPaused && !isGameOver && (
        <div className="pause-overlay">
          <div className="pause-card">
            <h1 className="pause-title">PAUSED</h1>

            <div className="pause-buttons">
              <button
                className="btn-funky"
                onClick={() => {
                  sound.play('click');
                  setIsPaused(false);
                }}
              >
                ▶ RESUME
              </button>

              <button
                className="btn-funky"
                onClick={() => {
                  sound.play('click');
                  handleTryAgain(); // reuse your reset logic
                }}
              >
                🔁 RESTART
              </button>

              <button
                className="btn-funky"
                onClick={() => {
                  sound.play('click');
                  setIsPaused(false);
                  setHasStarted(false); // go back to start screen
                }}
              >
                🏠 EXIT
              </button>
            </div>
          </div>
        </div>
      )}
      {isShopOpen && (
        <Shop
          totalCoins={totalCoins}
          selectedId={selectedCharacter}
          onPurchase={handlePurchase}
          onSelect={handleSelect}
          onClose={() => {
            setIsShopOpen(false);
            setShowGameOverScreen(true);
          }}
          sound={sound}
        />
      )}
      {showGameOverScreen && (
        <div className="game-over-container">
          <h1 className="wasted-text">WASTED</h1>
          <div className="revive-counter">
            <span className="revive-icon">❤️</span>
            <span>Revives Left: {reviveCount}</span>
          </div>
          <div className="button-row">
            <button
              className="btn-funky try-again"
              onClick={() => {
                handleTryAgain();
                sound.play('click');
              }}
            >
              TRY AGAIN
            </button>
            <button
              className={`btn-funky revive ${
                reviveCount === 0 ? 'disabled' : ''
              }`}
              onClick={() => {
                sound.play('click');
                handleRevive();
              }}
              disabled={reviveCount === 0}
              style={{ opacity: reviveCount === 0 ? 0.5 : 1 }}
            >
              {reviveCount > 0 ? `REVIVE (-1)` : 'NO REVIVES'}
            </button>
            <button
              className="btn-funky home"
              onClick={() => {
                setHasStarted(false);
                sound.play('click');
              }}
            >
              HOME
            </button>
            <button
              className="btn-funky shop"
              onClick={() => {
                sound.play('click');
                setShowGameOverScreen(false); // Hide Game Over screen
                setIsShopOpen(true); // Open Shop overlay
              }}
            >
              SHOP
            </button>{' '}
            <button
              className="btn-funky"
              onClick={() => {
                sound.play('click');
                setShowGameOverScreen(false); // 👈 hide game over UI
                setIsPaused(true);
                setIsThemeShopOpen(true);
              }}
            >
              THEMES
            </button>
          </div>
        </div>
      )}
      {!hasStarted && (
        <div className="start-screen">
          {/* Back button at the top left */}
          <button
            className="subway-back-btn start-back"
            onClick={() => {
              sound.play('click');
            }}
          >
            ‹
          </button>

          <div className="start-content">
            <div className="title-container">
              <h1 className="game-title" data-text="MORNING SPRINT">
                MORNING SPRINT
              </h1>
              <div className="title-glow"></div>
            </div>

            <div className="start-actions">
              <button
                className="btn-start-massive"
                onClick={() => {
                  sound.play('click');
                  handleStartGame();
                }}
              >
                START GAME
              </button>
<p className="best-distance">
  BEST:{" "}
  {bestDistance < 1000
    ? `${Math.floor(bestDistance)} m`
    : `${(bestDistance / 1000).toFixed(1)} km`}
</p>
              {/* Optional: Subtle sub-text to fill space */}
              <p className="start-subtitle">BEAT YOUR HIGH SCORE!</p>
            </div>
          </div>

          {/* Animated background shapes */}
          <div className="bg-blob"></div>
          <div className="bg-blob-2"></div>
        </div>
      )}
      {hasStarted && (
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 6, 12]} fov={45} />
          {/* <Environment preset="city" />*/}
          <Sky
            sunPosition={[100, 20, 100]}
            turbidity={selectedTheme === 'night' ? 10 : 0.1}
            rayleigh={selectedTheme === 'night' ? 0.2 : 2}
          />

          <fog attach="fog" args={[THEMES[selectedTheme].fog, 30, 130]} />

          <CloudSystem />

          {balloons.map((b) => (
            <HotAirBalloon
              key={b.id}
              initialPos={b.initialPos}
              color={b.color}
              speedOffset={b.speedOffset}
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

          <RacingTrack
            isGameOver={isGameOver}
            speedMultiplier={speedMultiplier}
            isPaused={isPaused}
          />
          <Player
            isGameOver={isGameOver}
            onCollide={() => {
              sound.play('collision');
              setIsGameOver(true);
            }}
            isPaused={isPaused}
            selectedCharacter={selectedCharacter}
            obstaclesRef={obstaclesRef} // 👈 IMPORTANT
          />

          {busPositions.map((z, i) => (
            <MovingBus
              key={`bus-${i}`}
              initialZ={z}
              isGameOver={isGameOver}
              speedMultiplier={speedMultiplier}
              register={registerObstacle}
              isPaused={isPaused}
            />
          ))}

          {carPositions.map((z, i) => (
            <MovingCar
              key={`car-${i}`}
              initialZ={z}
              color={i % 2 === 0 ? '#ff2222' : '#33ff33'}
              isGameOver={isGameOver}
              speedMultiplier={speedMultiplier} // Add this!
              register={registerObstacle}
              isPaused={isPaused}
            />
          ))}

          {/* Fix for Cones */}
          {conePositions.map((pos, idx) => (
            <TrafficCone
              key={`cone-${idx}`}
              initialPos={pos}
              isGameOver={isGameOver}
              speedMultiplier={speedMultiplier} // Add this!
              register={registerObstacle}
              isPaused={isPaused}
            />
          ))}

          <OilBarrel
            initialPos={[0, 0, -120]}
            isGameOver={isGameOver}
            score={score}
            speedMultiplier={speedMultiplier}
            register={registerObstacle}
            isPaused={isPaused}
          />
          {burgerPositions.map((pos, i) => (
            <Burger
              key={i}
              position={pos}
              onCollect={handleBurgerCollect}
              isGameOver={isGameOver}
              energy={energy}
              score={score}
              speedMultiplier={speedMultiplier}
              isPaused={isPaused}
            />
          ))}
          {/* Render Coins */}
          {coinPositions.map((pos, idx) => (
            <Coin
              key={idx}
              position={pos}
              onCollect={handleCollect}
              isGameOver={isGameOver}
              speedMultiplier={speedMultiplier}
              isPaused={isPaused}
            />
          ))}
          <StreetWall side={1} isGameOver={isGameOver} isPaused={isPaused} />
          <StreetWall side={-1} isGameOver={isGameOver} isPaused={isPaused} />
          <StreetLight
            initialZ={0}
            side={1}
            speedMultiplier={speedMultiplier}
            isPaused={isPaused}
            isGameOver={isGameOver}
          />
          <StreetLight
            initialZ={-25}
            side={-1}
            speedMultiplier={speedMultiplier}
            isPaused={isPaused}
            isGameOver={isGameOver}
          />
          <StreetLight
            initialZ={-50}
            side={1}
            speedMultiplier={speedMultiplier}
            isPaused={isPaused}
            isGameOver={isGameOver}
          />
          <StreetLight
            initialZ={-75}
            side={-1}
            speedMultiplier={speedMultiplier}
            isPaused={isPaused}
            isGameOver={isGameOver}
          />
        </Canvas>
      )}
      {!isLoading && (
        <>
          <EnergyBar energy={energy} isPaused={isPaused} />

          <div className="game-stats-header">
            {/* COINS */}
            <div className="stat-item">
              <h2 className="funky-coin-display">COINS: {score}</h2>
            </div>

            {/* DISTANCE */}
            <div className="stat-item">
              <div className="distance-display">
                {distance < 1000
                  ? `${Math.floor(distance)} m`
                  : `${(distance / 1000).toFixed(1)} km`}
              </div>
            </div>

            {/* PLAY/PAUSE */}
            <div className="stat-item">
              <button
                className="btn-pause-funky"
                onClick={() => {
                  sound.play('click');
                  setIsPaused(true);
                }}
              >
                <span className="pause-icon">{isPaused ? '▶' : '⏸'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
