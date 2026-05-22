import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================
// WEBGL 3D NAVIGATION - COMPLETE FILE
// Horizontal navigation tool for portfolio sections
// ============================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  
  // ============================================
  // CONFIGURATION
  // ============================================
  const config = {
    radius: 3.8,
    baseY: 0.2,
    cameraDistance: 7.5,
    cameraHeight: 1.8,
    autoRotate: false,
    rotationSpeed: 0.5,
    particleCount: 1200,
    cardWidth: 1.5,
    cardHeight: 1.1,
    cardDepth: 0.18,
    enableShadows: true,
    animationSpeed: 1.0
  };
  
  // Section data
  const sections = [
    { name: "WEB PROJECTS", desc: "Full-stack apps", icon: "🌐", color: "#3b82f6", accent: "#1e40af", link: "#web" },
    { name: "DATABASE", desc: "SQL & cloud security", icon: "🗄️", color: "#10b981", accent: "#065f46", link: "#database" },
    { name: "CYBERSECURITY", desc: "Defense & pen testing", icon: "🛡️", color: "#ef4444", accent: "#991b1b", link: "#cyber" },
    { name: "LINUX TOOLBOX", desc: "Scripts & automation", icon: "🐧", color: "#f59e0b", accent: "#b45309", link: "#linux" },
    { name: "METADATA", desc: "Data exploration", icon: "🔍", color: "#8b5cf6", accent: "#5b21b6", link: "#metadata" }
  ];
  
  // ============================================
  // SETUP SCENE, CAMERA, RENDERER
  // ============================================
  const canvas = document.getElementById('webgl-3d-canvas') || document.getElementById('webgl-canvas');
  
  if (!canvas) {
    console.error('WebGL canvas not found');
    return;
  }
  
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x003135, 1);
  if (config.enableShadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x003135);
  scene.fog = new THREE.FogExp2(0x003135, 0.008);
  
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, config.cameraHeight, config.cameraDistance);
  camera.lookAt(0, 0.3, 0);
  
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.rotateSpeed = 1.2;
  controls.zoomSpeed = 1.0;
  controls.enablePan = false;
  controls.target.set(0, 0.4, 0);
  controls.maxPolarAngle = Math.PI / 2.2;
  controls.minDistance = 3;
  controls.maxDistance = 12;
  
  // ============================================
  // LIGHTING SYSTEM
  // ============================================
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x2a4a6a, 0.55);
  scene.add(ambientLight);
  
  // Main directional light
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(4, 6, 3);
  mainLight.castShadow = true;
  mainLight.receiveShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 15;
  mainLight.shadow.camera.left = -5;
  mainLight.shadow.camera.right = 5;
  mainLight.shadow.camera.top = 5;
  mainLight.shadow.camera.bottom = -5;
  scene.add(mainLight);
  
  // Fill light from below
  const fillLight = new THREE.PointLight(0x0FA4AF, 0.45);
  fillLight.position.set(0, -1.2, 0);
  scene.add(fillLight);
  
  // Rim light (warm)
  const rimLight = new THREE.PointLight(0xf5c74f, 0.5);
  rimLight.position.set(-3, 2.5, -4);
  scene.add(rimLight);
  
  // Back rim light (cool)
  const backRimLight = new THREE.PointLight(0x3399ff, 0.45);
  backRimLight.position.set(2, 1.5, -5);
  scene.add(backRimLight);
  
  // Central core pulsing light
  const coreLight = new THREE.PointLight(0x44aaff, 0.9, 8);
  coreLight.position.set(0, 0.3, 0);
  scene.add(coreLight);
  
  // Additional colored accent lights
  const accentColors = [0x3b82f6, 0x10b981, 0xef4444, 0xf59e0b, 0x8b5cf6];
  const accentLights = [];
  accentColors.forEach((color, i) => {
    const light = new THREE.PointLight(color, 0.25);
    light.userData = { angle: (i / accentColors.length) * Math.PI * 2 };
    scene.add(light);
    accentLights.push(light);
  });
  
  // ============================================
  // DECORATIVE ELEMENTS
  // ============================================
  // Ground grid
  const gridHelper = new THREE.GridHelper(14, 24, 0x0FA4AF, 0x024950);
  gridHelper.position.y = -1.0;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.25;
  scene.add(gridHelper);
  
  // Reflective disc under the ring
  const discMat = new THREE.MeshStandardMaterial({ 
    color: 0x0a1a2a, 
    roughness: 0.4, 
    metalness: 0.7, 
    transparent: true, 
    opacity: 0.3 
  });
  const baseDisc = new THREE.Mesh(new THREE.CircleGeometry(5.2, 32), discMat);
  baseDisc.rotation.x = -Math.PI / 2;
  baseDisc.position.y = -1.05;
  baseDisc.receiveShadow = true;
  scene.add(baseDisc);
  
  // ============================================
  // CENTRAL CORE (Rotating Crystal)
  // ============================================
  const coreGeometry = new THREE.IcosahedronGeometry(0.52, 0);
  const coreMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x88bbff, 
    emissive: 0x3366aa, 
    emissiveIntensity: 0.7, 
    metalness: 0.85, 
    roughness: 0.2 
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  coreMesh.castShadow = true;
  scene.add(coreMesh);
  
  // Inner orbiting ring
  const innerRingGeo = new THREE.TorusGeometry(0.78, 0.045, 64, 180);
  const innerRingMat = new THREE.MeshStandardMaterial({ 
    color: 0x5a9eff, 
    emissive: 0x2266cc, 
    emissiveIntensity: 0.5 
  });
  const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRing.rotation.x = Math.PI / 2;
  scene.add(innerRing);
  
  // Outer orbiting ring
  const outerRingGeo = new THREE.TorusGeometry(1.05, 0.035, 64, 200);
  const outerRingMat = new THREE.MeshStandardMaterial({ 
    color: 0xff66aa, 
    emissive: 0x551133, 
    emissiveIntensity: 0.4 
  });
  const outerRingObj = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRingObj.rotation.z = 0.7;
  outerRingObj.rotation.x = 0.9;
  scene.add(outerRingObj);
  
  // Small floating particles around core
  const coreParticles = [];
  const coreParticleCount = 80;
  for (let i = 0; i < coreParticleCount; i++) {
    const particleMat = new THREE.MeshStandardMaterial({ 
      color: 0x0FA4AF, 
      emissive: 0x0FA4AF, 
      emissiveIntensity: 0.6 
    });
    const particle = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), particleMat);
    scene.add(particle);
    coreParticles.push(particle);
  }
  
  // ============================================
  // CREATE 3D CARDS
  // ============================================
  const cards = [];
  
  sections.forEach((section, idx) => {
    const angle = (idx / sections.length) * Math.PI * 2;
    const x = Math.cos(angle) * config.radius;
    const z = Math.sin(angle) * config.radius;
    const yOffset = Math.sin(angle * 2) * 0.08;
    const y = config.baseY + yOffset;
    
    // Create group for the card
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.userData = { section: section.name, link: section.link, index: idx, angle: angle };
    
    // Card body
    const boxMat = new THREE.MeshStandardMaterial({ 
      color: section.color, 
      metalness: 0.65, 
      roughness: 0.28, 
      emissive: section.accent, 
      emissiveIntensity: 0.12,
      transparent: true,
      opacity: 0.94
    });
    const box = new THREE.Mesh(new THREE.BoxGeometry(config.cardWidth, config.cardHeight, config.cardDepth), boxMat);
    box.castShadow = true;
    box.receiveShadow = false;
    group.add(box);
    
    // Wireframe edges
    const edgesGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(config.cardWidth, config.cardHeight, config.cardDepth));
    const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const wireframe = new THREE.LineSegments(edgesGeo, wireMat);
    group.add(wireframe);
    
    // Floating ring around card
    const cardRingGeo = new THREE.TorusGeometry(0.98, 0.035, 32, 70);
    const cardRingMat = new THREE.MeshStandardMaterial({ 
      color: section.color, 
      emissive: section.color, 
      emissiveIntensity: 0.45 
    });
    const cardRing = new THREE.Mesh(cardRingGeo, cardRingMat);
    cardRing.rotation.x = Math.PI / 2;
    cardRing.position.z = 0.1;
    group.add(cardRing);
    
    // Create canvas texture for label
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 512;
    canvasTexture.height = 256;
    const ctx = canvasTexture.getContext('2d');
    
    // Draw background
    ctx.fillStyle = '#0a1a2a';
    ctx.fillRect(0, 0, canvasTexture.width, canvasTexture.height);
    
    // Draw border
    ctx.strokeStyle = section.color;
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvasTexture.width - 20, canvasTexture.height - 20);
    
    // Draw icon
    ctx.font = `Bold ${Math.floor(canvasTexture.width * 0.25)}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
    ctx.fillStyle = section.color;
    ctx.textAlign = 'center';
    ctx.fillText(section.icon, canvasTexture.width / 2, canvasTexture.height * 0.4);
    
    // Draw title
    ctx.font = `Bold ${Math.floor(canvasTexture.width * 0.07)}px "Syne", "Inter", sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(section.name, canvasTexture.width / 2, canvasTexture.height * 0.65);
    
    // Draw subtitle
    ctx.font = `${Math.floor(canvasTexture.width * 0.045)}px "Space Mono", monospace`;
    ctx.fillStyle = '#aaccff';
    ctx.fillText(section.desc, canvasTexture.width / 2, canvasTexture.height * 0.82);
    
    const texture = new THREE.CanvasTexture(canvasTexture);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.6, 0.8, 1);
    sprite.position.y = 0.75;
    group.add(sprite);
    
    scene.add(group);
    
    cards.push({
      group: group,
      box: box,
      ring: cardRing,
      sprite: sprite,
      wireframe: wireframe,
      color: section.color,
      accent: section.accent,
      name: section.name,
      link: section.link,
      idx: idx,
      originalY: y,
      angle: angle
    });
  });
  
  // ============================================
  // ORBIT RINGS
  // ============================================
  // Main orbit path
  const orbitPoints = [];
  const orbitRadius = config.radius;
  for (let i = 0; i <= 120; i++) {
    const ang = (i / 120) * Math.PI * 2;
    const px = Math.cos(ang) * orbitRadius;
    const pz = Math.sin(ang) * orbitRadius;
    orbitPoints.push(new THREE.Vector3(px, config.baseY - 0.08, pz));
  }
  const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitMat = new THREE.LineBasicMaterial({ color: 0x4a80c0 });
  const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
  scene.add(orbitLine);
  
  // Secondary faint ring
  const orbitPointsFaint = [];
  const faintRadius = config.radius + 0.15;
  for (let i = 0; i <= 100; i++) {
    const ang = (i / 100) * Math.PI * 2;
    const px = Math.cos(ang) * faintRadius;
    const pz = Math.sin(ang) * faintRadius;
    orbitPointsFaint.push(new THREE.Vector3(px, config.baseY - 0.12, pz));
  }
  const faintOrbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPointsFaint);
  const faintMat = new THREE.LineBasicMaterial({ color: 0x3377aa, transparent: true, opacity: 0.4 });
  const faintOrbitLine = new THREE.LineLoop(faintOrbitGeo, faintMat);
  scene.add(faintOrbitLine);
  
  // Glowing torus ring
  const glowRingGeo = new THREE.TorusGeometry(config.radius + 0.05, 0.025, 64, 200);
  const glowRingMat = new THREE.MeshStandardMaterial({ color: 0x0FA4AF, emissive: 0x0FA4AF, emissiveIntensity: 0.3 });
  const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
  glowRing.rotation.x = Math.PI / 2;
  scene.add(glowRing);
  
  // ============================================
  // ANCHOR ORBS (Floating spheres at card positions)
  // ============================================
  const anchorOrbs = [];
  cards.forEach(card => {
    const orbGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const orbMat = new THREE.MeshStandardMaterial({ color: card.color, emissive: card.color, emissiveIntensity: 0.6 });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.copy(card.group.position);
    scene.add(orb);
    anchorOrbs.push(orb);
  });
  
  // ============================================
  // PARTICLE FIELD (Starfield)
  // ============================================
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(config.particleCount * 3);
  for (let i = 0; i < config.particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 28;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8 + 0.5;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 8;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.045, transparent: true, opacity: 0.4 });
  const starField = new THREE.Points(particleGeo, particleMat);
  scene.add(starField);
  
  // ============================================
  // FLOATING GLOW PARTICLES AROUND CARDS
  // ============================================
  const glowParticles = [];
  for (let i = 0; i < 400; i++) {
    const particle = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 6, 6),
      new THREE.MeshStandardMaterial({ color: 0x77aaff, emissive: 0x3388ff, emissiveIntensity: 0.4 })
    );
    scene.add(particle);
    glowParticles.push(particle);
  }
  
  // ============================================
  // INTERACTIVE LOGIC
  // ============================================
  let activeIdx = 0;
  let time = 0;
  let autoRotateAngle = 0;
  
  // Function to update active section based on camera view
  function updateActiveSection() {
    const camDir = camera.getWorldDirection(new THREE.Vector3());
    const camPos = camera.position;
    let bestDot = -Infinity;
    let bestIndex = 0;
    
    cards.forEach((card, idx) => {
      const cardPos = card.group.position;
      const toCard = new THREE.Vector3().subVectors(cardPos, camPos).normalize();
      const dot = camDir.dot(toCard);
      if (dot > bestDot) {
        bestDot = dot;
        bestIndex = idx;
      }
    });
    
    if (bestIndex !== activeIdx) {
      activeIdx = bestIndex;
      
      // Highlight active card
      cards.forEach((card, i) => {
        const intensity = i === activeIdx ? 0.55 : 0.12;
        card.box.material.emissiveIntensity = intensity;
        if (card.ring) {
          card.ring.material.emissiveIntensity = i === activeIdx ? 0.9 : 0.45;
          card.ring.scale.setScalar(i === activeIdx ? 1.15 : 1);
        }
        if (card.wireframe) {
          card.wireframe.material.color.setHex(i === activeIdx ? 0xffaa66 : 0xffffff);
        }
      });
      
      // Pulse effect
      coreLight.intensity = 1.4;
      coreMesh.scale.setScalar(1.1);
      setTimeout(() => {
        coreLight.intensity = 0.9;
        coreMesh.scale.setScalar(1);
      }, 250);
      
      // Update URL hash without scrolling
      const activeCard = cards[activeIdx];
      if (activeCard && activeCard.link) {
        history.pushState(null, null, activeCard.link);
      }
    }
  }
  
  // Handle card click
  function handleCardClick(event) {
    // Raycaster for clicking on 3D objects
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cards.map(c => c.box));
    
    if (intersects.length > 0) {
      const hitCard = cards.find(c => c.box === intersects[0].object);
      if (hitCard && hitCard.link) {
        // Smooth scroll to section
        const targetElement = document.querySelector(hitCard.link);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }
  
  // Add click listener
  renderer.domElement.addEventListener('click', handleCardClick);
  
  // ============================================
  // CONTROL BUTTONS
  // ============================================
  const rotateLeftBtn = document.querySelector('[data-action="rotate-left"]');
  const rotateRightBtn = document.querySelector('[data-action="rotate-right"]');
  const resetViewBtn = document.querySelector('[data-action="reset-view"]');
  
  if (rotateLeftBtn) {
    rotateLeftBtn.addEventListener('click', () => {
      controls.target.set(0, 0.4, 0);
      const currentAngle = Math.atan2(camera.position.z, camera.position.x);
      const newAngle = currentAngle - 0.3;
      const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
      camera.position.x = Math.cos(newAngle) * radius;
      camera.position.z = Math.sin(newAngle) * radius;
      controls.update();
    });
  }
  
  if (rotateRightBtn) {
    rotateRightBtn.addEventListener('click', () => {
      controls.target.set(0, 0.4, 0);
      const currentAngle = Math.atan2(camera.position.z, camera.position.x);
      const newAngle = currentAngle + 0.3;
      const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
      camera.position.x = Math.cos(newAngle) * radius;
      camera.position.z = Math.sin(newAngle) * radius;
      controls.update();
    });
  }
  
  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', () => {
      camera.position.set(0, config.cameraHeight, config.cameraDistance);
      controls.target.set(0, 0.4, 0);
      controls.update();
    });
  }
  
  // ============================================
  // ANIMATION LOOP
  // ============================================
  function animate() {
    requestAnimationFrame(animate);
    time += 0.012 * config.animationSpeed;
    
    // Animate central core
    coreMesh.rotation.y = time * 0.6;
    coreMesh.rotation.x = Math.sin(time * 0.7) * 0.2;
    const scalePulse = 1 + Math.sin(time * 6) * 0.03;
    coreMesh.scale.set(scalePulse, scalePulse, scalePulse);
    
    // Animate rings
    innerRing.rotation.z = time * 0.5;
    outerRingObj.rotation.x = Math.sin(time * 0.5) * 0.3;
    outerRingObj.rotation.y = time * 0.4;
    glowRing.rotation.z = time * 0.1;
    
    // Animate core particles (orbiting)
    coreParticles.forEach((particle, i) => {
      const particleAngle = (i / coreParticleCount) * Math.PI * 2 + time * 2;
      const rad = 0.85;
      particle.position.x = Math.cos(particleAngle) * rad;
      particle.position.z = Math.sin(particleAngle) * rad;
      particle.position.y = Math.sin(particleAngle * 2) * 0.2;
    });
    
    // Animate accent lights
    accentLights.forEach((light, i) => {
      const angle = light.userData.angle + time * 0.3;
      const rad = config.radius + 0.5;
      light.position.x = Math.cos(angle) * rad;
      light.position.z = Math.sin(angle) * rad;
      light.position.y = 0.3 + Math.sin(angle * 2) * 0.2;
      light.intensity = 0.25 + Math.sin(time * 2 + i) * 0.1;
    });
    
    // Floating cards animation
    cards.forEach((card, idx) => {
      const floatY = Math.sin(time * 1.2 + idx) * 0.045;
      card.group.position.y = card.originalY + floatY;
      card.group.rotation.z = Math.sin(time * 1.0 + idx) * 0.05;
      if (card.ring) {
        card.ring.rotation.z += 0.015;
      }
    });
    
    // Update anchor orbs to follow cards
    anchorOrbs.forEach((orb, i) => {
      orb.position.copy(cards[i].group.position);
      if (i === activeIdx) {
        const pulse = 1 + Math.sin(time * 12) * 0.3;
        orb.scale.set(pulse, pulse, pulse);
        orb.material.emissiveIntensity = 0.9;
      } else {
        orb.scale.set(1, 1, 1);
        orb.material.emissiveIntensity = 0.5;
      }
    });
    
    // Animate floating glow particles
    glowParticles.forEach((part, idx) => {
      const cardIdx = idx % cards.length;
      const basePos = cards[cardIdx].group.position;
      const offsetX = Math.sin(time * 1.3 + idx) * 0.28;
      const offsetY = Math.cos(time * 1.7 + idx) * 0.22;
      const offsetZ = Math.sin(time * 1.1 + idx * 0.7) * 0.28;
      part.position.x = basePos.x + offsetX;
      part.position.y = basePos.y + offsetY + 0.35;
      part.position.z = basePos.z + offsetZ;
      const intensity = 0.3 + Math.sin(time * 3 + idx) * 0.2;
      part.material.emissiveIntensity = intensity;
    });
    
    // Rotate star field
    starField.rotation.y += 0.0008;
    starField.rotation.x += 0.0004;
    
    // Pulse core light
    coreLight.intensity = 0.8 + Math.sin(time * 2.5) * 0.25;
    fillLight.intensity = 0.45 + Math.sin(time * 1.2) * 0.1;
    rimLight.intensity = 0.5 + Math.sin(time * 1.8) * 0.15;
    
    // Update active section based on camera view
    updateActiveSection();
    
    // Update controls and render
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
  
  // ============================================
  // WINDOW RESIZE HANDLER
  // ============================================
  window.addEventListener('resize', onWindowResize);
  
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  // Hide loading indicator if present
  const loadingEl = document.getElementById('webgl-loading');
  if (loadingEl) {
    loadingEl.style.display = 'none';
  }
  
  console.log('3D WebGL Navigation initialized successfully');
});