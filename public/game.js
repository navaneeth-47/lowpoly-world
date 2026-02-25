const socket = io();

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.Fog(0x87CEEB, 30, 100);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(20, 40, 20);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// Ground
const groundGeo = new THREE.PlaneGeometry(200, 200, 20, 20);
const groundMat = new THREE.MeshLambertMaterial({ color: 0x5a8a3c });

// Make ground bumpy for low poly feel
const pos = groundGeo.attributes.position;
for (let i = 0; i < pos.count; i++) {
  pos.setY(i, Math.random() * 1.5);
}
groundGeo.computeVertexNormals();

const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Low poly trees
function makeTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.3, 1.5, 5),
    new THREE.MeshLambertMaterial({ color: 0x8B4513 })
  );
  trunk.position.set(x, 0.75, z);

  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(1.5, 3, 6),
    new THREE.MeshLambertMaterial({ color: 0x2d6a2d })
  );
  leaves.position.set(x, 3.5, z);

  scene.add(trunk);
  scene.add(leaves);
}

// Scatter trees
for (let i = 0; i < 60; i++) {
  makeTree(Math.random() * 160 - 80, Math.random() * 160 - 80);
}

// Low poly rocks
function makeRock(x, z) {
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.6 + Math.random() * 0.4, 0),
    new THREE.MeshLambertMaterial({ color: 0x888888 })
  );
  rock.position.set(x, 0.3, z);
  rock.rotation.y = Math.random() * Math.PI;
  scene.add(rock);
}

for (let i = 0; i < 30; i++) {
  makeRock(Math.random() * 160 - 80, Math.random() * 160 - 80);
}

// Player avatar (low poly capsule shape)
function makeAvatar(color) {
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

  group.add(body);
  group.add(head);
  return group;
}

// My player
let myPlayer = null;
let myColor = null;
const otherPlayers = {};

// Movement
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Chat
const messagesDiv = document.getElementById('messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

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

// Socket events
socket.on('init', (players) => {
  for (const id in players) {
    const p = players[id];
    if (id === socket.id) {
      myColor = p.color;
      myPlayer = makeAvatar(myColor);
      myPlayer.position.set(p.x, 0, p.z);
      scene.add(myPlayer);
    } else {
      const avatar = makeAvatar(p.color);
      avatar.position.set(p.x, 0, p.z);
      scene.add(avatar);
      otherPlayers[id] = avatar;
    }
  }
});

socket.on('playerJoined', (p) => {
  const avatar = makeAvatar(p.color);
  avatar.position.set(p.x, 0, p.z);
  scene.add(avatar);
  otherPlayers[p.id] = avatar;
  showMessage('A new player joined!');
});

socket.on('playerMoved', (data) => {
  if (otherPlayers[data.id]) {
    otherPlayers[data.id].position.x = data.x;
    otherPlayers[data.id].position.z = data.z;
  }
});

socket.on('playerLeft', (id) => {
  if (otherPlayers[id]) {
    scene.remove(otherPlayers[id]);
    delete otherPlayers[id];
  }
  showMessage('A player left.');
});

socket.on('chatMessage', (data) => {
  const label = data.id === socket.id ? 'You' : 'Player';
  showMessage(`${label}: ${data.msg}`);
});

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Game loop
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
    }

    // Camera follows player
    camera.position.x = myPlayer.position.x;
    camera.position.y = myPlayer.position.y + 10;
    camera.position.z = myPlayer.position.z + 12;
    camera.lookAt(myPlayer.position);
  }

  renderer.render(scene, camera);
}

animate();
