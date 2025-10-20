const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let lives = 3;
const maxLives = 3;

function updateHearts() {
  if (lives > 0) {
    // Reposition player to start
    player.x = 100;
    player.y = 100;
    player.dy = 0;
  } else {
    // Game Over
    gameOver = true;
    //setTimeout(() => location.reload(), 3000); // auto-restart
  };
  const heartElements = document.querySelectorAll('.heart');
  heartElements.forEach((heart, index) => {
    heart.style.visibility = index < lives ? 'visible' : 'hidden';
  });
};

const skyThemes = [
{ sky: "./images/sky.png", block: "./images/block.png" },
{ sky: "./images/night.png", block: "./images/nightBlock.png" }
];

const skyImage = new Image();
const selectedTheme = skyThemes[Math.floor(Math.random() * skyThemes.length)];
skyImage.src = selectedTheme.sky;
skyImage.src = selectedTheme.sky;
skyImage.decode().then(() => {
  gameLoop(); // start the game only after the sky image is fully decoded and ready
}).catch(() => {
  // Fallback in case image fails to decode
  gameLoop();
});

let skyX = 0;

const spikeImage = new Image();
spikeImage.src = "./images/spike.png";

const gravity = 0.5;
const keys = {};
let cameraX = 0;
let cameraY = 0;

let gameOver = false;
let gameWin = false;
const flagPlatform = {
  x: 1500,  // adjust as per level
  y: 250,
  width: 60,
  height: 20
};
const flagImage = new Image();
flagImage.src = "./images/flag.png";
const blockImage = new Image();
blockImage.src = selectedTheme.block; // 32x32 tile texture

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function handleButtonDown(action) {
  // console.log(action + " down"); // For debugging
  if (action === 'left') keys["ArrowLeft"] = true;
  if (action === 'right') keys["ArrowRight"] = true;
  if (action === 'jump') keys["Space"] = true;
};

function handleButtonUp(action) {
  // console.log(action + " up"); // For debugging
  if (action === 'left') keys["ArrowLeft"] = false;
  if (action === 'right') keys["ArrowRight"] = false;
  if (action === 'jump') keys["Space"] = false;
};

class Player {
  constructor() {
    this.width = 40;
    this.height = 40;
    this.x = 100;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.jumpPower = -10;
    this.speed = 4;
    this.onGround = false;
    this.frame = 0;
    this.facingRight = true; // default direction

    // Load images
    this.images = {
      idle: new Image(),
      run1: new Image(),
      run2: new Image(),
	run3: new Image(),
      jump: new Image()
    };
    this.images.idle.src = "./images/chintu.png";
    this.images.run1.src = "./images/chintuRun1.png";
    this.images.run2.src = "./images/chintuRun2.png";
	this.images.run3.src = "./images/chintuRun3.png";
    this.images.jump.src = "./images/chintuJump.png";
  }

  update() {
    for (let spike of spikes) {
  if (
    player.x < spike.x + spike.width &&
    player.x + player.width > spike.x &&
    player.y < spike.y + spike.height &&
    player.y + player.height > spike.y
  ) {
    // Spike hit detected
    lives -= 1;
     updateHearts();
    break;
  }
};
 if (this.y > canvas.height + 200) {
   lives--;
  updateHearts();
}
    if (keys["ArrowLeft"]) {
  this.dx = -this.speed;
  this.facingRight = false;
} else if (keys["ArrowRight"]) {
  this.dx = this.speed;
  this.facingRight = true;
} else {
  this.dx = 0;
};

    if (keys["Space"] && this.onGround) {
      this.dy = this.jumpPower;
      this.onGround = false;
    }

    this.dy += gravity;
    this.x += this.dx;
    this.y += this.dy;

  this.onGround = false;

for (let block of platformBlocks) {
  if (
    this.x < block.x + block.width &&
    this.x + this.width > block.x &&
    this.y + this.height <= block.y + this.dy &&
    this.y + this.height + this.dy >= block.y
  ) {
    this.dy = 0;
    this.y = block.y - this.height;
    this.onGround = true;
    break; // No need to check others once landed
  }
};
    if (this.y + this.height > canvas.height + cameraY) {
      this.y = canvas.height + cameraY - this.height;
      this.dy = 0;
      this.onGround = true;
    }

    // Update animation frame
    if (this.dx !== 0) {
      this.frame++;
      if (this.frame > 20) this.frame = 0;
    } else {
      this.frame = 0;
    }
  };
  draw() {
  let imageToDraw = this.images.idle;
  if (!this.onGround) {
    imageToDraw = this.images.jump;
  } else if (this.dx !== 0) {
    imageToDraw = this.frame < 10 ? this.images.run1 : this.frame < 20 ? this.images.run2 : this.images.run3;
  }
  const drawX = this.x - cameraX;
  const drawY = this.y - cameraY;
  ctx.save(); // save current state
  if (!this.facingRight) {
    // Flip horizontally by scaling x by -1
    ctx.translate(drawX + this.width / 2, drawY + this.height / 2);
    ctx.scale(-1, 1);
    ctx.drawImage(imageToDraw, -this.width / 2, -this.height / 2, this.width, this.height);
  } else {
    ctx.drawImage(imageToDraw, drawX, drawY, this.width, this.height);
  }
  ctx.restore(); // restore state
}
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    // If the texture is small, repeat it across the platform width
    let pattern = ctx.createPattern(this.image, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.save();
      ctx.translate(this.x - cameraX, this.y - cameraY);
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    } else {
      // Fallback in case image isn't loaded yet
      ctx.fillStyle = "green";
      ctx.fillRect(this.x - cameraX, this.y - cameraY, this.width, this.height);
    }
  }
}

const player = new Player();
const blockSize = 32;

const platforms = [
  // Each platform is now made of x, y, and number of blocks
  { x: 0, y: 350, blocks: 12},
  { x: 400, y: 300, blocks: 2 },
  { x: 500, y: 250, blocks: 15},
  { x: 800, y: 250, blocks: 1, hasSpikes: true },
   { x: 1000, y: 200, blocks: 3},
   { x: 1150, y: 150, blocks: 8},
   { x: 1200, y: 150, blocks: 1, hasSpikes: true},
  { x: 1400, y: 150, blocks: 1, hasSpikes: true}
];
const platformBlocks = [];
//platforms.push(flagPlatform);
const spikes = [];

for (let p of platforms) {
  for (let i = 0; i < p.blocks; i++) {
    platformBlocks.push({
      x: p.x + i * blockSize,
      y: p.y,
      width: blockSize,
      height: blockSize
    });
  }
};
for (let platform of platforms) {
  if (platform.hasSpikes) {
    for (let i = 0; i < platform.blocks; i++) {
      spikes.push({
        x: platform.x + i * blockSize,
        y: platform.y - blockSize,
        width: blockSize - 4,
        height: blockSize - 4
      });
    }
  }
};

function gameLoop() {
  // Update both camera X and Y to center on player
  cameraX = player.x - canvas.width / 2 + player.width / 2;
  cameraY = player.y - canvas.height / 2 + player.height / 2;
  
const skyOffsetX = cameraX * 0.5;
const skyOffsetY = cameraY * 0.2; // Add vertical parallax
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Move sky background
  skyX -= 0.2; // speed of scroll
  if (skyX <= -canvas.width) {
    skyX = 0;
  }

  // Draw scrolling sky
 ctx.drawImage(skyImage, skyX, 0, canvas.width, canvas.height);
  ctx.drawImage(skyImage, skyX + canvas.width, 0, canvas.width, canvas.height);

  player.update();

  player.draw();
  // In gameLoop() where platforms are drawn:
for (let p of platforms) {
  for (let i = 0; i < p.blocks; i++) {
    const x = p.x + i * blockSize - cameraX;
    const y = p.y - cameraY;
     ctx.save(); // Save current canvas state
    ctx.shadowColor = "rgba(255, 255, 0, 0.1)";  // Yellow glow
    ctx.shadowBlur = 50;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.drawImage(blockImage, x, y, blockSize, blockSize);
    ctx.restore(); // Restore canvas state
  }
};
  for (let spike of spikes) {
  ctx.drawImage(spikeImage, spike.x - cameraX, spike.y - cameraY, spike.width - 4, spike.height -4);
};

ctx.drawImage(flagImage, flagPlatform.x - cameraX, flagPlatform.y - 60 - cameraY, 20, 40);
if (
  player.x + player.width > flagPlatform.x &&
  player.x < flagPlatform.x + flagPlatform.width &&
  player.y + player.height > flagPlatform.y &&
  player.y < flagPlatform.y + 10
) {
  gameWin = true;
}

if (gameOver) {
	document.body.appendChild(messagePage);
	message.innerHTML = 'Game Over';
	message.style.color = 'red';
btnBox.appendChild(figureReload);
  return;
}

if (gameWin) {
//setTimeout(() => location.reload(), 3000);
document.body.appendChild(messagePage);
	message.innerHTML = 'You Win';
	message.style.color = 'green';
btnBox.appendChild(figureNextLevel);
  return;
};
  requestAnimationFrame(gameLoop);
}
//gameLoop();
