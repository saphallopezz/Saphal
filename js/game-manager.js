/* ================================================================
   GAME MANAGER
   Handles multiple games and switching between them
   ================================================================ */

(function() {
  'use strict';

  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const highScoreDisplay = document.getElementById('highScoreDisplay');
  const statusDisplay = document.getElementById('statusDisplay');
  const controlsTitle = document.getElementById('game-controls-title');
  const controlsContent = document.getElementById('game-controls-content');

  // Colors
  const colors = {
    cyan: '#00f0ff',
    blue: '#3d7aff',
    green: '#3bffa0',
    red: '#ff4d6d',
    amber: '#ffb347',
    bg: '#06090f',
    grid: 'rgba(0, 240, 255, 0.15)'
  };

  let currentGame = null;
  let animationId = null;

  // Game selector
  const gameButtons = document.querySelectorAll('.game-select-btn');
  gameButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const gameName = btn.getAttribute('data-game');
      switchGame(gameName);
      
      // Update active button
      gameButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Switch game
  function switchGame(gameName) {
    // Stop current game
    if (currentGame && currentGame.destroy) {
      currentGame.destroy();
    }
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load new game
    switch(gameName) {
      case 'cyber-runner':
        currentGame = new CyberRunner(canvas, ctx, colors, scoreDisplay, highScoreDisplay, statusDisplay);
        updateControls('Cyber Runner', [
          '<p><span class="text-cyan">SPACE</span> or <span class="text-cyan">CLICK</span> — Jump</p>',
          '<p><span class="text-cyan">R</span> — Restart</p>',
          '<p><span class="text-cyan">ESC</span> — Pause</p>'
        ]);
        break;
      case 'neon-snake':
        currentGame = new NeonSnake(canvas, ctx, colors, scoreDisplay, highScoreDisplay, statusDisplay);
        updateControls('Neon Snake', [
          '<p><span class="text-cyan">ARROW KEYS</span> — Move</p>',
          '<p><span class="text-cyan">WASD</span> — Alternative controls</p>',
          '<p><span class="text-cyan">R</span> — Restart</p>'
        ]);
        break;
      case 'hack-invaders':
        currentGame = new HackInvaders(canvas, ctx, colors, scoreDisplay, highScoreDisplay, statusDisplay);
        updateControls('Hack Invaders', [
          '<p><span class="text-cyan">ARROW KEYS</span> or <span class="text-cyan">A/D</span> — Move</p>',
          '<p><span class="text-cyan">SPACE</span> — Shoot</p>',
          '<p><span class="text-cyan">R</span> — Restart</p>'
        ]);
        break;
      case 'memory-grid':
        currentGame = new MemoryGrid(canvas, ctx, colors, scoreDisplay, highScoreDisplay, statusDisplay);
        updateControls('Memory Grid', [
          '<p><span class="text-cyan">CLICK</span> — Flip cards</p>',
          '<p><span class="text-cyan">R</span> — New game</p>',
          '<p>Match all pairs to win!</p>'
        ]);
        break;
      case 'code-breaker':
        currentGame = new CodeBreaker(canvas, ctx, colors, scoreDisplay, highScoreDisplay, statusDisplay);
        updateControls('Code Breaker', [
          '<p><span class="text-cyan">CLICK</span> — Select colors</p>',
          '<p><span class="text-cyan">SUBMIT</span> — Check guess</p>',
          '<p>Crack the 4-color code!</p>'
        ]);
        break;
    }

    if (currentGame && currentGame.start) {
      currentGame.start();
    }
  }

  // Update controls display
  function updateControls(title, controls) {
    controlsTitle.textContent = `// ${title.toUpperCase()} CONTROLS`;
    controlsContent.innerHTML = controls.join('');
  }

  // Initialize with first game
  switchGame('cyber-runner');

  // Expose for cleanup
  window.gameManager = {
    switchGame,
    getCurrentGame: () => currentGame
  };

})();
