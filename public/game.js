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
scene.background = new THREE.Color(0x1a0a2e);
scene.fog = new THREE.Fog(0x1a0a2e, 30, 120);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting - magical purple/blue tones
const moonLight = new THREE.DirectionalLight(0x8888ff, 0.8);
moonLight.position.set(20, 40, 20);
scene.add(moonLight);
scene.add(new THREE.AmbientLight(0x221144, 0.8));

// Glowing point lights scattered around
const glowColors = [0x00ffaa, 0xff44ff, 0x44ffff, 0xffaa00];
for (let i = 0; i < 8; i++) {
  const light = new THREE.PointLight(glowColors[i % glowColors.length], 1.5, 20);
  light.position.set(
    Math.random() * 120 - 60,
    3,
    Math.random() * 120 - 60
  );
  scene.add(light);
}

// Ground - dark mossy color with bumps
const groundGeo = new THREE.PlaneGeometry(200, 200, 30, 30);
const groundMat = new THREE.MeshLambertMaterial({ color: 0x1a3a1a });
const pos = groundGeo.attributes.position;
for (let i = 0; i < pos.count; i++) {
  pos.setY(i, Math.random() * 1.2);
}
groundGeo.computeVertexNormals();
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Glowing fantasy tree
function makeGlowTree(x, z) {
  const trunkColor = [0x4a2800, 0x3a1f00, 0x5c3317][Math.floor(Math.random() * 3)];
  const leafColors = [0x00cc66, 0x9900ff, 0x0099ff, 0xff0099, 0x00ffcc];
  const leafColor = leafColors[Math.floor(Math.random() * leafColors.length)];

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.3, 2 + Math.random(), 6),
    new THREE.MeshLambertMaterial({ color: trunkColor })
  );
  trunk.position.set(x, 1, z);

  // Two layered cones for fuller look
  const leaves1 = new THREE.Mesh(
    new THREE.ConeGeometry(2, 3.5, 7),
    new THREE.MeshLambertMaterial({ color: leafColor, emissive: leafColor, emissiveIntensity: 0.3 })
  );
  leaves1.position.set(x, 4.5, z);

  const leaves2 = new THREE.Mesh(
    new THREE.ConeGeometry(1.3, 2.5, 6),
    new THREE.MeshLambertMaterial({ color: leafColor, emissive: leafColor, emissiveIntensity: 0.4 })
  );
  leaves2.position.set(x, 6.5, z);

  scene.add(trunk);
  scene.add(leaves1);
  scene.add(leaves2);
}

for (let i = 0; i < 70; i++) {
  makeGlowTree(Math.random() * 160 - 80, Math.random() * 160 - 80);
}

// Giant glowing mushrooms
function makeMushroom(x, z) {
  const stemColors = [0xffddcc, 0xeeddff, 0xddffee];
  const capColors = [0xff2244, 0xff6600, 0xcc00ff, 0xff0088, 0x00ccff];
  const capColor = capColors[Math.floor(Math.random() * capColors.length)];
  const scale = 0.5 + Math.random() * 1.5;

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 1.5 * scale, 7),
    new THREE.MeshLambertMaterial({ color: stemColors[Math.floor(Math.random() * stemColors.length)] })
  );
  stem.position.set(x, 0.75 * scale, z);

  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.9 * scale, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshLambertMaterial({ color: capColor, emissive: capColor, emissiveIntensity: 0.4 })
  );
  cap.position.set(x, 1.6 * scale, z);

  scene.add(stem);
  scene.add(cap);
}

for (let i = 0; i < 50; i++) {
  makeMushroom(Math.random() * 160 - 80, Math.random() * 160 - 80);
}

// Glowing crystals
function makeCrystal(x, z) {
  const crystalColors = [0x00ffff, 0xff00ff, 0xffff00, 0x00ff88];
  const color = crystalColors[Math.floor(Math.random() * crystalColors.length)];
  const height = 0.5 + Math.random() * 2;

  const crystal = new THREE.Mesh(
    new THREE.ConeGeometry(0.2, height, 4),
    new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.6 })
  );
  crystal.position.set(x, height / 2, z);
  crystal.rotation.y = Math.random() * Math.PI;
  scene.add(crystal);
}

for (let i = 0; i < 40; i++) {
  makeCrystal(Math.random() * 160 - 80, Math.random() * 160 - 80);
}

// Firefly particles
const fireflyCount = 200;
const fireflyGeo = new THREE.BufferGeometry();
const fireflyPos = new Float32Array(fireflyCount * 3);
const fireflyPhase = [];
for (let i = 0; i < fireflyCount; i++) {
  fireflyPos[i * 3] = Math.random() * 160 - 80;
  fireflyPos[i * 3 + 1] = 1 + Math.random() * 5;
  fireflyPos[i * 3 + 2] = Math.random() * 160 - 80;
  fireflyPhase.push(Math.random() * Math.PI * 2);
}
fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyPos, 3));
const fireflyMat = new THREE.PointsMaterial({ color: 0xaaffaa, size: 0.15, transparent: true, opacity: 0.9 });
const fireflies = new THREE.Points(fireflyGeo, fireflyMat);
scene.add(fireflies);

// Name tag helper
function makeNameTag(name) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(20,0,40,0.7)';
  ctx.roundRect(0, 0, 256, 64, 12);
  ctx.fill();
  ctx.fillStyle = '#ccaaff';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name || 'Guest', 128, 42);
  return new THREE.CanvasTexture(canvas);
}

// Avatar
function makeAvatar(color, name) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 1.2, 6),
    new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.2 })
  );
  body.position.y = 0.8;

  const head = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.4, 0),
    new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.2 })
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
  showMessage(`✨ ${p.name} entered the forest!`);
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
  showMessage('A traveller left the forest.');
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
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  // Animate fireflies
  const positions = fireflies.geometry.attributes.position.array;
  for (let i = 0; i < fireflyCount; i++) {
    positions[i * 3 + 1] = 1 + Math.sin(time + fireflyPhase[i]) * 2;
    positions[i * 3] += Math.sin(time * 0.5 + fireflyPhase[i]) * 0.02;
    positions[i * 3 + 2] += Math.cos(time * 0.5 + fireflyPhase[i]) * 0.02;
  }
  fireflies.geometry.attributes.position.needsUpdate = true;
  fireflyMat.opacity = 0.5 + Math.sin(time * 2) * 0.4;

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

} // end initGame
