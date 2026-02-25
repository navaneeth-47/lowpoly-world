// Name entry
const nameScreen = document.getElementById('name-screen');
const nameInput = document.getElementById('name-input');
const nameBtn = document.getElementById('name-btn');
let myName = 'Guest';

nameBtn.addEventListener('click', () => {
  const val = nameInput.value.trim();
  if (val) {
    myName = val;
    nameScreen.style.display = 'none';
    const socket = io();
    initGame(socket);
  }
});

nameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') nameBtn.click();
});

function initGame(socket) {

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd0e8f0);
scene.fog = new THREE.Fog(0xd0e8f0, 60, 160);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Bright daylight
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(40, 80, 40);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

// --- FLAT GREEN GROUND ---
const groundGeo = new THREE.PlaneGeometry(300, 300);
const groundMat = new THREE.MeshLambertMaterial({ color: 0x88bb22 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

// --- RAISED TERRAIN PLATEAUS (cliffs from reference) ---
// These are flat boxes sitting ON the ground with brown sides visible
function makePlateau(x, z, w, d, h) {
  // Top surface - green
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    [
      new THREE.MeshLambertMaterial({ color: 0x7a4010 }), // right side brown
      new THREE.MeshLambertMaterial({ color: 0x7a4010 }), // left side brown
      new THREE.MeshLambertMaterial({ color: 0x99cc22 }), // top green
      new THREE.MeshLambertMaterial({ color: 0x5a3008 }), // bottom
      new THREE.MeshLambertMaterial({ color: 0x7a4010 }), // front brown
      new THREE.MeshLambertMaterial({ color: 0x7a4010 }), // back brown
    ]
  );
  top.position.set(x, h / 2, z);
  scene.add(top);
}

// Place plateaus around edges to create cliff walls like the reference
makePlateau(-80, 0, 40, 300, 8);   // left wall
makePlateau(80, 0, 40, 300, 8);    // right wall
makePlateau(0, -80, 300, 40, 8);   // back wall
makePlateau(0, 80, 300, 40, 8);    // front wall
makePlateau(-50, -40, 30, 80, 6);  // inner cliff left
makePlateau(45, 30, 25, 70, 5);    // inner cliff right
makePlateau(-20, 50, 60, 25, 7);   // inner cliff top

// --- GRASS PATCHES ---
function makeGrass(x, z) {
  const grassColors = [0x44aa22, 0x55bb33, 0x33991a, 0x66cc44, 0x3d8c1a];
  const count = 4 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const color = grassColors[Math.floor(Math.random() * grassColors.length)];
    const height = 0.3 + Math.random() * 0.5;
    const blade = new THREE.Mesh(
      new THREE.ConeGeometry(0.05, height, 3),
      new THREE.MeshLambertMaterial({ color })
    );
    blade.position.set(
      x + (Math.random() - 0.5) * 0.8,
      height / 2,
      z + (Math.random() - 0.5) * 0.8
    );
    blade.rotation.z = (Math.random() - 0.5) * 0.3;
    scene.add(blade);
  }
}

for (let i = 0; i < 500; i++) {
  makeGrass(
    Math.random() * 140 - 70,
    Math.random() * 140 - 70
  );
}

// --- PINE TREES ---
function makePineTree(x, z) {
  const scale = 0.8 + Math.random() * 0.9;
  const trunkH = 1.2 * scale;

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, trunkH, 5),
    new THREE.MeshLambertMaterial({ color: 0x3a1f00 })
  );
  trunk.position.set(x, trunkH / 2, z);
  scene.add(trunk);

  const layerColors = [0x2d7a1a, 0x33881f, 0x226614];
  const layers = [
    { r: 1.4 * scale, h: 2.2 * scale, y: trunkH + 0.6 * scale },
    { r: 1.0 * scale, h: 1.8 * scale, y: trunkH + 1.7 * scale },
    { r: 0.6 * scale, h: 1.4 * scale, y: trunkH + 2.6 * scale },
  ];

  layers.forEach((l, i) => {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(l.r, l.h, 7),
      new THREE.MeshLambertMaterial({ color: layerColors[i] })
    );
    cone.position.set(x, l.y, z);
    scene.add(cone);
  });
}

for (let i = 0; i < 120; i++) {
  makePineTree(
    Math.random() * 220 - 110,
    Math.random() * 220 - 110
  );
}

// --- ROCK CLUSTERS ---
function makeRockCluster(cx, cz) {
  const rockCount = 2 + Math.floor(Math.random() * 4);
  const rockColors = [0x999999, 0x888888, 0xaaaaaa, 0x777777];
  for (let i = 0; i < rockCount; i++) {
    const size = 0.4 + Math.random() * 1.0;
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(size, 0),
      new THREE.MeshLambertMaterial({ color: rockColors[Math.floor(Math.random() * rockColors.length)] })
    );
    rock.position.set(
      cx + (Math.random() - 0.5) * 3,
      size * 0.5,
      cz + (Math.random() - 0.5) * 3
    );
    rock.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    scene.add(rock);
  }
}

for (let i = 0; i < 30; i++) {
  makeRockCluster(
    Math.random() * 180 - 90,
    Math.random() * 180 - 90
  );
}

// --- NAME TAG ---
function makeNameTag(name) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.roundRect(0, 0, 256, 64, 12);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name || 'Guest', 128, 42);
  return new THREE.CanvasTexture(canvas);
}

// --- AVATAR ---
function makeAvatar(color, name) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 1.2, 6),
    new THREE.MeshLambertMaterial({ color })
  );
  body.position.y = 0.8;

  const head = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.4, 0),
    new THREE.MeshLambertMaterial({ color })
  );
  head.position.y = 1.8;

  const tagMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 0.5),
    new THREE.MeshBasicMaterial({ map: makeNameTag(name), transparent: true, depthWrite: false })
  );
  tagMesh.position.y = 2.6;
  tagMesh.name = 'nameTag';

  const bubbleCanvas = document.createElement('canvas');
  bubbleCanvas.width = 512;
  bubbleCanvas.height = 128;
  const bubbleTexture = new THREE.CanvasTexture(bubbleCanvas);
  const bubble = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 1),
    new THREE.MeshBasicMaterial({ map: bubbleTexture, transparent: true, depthWrite: false })
  );
  bubble.position.y = 3.4;
  bubble.name = 'speechBubble';
  bubble.visible = false;
  bubble.userData.canvas = bubbleCanvas;
  bubble.userData.texture = bubbleTexture;
  bubble.userData.timeout = null;

  group.add(body);
  group.add(head);
  group.add(tagMesh);
  group.add(bubble);
  return group;
}

function showSpeechBubble(avatar, text) {
  const bubble = avatar.getObjectByName('speechBubble');
  if (!bubble) return;
  const canvas = bubble.userData.canvas;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 30, 16);
  ctx.fill();
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

let myPlayer = null;
let myColor = null;
const otherPlayers = {};
const PROXIMITY = 15;

const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

const messagesDiv = document.getElementById('messages');
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
chatBox.style.display = 'none';

function showMessage(text) {
  const p = document.createElement('p');
  p.textContent = text;
  messagesDiv.appendChild(p);
  setTimeout(() => p.remove(), 5000);
}

chatSend.addEventListener('click', () => {
  const msg = chatInput.value.trim();
  if (msg) {
    socket.emit('chatMessage', msg);
    chatInput.value = '';
  }
});

chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') chatSend.click();
});

function checkProximity() {
  if (!myPlayer) return;
  let someoneNearby = false;
  for (const id in otherPlayers) {
    const dx = myPlayer.position.x - otherPlayers[id].position.x;
    const dz = myPlayer.position.z - otherPlayers[id].position.z;
    if (Math.sqrt(dx * dx + dz * dz) <= PROXIMITY) {
      someoneNearby = true;
      break;
    }
  }
  chatBox.style.display = someoneNearby ? 'flex' : 'none';
}

socket.on('init', (players) => {
  for (const id in players) {
    const p = players[id];
    if (id === socket.id) {
      myColor = p.color;
      myPlayer = makeAvatar(myColor, myName);
      myPlayer.position.set(p.x, 0, p.z);
      scene.add(myPlayer);
    } else {
      const avatar = makeAvatar(p.color, p.name);
      avatar.position.set(p.x, 0, p.z);
      scene.add(avatar);
      otherPlayers[id] = avatar;
    }
  }
  socket.emit('setName', myName);
});

socket.on('playerJoined', (p) => {
  const avatar = makeAvatar(p.color, p.name);
  avatar.position.set(p.x, 0, p.z);
  scene.add(avatar);
  otherPlayers[p.id] = avatar;
  showMessage(`${p.name} joined the world!`);
});

socket.on('playerNamed', (data) => {
  if (otherPlayers[data.id]) {
    const tag = otherPlayers[data.id].getObjectByName('nameTag');
    if (tag) {
      tag.material.map = makeNameTag(data.name);
      tag.material.map.needsUpdate = true;
    }
  }
});

socket.on('playerMoved', (data) => {
  if (otherPlayers[data.id]) {
    otherPlayers[data.id].position.x = data.x;
    otherPlayers[data.id].position.z = data.z;
  }
  checkProximity();
});

socket.on('playerLeft', (id) => {
  if (otherPlayers[id]) {
    scene.remove(otherPlayers[id]);
    delete otherPlayers[id];
  }
  showMessage('A player left.');
  checkProximity();
});

socket.on('chatMessage', (data) => {
  const label = data.id === socket.id ? 'You' : data.name || 'Player';
  showMessage(`${label}: ${data.msg}`);
  if (data.id === socket.id && myPlayer) {
    showSpeechBubble(myPlayer, data.msg);
  } else if (otherPlayers[data.id]) {
    showSpeechBubble(otherPlayers[data.id], data.msg);
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const speed = 0.1;

function animate() {
  requestAnimationFrame(animate);

  if (myPlayer) {
    let moved = false;
    if (keys['ArrowUp'] || keys['w'] || keys['W']) { myPlayer.position.z -= speed; moved = true; }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) { myPlayer.position.z += speed; moved = true; }
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) { myPlayer.position.x -= speed; moved = true; }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) { myPlayer.position.x += speed; moved = true; }

    if (moved) {
      socket.emit('move', { x: myPlayer.position.x, z: myPlayer.position.z });
      checkProximity();
    }

    camera.position.x = myPlayer.position.x;
    camera.position.y = myPlayer.position.y + 10;
    camera.position.z = myPlayer.position.z + 12;
    camera.lookAt(myPlayer.position);
  }

  scene.traverse((obj) => {
    if (obj.name === 'nameTag' || obj.name === 'speechBubble') {
      obj.lookAt(camera.position);
    }
  });

  renderer.render(scene, camera);
}

animate();

} 