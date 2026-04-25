/* ================================================================
   TERMINAL BOOT SCREEN
   Interactive terminal that requires command to access site
   ================================================================ */

(function() {
  'use strict';

  // Check if user has already booted (session storage)
  if (sessionStorage.getItem('terminalBooted') === 'true') {
    return; // Skip terminal, show site directly
  }

  // Create terminal overlay
  const terminalHTML = `
    <div id="terminal-boot" class="terminal-boot-overlay">
      <div class="terminal-boot-container">
        <div class="terminal-boot-header">
          <div class="terminal-dots">
            <span style="background:#ff5f57"></span>
            <span style="background:#febc2e"></span>
            <span style="background:#3bffa0"></span>
          </div>
          <span class="terminal-title">saphal@obsidian:~</span>
        </div>
        <div class="terminal-boot-body">
          <div class="terminal-output">
            <div class="boot-line">╔═══════════════════════════════════════════════════════════╗</div>
            <div class="boot-line">║                                                           ║</div>
            <div class="boot-line">║     ███████╗ █████╗ ██████╗ ██╗  ██╗ █████╗ ██╗         ║</div>
            <div class="boot-line">║     ██╔════╝██╔══██╗██╔══██╗██║  ██║██╔══██╗██║         ║</div>
            <div class="boot-line">║     ███████╗███████║██████╔╝███████║███████║██║         ║</div>
            <div class="boot-line">║     ╚════██║██╔══██║██╔═══╝ ██╔══██║██╔══██║██║         ║</div>
            <div class="boot-line">║     ███████║██║  ██║██║     ██║  ██║██║  ██║███████╗    ║</div>
            <div class="boot-line">║     ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝    ║</div>
            <div class="boot-line">║                                                           ║</div>
            <div class="boot-line">║              
             SECURITY TERMINAL v2.6.0             ║</div>
            <div class="boot-line">║                                                           ║</div>
            <div class="boot-line">╚═══════════════════════════════════════════════════════════╝</div>
            <div class="boot-line" style="margin-top:20px"></div>
            <div class="boot-line"><span class="text-cyan">[SYSTEM]</span> Initializing secure connection...</div>
            <div class="boot-line"><span class="text-green">[OK]</span> Encryption protocols loaded</div>
            <div class="boot-line"><span class="text-green">[OK]</span> Firewall status: ACTIVE</div>
            <div class="boot-line"><span class="text-green">[OK]</span> Neural network online</div>
            <div class="boot-line"><span class="text-amber">[AUTH]</span> Authentication required</div>
            <div class="boot-line" style="margin-top:20px"></div>
            <div class="boot-line">Welcome to Saphal Lamsal's Portfolio System</div>
            <div class="boot-line" style="margin-top:10px"></div>
            <div class="boot-line"><span class="text-amber">[HINT]</span> Type one of these commands to access the site:</div>
            <div class="boot-line" style="margin-left:20px">→ <span class="text-cyan">access</span> or <span class="text-cyan">enter</span> or <span class="text-cyan">login</span></div>
            <div class="boot-line" style="margin-top:10px"></div>
            <div class="boot-line">Or type <span class="text-cyan">'help'</span> to see all available commands</div>
            <div class="boot-line" style="margin-top:10px"></div>
          </div>
          <div class="terminal-input-line">
            <span class="terminal-prompt">visitor@saphal:~$</span>
            <input type="text" id="terminal-input" class="terminal-input" autocomplete="off" spellcheck="false" autofocus>
            <span class="terminal-cursor">_</span>
          </div>
          <div id="terminal-suggestions" class="terminal-suggestions"></div>
        </div>
      </div>
    </div>
  `;

  // Inject terminal into page
  document.body.insertAdjacentHTML('afterbegin', terminalHTML);

  // Get elements
  const terminalOverlay = document.getElementById('terminal-boot');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.querySelector('.terminal-output');
  const suggestions = document.getElementById('terminal-suggestions');

  // Command history
  let commandHistory = [];
  let historyIndex = -1;

  // Available commands
  const commands = {
    help: {
      desc: 'Show available commands',
      action: () => {
        addOutput('<span class="text-cyan">Available Commands:</span>');
        addOutput('  <span class="text-green">access</span>      - Access the portfolio');
        addOutput('  <span class="text-green">enter</span>       - Enter the system');
        addOutput('  <span class="text-green">login</span>       - Login to portfolio');
        addOutput('  <span class="text-green">start</span>       - Start the interface');
        addOutput('  <span class="text-green">whoami</span>      - Display user information');
        addOutput('  <span class="text-green">about</span>       - About Saphal Lamsal');
        addOutput('  <span class="text-green">skills</span>      - List technical skills');
        addOutput('  <span class="text-green">clear</span>       - Clear terminal');
        addOutput('  <span class="text-green">exit</span>        - Exit terminal (access site)');
      }
    },
    access: {
      desc: 'Access the portfolio',
      action: () => {
        addOutput('<span class="text-green">[ACCESS GRANTED]</span> Initializing portfolio interface...');
        setTimeout(() => bootComplete(), 1000);
      }
    },
    enter: {
      desc: 'Enter the system',
      action: () => {
        addOutput('<span class="text-green">[AUTHORIZED]</span> Loading portfolio...');
        setTimeout(() => bootComplete(), 1000);
      }
    },
    login: {
      desc: 'Login to portfolio',
      action: () => {
        addOutput('<span class="text-green">[LOGIN SUCCESSFUL]</span> Welcome, visitor!');
        setTimeout(() => bootComplete(), 1000);
      }
    },
    start: {
      desc: 'Start the interface',
      action: () => {
        addOutput('<span class="text-cyan">[STARTING]</span> Portfolio interface loading...');
        setTimeout(() => bootComplete(), 1000);
      }
    },
    exit: {
      desc: 'Exit terminal',
      action: () => {
        addOutput('<span class="text-cyan">[EXIT]</span> Goodbye!');
        setTimeout(() => bootComplete(), 800);
      }
    },
    whoami: {
      desc: 'Display user information',
      action: () => {
        addOutput('<span class="text-cyan">User:</span> visitor');
        addOutput('<span class="text-cyan">Host:</span> saphal-portfolio');
        addOutput('<span class="text-cyan">Access Level:</span> Guest');
        addOutput('<span class="text-cyan">Location:</span> Nepal (UTC+5:45)');
      }
    },
    about: {
      desc: 'About Saphal Lamsal',
      action: () => {
        addOutput('<span class="text-cyan">Saphal Lamsal</span>');
        addOutput('Developer | Cybersecurity Enthusiast | Researcher');
        addOutput('Location: Nawalpur, Nepal');
        addOutput('Education: BSc Computer Systems Engineering');
        addOutput('Specialization: Web Dev, Security, AI/ML, Networking');
        addOutput('');
        addOutput('Type <span class="text-green">access</span> to view full portfolio');
      }
    },
    skills: {
      desc: 'List technical skills',
      action: () => {
        addOutput('<span class="text-cyan">Core Skills:</span>');
        addOutput('  • Frontend: HTML, CSS, JavaScript, React');
        addOutput('  • Backend: Python, Flask, Django, Node.js');
        addOutput('  • Security: VAPT, Ethical Hacking, Network Security');
        addOutput('  • AI/ML: TensorFlow, PyTorch, Scikit-learn');
        addOutput('  • Networking: CCNA, RCNA, Routing & Switching');
        addOutput('');
        addOutput('Type <span class="text-green">access</span> to explore more');
      }
    },
    clear: {
      desc: 'Clear terminal',
      action: () => {
        terminalOutput.innerHTML = '';
      }
    },
    ls: {
      desc: 'List directory contents',
      action: () => {
        addOutput('about.html    certifications.html    contact.html');
        addOutput('cyberlab.html experience.html        game.html');
        addOutput('index.html    projects.html          skills.html');
        addOutput('techstack.html');
      }
    },
    pwd: {
      desc: 'Print working directory',
      action: () => {
        addOutput('/home/saphal/portfolio');
      }
    }
  };

  // Add output line
  function addOutput(text) {
    const line = document.createElement('div');
    line.className = 'boot-line';
    line.innerHTML = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  // Process command
  function processCommand(input) {
    const cmd = input.trim().toLowerCase();
    
    if (!cmd) return;

    // Add to history
    commandHistory.unshift(cmd);
    historyIndex = -1;

    // Show command
    addOutput(`<span class="terminal-prompt">visitor@saphal:~$</span> ${input}`);

    // Execute command
    if (commands[cmd]) {
      commands[cmd].action();
    } else {
      addOutput(`<span class="text-red">Command not found:</span> ${cmd}`);
      addOutput(`Type <span class="text-cyan">help</span> for available commands`);
    }
  }

  // Boot complete - hide terminal and show site
  function bootComplete() {
    terminalOverlay.style.opacity = '0';
    setTimeout(() => {
      terminalOverlay.remove();
      sessionStorage.setItem('terminalBooted', 'true');
      document.body.classList.add('booted');
    }, 500);
  }

  // Update suggestions
  function updateSuggestions(input) {
    if (!input) {
      suggestions.innerHTML = '';
      return;
    }

    const matches = Object.keys(commands).filter(cmd => 
      cmd.startsWith(input.toLowerCase())
    );

    if (matches.length > 0) {
      suggestions.innerHTML = matches.map(cmd => 
        `<span class="suggestion">${cmd}</span>`
      ).join(' ');
    } else {
      suggestions.innerHTML = '';
    }
  }

  // Input handler
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = terminalInput.value;
      processCommand(input);
      terminalInput.value = '';
      suggestions.innerHTML = '';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const input = terminalInput.value.toLowerCase();
      const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input));
      if (matches.length === 1) {
        terminalInput.value = matches[0];
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = -1;
        terminalInput.value = '';
      }
    }
  });

  terminalInput.addEventListener('input', (e) => {
    updateSuggestions(e.target.value);
  });

  // Click anywhere to focus input
  terminalOverlay.addEventListener('click', () => {
    terminalInput.focus();
  });

  // Prevent body scroll when terminal is active
  document.body.style.overflow = 'hidden';

  // Auto-focus input
  terminalInput.focus();

  // Cursor blink
  setInterval(() => {
    const cursor = document.querySelector('.terminal-cursor');
    if (cursor) {
      cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }
  }, 500);

})();
