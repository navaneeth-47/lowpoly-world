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
scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.Fog(0x87CEEB, 30, 100);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(20, 40, 20);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const groundGeo = new THREE.PlaneGeometry(200, 200, 20, 20);
const groundMat = new THREE.MeshLambertMaterial({ color: 0x5a8a3c });
const pos = groundGeo.attributes.position;
for (let i = 0; i < pos.count; i++) {
  pos.setY(i, Math.random() * 1.5);
}
groundGeo.computeVertexNormals();
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

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
for (let i = 0; i < 60; i++) {
  makeTree(Math.random() * 160 - 80, Math.random() * 160 - 80);
}

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

function makeNameTag(name) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.roundRect(0, 0, 256, 64, 12);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name || 'Guest', 128, 42);
  return new THREE.CanvasTexture(canvas);
}

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

  // Speech bubble (hidden by default)
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

  // Bubble background
  ctx.fillStyle = 'white';
  ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 30, 16);
  ctx.fill();

  // Tail
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 10, canvas.height - 20);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.lineTo(canvas.width / 2 + 10, canvas.height - 20);
  ctx.fill();

  // Text
  ctx.fillStyle = '#222';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text.slice(0, 40), canvas.width / 2, 65);

  bubble.userData.texture.needsUpdate = true;
  bubble.visible = true;

  if (bubble.userData.timeout) clearTimeout(bubble.userData.timeout);
  bubble.userData.timeout = setTimeout(() => {
    bubble.visible = false;
  }, 5000);
}

let myPlayer = null;
let myColor = null;
const otherPlayers = {};

const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

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
    const avatar = otherPlayers[data.id];
    const tag = avatar.getObjectByName('nameTag');
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
});

socket.on('playerLeft', (id) => {
  if (otherPlayers[id]) {
    scene.remove(otherPlayers[id]);
    delete otherPlayers[id];
  }
  showMessage('A player left.');
});

socket.on('chatMessage', (data) => {
  const label = data.id === socket.id ? 'You' : data.name || 'Player';
  showMessage(`${label}: ${data.msg}`);

  // Show speech bubble on the correct avatar
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
