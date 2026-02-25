// ─── AVATAR DEFINITIONS ───────────────────────────────────────────────
const AVATAR_TYPES = [
  { id: 'cute',   label: 'Cute' },
  { id: 'knight', label: 'Knight' },
  { id: 'ghost',  label: 'Ghost' },
  { id: 'human',  label: 'Human' },
];

function drawAvatarPreview(type, color) {
  const c = document.createElement('canvas');
  c.width = 60; c.height = 80;
  const ctx = c.getContext('2d');
  const hex = '#' + color.toString(16).padStart(6, '0');
  ctx.fillStyle = hex;

  if (type === 'cute') {
    ctx.beginPath(); ctx.arc(30, 28, 20, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(30, 60, 12, 16, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(23, 25, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(37, 25, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath(); ctx.arc(24, 25, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(38, 25, 2, 0, Math.PI * 2); ctx.fill();
  } else if (type === 'knight') {
    ctx.fillRect(18, 40, 24, 28);
    ctx.beginPath(); ctx.arc(30, 25, 16, Math.PI, 0); ctx.fill();
    ctx.fillRect(14, 25, 32, 18);
    ctx.fillStyle = '#222'; ctx.fillRect(20, 28, 20, 7);
    ctx.fillStyle = '#aaa'; ctx.fillRect(48, 20, 4, 40);
    ctx.fillStyle = hex; ctx.fillRect(44, 35, 12, 5);
  } else if (type === 'ghost') {
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(30, 30, 20, Math.PI, 0);
    ctx.lineTo(50, 70);
    ctx.bezierCurveTo(44, 62, 36, 68, 30, 62);
    ctx.bezierCurveTo(24, 68, 16, 62, 10, 70);
    ctx.lineTo(10, 30); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(23, 28, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(37, 28, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath(); ctx.arc(24, 29, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(38, 29, 2.5, 0, Math.PI * 2); ctx.fill();
  } else if (type === 'human') {
    ctx.beginPath(); ctx.arc(30, 18, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(20, 32, 20, 24);
    ctx.fillRect(20, 56, 8, 18); ctx.fillRect(32, 56, 8, 18);
    ctx.fillRect(10, 33, 9, 18); ctx.fillRect(41, 33, 9, 18);
  }
  return c;
}

let selectedAvatar = 'cute';
const pickerEl = document.getElementById('avatar-picker');

function buildPicker(color) {
  pickerEl.innerHTML = '';
  AVATAR_TYPES.forEach(av => {
    const div = document.createElement('div');
    div.className = 'avatar-option' + (av.id === selectedAvatar ? ' selected' : '');
    div.dataset.id = av.id;
    const preview = drawAvatarPreview(av.id, color);
    const label = document.createElement('span');
    label.textContent = av.label;
    div.appendChild(preview);
    div.appendChild(label);
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

function getTerrainHeight(x, z) {
  return smoothNoise(x, z);
}

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
const tileDecor = {};

function spawnTileDecor(tileX, tileZ) {
  const key = tileKey(tileX, tileZ);
  if (tileDecor[key]) return;
  const group = new THREE.Group();
  const ox = tileX * TILE_SIZE;
  const oz = tileZ * TILE_SIZE;

  // Trees
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

  // Rocks
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
      rock.position.set(
        cx + (Math.random() - 0.5) * 3,
        baseH + size * 0.5,
        cz + (Math.random() - 0.5) * 3
      );
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      rock.castShadow = true;
      group.add(rock);
    }
  }

  // Flowers
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
    stem.position.set(x, baseH + stemH / 2, z);
    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 5, 5),
      new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.4 })
    );
    flower.position.set(x, baseH + stemH + 0.1, z);
    group.add(stem, flower);
  }

  // Grass
  for (let i = 0; i < 120; i++) {
    const x = ox + Math.random() * TILE_SIZE - TILE_SIZE / 2;
    const z = oz + Math.random() * TILE_SIZE - TILE_SIZE / 2;
    const baseH = getTerrainHeight(x, z);
    const height = 0.3 + Math.random() * 0.4;
    const blade = new THREE.Mesh(
      new THREE.ConeGeometry(0.05, height, 3),
      new THREE.MeshLambertMaterial({ color: [0x44aa22, 0x55bb33, 0x33991a][Math.floor(Math.random() * 3)] })
    );
    blade.position.set(x, baseH + height / 2, z);
    blade.rotation.z = (Math.random() - 0.5) * 0.3;
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
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.roundRect(0, 0, 256, 64, 12); ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name || 'Guest', 128, 42);
  return new THREE.CanvasTexture(canvas);
}

// ─── AVATAR ────────────────────────────────────────────────────────────
function makeAvatar(color, name, type) {
  const group = new THREE.Group();
  const mat     = new THREE.MeshLambertMaterial({ color });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const greyMat = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });

  if (type === 'cute') {
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), mat);
    head.position.y = 1.6;
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.4, 7, 7), mat);
    body.scale.y = 1.2; body.position.y = 0.75;
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 5, 5), darkMat);
    eyeL.position.set(-0.2, 1.68, 0.48);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.1, 5, 5), darkMat);
    eyeR.position.set(0.2, 1.68, 0.48);
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 5), mat);
    legL.position.set(-0.18, 0.25, 0);
    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 5), mat);
    legR.position.set(0.18, 0.25, 0);
    group.add(head, body, eyeL, eyeR, legL, legR);

  } else if (type === 'knight') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.5), mat);
    body.position.y = 0.9;
    const helmet = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.5, 6), mat);
    helmet.position.y = 1.75;
    const helmetTop = new THREE.Mesh(new THREE.SphereGeometry(0.38, 6, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat);
    helmetTop.position.y = 2.0;
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 0.1), darkMat);
    visor.position.set(0, 1.78, 0.4);
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.6, 0.28), mat);
    legL.position.set(-0.2, 0.3, 0);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.6, 0.28), mat);
    legR.position.set(0.2, 0.3, 0);
    const sword = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.0, 0.06), greyMat);
    sword.position.set(0.6, 1.1, 0);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.06), greyMat);
    guard.position.set(0.6, 0.65, 0);
    group.add(body, helmet, helmetTop, visor, legL, legR, sword, guard);

  } else if (type === 'ghost') {
    const glowMat = new THREE.MeshLambertMaterial({
      color, transparent: true, opacity: 0.85,
      emissive: color, emissiveIntensity: 0.4
    });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.65), glowMat);
    body.position.y = 1.3;
    const bottom = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.8, 8), glowMat);
    bottom.position.y = 0.85;
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 5, 5),
      new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 }));
    eyeL.position.set(-0.18, 1.45, 0.44);
    const eyeR = eyeL.clone(); eyeR.position.set(0.18, 1.45, 0.44);
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.06, 6, 12),
      new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 1.0 })
    );
    halo.position.y = 2.0; halo.rotation.x = Math.PI / 2;
    group.add(body, bottom, eyeL, eyeR, halo);

  } else {
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), mat);
    head.position.y = 1.75;
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.35), mat);
    body.position.y = 1.05;
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), mat);
    armL.position.set(-0.42, 1.05, 0);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), mat);
    armR.position.set(0.42, 1.05, 0);
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.24), mat);
    legL.position.set(-0.18, 0.35, 0);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.24), mat);
    legR.position.set(0.18, 0.35, 0);
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.05), darkMat);
    eyeL.position.set(-0.12, 1.8, 0.26);
    const eyeR = eyeL.clone(); eyeR.position.set(0.12, 1.8, 0.26);
    group.add(head, body, armL, armR, legL, legR, eyeL, eyeR);
  }

  const tagMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 0.5),
    new THREE.MeshBasicMaterial({ map: makeNameTag(name), transparent: true, depthWrite: false })
  );
  tagMesh.position.y = 2.9;
  tagMesh.name = 'nameTag';

  const bubbleCanvas = document.createElement('canvas');
  bubbleCanvas.width = 512; bubbleCanvas.height = 128;
  const bubbleTexture = new THREE.CanvasTexture(bubbleCanvas);
  const bubble = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 1),
    new THREE.MeshBasicMaterial({ map: bubbleTexture, transparent: true, depthWrite: false })
  );
  bubble.position.y = 3.7;
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
  ctx.moveTo(canvas.width / 2 - 10, canvas.height - 20);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.lineTo(canvas.width / 2 + 10, canvas.height - 20);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text.slice(0, 40), canvas.width / 2, 65);
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
    if (Math.sqrt(dx * dx + dz * dz) <= PROXIMITY) { near = true; break; }
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
      const avatar = makeAvatar(p.color, p.name, p.avatarType || 'human');
      avatar.position.set(p.x, getTerrainHeight(p.x, p.z), p.z);
      scene.add(avatar);
      otherPlayers[id] = avatar;
    }
  }
  socket.emit('setName', myName);
  socket.emit('setAvatarType', selectedAvatar);
});

socket.on('playerJoined', (p) => {
  const avatar = makeAvatar(p.color, p.name, p.avatarType || 'human');
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

function animate() {
  requestAnimationFrame(animate);

  if (myPlayer) {
    let moved = false;
    if (keys['ArrowUp']    || keys['w'] || keys['W']) { myPlayer.position.z -= speed; moved = true; }
    if (keys['ArrowDown']  || keys['s'] || keys['S']) { myPlayer.position.z += speed; moved = true; }
    if (keys['ArrowLeft']  || keys['a'] || keys['A']) { myPlayer.position.x -= speed; moved = true; }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) { myPlayer.position.x += speed; moved = true; }

    const targetH = getTerrainHeight(myPlayer.position.x, myPlayer.position.z);
    myPlayer.position.y += (targetH - myPlayer.position.y) * 0.2;

    if (moved) {
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