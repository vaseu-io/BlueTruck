import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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

    this.init();
  }

  init() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0e1a, 0.015);

    // Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    // Visão lateral do caminhão mostrando a entrada (lado oposto)
    this.camera.position.set(0, 4, -20);
    this.camera.lookAt(0, 1.5, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 8;
    this.controls.maxDistance = 30;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.01; // Não deixa ir pra debaixo da terra
    this.controls.target.set(0, 1.5, 0);

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
    // Ambient
    const ambient = new THREE.AmbientLight(0x4466aa, 0.6);
    this.scene.add(ambient);

    // Main directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
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
      color: 0x111827,
      roughness: 0.9,
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

  addHotspot(data, mesh) {
    // Create hotspot sprite
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Outer glow
    const gradient = ctx.createRadialGradient(32, 32, 8, 32, 32, 32);
    gradient.addColorStop(0, data.color + 'CC');
    gradient.addColorStop(0.5, data.color + '44');
    gradient.addColorStop(1, data.color + '00');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    // Inner circle
    ctx.beginPath();
    ctx.arc(32, 32, 10, 0, Math.PI * 2);
    ctx.fillStyle = data.color;
    ctx.fill();

    // White center
    ctx.beginPath();
    ctx.arc(32, 32, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.copy(new THREE.Vector3(data.position.x, data.position.y, data.position.z));
    sprite.scale.set(1.5, 1.5, 1.5);
    sprite.userData = { hotspotData: data, type: 'hotspot' };
    this.scene.add(sprite);

    this.hotspotMeshes.push(sprite);
    this.hotspots.push({ sprite, data, mesh });
  }

  onMouseMove(event) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycasting for hotspots
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.hotspotMeshes);

    if (intersects.length > 0) {
      const hotspot = intersects[0].object;
      if (this.hoveredHotspot !== hotspot) {
        // Reset previous
        if (this.hoveredHotspot) {
          this.hoveredHotspot.scale.set(1.5, 1.5, 1.5);
        }
        this.hoveredHotspot = hotspot;
        hotspot.scale.set(2, 2, 2);
        this.container.style.cursor = 'pointer';
      }
    } else {
      if (this.hoveredHotspot) {
        this.hoveredHotspot.scale.set(1.5, 1.5, 1.5);
        this.hoveredHotspot = null;
        this.container.style.cursor = 'grab';
      }
    }
  }

  onClick(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.hotspotMeshes);

    if (intersects.length > 0) {
      const hotspotData = intersects[0].object.userData.hotspotData;
      if (this.onHotspotClick) {
        this.onHotspotClick(hotspotData);
      }
    }
  }

  onResize() {
    if (!this.container.clientWidth || !this.container.clientHeight) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();

    // Animate hotspot sprites
    this.hotspotMeshes.forEach((sprite, i) => {
      const scale = 1.5 + Math.sin(time * 2 + i * 0.8) * 0.15;
      if (sprite !== this.hoveredHotspot) {
        sprite.scale.set(scale, scale, scale);
      }
      sprite.material.opacity = 0.7 + Math.sin(time * 3 + i) * 0.3;
    });

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  focusOnPosition(position, distance = 6) {
    const targetPos = new THREE.Vector3(position.x, position.y, position.z);
    const cameraTarget = targetPos.clone().add(new THREE.Vector3(distance, distance * 0.5, distance));

    // Smooth camera transition
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    let progress = 0;

    const animateCamera = () => {
      progress += 0.02;
      if (progress >= 1) {
        this.camera.position.copy(cameraTarget);
        this.controls.target.copy(targetPos);
        return;
      }

      const eased = 1 - Math.pow(1 - progress, 3);
      this.camera.position.lerpVectors(startPos, cameraTarget, eased);
      this.controls.target.lerpVectors(startTarget, targetPos, eased);
      requestAnimationFrame(animateCamera);
    };
    animateCamera();
  }

  resetCamera() {
    const cameraTarget = new THREE.Vector3(0, 4, -20);
    const targetPos = new THREE.Vector3(0, 1.5, 0);

    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    let progress = 0;

    const animateCamera = () => {
      progress += 0.02;
      if (progress >= 1) {
        this.camera.position.copy(cameraTarget);
        this.controls.target.copy(targetPos);
        return;
      }

      const eased = 1 - Math.pow(1 - progress, 3);
      this.camera.position.lerpVectors(startPos, cameraTarget, eased);
      this.controls.target.lerpVectors(startTarget, targetPos, eased);
      requestAnimationFrame(animateCamera);
    };
    animateCamera();
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
