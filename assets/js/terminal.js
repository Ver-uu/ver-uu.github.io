// assets/js/terminal.js
import { switchTheme } from './theme.js';

class Terminal {
  constructor() {
    this.terminalWindow = document.getElementById('terminal-window');
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.commands = window.__TERMINAL_COMMANDS__ || [];
    this.searchIndex = null;
    this.history = [];
    this.historyIndex = -1;

    this.init();
  }

  async init() {
    this.addEventListeners();
    await this.showWelcomeMessage();
    this.input.focus();
    this.fetchSearchIndex();
  }

  addEventListeners() {
    this.input.addEventListener('keydown', (e) => this.handleInput(e));
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
      { text: '### Welcome to Veru\'s Log!', classes: ['line-welcome'] },
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
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
    }
  }

  processCommand(inputValue) {
    if (!inputValue.startsWith('/')) {
      this.printLine(`-bash: ${inputValue}: command not found`, false, ['line-system']);
      return;
    }

    const [command, ...args] = inputValue.substring(1).split(' ');

    switch (command.toLowerCase()) {
      case 'help':
        this.handleHelp();
        break;
      case 'man':
        this.handleMan(args);
        break;
      case 'theme':
        this.handleTheme(args);
        break;
      case 'grep':
        this.handleGrep(args);
        break;
      case 'clear':
        this.handleClear();
        break;
      default:
        this.printLine(`-bash: /${command}: command not found`, false, ['line-system']);
    }
    this.scrollToBottom();
  }

  handleHelp() {
    const helpText = this.commands.map(cmd => `  /${cmd.name.padEnd(10)} ${cmd.description}`).join('\n');
    this.printLine(helpText, false, ['output-help']);
  }

  handleMan(args) {
    if (args.length === 0) {
      this.printLine('Usage: /man [command]', false, ['line-system']);
      return;
    }
    const cmdName = args[0];
    const cmd = this.commands.find(c => c.name === cmdName);
    if (cmd) {
      this.printLine(cmd.man_page);
    } else {
      this.printLine(`No manual entry for ${cmdName}`, false, ['line-system']);
    }
  }

  handleTheme(args) {
    const theme = args[0];
    if (theme === 'light' || theme === 'dark') {
      switchTheme(theme);
      this.printLine(`Theme switched to ${theme}.`, false, ['line-system']);
    } else {
      this.printLine('Usage: /theme [light|dark]', false, ['line-system']);
    }
  }

  handleGrep(args) {
    if (args.length === 0) {
      this.printLine('Usage: /grep [keyword]', false, ['line-system']);
      return;
    }
    if (!this.searchIndex) {
      this.printLine('Search index is not loaded yet. Please try again in a moment.', false, ['line-system']);
      return;
    }
    const keyword = args.join(' ').toLowerCase();
    const results = this.searchIndex.filter(post => 
      post.title.toLowerCase().includes(keyword) || 
      post.content.toLowerCase().includes(keyword)
    );

    if (results.length > 0) {
      const resultLines = results.map(post => `  <a href="${post.url}">${post.title}</a>`).join('\n');
      this.printLine(resultLines, true);
    } else {
      this.printLine(`No posts found containing "${keyword}".`, false, ['line-system']);
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
