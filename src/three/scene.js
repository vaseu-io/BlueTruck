import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export class Scene3D {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hotspots = [];
    this.hotspotMeshes = [];
    this.onHotspotClick = null;
    this.onHotspotHover = null;
    this.animationId = null;
    this.clock = new THREE.Clock();
    this.hoveredHotspot = null;
    this.fly = null;
    this.userMoved = false;

    this.init();
  }

  init() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0e1a, 0.006);

    // Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    // Posição inicial provisória; o enquadramento real vem de getHomeView()
    this.camera.position.set(0, 4, -20);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    // Mínimo de 1.5x: em telas comuns renderiza em maior resolução e reduz serrilhado
    this.renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio, 1.5), 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    // Neutral mantém as cores do material fiéis (bom para visualização de produto)
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 30;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.01; // Não deixa ir pra debaixo da terra
    this.controls.target.set(0, 1.5, 0);

    // Enquadra a carreta inteira e perto; qualquer arrasto do usuário cancela animações
    this.applyView(this.getHomeView());
    this.controls.addEventListener('start', () => {
      this.userMoved = true;
      this.fly = null;
    });

    // Não prender a rolagem da página: a roda só dá zoom com Ctrl/⌘ e,
    // no toque, o arrasto vertical continua rolando a página
    const canvasEl = this.renderer.domElement;
    canvasEl.addEventListener('wheel', (e) => {
      if (!e.ctrlKey && !e.metaKey) e.stopImmediatePropagation();
    }, { capture: true });
    canvasEl.style.touchAction = 'pan-y';

    // Lighting
    this.setupLighting();

    // Ground
    this.createGround();

    // Events
    this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.container.addEventListener('click', (e) => this.onClick(e));
    window.addEventListener('resize', () => this.onResize());

    // Start loop
    this.animate();
  }

  setupLighting() {
    // Iluminação de estúdio (reflexos e luz difusa em todos os lados)
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.7;
    pmrem.dispose();

    // Ambient
    const ambient = new THREE.HemisphereLight(0xffffff, 0x556677, 0.5);
    this.scene.add(ambient);

    // Luz principal: do lado da câmera (vista padrão da carreta)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
    keyLight.position.set(-6, 14, -14);
    this.scene.add(keyLight);

    // Main directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    dirLight.shadow.normalBias = 0.03;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    this.scene.add(dirLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x0A84FF, 0.3);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);

    // Rim light
    const rimLight = new THREE.DirectionalLight(0x30D158, 0.2);
    rimLight.position.set(0, 3, -10);
    this.scene.add(rimLight);
  }

  createGround() {
    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.95,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Grid
    const grid = new THREE.GridHelper(60, 60, 0x1a2236, 0x1a2236);
    grid.position.y = 0.01;
    grid.material.opacity = 0.3;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  // ----- Câmera -----

  // Enquadramento inicial: a carreta ocupa a largura da área, em qualquer proporção de tela
  getHomeView() {
    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    // Em telas estreitas (celular) corta um pouco as pontas para a carreta aparecer maior
    const comprimento = this.camera.aspect < 1.3 ? 19.5 : 22;
    const distLargura = (comprimento / 2) / (Math.tan(fov / 2) * this.camera.aspect);
    const distAltura = 3.4 / Math.tan(fov / 2);
    const d = THREE.MathUtils.clamp(Math.max(distLargura, distAltura), 9, 28);
    return { position: [0, 2.6 + d * 0.12, -d], target: [0, 1.9, 0] };
  }

  applyView(view) {
    this.camera.position.set(...view.position);
    this.controls.target.set(...view.target);
    this.controls.update();
  }

  // Voo suave até uma vista { position: [x,y,z], target: [x,y,z] }
  flyTo(view, duration = 1100) {
    this.fly = {
      t0: performance.now(),
      duration,
      p0: this.camera.position.clone(),
      p1: new THREE.Vector3(...view.position),
      g0: this.controls.target.clone(),
      g1: new THREE.Vector3(...view.target),
    };
  }

  resetCamera() {
    this.userMoved = false;
    this.flyTo(this.getHomeView());
  }

  // ----- Pontos clicáveis -----

  makeDotTexture(color) {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const c = size / 2;

    const glow = ctx.createRadialGradient(c, c, 14, c, c, c);
    glow.addColorStop(0, color + '99');
    glow.addColorStop(1, color + '00');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(c, c, 26, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(c, c, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  makeRingTexture(color) {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 54, 0, Math.PI * 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = color;
    ctx.stroke();
    return new THREE.CanvasTexture(canvas);
  }

  makeLabelTexture(text, color) {
    const h = 96;
    const measure = document.createElement('canvas').getContext('2d');
    measure.font = '700 44px Inter, "Segoe UI", sans-serif';
    const w = Math.ceil(measure.measureText(text).width) + 72;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(10, 14, 26, 0.94)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 10, h);
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    ctx.strokeRect(1.5, 1.5, w - 3, h - 3);
    ctx.font = '700 44px Inter, "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 36, h / 2 + 2);

    return { texture: new THREE.CanvasTexture(canvas), aspect: w / h };
  }

  addHotspot(data) {
    const pos = new THREE.Vector3(data.position.x, data.position.y, data.position.z);
    const material = (map) => new THREE.SpriteMaterial({ map, transparent: true, depthTest: false, depthWrite: false });

    const dot = new THREE.Sprite(material(this.makeDotTexture(data.color)));
    const ring = new THREE.Sprite(material(this.makeRingTexture(data.color)));
    const labelTex = this.makeLabelTexture(data.label || data.name, data.color);
    const label = new THREE.Sprite(material(labelTex.texture));

    dot.position.copy(pos);
    ring.position.copy(pos);
    label.position.copy(pos);
    dot.renderOrder = 10;
    ring.renderOrder = 9;
    label.renderOrder = 11;

    const hotspot = { data, dot, ring, label, labelAspect: labelTex.aspect, hover: 0 };
    [dot, label].forEach((sprite) => {
      sprite.userData = { hotspotData: data, type: 'hotspot', hotspot };
      this.hotspotMeshes.push(sprite);
    });

    this.scene.add(ring, dot, label);
    this.hotspots.push(hotspot);
  }

  hotspotUnderPointer() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hit = this.raycaster.intersectObjects(this.hotspotMeshes)[0];
    return hit ? hit.object.userData.hotspot : null;
  }

  onMouseMove(event) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.hoveredHotspot = this.hotspotUnderPointer();
    this.container.style.cursor = this.hoveredHotspot ? 'pointer' : 'grab';
  }

  onClick(event) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const hotspot = this.hotspotUnderPointer();
    if (hotspot && this.onHotspotClick) {
      this.onHotspotClick(hotspot.data);
    }
  }

  onResize() {
    if (!this.container.clientWidth || !this.container.clientHeight) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    if (!this.userMoved && !this.fly) this.applyView(this.getHomeView());
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();

    // Voo de câmera
    if (this.fly) {
      const u = Math.min((performance.now() - this.fly.t0) / this.fly.duration, 1);
      const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      this.camera.position.lerpVectors(this.fly.p0, this.fly.p1, e);
      this.controls.target.lerpVectors(this.fly.g0, this.fly.g1, e);
      if (u >= 1) this.fly = null;
    }

    // Pontos clicáveis: pulsam, com anel que se expande, e mantêm tamanho legível à distância
    const dist = this.camera.position.distanceTo(this.controls.target);
    const k = THREE.MathUtils.clamp(dist / 14, 0.5, 1.6);
    this.hotspots.forEach((h, i) => {
      const target = h === this.hoveredHotspot ? 1 : 0;
      h.hover += (target - h.hover) * 0.2;

      const beat = 1 + Math.sin(time * 4 + i) * 0.07;
      const size = 1.15 * k * beat * (1 + h.hover * 0.35);
      h.dot.scale.set(size, size, 1);

      const phase = (time * 0.9 + i * 0.33) % 1;
      const ringSize = 1.15 * k * (1 + phase * 1.9);
      h.ring.scale.set(ringSize, ringSize, 1);
      h.ring.material.opacity = (1 - phase) * 0.85;

      const labelH = 0.5 * k * (1 + h.hover * 0.12);
      h.label.scale.set(labelH * h.labelAspect, labelH, 1);
      const lado = h.data.labelBelow ? -1 : 1;
      h.label.position.set(h.data.position.x, h.data.position.y + lado * 0.95 * k, h.data.position.z);
    });

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
    this.controls.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
