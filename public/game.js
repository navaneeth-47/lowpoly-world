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
scene.background = new THREE.Color(0xd0d8e0);
scene.fog = new THREE.Fog(0xd0d8e0, 60, 160);

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

// --- GROUND (bright yellow-green) ---
const groundGeo = new THREE.PlaneGeometry(300, 300, 60, 60);
const groundMat = new THREE.MeshLambertMaterial({ color: 0xaacc22 });
const gpos = groundGeo.attributes.position;
for (let i = 0; i < gpos.count; i++) {
  gpos.setY(i, Math.random() * 0.8);
}
groundGeo.computeVertexNormals();
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// --- CLIFFS ---
// Cliffs are flat-topped brown walls dropped below ground level
function makeCliff(x, z, width, depth, height, rotation) {
  const cliffGeo = new THREE.BufferGeometry();

  // A cliff face is just a flat quad going downward
  const hw = width / 2;
  const vertices = new Float32Array([
    -hw, 0, 0,
     hw, 0, 0,
     hw, -height, depth,
    -hw, -height, depth,
  ]);
  const indices = [0, 1, 2, 0, 2, 3];
  cliffGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  cliffGeo.setIndex(indices);
  cliffGeo.computeVertexNormals();

  const cliff = new THREE.Mesh(
    cliffGeo,
    new THREE.MeshLambertMaterial({ color: 0x7a4a1a, side: THREE.DoubleSide })
  );
  cliff.position.set(x, 0, z);
  cliff.rotation.y = rotation;
  scene.add(cliff);
}

// Place several cliff sections around the map
makeCliff(-30, -20, 60, 8, 12, 0);
makeCliff(20, 30, 50, 8, 10, Math.PI * 0.15);
makeCliff(-50, 10, 40, 8, 14, Math.PI * 0.5);
makeCliff(40, -30, 55, 8, 11, Math.PI * -0.2);
makeCliff(-10, 50, 45, 8, 13, Math.PI * 0.3);
makeCliff(60, 20, 35, 8, 10, Math.PI * 0.7);
makeCliff(-60, -40, 50, 8, 12, Math.PI * -0.1);
makeCliff(10, -60, 60, 8, 11, Math.PI * 0.1);

// --- PINE TREES ---
function makePineTree(x, z) {
  const scale = 0.7 + Math.random() * 0.8;
  const trunkH = 1.2 * scale;

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, trunkH, 5),
    new THREE.MeshLambertMaterial({ color: 0x2a1a0a })
  );
  trunk.position.set(x, trunkH / 2, z);

  // Three layered cones like the reference image
  const layerColors = [0x2d6e1a, 0x347a1f, 0x255e15];
  const layers = [
    { r: 1.4 * scale, h: 2.2 * scale, y: trunkH + 0.8 * scale },
    { r: 1.1 * scale, h: 1.8 * scale, y: trunkH + 1.8 * scale },
    { r: 0.7 * scale, h: 1.4 * scale, y: trunkH + 2.6 * scale },
  ];

  layers.forEach((l, i) => {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(l.r, l.h, 7),
      new THREE.MeshLambertMaterial({ color: layerColors[i] })
    );
    cone.position.set(x, l.y, z);
    scene.add(cone);
  });

  scene.add(trunk);
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
  const rockColors = [0x888888, 0x777777, 0x999999, 0xaaaaaa, 0x666666];
  for (let i = 0; i < rockCount; i++) {
    const size = 0.4 + Math.random() * 1.2;
    const color = rockColors[Math.floor(Math.random() * rockColors.length)];
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(size, 0),
      new THREE.MeshLambertMaterial({ color })
    );
    rock.position.set(
      cx + (Math.random() - 0.5) * 3,
      size * 0.4,
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

for (let i = 0; i < 35; i++) {
  makeRockCluster(
    Math.random() * 200 - 100,
    Math.random() * 200 - 100
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