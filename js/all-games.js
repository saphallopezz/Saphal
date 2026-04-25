/* ================================================================
   HACK INVADERS - Space Invaders clone
   ================================================================ */

class HackInvaders {
  constructor(canvas, ctx, colors, scoreDisplay, highScoreDisplay, statusDisplay) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.colors = colors;
    this.scoreDisplay = scoreDisplay;
    this.highScoreDisplay = highScoreDisplay;
    this.statusDisplay = statusDisplay;
    
    this.gameState = 'ready';
    this.score = 0;
    this.highScore = localStorage.getItem('hackInvadersHighScore') || 0;
    
    this.player = {x: canvas.width / 2 - 20, y: canvas.height - 60, width: 40, height: 20, speed: 5};
    this.bullets = [];
    this.enemies = [];
    this.enemySpeed = 1;
    this.enemyDirection = 1;
    
    this.keys = {};
    this.boundHandleKeyDown = (e) => this.keys[e.code] = true;
    this.boundHandleKeyUp = (e) => this.keys[e.code] = false;
    this.animationId = null;
    
    this.createEnemies();
  }
  
  start() {
    document.addEventListener('keydown', this.boundHandleKeyDown);
    document.addEventListener('keyup', this.boundHandleKeyUp);
    this.highScoreDisplay.textContent = this.highScore;
    this.statusDisplay.textContent = 'READY';
    this.statusDisplay.style.color = this.colors.cyan;
    this.gameLoop();
  }
  
  destroy() {
    document.removeEventListener('keydown', this.boundHandleKeyDown);
    document.removeEventListener('keyup', this.boundHandleKeyUp);
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
  
  createEnemies() {
    this.enemies = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        this.enemies.push({
          x: col * 80 + 60,
          y: row * 50 + 50,
          width: 40,
          height: 30,
          alive: true
        });
      }
    }
  }
  
  update() {
    if (this.gameState !== 'playing') return;
    
    // Player movement
    if ((this.keys['ArrowLeft'] || this.keys['KeyA']) && this.player.x > 0) {
      this.player.x -= this.player.speed;
    }
    if ((this.keys['ArrowRight'] || this.keys['KeyD']) && this.player.x < this.canvas.width - this.player.width) {
      this.player.x += this.player.speed;
    }
    
    // Shoot
    if (this.keys['Space']) {
      if (this.bullets.length === 0 || this.bullets[this.bullets.length - 1].y < this.canvas.height - 100) {
        this.bullets.push({x: this.player.x + this.player.width / 2 - 2, y: this.player.y, width: 4, height: 10});
      }
    }
    
    // Update bullets
    this.bullets.forEach((bullet, i) => {
      bullet.y -= 8;
      if (bullet.y < 0) this.bullets.splice(i, 1);
      
      // Check enemy collision
      this.enemies.forEach(enemy => {
        if (enemy.alive && 
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y) {
          enemy.alive = false;
          this.bullets.splice(i, 1);
          this.score += 10;
          this.scoreDisplay.textContent = this.score;
        }
      });
    });
    
    // Move enemies
    let hitEdge = false;
    this.enemies.forEach(enemy => {
      if (!enemy.alive) return;
      enemy.x += this.enemySpeed * this.enemyDirection;
      if (enemy.x <= 0 || enemy.x >= this.canvas.width - enemy.width) {
        hitEdge = true;
      }
      if (enemy.y + enemy.height >= this.player.y) {
        this.gameOver();
      }
    });
    
    if (hitEdge) {
      this.enemyDirection *= -1;
      this.enemies.forEach(e => e.y += 20);
    }
    
    // Check win
    if (this.enemies.every(e => !e.alive)) {
      this.createEnemies();
      this.enemySpeed += 0.5;
    }
  }
  
  draw() {
    this.ctx.fillStyle = this.colors.bg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Grid
    this.ctx.strokeStyle = this.colors.grid;
    for (let i = 0; i < this.canvas.width; i += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvas.height);
      this.ctx.stroke();
    }
    
    // Player
    this.ctx.fillStyle = this.colors.cyan;
    this.ctx.shadowColor = this.colors.cyan;
    this.ctx.shadowBlur = 10;
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    this.ctx.shadowBlur = 0;
    
    // Bullets
    this.ctx.fillStyle = this.colors.green;
    this.bullets.forEach(b => this.ctx.fillRect(b.x, b.y, b.width, b.height));
    
    // Enemies
    this.ctx.fillStyle = this.colors.red;
    this.ctx.shadowColor = this.colors.red;
    this.ctx.shadowBlur = 10;
    this.enemies.forEach(e => {
      if (e.alive) this.ctx.fillRect(e.x, e.y, e.width, e.height);
    });
    this.ctx.shadowBlur = 0;
    
    // Score
    this.ctx.fillStyle = this.colors.cyan;
    this.ctx.font = '20px "JetBrains Mono"';
    this.ctx.fillText(`SCORE: ${this.score}`, 20, 40);
  }
  
  gameLoop() {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }
  
  gameOver() {
    this.gameState = 'gameover';
    this.statusDisplay.textContent = 'GAME OVER';
    this.statusDisplay.style.color = this.colors.red;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('hackInvadersHighScore', this.highScore);
      this.highScoreDisplay.textContent = this.highScore;
    }
  }
  
  resetGame() {
    this.gameState = 'playing';
    this.score = 0;
    this.player.x = this.canvas.width / 2 - 20;
    this.bullets = [];
    this.enemySpeed = 1;
    this.enemyDirection = 1;
    this.createEnemies();
    this.scoreDisplay.textContent = this.score;
    this.statusDisplay.textContent = 'PLAYING';
    this.statusDisplay.style.color = this.colors.green;
  }
}

/* ================================================================
   MEMORY GRID - Memory matching game
   ================================================================ */

class MemoryGrid {
  constructor(canvas, ctx, colors, scoreDisplay, highScoreDisplay, statusDisplay) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.colors = colors;
    this.scoreDisplay = scoreDisplay;
    this.highScoreDisplay = highScoreDisplay;
    this.statusDisplay = statusDisplay;
    
    this.gameState = 'playing';
    this.moves = 0;
    this.matches = 0;
    this.highScore = localStorage.getItem('memoryGridHighScore') || 999;
    
    this.gridSize = 4;
    this.cardSize = 80;
    this.gap = 20;
    this.cards = [];
    this.flipped = [];
    this.matched = [];
    
    this.boundHandleClick = this.handleClick.bind(this);
    this.animationId = null;
    
    this.initCards();
  }
  
  start() {
    this.canvas.addEventListener('click', this.boundHandleClick);
    this.highScoreDisplay.textContent = this.highScore;
    this.statusDisplay.textContent = 'PLAYING';
    this.statusDisplay.style.color = this.colors.green;
    this.scoreDisplay.textContent = this.moves;
    this.draw();
  }
  
  destroy() {
    this.canvas.removeEventListener('click', this.boundHandleClick);
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
  
  initCards() {
    const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const pairs = [...symbols, ...symbols];
    pairs.sort(() => Math.random() - 0.5);
    
    this.cards = [];
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        this.cards.push({
          x: j * (this.cardSize + this.gap) + 100,
          y: i * (this.cardSize + this.gap) + 50,
          symbol: pairs[i * this.gridSize + j],
          index: i * this.gridSize + j
        });
      }
    }
  }
  
  handleClick(e) {
    if (this.flipped.length >= 2) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const card = this.cards.find(c => 
      x >= c.x && x <= c.x + this.cardSize &&
      y >= c.y && y <= c.y + this.cardSize &&
      !this.flipped.includes(c.index) &&
      !this.matched.includes(c.index)
    );
    
    if (card) {
      this.flipped.push(card.index);
      this.draw();
      
      if (this.flipped.length === 2) {
        this.moves++;
        this.scoreDisplay.textContent = this.moves;
        
        const card1 = this.cards[this.flipped[0]];
        const card2 = this.cards[this.flipped[1]];
        
        if (card1.symbol === card2.symbol) {
          this.matched.push(...this.flipped);
          this.matches++;
          this.flipped = [];
          
          if (this.matches === 8) {
            this.gameWin();
          }
        } else {
          setTimeout(() => {
            this.flipped = [];
            this.draw();
          }, 800);
        }
      }
    }
  }
  
  draw() {
    this.ctx.fillStyle = this.colors.bg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.cards.forEach(card => {
      const isFlipped = this.flipped.includes(card.index) || this.matched.includes(card.index);
      
      this.ctx.fillStyle = isFlipped ? this.colors.cyan : this.colors.grid;
      this.ctx.strokeStyle = this.colors.cyan;
      this.ctx.lineWidth = 2;
      this.ctx.fillRect(card.x, card.y, this.cardSize, this.cardSize);
      this.ctx.strokeRect(card.x, card.y, this.cardSize, this.cardSize);
      
      if (isFlipped) {
        this.ctx.fillStyle = this.colors.bg;
        this.ctx.font = '40px "JetBrains Mono"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(card.symbol, card.x + this.cardSize / 2, card.y + this.cardSize / 2);
      }
    });
    
    this.ctx.fillStyle = this.colors.cyan;
    this.ctx.font = '20px "JetBrains Mono"';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`MOVES: ${this.moves}`, 20, 40);
  }
  
  gameWin() {
    this.statusDisplay.textContent = 'YOU WIN!';
    this.statusDisplay.style.color = this.colors.green;
    if (this.moves < this.highScore) {
      this.highScore = this.moves;
      localStorage.setItem('memoryGridHighScore', this.highScore);
      this.highScoreDisplay.textContent = this.highScore;
    }
  }
  
  resetGame() {
    this.moves = 0;
    this.matches = 0;
    this.flipped = [];
    this.matched = [];
    this.initCards();
    this.scoreDisplay.textContent = this.moves;
    this.statusDisplay.textContent = 'PLAYING';
    this.statusDisplay.style.color = this.colors.green;
    this.draw();
  }
}

/* ================================================================
   CODE BREAKER - Mastermind clone
   ================================================================ */

class CodeBreaker {
  constructor(canvas, ctx, colors, scoreDisplay, highScoreDisplay, statusDisplay) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.colors = colors;
    this.scoreDisplay = scoreDisplay;
    this.highScoreDisplay = highScoreDisplay;
    this.statusDisplay = statusDisplay;
    
    this.gameState = 'playing';
    this.attempts = 0;
    this.maxAttempts = 10;
    this.highScore = localStorage.getItem('codeBreakerHighScore') || 0;
    
    this.codeColors = [this.colors.cyan, this.colors.green, this.colors.red, this.colors.amber];
    this.secret = this.generateSecret();
    this.guesses = [];
    this.currentGuess = [];
    
    this.boundHandleClick = this.handleClick.bind(this);
    this.animationId = null;
  }
  
  start() {
    this.canvas.addEventListener('click', this.boundHandleClick);
    this.highScoreDisplay.textContent = this.highScore;
    this.statusDisplay.textContent = 'PLAYING';
    this.statusDisplay.style.color = this.colors.green;
    this.scoreDisplay.textContent = this.attempts;
    this.draw();
  }
  
  destroy() {
    this.canvas.removeEventListener('click', this.boundHandleClick);
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
  
  generateSecret() {
    return Array(4).fill(0).map(() => Math.floor(Math.random() * 4));
  }
  
  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Color selection
    if (y > 320 && y < 370 && this.currentGuess.length < 4) {
      const colorIndex = Math.floor((x - 200) / 60);
      if (colorIndex >= 0 && colorIndex < 4) {
        this.currentGuess.push(colorIndex);
        this.draw();
      }
    }
    
    // Submit button
    if (x > 550 && x < 700 && y > 320 && y < 370 && this.currentGuess.length === 4) {
      this.submitGuess();
    }
    
    // Clear button
    if (x > 500 && x < 550 && y > 320 && y < 370) {
      this.currentGuess = [];
      this.draw();
    }
  }
  
  submitGuess() {
    const feedback = this.checkGuess(this.currentGuess);
    this.guesses.push({guess: [...this.currentGuess], feedback});
    this.currentGuess = [];
    this.attempts++;
    this.scoreDisplay.textContent = this.attempts;
    
    if (feedback.exact === 4) {
      this.gameWin();
    } else if (this.attempts >= this.maxAttempts) {
      this.gameLose();
    }
    
    this.draw();
  }
  
  checkGuess(guess) {
    let exact = 0;
    let close = 0;
    const secretCopy = [...this.secret];
    const guessCopy = [...guess];
    
    // Check exact matches
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        exact++;
        secretCopy[i] = guessCopy[i] = -1;
      }
    }
    
    // Check close matches
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] !== -1) {
        const index = secretCopy.indexOf(guessCopy[i]);
        if (index !== -1) {
          close++;
          secretCopy[index] = -1;
        }
      }
    }
    
    return {exact, close};
  }
  
  draw() {
    this.ctx.fillStyle = this.colors.bg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Previous guesses
    this.guesses.forEach((g, i) => {
      const y = 50 + i * 30;
      g.guess.forEach((c, j) => {
        this.ctx.fillStyle = this.codeColors[c];
        this.ctx.fillRect(200 + j * 40, y, 30, 20);
      });
      
      this.ctx.fillStyle = this.colors.cyan;
      this.ctx.font = '14px "JetBrains Mono"';
      this.ctx.fillText(`${g.feedback.exact}E ${g.feedback.close}C`, 400, y + 15);
    });
    
    // Current guess
    this.currentGuess.forEach((c, i) => {
      this.ctx.fillStyle = this.codeColors[c];
      this.ctx.fillRect(200 + i * 40, 320, 30, 30);
    });
    
    // Color palette
    this.codeColors.forEach((c, i) => {
      this.ctx.fillStyle = c;
      this.ctx.fillRect(200 + i * 60, 330, 40, 40);
    });
    
    // Buttons
    this.ctx.strokeStyle = this.colors.cyan;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(500, 320, 50, 50);
    this.ctx.strokeRect(550, 320, 150, 50);
    this.ctx.fillStyle = this.colors.cyan;
    this.ctx.font = '12px "JetBrains Mono"';
    this.ctx.fillText('CLR', 510, 350);
    this.ctx.fillText('SUBMIT', 580, 350);
    
    // Info
    this.ctx.fillText(`Attempts: ${this.attempts}/${this.maxAttempts}`, 20, 40);
  }
  
  gameWin() {
    this.statusDisplay.textContent = 'CODE CRACKED!';
    this.statusDisplay.style.color = this.colors.green;
    const score = this.maxAttempts - this.attempts + 1;
    if (score > this.highScore) {
      this.highScore = score;
      localStorage.setItem('codeBreakerHighScore', this.highScore);
      this.highScoreDisplay.textContent = this.highScore;
    }
  }
  
  gameLose() {
    this.statusDisplay.textContent = 'FAILED';
    this.statusDisplay.style.color = this.colors.red;
  }
  
  resetGame() {
    this.attempts = 0;
    this.secret = this.generateSecret();
    this.guesses = [];
    this.currentGuess = [];
    this.scoreDisplay.textContent = this.attempts;
    this.statusDisplay.textContent = 'PLAYING';
    this.statusDisplay.style.color = this.colors.green;
    this.draw();
  }
}
