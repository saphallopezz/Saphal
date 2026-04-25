/* ================================================================
   CYBER RUNNER GAME
   Cyberpunk endless runner - jump over obstacles
   ================================================================ */

class CyberRunner {
  constructor(canvas, ctx, colors, scoreDisplay, highScoreDisplay, statusDisplay) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.colors = colors;
    this.scoreDisplay = scoreDisplay;
    this.highScoreDisplay = highScoreDisplay;
    this.statusDisplay = statusDisplay;
    
    this.gameState = 'ready';
    this.score = 0;
    this.highScore = localStorage.getItem('cyberRunnerHighScore') || 0;
    this.gameSpeed = 6;
    this.gravity = 0.8;
    this.frameCount = 0;
    
    this.ground = canvas.height - 80;
    
    this.player = {
      x: 100,
      y: this.ground - 30,
      width: 30,
      height: 30,
      velocityY: 0,
      jumping: false,
      grounded: true,
      color: colors.cyan
    };
    
    this.obstacles = [];
    this.particles = [];
    this.obstacleWidth = 30;
    this.obstacleHeight = 50;
    this.obstacleGap = 300;
    
    this.boundHandleInput = this.handleInput.bind(this);
    this.animationId = null;
  }
  
  start() {
    document.addEventListener('keydown', this.boundHandleInput);
    this.canvas.addEventListener('click', this.boundHandleInput);
    this.highScoreDisplay.textContent = this.highScore;
    this.statusDisplay.textContent = 'READY';
    this.statusDisplay.style.color = this.colors.cyan;
    this.gameLoop();
  }
  
  destroy() {
    document.removeEventListener('keydown', this.boundHandleInput);
    this.canvas.removeEventListener('click', this.boundHandleInput);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  
  drawGrid() {
    this.ctx.strokeStyle = this.colors.grid;
    this.ctx.lineWidth = 1;
    
    for (let y = 0; y < this.canvas.height; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
    
    const offset = (this.frameCount * this.gameSpeed) % 40;
    for (let x = -offset; x < this.canvas.width; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
  }

  drawGround() {
    this.ctx.fillStyle = this.colors.cyan;
    this.ctx.shadowColor = this.colors.cyan;
    this.ctx.shadowBlur = 10;
    this.ctx.fillRect(0, this.ground + this.player.height, this.canvas.width, 2);
    this.ctx.shadowBlur = 0;
    
    this.ctx.strokeStyle = this.colors.grid;
    this.ctx.lineWidth = 1;
    const offset = (this.frameCount * this.gameSpeed) % 20;
    for (let x = -offset; x < this.canvas.width; x += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.ground + this.player.height + 10);
      this.ctx.lineTo(x + 10, this.ground + this.player.height + 20);
      this.ctx.stroke();
    }
  }

  drawPlayer() {
    this.ctx.shadowColor = this.player.color;
    this.ctx.shadowBlur = 15;
    this.ctx.fillStyle = this.player.color;
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(this.player.x + 5, this.player.y + 5, this.player.width - 10, this.player.height - 10);
    this.ctx.fillStyle = this.colors.cyan;
    this.ctx.fillRect(this.player.x + 8, this.player.y + 10, 5, 5);
    this.ctx.fillRect(this.player.x + this.player.width - 13, this.player.y + 10, 5, 5);
    this.ctx.shadowBlur = 0;
  }

  createObstacle() {
    const height = this.obstacleHeight + Math.random() * 40;
    this.obstacles.push({
      x: this.canvas.width,
      y: this.ground - height,
      width: this.obstacleWidth,
      height: height,
      passed: false
    });
  }

  drawObstacles() {
    this.obstacles.forEach(obs => {
      this.ctx.shadowColor = this.colors.red;
      this.ctx.shadowBlur = 15;
      this.ctx.fillStyle = this.colors.red;
      this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let y = obs.y; y < obs.y + obs.height; y += 10) {
        this.ctx.fillRect(obs.x + 5, y, obs.width - 10, 2);
      }
      this.ctx.shadowBlur = 0;
      this.ctx.fillStyle = this.colors.red;
      this.ctx.font = '10px "JetBrains Mono"';
      this.ctx.fillText('!', obs.x + obs.width / 2 - 3, obs.y - 5);
    });
  }

  createParticle(x, y, color) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 30,
        color: color
      });
    }
  }

  drawParticles() {
    this.particles.forEach((p, index) => {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life / 30;
      this.ctx.fillRect(p.x, p.y, 3, 3);
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(index, 1);
      }
    });
    this.ctx.globalAlpha = 1;
  }

  jump() {
    if (this.player.grounded) {
      this.player.velocityY = -15;
      this.player.jumping = true;
      this.player.grounded = false;
      this.createParticle(this.player.x + this.player.width / 2, this.player.y + this.player.height, this.colors.cyan);
    }
  }

  updatePlayer() {
    this.player.velocityY += this.gravity;
    this.player.y += this.player.velocityY;
    
    if (this.player.y >= this.ground - this.player.height) {
      this.player.y = this.ground - this.player.height;
      this.player.velocityY = 0;
      this.player.jumping = false;
      this.player.grounded = true;
    } else {
      this.player.grounded = false;
    }
  }

  updateObstacles() {
    this.obstacles.forEach((obs, index) => {
      obs.x -= this.gameSpeed;
      
      if (!obs.passed && obs.x + obs.width < this.player.x) {
        obs.passed = true;
        this.score++;
        this.createParticle(obs.x + obs.width / 2, obs.y, this.colors.green);
      }
      
      if (obs.x + obs.width < 0) {
        this.obstacles.splice(index, 1);
      }
    });
    
    if (this.obstacles.length === 0 || this.obstacles[this.obstacles.length - 1].x < this.canvas.width - this.obstacleGap) {
      this.createObstacle();
    }
  }

  checkCollision() {
    for (let obs of this.obstacles) {
      if (
        this.player.x < obs.x + obs.width &&
        this.player.x + this.player.width > obs.x &&
        this.player.y < obs.y + obs.height &&
        this.player.y + this.player.height > obs.y
      ) {
        return true;
      }
    }
    return false;
  }

  gameOver() {
    this.gameState = 'gameover';
    this.statusDisplay.textContent = 'GAME OVER';
    this.statusDisplay.style.color = this.colors.red;
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('cyberRunnerHighScore', this.highScore);
      this.highScoreDisplay.textContent = this.highScore;
    }
    
    this.createParticle(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.colors.red);
    this.createParticle(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.colors.cyan);
  }

  resetGame() {
    this.gameState = 'playing';
    this.score = 0;
    this.gameSpeed = 6;
    this.obstacles = [];
    this.particles = [];
    this.player.y = this.ground - this.player.height;
    this.player.velocityY = 0;
    this.player.jumping = false;
    this.player.grounded = true;
    this.frameCount = 0;
    this.statusDisplay.textContent = 'RUNNING';
    this.statusDisplay.style.color = this.colors.green;
  }

  draw() {
    this.ctx.fillStyle = this.colors.bg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.drawGround();
    this.drawObstacles();
    this.drawPlayer();
    this.drawParticles();
    this.ctx.fillStyle = this.colors.cyan;
    this.ctx.font = '20px "JetBrains Mono"';
    this.ctx.shadowColor = this.colors.cyan;
    this.ctx.shadowBlur = 10;
    this.ctx.fillText(`SCORE: ${this.score}`, 20, 40);
    this.ctx.shadowBlur = 0;
  }

  gameLoop() {
    if (this.gameState === 'playing') {
      this.updatePlayer();
      this.updateObstacles();
      
      if (this.checkCollision()) {
        this.gameOver();
      }
      
      if (this.frameCount % 300 === 0 && this.gameSpeed < 12) {
        this.gameSpeed += 0.5;
      }
      
      this.frameCount++;
      this.scoreDisplay.textContent = this.score;
    }
    
    this.draw();
    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  handleInput(e) {
    if (e.code === 'Space' || e.type === 'click') {
      e.preventDefault();
      if (this.gameState === 'ready') {
        this.resetGame();
      } else if (this.gameState === 'playing') {
        this.jump();
      }
    }
    
    if (e.code === 'KeyR' && this.gameState === 'gameover') {
      this.resetGame();
    }
    
    if (e.code === 'Escape') {
      if (this.gameState === 'playing') {
        this.gameState = 'paused';
        this.statusDisplay.textContent = 'PAUSED';
        this.statusDisplay.style.color = this.colors.blue;
      } else if (this.gameState === 'paused') {
        this.gameState = 'playing';
        this.statusDisplay.textContent = 'RUNNING';
        this.statusDisplay.style.color = this.colors.green;
      }
    }
  }
}

