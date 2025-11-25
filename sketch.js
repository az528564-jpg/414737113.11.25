let sprites = {};
let currentKey = 'stance';
let frameW = 0, frameH = 0;
let currentFrame = 0;
let lastChange = 0;
const FRAME_INTERVAL = 100; // ms 每幀間隔

// 移動相關變數
let charX = 0; // 角色中心 X 位置
let charY = 0; // 角色中心 Y 位置
let velocityX = 0; // X 方向速度
const WALK_SPEED = 3; // 移動速度（像素/幀）
let isWalking = false; // 是否正在行走
let facingRight = true; // 角色朝向（true=右, false=左）

function preload() {
  // 主要站立精靈（10 幀）
  sprites['stance'] = {
    img: loadImage('1/stance/all.png'),
    frames: 10
  };

  // 右鍵按下時要切換的精靈（6 幀）
  sprites['walk'] = {
    img: loadImage('1/walk/all.png'),
    frames: 6
  };
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
  updateFrameSize();
  lastChange = millis();
  charX = width / 2; // 初始位置：螢幕中央
  charY = height / 2;
}

function updateFrameSize() {
  const s = sprites[currentKey];
  if (s && s.img) {
    frameW = s.img.width / s.frames;
    frameH = s.img.height;
  } else {
    frameW = frameH = 0;
  }
}

function draw() {
  background('#e6ccb2');

  const s = sprites[currentKey];
  if (!s || !s.img) return;

  // 更新動畫幀
  if (millis() - lastChange >= FRAME_INTERVAL) {
    currentFrame = (currentFrame + 1) % s.frames;
    lastChange = millis();
  }

  // 更新位置
  charX += velocityX;

  // 邊界限制：角色不能超出畫布左右邊界
  const halfFrameW = frameW / 2;
  if (charX - halfFrameW < 0) {
    charX = halfFrameW;
  }
  if (charX + halfFrameW > width) {
    charX = width - halfFrameW;
  }

  const sx = currentFrame * frameW;

  // 繪製精靈
  const dx = charX - frameW / 2; // 左上角 X
  const dy = charY - frameH / 2; // 左上角 Y

  // 根據朝向繪製精靈
  push();
  if (isWalking) {
    // 行走時根據朝向翻轉
    translate(charX, charY);
    if (!facingRight) {
      scale(-1, 1); // 翻轉向左
    }
    image(s.img, -frameW / 2, -frameH / 2, frameW, frameH, sx, 0, frameW, frameH);
  } else {
    image(s.img, dx, dy, frameW, frameH, sx, 0, frameW, frameH);
  }
  pop();
}


function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    if (currentKey !== 'walk') {
      currentKey = 'walk';
      currentFrame = 0;
      updateFrameSize();
      lastChange = millis();
    }
    isWalking = true;
    facingRight = true;
    velocityX = WALK_SPEED; // 向右移動
  } else if (keyCode === LEFT_ARROW) {
    if (currentKey !== 'walk') {
      currentKey = 'walk';
      currentFrame = 0;
      updateFrameSize();
      lastChange = millis();
    }
    isWalking = true;
    facingRight = false;
    velocityX = -WALK_SPEED; // 向左移動
  }
}

function keyReleased() {
  // 放開任何方向鍵時恢復站立精靈並停止移動
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
    if (currentKey !== 'stance') {
      currentKey = 'stance';
      currentFrame = 0;
      updateFrameSize();
      lastChange = millis();
    }
    isWalking = false;
    velocityX = 0; // 停止移動
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
