/* ================================================================
   NEON SNAKE GAME
   Classic snake with cyberpunk aesthetics
   ================================================================ */

class NeonSnake {
  constructor(canvas, ctx, colors, scoreDisplay, highScoreDisplay, statusDisplay) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.colors = colors;
    this.scoreDisplay = scoreDisplay;
    this.highScoreDisplay = highScoreDisplay;
    this.statusDisplay = statusDisplay;
    
    this.gridSize = 20;
    this.tileCount = 20;
    this.gameState = 'ready';
    this.score = 0;
    this.highScore = localStorage.getItem('neonSnakeHighScore') || 0;
    
    this.snake = [{x: 10, y: 10}];
    this.direction = {x: 1, y: 0};
    this.nextDirection = {x: 1, y: 0};
    this.food = this.generateFood();
    this.speed = 150;
    this.lastUpdate = 0;
    
    this.boundHandleInput = this.handleInput.bind(this);
    this.animationId = null;
  }
  
  start() {
    document.addEventListener('keydown', this.boundHandleInput);
    this.highScoreDisplay.textContent = this.highScore;
    this.statusDisplay.textContent = 'READY';
    this.statusDisplay.style.color = this.colors.cyan;
    this.gameLoop(0);
  }
  
  destroy() {
    document.removeEventListener('keydown', this.boundHandleInput);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  generateFood() {
    let food;
    do {
      food = {
        x: Math.floor(Math.random() * this.tileCount),
        y: Math.floor(Math.random() * this.tileCount)
      };
    } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
    return food;
  }
  
  update() {
    if (this.gameState !== 'playing') return;
    
    this.direction = {...this.nextDirection};
    
    const head = {
      x: this.snake[0].x + this.direction.x,
      y: this.snake[0].y + this.direction.y
    };
    
    // Wall collision
    if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
      this.gameOver();
      return;
    }
    
    // Self collision
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.gameOver();
      return;
    }
    
    this.snake.unshift(head);
    
    // Food collision
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.scoreDisplay.textContent = this.score;
      this.food = this.generateFood();
      if (this.speed > 50) this.speed -= 5;
    } else {
      this.snake.pop();
    }
  }
  
  draw() {
    // Background
    this.ctx.fillStyle = this.colors.bg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Grid
    this.ctx.strokeStyle = this.colors.grid;
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= this.tileCount; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.gridSize, 0);
      this.ctx.lineTo(i * this.gridSize, this.canvas.height);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.gridSize);
      this.ctx.lineTo(this.canvas.width, i * this.gridSize);
      this.ctx.stroke();
    }
    
    // Snake
    this.snake.forEach((segment, index) => {
      const alpha = 1 - (index / this.snake.length) * 0.5;
      this.ctx.fillStyle = this.colors.cyan;
      this.ctx.globalAlpha = alpha;
      this.ctx.shadowColor = this.colors.cyan;
      this.ctx.shadowBlur = 10;
      this.ctx.fillRect(
        segment.x * this.gridSize + 2,
        segment.y * this.gridSize + 2,
        this.gridSize - 4,
        this.gridSize - 4
      );
    });
    this.ctx.globalAlpha = 1;
    this.ctx.shadowBlur = 0;
    
    // Food
    this.ctx.fillStyle = this.colors.green;
    this.ctx.shadowColor = this.colors.green;
    this.ctx.shadowBlur = 15;
    this.ctx.fillRect(
      this.food.x * this.gridSize + 2,
      this.food.y * this.gridSize + 2,
      this.gridSize - 4,
      this.gridSize - 4
    );
    this.ctx.shadowBlur = 0;
    
    // Score
    this.ctx.fillStyle = this.colors.cyan;
    this.ctx.font = '20px "JetBrains Mono"';
    this.ctx.shadowColor = this.colors.cyan;
    this.ctx.shadowBlur = 10;
    this.ctx.fillText(`LENGTH: ${this.snake.length}`, 20, 40);
    this.ctx.shadowBlur = 0;
  }
  
  gameLoop(timestamp) {
    if (timestamp - this.lastUpdate > this.speed) {
      this.update();
      this.lastUpdate = timestamp;
    }
    this.draw();
    this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
  }
  
  gameOver() {
    this.gameState = 'gameover';
    this.statusDisplay.textContent = 'GAME OVER';
    this.statusDisplay.style.color = this.colors.red;
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('neonSnakeHighScore', this.highScore);
      this.highScoreDisplay.textContent = this.highScore;
    }
  }
  
  resetGame() {
    this.gameState = 'playing';
    this.score = 0;
    this.snake = [{x: 10, y: 10}];
    this.direction = {x: 1, y: 0};
    this.nextDirection = {x: 1, y: 0};
    this.food = this.generateFood();
    this.speed = 150;
    this.scoreDisplay.textContent = this.score;
    this.statusDisplay.textContent = 'PLAYING';
    this.statusDisplay.style.color = this.colors.green;
  }
  
  handleInput(e) {
    if (this.gameState === 'ready' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
      this.resetGame();
    }
    
    if (this.gameState === 'playing') {
      if ((e.code === 'ArrowUp' || e.code === 'KeyW') && this.direction.y === 0) {
        this.nextDirection = {x: 0, y: -1};
      } else if ((e.code === 'ArrowDown' || e.code === 'KeyS') && this.direction.y === 0) {
        this.nextDirection = {x: 0, y: 1};
      } else if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && this.direction.x === 0) {
        this.nextDirection = {x: -1, y: 0};
      } else if ((e.code === 'ArrowRight' || e.code === 'KeyD') && this.direction.x === 0) {
        this.nextDirection = {x: 1, y: 0};
      }
    }
    
    if (e.code === 'KeyR' && this.gameState === 'gameover') {
      this.resetGame();
    }
  }
}
