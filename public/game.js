// ─── AVATAR DEFINITIONS ───────────────────────────────────────────────
const AVATAR_TYPES = [
  { id: 'wizard',   label: 'Wizard',   desc: 'Mystical Sorcerer' },
  { id: 'robot',    label: 'Robot',    desc: 'Cyber Machine' },
  { id: 'warrior',  label: 'Warrior',  desc: 'Battle Knight' },
  { id: 'explorer', label: 'Explorer', desc: 'Bold Adventurer' },
];

// ─── 2D PREVIEW DRAWINGS ──────────────────────────────────────────────
function drawAvatarPreview(type, color) {
  const c = document.createElement('canvas');
  c.width = 80; c.height = 100;
  const ctx = c.getContext('2d');
  const hex = '#' + color.toString(16).padStart(6, '0');
  const dark = '#' + Math.max(0, color - 0x333333).toString(16).padStart(6, '0');

  if (type === 'wizard') {
    // Robe body
    ctx.fillStyle = hex;
    ctx.beginPath();
    ctx.moveTo(20, 55); ctx.lineTo(10, 95); ctx.lineTo(70, 95); ctx.lineTo(60, 55);
    ctx.closePath(); ctx.fill();
    // Stars on robe
    ctx.fillStyle = 'rgba(255,220,0,0.8)';
    ctx.beginPath(); ctx.arc(32, 70, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(50, 78, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(42, 62, 2, 0, Math.PI*2); ctx.fill();
    // Head
    ctx.fillStyle = '#f5d5a0';
    ctx.beginPath(); ctx.arc(40, 45, 14, 0, Math.PI*2); ctx.fill();
    // Beard
    ctx.fillStyle = '#dddddd';
    ctx.beginPath(); ctx.arc(40, 54, 8, 0, Math.PI); ctx.fill();
    // Eyes
    ctx.fillStyle = '#6633ff';
    ctx.beginPath(); ctx.arc(34, 43, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(46, 43, 3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(33, 42, 1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(45, 42, 1, 0, Math.PI*2); ctx.fill();
    // Pointy hat
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.moveTo(40, 5); ctx.lineTo(18, 34); ctx.lineTo(62, 34);
    ctx.closePath(); ctx.fill();
    // Hat brim
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.ellipse(40, 34, 24, 6, 0, 0, Math.PI*2); ctx.fill();
    // Hat star
    ctx.fillStyle = '#ffdd00';
    ctx.beginPath(); ctx.arc(40, 18, 4, 0, Math.PI*2); ctx.fill();
    // Staff
    ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(68, 95); ctx.lineTo(72, 30); ctx.stroke();
    ctx.fillStyle = '#00ddff';
    ctx.beginPath(); ctx.arc(72, 27, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(0,200,255,0.4)';
    ctx.beginPath(); ctx.arc(72, 27, 9, 0, Math.PI*2); ctx.fill();

  } else if (type === 'robot') {
    // Legs
    ctx.fillStyle = dark;
    ctx.fillRect(22, 72, 14, 22);
    ctx.fillRect(44, 72, 14, 22);
    // Body
    ctx.fillStyle = hex;
    ctx.fillRect(16, 45, 48, 30);
    // Body panel lines
    ctx.strokeStyle = dark; ctx.lineWidth = 1.5;
    ctx.strokeRect(22, 50, 14, 10);
    ctx.strokeRect(44, 50, 14, 10);
    // Chest light
    ctx.fillStyle = '#00ffff';
    ctx.beginPath(); ctx.arc(40, 55, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(0,255,255,0.3)';
    ctx.beginPath(); ctx.arc(40, 55, 9, 0, Math.PI*2); ctx.fill();
    // Arms
    ctx.fillStyle = dark;
    ctx.fillRect(4, 47, 11, 24);
    ctx.fillRect(65, 47, 11, 24);
    // Hand claws
    ctx.fillStyle = '#888';
    ctx.fillRect(4, 71, 4, 8);
    ctx.fillRect(9, 71, 4, 8);
    ctx.fillRect(65, 71, 4, 8);
    ctx.fillRect(70, 71, 4, 8);
    // Head
    ctx.fillStyle = hex;
    ctx.fillRect(20, 20, 40, 28);
    // Eye visor
    ctx.fillStyle = '#ff3300';
    ctx.fillRect(24, 28, 32, 10);
    ctx.fillStyle = 'rgba(255,50,0,0.4)';
    ctx.fillRect(22, 26, 36, 14);
    // Antenna
    ctx.strokeStyle = '#aaa'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(40, 20); ctx.lineTo(40, 8); ctx.stroke();
    ctx.fillStyle = '#ff0000';
    ctx.beginPath(); ctx.arc(40, 7, 4, 0, Math.PI*2); ctx.fill();

  } else if (type === 'warrior') {
    // Legs with greaves
    ctx.fillStyle = '#888';
    ctx.fillRect(20, 68, 15, 26);
    ctx.fillRect(45, 68, 15, 26);
    ctx.fillStyle = hex;
    ctx.fillRect(22, 70, 11, 22);
    ctx.fillRect(47, 70, 11, 22);
    // Body armor
    ctx.fillStyle = '#aaa';
    ctx.fillRect(14, 42, 52, 30);
    ctx.fillStyle = hex;
    ctx.fillRect(18, 46, 44, 24);
    // Armor details
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(34, 48, 12, 16);
    ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 1.5;
    ctx.strokeRect(18, 46, 44, 24);
    // Cape
    ctx.fillStyle = '#cc2222';
    ctx.beginPath();
    ctx.moveTo(14, 44); ctx.lineTo(2, 90); ctx.lineTo(14, 85); ctx.lineTo(14, 72);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(66, 44); ctx.lineTo(78, 90); ctx.lineTo(66, 85); ctx.lineTo(66, 72);
    ctx.closePath(); ctx.fill();
    // Shoulder pads
    ctx.fillStyle = '#999';
    ctx.beginPath(); ctx.arc(14, 46, 9, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(66, 46, 9, 0, Math.PI*2); ctx.fill();
    // Head
    ctx.fillStyle = '#aaa';
    ctx.beginPath(); ctx.arc(40, 32, 16, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#888';
    ctx.fillRect(24, 28, 32, 20);
    // Helmet visor
    ctx.fillStyle = '#333';
    ctx.fillRect(28, 30, 24, 10);
    ctx.fillStyle = 'rgba(50,150,255,0.6)';
    ctx.fillRect(29, 31, 22, 8);
    // Crest
    ctx.fillStyle = '#cc2222';
    ctx.beginPath();
    ctx.moveTo(34, 18); ctx.lineTo(40, 8); ctx.lineTo(46, 18);
    ctx.closePath(); ctx.fill();
    // Sword
    ctx.strokeStyle = '#ccc'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(74, 95); ctx.lineTo(78, 30); ctx.stroke();
    ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(70, 60); ctx.lineTo(82, 60); ctx.stroke();
    // Shield
    ctx.fillStyle = '#cc2222';
    ctx.beginPath();
    ctx.moveTo(2, 50); ctx.lineTo(14, 45); ctx.lineTo(14, 75); ctx.lineTo(2, 80);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath(); ctx.arc(8, 63, 5, 0, Math.PI*2); ctx.fill();

  } else if (type === 'explorer') {
    // Boots
    ctx.fillStyle = '#5c3a1e';
    ctx.fillRect(20, 78, 15, 16);
    ctx.fillRect(45, 78, 15, 16);
    // Pants
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(22, 60, 13, 22);
    ctx.fillRect(45, 60, 13, 22);
    // Jacket body
    ctx.fillStyle = hex;
    ctx.fillRect(16, 38, 48, 26);
    // Jacket details
    ctx.strokeStyle = dark; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(40, 38); ctx.lineTo(40, 64); ctx.stroke();
    // Pockets
    ctx.fillStyle = dark;
    ctx.fillRect(20, 50, 10, 8);
    ctx.fillRect(50, 50, 10, 8);
    // Belt
    ctx.fillStyle = '#5c3a1e';
    ctx.fillRect(16, 60, 48, 5);
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(35, 59, 10, 7);
    // Arms
    ctx.fillStyle = hex;
    ctx.fillRect(4, 40, 11, 22);
    ctx.fillRect(65, 40, 11, 22);
    // Gloves
    ctx.fillStyle = '#5c3a1e';
    ctx.fillRect(4, 60, 11, 8);
    ctx.fillRect(65, 60, 11, 8);
    // Head/neck
    ctx.fillStyle = '#f5d5a0';
    ctx.beginPath(); ctx.arc(40, 28, 13, 0, Math.PI*2); ctx.fill();
    // Face details
    ctx.fillStyle = '#4a3000';
    ctx.beginPath(); ctx.arc(34, 26, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(46, 26, 2.5, 0, Math.PI*2); ctx.fill();
    // Smile
    ctx.strokeStyle = '#4a3000'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(40, 28, 5, 0.2, Math.PI-0.2); ctx.stroke();
    // Explorer hat
    ctx.fillStyle = '#5c3a1e';
    ctx.beginPath(); ctx.ellipse(40, 17, 20, 5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillRect(26, 8, 28, 10);
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(27, 9, 26, 8);
    // Hat band
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(26, 16, 28, 3);
    // Backpack
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(56, 40, 14, 20);
    ctx.strokeStyle = dark; ctx.lineWidth = 1;
    ctx.strokeRect(58, 42, 10, 8);
    ctx.strokeRect(58, 52, 10, 6);
    // Backpack straps
    ctx.strokeStyle = '#5c3a1e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(57, 40); ctx.lineTo(64, 38); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(57, 58); ctx.lineTo(64, 62); ctx.stroke();
  }
  return c;
}

// ─── BUILD PICKER UI ──────────────────────────────────────────────────
let selectedAvatar = 'wizard';
const pickerEl = document.getElementById('avatar-picker');

function buildPicker(color) {
  pickerEl.innerHTML = '';
  AVATAR_TYPES.forEach(av => {
    const div = document.createElement('div');
    div.className = 'avatar-option' + (av.id === selectedAvatar ? ' selected' : '');
    div.dataset.id = av.id;
    const preview = drawAvatarPreview(av.id, color);
    const label = document.createElement('span');
    label.className = 'avatar-label';
    label.textContent = av.label;
    const desc = document.createElement('span');
    desc.className = 'avatar-desc';
    desc.textContent = av.desc;
    div.appendChild(preview);
    div.appendChild(label);
    div.appendChild(desc);
    div.addEventListener('click', () => {
      selectedAvatar = av.id;
      document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
    });
    pickerEl.appendChild(div);
  });
}

const previewColor = Math.floor(Math.random() * 0xffffff);
buildPicker(previewColor);

// ─── ENTRY ────────────────────────────────────────────────────────────
const entryScreen = document.getElementById('entry-screen');
const nameInput   = document.getElementById('name-input');
const joinBtn     = document.getElementById('join-btn');
let myName = 'Guest';

joinBtn.addEventListener('click', () => {
  const val = nameInput.value.trim();
  if (!val) { nameInput.placeholder = 'Please enter a name!'; return; }
  myName = val;
  entryScreen.style.display = 'none';
  const socket = io();
  initGame(socket);
});

nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') joinBtn.click(); });

// ─── GAME ─────────────────────────────────────────────────────────────
function initGame(socket) {

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd0e8f0);
scene.fog = new THREE.Fog(0xd0e8f0, 60, 160);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Lighting
const sun = new THREE.DirectionalLight(0xfffbf0, 2.0);
sun.position.set(60, 100, 40);
sun.castShadow = true;
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 300;
sun.shadow.camera.left = -100;
sun.shadow.camera.right = 100;
sun.shadow.camera.top = 100;
sun.shadow.camera.bottom = -100;
scene.add(sun);
scene.add(new THREE.HemisphereLight(0x87ceeb, 0x4a7a20, 0.8));
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// ─── TERRAIN ──────────────────────────────────────────────────────────
const TILE_SIZE = 100;
const TILE_SEGS = 40;

function smoothNoise(x, z) {
  return (
    Math.sin(x * 0.03) * Math.cos(z * 0.03) * 4 +
    Math.sin(x * 0.07 + 1.2) * Math.cos(z * 0.05 + 0.8) * 2.5 +
    Math.sin(x * 0.15 + 2.1) * Math.cos(z * 0.13 + 1.5) * 1.2 +
    Math.sin(x * 0.25) * Math.cos(z * 0.2) * 0.5
  );
}

function getTerrainHeight(x, z) { return smoothNoise(x, z); }

function buildTile(tileX, tileZ) {
  const geo = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, TILE_SEGS, TILE_SEGS);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = [];
  for (let i = 0; i < pos.count; i++) {
    const wx = pos.getX(i) + tileX * TILE_SIZE;
    const wz = pos.getZ(i) + tileZ * TILE_SIZE;
    const h = smoothNoise(wx, wz);
    pos.setY(i, h);
    if (h < 1)        colors.push(0.53, 0.73, 0.13);
    else if (h < 2.5) colors.push(0.47, 0.65, 0.10);
    else              colors.push(0.48, 0.25, 0.06);
  }
  geo.computeVertexNormals();
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
  mesh.position.set(tileX * TILE_SIZE, 0, tileZ * TILE_SIZE);
  mesh.receiveShadow = true;
  return mesh;
}

const tiles = {};
const tileObjects = {};
const tileDecor = {};

function tileKey(tx, tz) { return `${tx}_${tz}`; }

function updateTiles(playerX, playerZ) {
  const cx = Math.round(playerX / TILE_SIZE);
  const cz = Math.round(playerZ / TILE_SIZE);
  for (let tx = cx - 1; tx <= cx + 1; tx++) {
    for (let tz = cz - 1; tz <= cz + 1; tz++) {
      const key = tileKey(tx, tz);
      if (!tiles[key]) {
        const mesh = buildTile(tx, tz);
        scene.add(mesh);
        tiles[key] = true;
        tileObjects[key] = mesh;
        spawnTileDecor(tx, tz);
      }
    }
  }
  for (const key in tiles) {
    const [ktx, ktz] = key.split('_').map(Number);
    if (Math.abs(ktx - cx) > 2 || Math.abs(ktz - cz) > 2) {
      scene.remove(tileObjects[key]);
      if (tileDecor[key]) scene.remove(tileDecor[key]);
      delete tiles[key];
      delete tileObjects[key];
      delete tileDecor[key];
    }
  }
}

// ─── DECOR ─────────────────────────────────────────────────────────────
function spawnTileDecor(tileX, tileZ) {
  const key = tileKey(tileX, tileZ);
  if (tileDecor[key]) return;
  const group = new THREE.Group();
  const ox = tileX * TILE_SIZE;
  const oz = tileZ * TILE_SIZE;

  for (let i = 0; i < 20; i++) {
    const x = ox + Math.random() * TILE_SIZE - TILE_SIZE / 2;
    const z = oz + Math.random() * TILE_SIZE - TILE_SIZE / 2;
    const scale = 0.8 + Math.random() * 0.9;
    const baseH = getTerrainHeight(x, z);
    const trunkH = 1.2 * scale;
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, trunkH, 5),
      new THREE.MeshLambertMaterial({ color: 0x3a1f00 })
    );
    trunk.position.set(x, baseH + trunkH / 2, z);
    trunk.castShadow = true;
    group.add(trunk);
    const layerColors = [0x2d7a1a, 0x33881f, 0x226614];
    [
      { r: 1.4 * scale, h: 2.2 * scale, y: baseH + trunkH + 0.6 * scale },
      { r: 1.0 * scale, h: 1.8 * scale, y: baseH + trunkH + 1.7 * scale },
      { r: 0.6 * scale, h: 1.4 * scale, y: baseH + trunkH + 2.6 * scale },
    ].forEach((l, idx) => {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(l.r, l.h, 7),
        new THREE.MeshLambertMaterial({ color: layerColors[idx] })
      );
      cone.position.set(x, l.y, z);
      cone.castShadow = true;
      group.add(cone);
    });
  }

  for (let i = 0; i < 6; i++) {
    const cx = ox + Math.random() * TILE_SIZE - TILE_SIZE / 2;
    const cz = oz + Math.random() * TILE_SIZE - TILE_SIZE / 2;
    const baseH = getTerrainHeight(cx, cz);
    const count = 2 + Math.floor(Math.random() * 3);
    for (let j = 0; j < count; j++) {
      const size = 0.4 + Math.random() * 0.9;
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(size, 0),
        new THREE.MeshLambertMaterial({ color: [0x999999, 0x888888, 0xaaaaaa][j % 3] })
      );
      rock.position.set(cx + (Math.random()-0.5)*3, baseH + size*0.5, cz + (Math.random()-0.5)*3);
      rock.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
      rock.castShadow = true;
      group.add(rock);
    }
  }

  const flowerColors = [0xff4488, 0xff8800, 0xffff00, 0xff00ff, 0x00ffff];
  for (let i = 0; i < 40; i++) {
    const x = ox + Math.random() * TILE_SIZE - TILE_SIZE / 2;
    const z = oz + Math.random() * TILE_SIZE - TILE_SIZE / 2;
    const baseH = getTerrainHeight(x, z);
    const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    const stemH = 0.3 + Math.random() * 0.3;
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, stemH, 4),
      new THREE.MeshLambertMaterial({ color: 0x33aa33 })
    );
    stem.position.set(x, baseH + stemH/2, z);
    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 5, 5),
      new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.4 })
    );
    flower.position.set(x, baseH + stemH + 0.1, z);
    group.add(stem, flower);
  }

  for (let i = 0; i < 120; i++) {
    const x = ox + Math.random() * TILE_SIZE - TILE_SIZE / 2;
    const z = oz + Math.random() * TILE_SIZE - TILE_SIZE / 2;
    const baseH = getTerrainHeight(x, z);
    const height = 0.3 + Math.random() * 0.4;
    const blade = new THREE.Mesh(
      new THREE.ConeGeometry(0.05, height, 3),
      new THREE.MeshLambertMaterial({ color: [0x44aa22, 0x55bb33, 0x33991a][Math.floor(Math.random()*3)] })
    );
    blade.position.set(x, baseH + height/2, z);
    blade.rotation.z = (Math.random()-0.5)*0.3;
    group.add(blade);
  }

  scene.add(group);
  tileDecor[key] = group;
}

// ─── NAME TAG ──────────────────────────────────────────────────────────
function makeNameTag(name) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.roundRect(0, 0, 256, 64, 12); ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name || 'Guest', 128, 42);
  return new THREE.CanvasTexture(canvas);
}

// ─── 3D AVATAR BUILDER ─────────────────────────────────────────────────
function makeAvatar(color, name, type) {
  const group = new THREE.Group();
  const c = color;
  const mat     = (col) => new THREE.MeshLambertMaterial({ color: col });
  const eMat    = (col, ei) => new THREE.MeshLambertMaterial({ color: col, emissive: col, emissiveIntensity: ei || 0.5 });
  const tMat    = (col, op) => new THREE.MeshLambertMaterial({ color: col, transparent: true, opacity: op });

  const add = (geo, material, x, y, z, rx, ry, rz, sx, sy, sz) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x||0, y||0, z||0);
    if (rx||ry||rz) m.rotation.set(rx||0, ry||0, rz||0);
    if (sx||sy||sz) m.scale.set(sx||1, sy||1, sz||1);
    m.castShadow = true;
    group.add(m);
    return m;
  };

  if (type === 'wizard') {
    const robeColor = c;
    const hatColor = Math.max(0, c - 0x222222);

    // Feet
    add(new THREE.SphereGeometry(0.14, 6, 4), mat(0x3a1a00), -0.18, 0.14, 0.1);
    add(new THREE.SphereGeometry(0.14, 6, 4), mat(0x3a1a00),  0.18, 0.14, 0.1);

    // Robe - layered for depth
    add(new THREE.CylinderGeometry(0.5, 0.75, 1.2, 8), mat(robeColor), 0, 0.8, 0);
    add(new THREE.CylinderGeometry(0.35, 0.5, 0.6, 8), mat(robeColor), 0, 1.6, 0);

    // Robe stars
    add(new THREE.OctahedronGeometry(0.06), eMat(0xffdd00, 0.8), -0.25, 1.0, 0.45);
    add(new THREE.OctahedronGeometry(0.05), eMat(0xffdd00, 0.8),  0.3,  0.7, 0.42);
    add(new THREE.OctahedronGeometry(0.04), eMat(0xffdd00, 0.8),  0.1,  1.3, 0.4);

    // Belt
    add(new THREE.CylinderGeometry(0.51, 0.51, 0.1, 8), mat(0x5c3010), 0, 1.1, 0);

    // Arms
    add(new THREE.CylinderGeometry(0.1, 0.12, 0.7, 6), mat(robeColor), -0.6, 1.55, 0, 0, 0, 0.4);
    add(new THREE.CylinderGeometry(0.1, 0.12, 0.7, 6), mat(robeColor),  0.6, 1.55, 0, 0, 0, -0.4);

    // Hands
    add(new THREE.SphereGeometry(0.12, 6, 6), mat(0xf5c080), -0.88, 1.3, 0);
    add(new THREE.SphereGeometry(0.12, 6, 6), mat(0xf5c080),  0.88, 1.3, 0);

    // Neck
    add(new THREE.CylinderGeometry(0.12, 0.15, 0.2, 6), mat(0xf5c080), 0, 1.95, 0);

    // Head
    add(new THREE.SphereGeometry(0.38, 8, 8), mat(0xf5c080), 0, 2.35, 0);

    // Beard
    add(new THREE.ConeGeometry(0.2, 0.5, 7), mat(0xdddddd), 0, 2.0, 0.2, -0.4, 0, 0);

    // Eyes
    add(new THREE.SphereGeometry(0.07, 6, 6), eMat(0x6633ff, 0.5), -0.14, 2.38, 0.33);
    add(new THREE.SphereGeometry(0.07, 6, 6), eMat(0x6633ff, 0.5),  0.14, 2.38, 0.33);
    add(new THREE.SphereGeometry(0.03, 4, 4), mat(0xffffff), -0.14, 2.4, 0.38);
    add(new THREE.SphereGeometry(0.03, 4, 4), mat(0xffffff),  0.14, 2.4, 0.38);

    // Eyebrows
    add(new THREE.BoxGeometry(0.12, 0.03, 0.04), mat(0x888888), -0.14, 2.48, 0.33);
    add(new THREE.BoxGeometry(0.12, 0.03, 0.04), mat(0x888888),  0.14, 2.48, 0.33);

    // Pointy hat
    add(new THREE.CylinderGeometry(0, 0.42, 0.9, 8), mat(hatColor), 0, 3.05, 0);
    add(new THREE.CylinderGeometry(0.48, 0.48, 0.08, 8), mat(hatColor), 0, 2.65, 0);

    // Hat star
    add(new THREE.OctahedronGeometry(0.09), eMat(0xffdd00, 1.0), 0, 3.45, 0);

    // Hat band
    add(new THREE.CylinderGeometry(0.43, 0.43, 0.06, 8), eMat(0xffaa00, 0.3), 0, 2.7, 0);

    // Staff
    add(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6), mat(0x8B4513), 0.95, 1.1, 0);
    add(new THREE.OctahedronGeometry(0.18), eMat(0x00ddff, 1.0), 0.95, 2.3, 0);
    add(new THREE.SphereGeometry(0.25, 8, 8), tMat(0x00ddff, 0.25), 0.95, 2.3, 0);

  } else if (type === 'robot') {
    const bodyColor = c;
    const darkColor = Math.max(0, c - 0x303030);

    // Feet
    add(new THREE.BoxGeometry(0.28, 0.12, 0.38), mat(darkColor), -0.18, 0.06, 0.05);
    add(new THREE.BoxGeometry(0.28, 0.12, 0.38), mat(darkColor),  0.18, 0.06, 0.05);

    // Lower legs
    add(new THREE.BoxGeometry(0.22, 0.5, 0.22), mat(darkColor), -0.18, 0.37, 0);
    add(new THREE.BoxGeometry(0.22, 0.5, 0.22), mat(darkColor),  0.18, 0.37, 0);

    // Knee joints
    add(new THREE.SphereGeometry(0.13, 6, 6), mat(0x888888), -0.18, 0.65, 0);
    add(new THREE.SphereGeometry(0.13, 6, 6), mat(0x888888),  0.18, 0.65, 0);

    // Upper legs
    add(new THREE.BoxGeometry(0.24, 0.4, 0.24), mat(bodyColor), -0.18, 0.9, 0);
    add(new THREE.BoxGeometry(0.24, 0.4, 0.24), mat(bodyColor),  0.18, 0.9, 0);

    // Hip
    add(new THREE.BoxGeometry(0.6, 0.2, 0.4), mat(darkColor), 0, 1.12, 0);

    // Torso
    add(new THREE.BoxGeometry(0.72, 0.7, 0.48), mat(bodyColor), 0, 1.6, 0);

    // Chest panel
    add(new THREE.BoxGeometry(0.4, 0.3, 0.08), mat(darkColor), 0, 1.65, 0.25);

    // Chest light
    add(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 8), eMat(0x00ffff, 1.5), 0, 1.7, 0.28);
    add(new THREE.SphereGeometry(0.14, 8, 8), tMat(0x00ffff, 0.3), 0, 1.7, 0.28);

    // Side vents
    add(new THREE.BoxGeometry(0.06, 0.3, 0.12), mat(darkColor), -0.38, 1.55, 0.1);
    add(new THREE.BoxGeometry(0.06, 0.3, 0.12), mat(darkColor),  0.38, 1.55, 0.1);

    // Shoulder joints
    add(new THREE.SphereGeometry(0.18, 8, 8), mat(0x888888), -0.54, 1.9, 0);
    add(new THREE.SphereGeometry(0.18, 8, 8), mat(0x888888),  0.54, 1.9, 0);

    // Upper arms
    add(new THREE.BoxGeometry(0.22, 0.5, 0.22), mat(bodyColor), -0.6, 1.55, 0);
    add(new THREE.BoxGeometry(0.22, 0.5, 0.22), mat(bodyColor),  0.6, 1.55, 0);

    // Elbow joints
    add(new THREE.SphereGeometry(0.12, 6, 6), mat(0x888888), -0.6, 1.28, 0);
    add(new THREE.SphereGeometry(0.12, 6, 6), mat(0x888888),  0.6, 1.28, 0);

    // Lower arms
    add(new THREE.BoxGeometry(0.2, 0.42, 0.2), mat(darkColor), -0.6, 1.0, 0);
    add(new THREE.BoxGeometry(0.2, 0.42, 0.2), mat(darkColor),  0.6, 1.0, 0);

    // Claws
    add(new THREE.BoxGeometry(0.07, 0.22, 0.07), mat(0x888888), -0.68, 0.74, 0.05);
    add(new THREE.BoxGeometry(0.07, 0.22, 0.07), mat(0x888888), -0.52, 0.74, 0.05);
    add(new THREE.BoxGeometry(0.07, 0.22, 0.07), mat(0x888888),  0.68, 0.74, 0.05);
    add(new THREE.BoxGeometry(0.07, 0.22, 0.07), mat(0x888888),  0.52, 0.74, 0.05);

    // Neck
    add(new THREE.CylinderGeometry(0.15, 0.18, 0.2, 8), mat(darkColor), 0, 2.05, 0);

    // Head
    add(new THREE.BoxGeometry(0.6, 0.5, 0.54), mat(bodyColor), 0, 2.45, 0);

    // Visor
    add(new THREE.BoxGeometry(0.52, 0.16, 0.08), eMat(0xff2200, 0.8), 0, 2.48, 0.28);
    add(new THREE.BoxGeometry(0.56, 0.2, 0.06), tMat(0xff3300, 0.25), 0, 2.48, 0.29);

    // Ear sensors
    add(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 6), eMat(0x00ffaa, 0.8), -0.32, 2.52, 0, 0, 0, Math.PI/2);
    add(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 6), eMat(0x00ffaa, 0.8),  0.32, 2.52, 0, 0, 0, Math.PI/2);

    // Antenna
    add(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 5), mat(0xaaaaaa), 0.2, 2.88, 0);
    add(new THREE.SphereGeometry(0.06, 6, 6), eMat(0xff0000, 1.5), 0.2, 3.06, 0);

  } else if (type === 'warrior') {
    const armorColor = c;
    const darkArmor = Math.max(0, c - 0x222222);

    // Boots
    add(new THREE.BoxGeometry(0.26, 0.18, 0.35), mat(0x333333), -0.18, 0.09, 0.05);
    add(new THREE.BoxGeometry(0.26, 0.18, 0.35), mat(0x333333),  0.18, 0.09, 0.05);

    // Greaves
    add(new THREE.BoxGeometry(0.24, 0.5, 0.26), mat(0x888888), -0.18, 0.43, 0);
    add(new THREE.BoxGeometry(0.24, 0.5, 0.26), mat(0x888888),  0.18, 0.43, 0);
    add(new THREE.BoxGeometry(0.2, 0.46, 0.06), mat(armorColor), -0.18, 0.43, 0.14);
    add(new THREE.BoxGeometry(0.2, 0.46, 0.06), mat(armorColor),  0.18, 0.43, 0.14);

    // Knee guards
    add(new THREE.SphereGeometry(0.1, 6, 6), mat(0xaaaaaa), -0.18, 0.72, 0.12);
    add(new THREE.SphereGeometry(0.1, 6, 6), mat(0xaaaaaa),  0.18, 0.72, 0.12);

    // Thighs
    add(new THREE.BoxGeometry(0.28, 0.4, 0.28), mat(0x888888), -0.18, 0.98, 0);
    add(new THREE.BoxGeometry(0.28, 0.4, 0.28), mat(0x888888),  0.18, 0.98, 0);

    // Skirt/tassets
    add(new THREE.BoxGeometry(0.2, 0.28, 0.1), mat(armorColor), -0.24, 1.05, -0.1);
    add(new THREE.BoxGeometry(0.2, 0.28, 0.1), mat(armorColor),  0.24, 1.05, -0.1);

    // Chest plate
    add(new THREE.BoxGeometry(0.72, 0.65, 0.42), mat(0x888888), 0, 1.6, 0);
    add(new THREE.BoxGeometry(0.6, 0.55, 0.1), mat(armorColor), 0, 1.62, 0.22);

    // Chest detail
    add(new THREE.BoxGeometry(0.15, 0.35, 0.08), mat(0xffcc00), 0, 1.65, 0.26);

    // Cape
    add(new THREE.BoxGeometry(0.06, 0.9, 0.55), tMat(0xcc2222, 0.9), -0.4, 1.35, -0.15);
    add(new THREE.BoxGeometry(0.06, 0.9, 0.55), tMat(0xcc2222, 0.9),  0.4, 1.35, -0.15);

    // Shoulder pads
    add(new THREE.SphereGeometry(0.22, 7, 7), mat(0x999999), -0.52, 1.92, 0);
    add(new THREE.SphereGeometry(0.22, 7, 7), mat(0x999999),  0.52, 1.92, 0);
    add(new THREE.SphereGeometry(0.15, 6, 6), mat(armorColor), -0.52, 2.02, 0);
    add(new THREE.SphereGeometry(0.15, 6, 6), mat(armorColor),  0.52, 2.02, 0);

    // Arms
    add(new THREE.CylinderGeometry(0.12, 0.14, 0.55, 7), mat(0x888888), -0.6, 1.62, 0);
    add(new THREE.CylinderGeometry(0.12, 0.14, 0.55, 7), mat(0x888888),  0.6, 1.62, 0);

    // Gauntlets
    add(new THREE.BoxGeometry(0.22, 0.3, 0.22), mat(0x888888), -0.6, 1.24, 0);
    add(new THREE.BoxGeometry(0.22, 0.3, 0.22), mat(0x888888),  0.6, 1.24, 0);

    // Fists
    add(new THREE.BoxGeometry(0.2, 0.2, 0.2), mat(0x777777), -0.6, 1.0, 0);
    add(new THREE.BoxGeometry(0.2, 0.2, 0.2), mat(0x777777),  0.6, 1.0, 0);

    // Neck
    add(new THREE.CylinderGeometry(0.13, 0.16, 0.18, 7), mat(0x888888), 0, 2.04, 0);

    // Helmet
    add(new THREE.SphereGeometry(0.38, 8, 8), mat(0x888888), 0, 2.44, 0);
    add(new THREE.BoxGeometry(0.56, 0.32, 0.1), mat(0x777777), 0, 2.35, 0.34);
    add(new THREE.BoxGeometry(0.4, 0.18, 0.08), tMat(0x4499ff, 0.6), 0, 2.38, 0.38);

    // Helmet crest
    add(new THREE.BoxGeometry(0.08, 0.3, 0.4), mat(0xcc2222), 0, 2.75, 0);

    // Sword
    add(new THREE.BoxGeometry(0.06, 1.3, 0.06), mat(0xdddddd), 1.0, 1.4, 0);
    add(new THREE.BoxGeometry(0.35, 0.07, 0.07), mat(0xffcc00), 1.0, 0.85, 0);
    add(new THREE.BoxGeometry(0.1, 0.2, 0.1), mat(0x8B4513), 1.0, 0.75, 0);

    // Shield
    add(new THREE.BoxGeometry(0.08, 0.65, 0.5), mat(armorColor), -1.05, 1.55, 0);
    add(new THREE.BoxGeometry(0.06, 0.55, 0.4), mat(0x999999), -1.05, 1.55, 0);
    add(new THREE.SphereGeometry(0.08, 6, 6), mat(0xffcc00), -1.05, 1.55, 0.22);

  } else if (type === 'explorer') {
    const jacketColor = c;

    // Boots
    add(new THREE.BoxGeometry(0.26, 0.22, 0.34), mat(0x5c3a1e), -0.18, 0.11, 0.04);
    add(new THREE.BoxGeometry(0.26, 0.22, 0.34), mat(0x5c3a1e),  0.18, 0.11, 0.04);

    // Pants
    add(new THREE.BoxGeometry(0.24, 0.55, 0.26), mat(0x8B6914), -0.18, 0.5, 0);
    add(new THREE.BoxGeometry(0.24, 0.55, 0.26), mat(0x8B6914),  0.18, 0.5, 0);

    // Knee pads
    add(new THREE.BoxGeometry(0.22, 0.14, 0.14), mat(0xaa8820), -0.18, 0.62, 0.12);
    add(new THREE.BoxGeometry(0.22, 0.14, 0.14), mat(0xaa8820),  0.18, 0.62, 0.12);

    // Belt
    add(new THREE.BoxGeometry(0.64, 0.1, 0.34), mat(0x5c3a1e), 0, 0.85, 0);
    add(new THREE.BoxGeometry(0.14, 0.12, 0.12), mat(0xffcc00), 0, 0.85, 0.18);

    // Jacket
    add(new THREE.BoxGeometry(0.68, 0.65, 0.4), mat(jacketColor), 0, 1.52, 0);

    // Jacket collar
    add(new THREE.BoxGeometry(0.5, 0.18, 0.12), mat(Math.max(0, jacketColor - 0x222222)), 0, 1.88, 0.16);

    // Jacket pockets
    add(new THREE.BoxGeometry(0.2, 0.16, 0.08), mat(Math.max(0, jacketColor - 0x111111)), -0.22, 1.45, 0.22);
    add(new THREE.BoxGeometry(0.2, 0.16, 0.08), mat(Math.max(0, jacketColor - 0x111111)),  0.22, 1.45, 0.22);

    // Arms
    add(new THREE.CylinderGeometry(0.11, 0.13, 0.62, 6), mat(jacketColor), -0.52, 1.52, 0, 0, 0, 0.12);
    add(new THREE.CylinderGeometry(0.11, 0.13, 0.62, 6), mat(jacketColor),  0.52, 1.52, 0, 0, 0, -0.12);

    // Gloves
    add(new THREE.SphereGeometry(0.13, 6, 6), mat(0x5c3a1e), -0.6, 1.15, 0);
    add(new THREE.SphereGeometry(0.13, 6, 6), mat(0x5c3a1e),  0.6, 1.15, 0);

    // Neck
    add(new THREE.CylinderGeometry(0.1, 0.13, 0.18, 6), mat(0xf5c080), 0, 1.96, 0);

    // Head
    add(new THREE.SphereGeometry(0.35, 8, 8), mat(0xf5c080), 0, 2.35, 0);

    // Eyes
    add(new THREE.SphereGeometry(0.065, 6, 6), mat(0x4a3000), -0.13, 2.38, 0.3);
    add(new THREE.SphereGeometry(0.065, 6, 6), mat(0x4a3000),  0.13, 2.38, 0.3);
    add(new THREE.SphereGeometry(0.03, 4, 4), mat(0xffffff), -0.12, 2.4, 0.35);
    add(new THREE.SphereGeometry(0.03, 4, 4), mat(0xffffff),  0.12, 2.4, 0.35);

    // Smile
    const smileCurve = new THREE.TorusGeometry(0.08, 0.015, 4, 8, Math.PI);
    const smileMesh = new THREE.Mesh(smileCurve, mat(0x4a3000));
    smileMesh.position.set(0, 2.24, 0.33);
    smileMesh.rotation.set(Math.PI/2, 0, 0);
    group.add(smileMesh);

    // Nose
    add(new THREE.SphereGeometry(0.04, 5, 5), mat(0xe5b070), 0, 2.32, 0.35);

    // Explorer hat brim
    add(new THREE.CylinderGeometry(0.52, 0.52, 0.06, 10), mat(0x5c3a1e), 0, 2.67, 0);
    // Hat crown
    add(new THREE.CylinderGeometry(0.28, 0.32, 0.3, 8), mat(0x5c3a1e), 0, 2.86, 0);
    // Hat band
    add(new THREE.CylinderGeometry(0.33, 0.33, 0.07, 8), mat(0xffcc00), 0, 2.68, 0);

    // Backpack body
    add(new THREE.BoxGeometry(0.38, 0.5, 0.22), mat(0x8B6914), 0, 1.55, -0.32);
    // Backpack top
    add(new THREE.BoxGeometry(0.34, 0.14, 0.18), mat(0x7a5c10), 0, 1.83, -0.3);
    // Backpack pockets
    add(new THREE.BoxGeometry(0.3, 0.2, 0.1), mat(0x7a5c10), 0, 1.38, -0.38);
    // Backpack straps
    add(new THREE.BoxGeometry(0.06, 0.55, 0.06), mat(0x5c3a1e), -0.14, 1.62, -0.12);
    add(new THREE.BoxGeometry(0.06, 0.55, 0.06), mat(0x5c3a1e),  0.14, 1.62, -0.12);
    // Rolled bedroll on top
    add(new THREE.CylinderGeometry(0.1, 0.1, 0.36, 7), mat(0xcc8833), 0, 2.0, -0.3, Math.PI/2, 0, 0);
  }

  // Name tag
  const tagMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 0.55),
    new THREE.MeshBasicMaterial({ map: makeNameTag(name), transparent: true, depthWrite: false })
  );
  tagMesh.position.y = 3.6;
  tagMesh.name = 'nameTag';

  // Speech bubble
  const bubbleCanvas = document.createElement('canvas');
  bubbleCanvas.width = 512; bubbleCanvas.height = 128;
  const bubbleTexture = new THREE.CanvasTexture(bubbleCanvas);
  const bubble = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 1),
    new THREE.MeshBasicMaterial({ map: bubbleTexture, transparent: true, depthWrite: false })
  );
  bubble.position.y = 4.4;
  bubble.name = 'speechBubble';
  bubble.visible = false;
  bubble.userData.canvas = bubbleCanvas;
  bubble.userData.texture = bubbleTexture;
  bubble.userData.timeout = null;
  group.add(tagMesh, bubble);
  return group;
}

function showSpeechBubble(avatar, text) {
  const bubble = avatar.getObjectByName('speechBubble');
  if (!bubble) return;
  const canvas = bubble.userData.canvas;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 30, 16); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(canvas.width/2 - 10, canvas.height - 20);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.lineTo(canvas.width/2 + 10, canvas.height - 20);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text.slice(0, 40), canvas.width/2, 65);
  bubble.userData.texture.needsUpdate = true;
  bubble.visible = true;
  if (bubble.userData.timeout) clearTimeout(bubble.userData.timeout);
  bubble.userData.timeout = setTimeout(() => { bubble.visible = false; }, 5000);
}

// ─── STATE ─────────────────────────────────────────────────────────────
let myPlayer = null;
let myColor  = null;
const otherPlayers = {};
const PROXIMITY = 15;

const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup',   e => keys[e.key] = false);

const messagesDiv = document.getElementById('messages');
const chatBox     = document.getElementById('chat-box');
const chatInput   = document.getElementById('chat-input');
const chatSend    = document.getElementById('chat-send');

function showMessage(text) {
  const p = document.createElement('p');
  p.textContent = text;
  messagesDiv.appendChild(p);
  setTimeout(() => p.remove(), 5000);
}

chatSend.addEventListener('click', () => {
  const msg = chatInput.value.trim();
  if (msg) { socket.emit('chatMessage', msg); chatInput.value = ''; }
});
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') chatSend.click(); });

function checkProximity() {
  if (!myPlayer) return;
  let near = false;
  for (const id in otherPlayers) {
    const dx = myPlayer.position.x - otherPlayers[id].position.x;
    const dz = myPlayer.position.z - otherPlayers[id].position.z;
    if (Math.sqrt(dx*dx + dz*dz) <= PROXIMITY) { near = true; break; }
  }
  chatBox.style.display = near ? 'flex' : 'none';
}

// ─── SOCKET ────────────────────────────────────────────────────────────
socket.on('init', (players) => {
  for (const id in players) {
    const p = players[id];
    if (id === socket.id) {
      myColor  = p.color;
      myPlayer = makeAvatar(myColor, myName, selectedAvatar);
      myPlayer.position.set(p.x, getTerrainHeight(p.x, p.z), p.z);
      scene.add(myPlayer);
      updateTiles(p.x, p.z);
    } else {
      const avatar = makeAvatar(p.color, p.name, p.avatarType || 'explorer');
      avatar.position.set(p.x, getTerrainHeight(p.x, p.z), p.z);
      scene.add(avatar);
      otherPlayers[id] = avatar;
    }
  }
  socket.emit('setName', myName);
  socket.emit('setAvatarType', selectedAvatar);
});

socket.on('playerJoined', (p) => {
  const avatar = makeAvatar(p.color, p.name, p.avatarType || 'explorer');
  avatar.position.set(p.x, getTerrainHeight(p.x, p.z), p.z);
  scene.add(avatar);
  otherPlayers[p.id] = avatar;
  showMessage(`${p.name} joined the world!`);
});

socket.on('playerNamed', (data) => {
  if (otherPlayers[data.id]) {
    const tag = otherPlayers[data.id].getObjectByName('nameTag');
    if (tag) { tag.material.map = makeNameTag(data.name); tag.material.map.needsUpdate = true; }
  }
});

socket.on('playerMoved', (data) => {
  if (otherPlayers[data.id]) {
    otherPlayers[data.id].position.set(data.x, getTerrainHeight(data.x, data.z), data.z);
  }
  checkProximity();
});

socket.on('playerLeft', (id) => {
  if (otherPlayers[id]) { scene.remove(otherPlayers[id]); delete otherPlayers[id]; }
  showMessage('A player left.');
  checkProximity();
});

socket.on('chatMessage', (data) => {
  const label = data.id === socket.id ? 'You' : data.name || 'Player';
  showMessage(`${label}: ${data.msg}`);
  if (data.id === socket.id && myPlayer) showSpeechBubble(myPlayer, data.msg);
  else if (otherPlayers[data.id]) showSpeechBubble(otherPlayers[data.id], data.msg);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── LOOP ──────────────────────────────────────────────────────────────
const speed = 0.12;
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.016;

  if (myPlayer) {
    let moved = false;
    if (keys['ArrowUp']    || keys['w'] || keys['W']) { myPlayer.position.z -= speed; moved = true; }
    if (keys['ArrowDown']  || keys['s'] || keys['S']) { myPlayer.position.z += speed; moved = true; }
    if (keys['ArrowLeft']  || keys['a'] || keys['A']) { myPlayer.position.x -= speed; moved = true; }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) { myPlayer.position.x += speed; moved = true; }

    const targetH = getTerrainHeight(myPlayer.position.x, myPlayer.position.z);
    myPlayer.position.y += (targetH - myPlayer.position.y) * 0.2;

    // Subtle bobbing when moving
    if (moved) {
      myPlayer.position.y += Math.sin(time * 12) * 0.02;
      socket.emit('move', { x: myPlayer.position.x, z: myPlayer.position.z });
      checkProximity();
      updateTiles(myPlayer.position.x, myPlayer.position.z);
    }

    camera.position.x = myPlayer.position.x;
    camera.position.y = myPlayer.position.y + 10;
    camera.position.z = myPlayer.position.z + 12;
    camera.lookAt(myPlayer.position);
  }

  scene.traverse((obj) => {
    if (obj.name === 'nameTag' || obj.name === 'speechBubble') obj.lookAt(camera.position);
  });

  renderer.render(scene, camera);
}

animate();

} 