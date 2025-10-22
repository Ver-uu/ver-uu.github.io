// assets/js/terminal.js
import { switchTheme } from './theme.js';
import { drawGraph } from './graph.js';

class Terminal {
  constructor() {
    this.terminalWindow = document.getElementById('terminal-window');
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.commands = window.__TERMINAL_COMMANDS__ || [];
    this.searchIndex = null;
    this.history = [];
    this.historyIndex = -1;
    this.statusElement = document.getElementById('terminal-status');
    this.suggestionsElement = document.getElementById('autocomplete-suggestions');
    this.currentSuggestions = [];
    this.suggestionIndex = -1;

    this.init();
  }

  updateStatus(message) {
    if (this.statusElement) {
      this.statusElement.textContent = `STATUS: ${message}`;
    }
  }

  async init() {
    this.addEventListeners();
    await this.showWelcomeMessage();
    this.input.focus();
    this.fetchSearchIndex();
    this.updateStatus('OPERATIONAL');
  }

  addEventListeners() {
    this.input.addEventListener('keydown', (e) => this.handleInput(e));
    this.input.addEventListener('input', (e) => this.handleAutocomplete(e));
    this.terminalWindow.addEventListener('click', () => this.input.focus());
  }

  async fetchSearchIndex() {
    try {
      const response = await fetch('/pages/search.json');
      this.searchIndex = await response.json();
    } catch (error) {
      console.error('Error fetching search index:', error);
      this.printLine('Error: Could not load search data.');
    }
  }

  async showWelcomeMessage() {
    const welcomeLines = [
      { text: 'Welcome to Veru\'s Log!', classes: ['line-welcome'] },
      { text: ' ', classes: [] },
      { text: 'Type `/help` to see a list of available commands.', classes: ['line-system'] },
      { text: ' ', classes: [] },
    ];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      welcomeLines.forEach(line => this.printLine(line.text, false, line.classes));
      return;
    }

    for (const line of welcomeLines) {
      await this.typeLine(line.text, 50, line.classes);
    }
  }

  typeLine(line, speed, classes = []) {
    return new Promise(resolve => {
      let i = 0;
      const outputLine = this.createNewLine(classes);
      const interval = setInterval(() => {
        if (i < line.length) {
          outputLine.textContent += line.charAt(i);
          i++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  }

  handleAutocomplete(e) {
    const inputValue = e.target.value.trim();
    this.currentSuggestions = [];
    this.suggestionIndex = -1;
    this.suggestionsElement.innerHTML = '';
    this.suggestionsElement.style.display = 'none';

    if (inputValue.startsWith('/')) {
      const commandPrefix = inputValue.substring(1).toLowerCase();
      this.currentSuggestions = this.commands.filter(cmd => 
        cmd.name.startsWith(commandPrefix)
      );

      if (this.currentSuggestions.length > 0) {
        this.suggestionsElement.style.display = 'block';
        this.currentSuggestions.forEach((cmd, index) => {
          const div = document.createElement('div');
          div.classList.add('suggestion-item');
          div.textContent = `/${cmd.name} - ${cmd.description}`;
          div.dataset.command = `/${cmd.name}`;
          div.addEventListener('click', () => this.selectSuggestion(cmd.name));
          this.suggestionsElement.appendChild(div);
        });
      }
    }
  }

  selectSuggestion(commandName) {
    this.input.value = `/${commandName}`;
    this.suggestionsElement.innerHTML = '';
    this.suggestionsElement.style.display = 'none';
    this.input.focus();
  }

  handleInput(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = this.input.value.trim();
      if (value) {
        this.printLine(`> ${value}`);
        this.processCommand(value);
        this.history.push(value);
        this.historyIndex = this.history.length;
      }
      this.input.value = '';
      this.suggestionsElement.innerHTML = '';
      this.suggestionsElement.style.display = 'none';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (this.currentSuggestions.length > 0 && this.suggestionIndex !== -1) {
        this.selectSuggestion(this.currentSuggestions[this.suggestionIndex].name);
      } else if (this.currentSuggestions.length === 1) {
        this.selectSuggestion(this.currentSuggestions[0].name);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.currentSuggestions.length > 0) {
        this.suggestionIndex = (this.suggestionIndex - 1 + this.currentSuggestions.length) % this.currentSuggestions.length;
        this.highlightSuggestion();
      } else if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.currentSuggestions.length > 0) {
        this.suggestionIndex = (this.suggestionIndex + 1) % this.currentSuggestions.length;
        this.highlightSuggestion();
      } else if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
    }
  }

  highlightSuggestion() {
    const items = this.suggestionsElement.querySelectorAll('.suggestion-item');
    items.forEach((item, index) => {
      if (index === this.suggestionIndex) {
        item.classList.add('selected');
        this.input.value = item.dataset.command; // Update input with selected command
      } else {
        item.classList.remove('selected');
      }
    });
  }

  processCommand(inputValue) {
    this.updateStatus('PROCESSING...');
    if (!inputValue.startsWith('/')) {
      this.printLine(`-bash: ${inputValue}: command not found`, false, ['line-system']);
      this.updateStatus('ERROR');
      return;
    }

    const [command, ...args] = inputValue.substring(1).split(' ');

    switch (command.toLowerCase()) {
      case 'help':
        this.handleHelp();
        this.updateStatus('HELP DISPLAYED');
        break;
      case 'search':
        this.handleSearch(args);
        break;
      case 'map':
        const graphOverlay = document.getElementById('graph-overlay');
        const knowledgeGraphContainer = document.getElementById('knowledge-graph-container');
        const closeOverlayButton = graphOverlay ? graphOverlay.querySelector('.close-overlay-button') : null;

        if (!graphOverlay || !knowledgeGraphContainer) {
          this.printLine('Error: Graph overlay or container not found.', false, ['line-system']);
          this.updateStatus('ERROR');
          return;
        }

        const closeGraphOverlay = () => {
          graphOverlay.style.display = 'none';
          this.updateStatus('OPERATIONAL');
          window.removeEventListener('keydown', handleEscKey);
          if (closeOverlayButton) {
            closeOverlayButton.removeEventListener('click', closeGraphOverlay);
          }
          graphOverlay.removeEventListener('click', handleOverlayClick);
        };

        const handleEscKey = (e) => {
          if (e.key === 'Escape') {
            closeGraphOverlay();
          }
        };

        const handleOverlayClick = (event) => {
          if (event.target === graphOverlay) {
            closeGraphOverlay();
          }
        };

        if (closeOverlayButton) {
          closeOverlayButton.addEventListener('click', closeGraphOverlay);
        }
        graphOverlay.addEventListener('click', handleOverlayClick);
        window.addEventListener('keydown', handleEscKey);

        graphOverlay.style.display = 'flex';
        this.updateStatus('LOADING MAP...');
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { // Double rAF to ensure layout is calculated
            drawGraph('knowledge-graph-container'); // Pass the container ID
            this.updateStatus('MAP LOADED');
          });
        });
        break;
      case 'clear':
        this.handleClear();
        this.updateStatus('SCREEN CLEARED');
        break;
      default:
        this.printLine(`-bash: /${command}: command not found`, false, ['line-system']);
        this.updateStatus('ERROR');
    }
    this.scrollToBottom();
    this.updateStatus('OPERATIONAL'); // Reset to operational after command
  }

  handleHelp() {
    const helpText = this.commands.map(cmd => `  /${cmd.name.padEnd(10)} ${cmd.description}`).join('\n');
    this.printLine(helpText, false, ['output-help']);
  }

  handleSearch(args) {
    if (args.length === 0) {
      this.printLine('Usage: /search [keyword]', false, ['line-system']);
      this.updateStatus('ERROR');
      return;
    }
    if (!this.searchIndex) {
      this.printLine('Search index is not loaded yet. Please try again in a moment.', false, ['line-system']);
      this.updateStatus('ERROR');
      return;
    }
    const keyword = args.join(' ').toLowerCase();
    this.updateStatus('PROCESSING...');
    const results = this.searchIndex.filter(post => 
      post.title.toLowerCase().includes(keyword) || 
      post.content.toLowerCase().includes(keyword) ||
      (post.tags && post.tags.join(' ').toLowerCase().includes(keyword))
    );

    if (results.length > 0) {
      let resultLines = `Searching for '${keyword}'... ${results.length} posts found.\n\n`;
      results.forEach(post => {
        const postDate = new Date(post.date).toLocaleDateString('en-CA'); // YYYY-MM-DD
        resultLines += `[${postDate}] <a href="${post.url}">${post.title}</a>\n`;
        if (post.tags && post.tags.length > 0) {
          resultLines += `> Tags: #${post.tags.join(' #')}\n\n`;
        }
      });
      this.printLine(resultLines, true);
      this.updateStatus(`SEARCH COMPLETE (${results.length} results)`);
    } else {
      this.printLine(`No posts found containing "${keyword}".`, false, ['line-system']);
      this.updateStatus('NO RESULTS');
    }
  }

  handleClear() {
    this.output.innerHTML = '';
  }

  printLine(text, isHTML = false, classes = []) {
    const line = this.createNewLine(['command-output', ...classes]);
    if (isHTML) {
      line.innerHTML = text;
    } else {
      line.textContent = text;
    }
  }

  createNewLine(classes = []) {
    const div = document.createElement('div');
    div.className = ['terminal-line', ...classes].join(' ').trim();
    this.output.appendChild(div);
    this.scrollToBottom();
    return div;
  }

  scrollToBottom() {
    this.terminalWindow.scrollTop = this.terminalWindow.scrollHeight;
  }
}

// Initialize the terminal
new Terminal();