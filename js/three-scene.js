/* ================================================================
   THREE.JS CINEMATIC BACKDROP
   Particle field + floating geometric nodes with depth parallax
   ================================================================ */

(function() {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  // Respect reduced motion
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030509, 0.035);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 20;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: window.devicePixelRatio < 2,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // ------------------------------------------------------------------
  // Particle field — deep space digital dust
  // ------------------------------------------------------------------
  const particleCount = reduced ? 400 : 1400;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const velocities = [];

  const cyan = new THREE.Color(0x00f0ff);
  const blue = new THREE.Color(0x3d7aff);
  const white = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 80;
    positions[i3 + 1] = (Math.random() - 0.5) * 60;
    positions[i3 + 2] = (Math.random() - 0.5) * 60;

    const c = Math.random();
    const color = c < 0.6 ? cyan : (c < 0.9 ? blue : white);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    sizes[i] = Math.random() * 2 + 0.4;

    velocities.push({
      x: (Math.random() - 0.5) * 0.003,
      y: (Math.random() - 0.5) * 0.003,
      z: (Math.random() - 0.5) * 0.005
    });
  }

  const particleGeom = new THREE.BufferGeometry();
  particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Circular glow sprite
  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = spriteCanvas.height = 64;
  const sctx = spriteCanvas.getContext('2d');
  const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,0.5)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 64, 64);
  const sprite = new THREE.CanvasTexture(spriteCanvas);

  const particleMat = new THREE.PointsMaterial({
    size: 0.18,
    map: sprite,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(particleGeom, particleMat);
  scene.add(particles);

  // ------------------------------------------------------------------
  // Floating wireframe geometrics — depth anchors
  // ------------------------------------------------------------------
  const wireGroup = new THREE.Group();
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.25
  });

  const shapes = [];
  const geomTypes = [
    () => new THREE.IcosahedronGeometry(1.6, 0),
    () => new THREE.OctahedronGeometry(1.4, 0),
    () => new THREE.TetrahedronGeometry(1.8, 0),
    () => new THREE.TorusGeometry(1.4, 0.4, 8, 16),
    () => new THREE.BoxGeometry(1.5, 1.5, 1.5)
  ];

  const wireCount = reduced ? 3 : 7;
  for (let i = 0; i < wireCount; i++) {
    const geom = geomTypes[i % geomTypes.length]();
    const edges = new THREE.EdgesGeometry(geom);
    const mesh = new THREE.LineSegments(edges, wireMat.clone());
    mesh.material.opacity = 0.15 + Math.random() * 0.2;
    mesh.position.set(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 26,
      -8 - Math.random() * 18
    );
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    mesh.userData.rotSpeed = {
      x: (Math.random() - 0.5) * 0.003,
      y: (Math.random() - 0.5) * 0.003,
      z: (Math.random() - 0.5) * 0.002
    };
    mesh.userData.float = {
      y: mesh.position.y,
      offset: Math.random() * Math.PI * 2,
      amp: 0.5 + Math.random() * 1.2
    };
    wireGroup.add(mesh);
    shapes.push(mesh);
  }
  scene.add(wireGroup);

  // ------------------------------------------------------------------
  // Lighting
  // ------------------------------------------------------------------
  scene.add(new THREE.AmbientLight(0x3d7aff, 0.4));
  const keyLight = new THREE.DirectionalLight(0x00f0ff, 0.6);
  keyLight.position.set(10, 10, 10);
  scene.add(keyLight);

  // ------------------------------------------------------------------
  // Mouse + scroll parallax
  // ------------------------------------------------------------------
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const scrollState = { y: 0, ty: 0 };

  window.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollState.ty = window.scrollY;
  }, { passive: true });

  // ------------------------------------------------------------------
  // Resize
  // ------------------------------------------------------------------
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 100);
  });

  // ------------------------------------------------------------------
  // Animate
  // ------------------------------------------------------------------
  const clock = new THREE.Clock();
  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) clock.start();
  });

  function animate() {
    if (!running) {
      requestAnimationFrame(animate);
      return;
    }
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth mouse
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    scrollState.y += (scrollState.ty - scrollState.y) * 0.06;

    // Camera drift
    camera.position.x = mouse.x * 3;
    camera.position.y = mouse.y * 1.8 + (scrollState.y * -0.002);
    camera.lookAt(0, 0, 0);

    // Particles gentle orbit
    particles.rotation.y = t * 0.02 + mouse.x * 0.1;
    particles.rotation.x = t * 0.008 + mouse.y * 0.05;

    const pos = particleGeom.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i].x;
      pos[i3 + 1] += velocities[i].y;
      pos[i3 + 2] += velocities[i].z;
      // wrap
      if (pos[i3] > 40) pos[i3] = -40;
      if (pos[i3] < -40) pos[i3] = 40;
      if (pos[i3 + 1] > 30) pos[i3 + 1] = -30;
      if (pos[i3 + 1] < -30) pos[i3 + 1] = 30;
      if (pos[i3 + 2] > 30) pos[i3 + 2] = -30;
      if (pos[i3 + 2] < -30) pos[i3 + 2] = 30;
    }
    particleGeom.attributes.position.needsUpdate = true;

    // Wireframe shapes
    shapes.forEach((s) => {
      s.rotation.x += s.userData.rotSpeed.x;
      s.rotation.y += s.userData.rotSpeed.y;
      s.rotation.z += s.userData.rotSpeed.z;
      s.position.y = s.userData.float.y + Math.sin(t + s.userData.float.offset) * s.userData.float.amp * 0.3;
    });

    renderer.render(scene, camera);
  }

  animate();
})();
