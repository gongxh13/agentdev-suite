/**
 * Utility functions for AgentDev Suite
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

/**
 * Check if a file or directory exists
 */
function exists(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensure directory exists, create if not
 */
async function ensureDir(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Read JSON file
 */
async function readJson(filePath) {
  const content = await readFile(filePath, 'utf8');
  return JSON.parse(content);
}

/**
 * Write JSON file with pretty formatting
 */
async function writeJson(filePath, data) {
  const content = JSON.stringify(data, null, 2);
  await writeFile(filePath, content, 'utf8');
}

/**
 * Deep merge objects
 */
function deepMerge(target, source) {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }

  return output;
}

/**
 * Check if value is an object
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Generate unique ID
 */
function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}_${random}`;
}

/**
 * Format timestamp
 */
function formatTimestamp(date = new Date()) {
  return date.toISOString().replace('T', ' ').substr(0, 19);
}

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const parsed = {};
  let currentKey = null;

  args.forEach(arg => {
    if (arg.startsWith('--')) {
      currentKey = arg.substr(2);
      parsed[currentKey] = true;
    } else if (arg.startsWith('-')) {
      currentKey = arg.substr(1);
      parsed[currentKey] = true;
    } else if (currentKey) {
      parsed[currentKey] = arg;
      currentKey = null;
    } else {
      // Positional argument
      if (!parsed._) parsed._ = [];
      parsed._.push(arg);
    }
  });

  return parsed;
}

/**
 * Logger utility
 */
class Logger {
  constructor(options = {}) {
    this.options = {
      level: 'info',
      timestamp: true,
      colors: true,
      ...options
    };

    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };

    this.colors = {
      error: '\x1b[31m', // red
      warn: '\x1b[33m',  // yellow
      info: '\x1b[36m',  // cyan
      debug: '\x1b[90m', // gray
      reset: '\x1b[0m'
    };
  }

  log(level, message, ...args) {
    if (this.levels[level] > this.levels[this.options.level]) {
      return;
    }

    let logMessage = '';

    // Add timestamp
    if (this.options.timestamp) {
      logMessage += `[${formatTimestamp()}] `;
    }

    // Add level with color
    if (this.options.colors) {
      logMessage += `${this.colors[level]}${level.toUpperCase()}${this.colors.reset} `;
    } else {
      logMessage += `${level.toUpperCase()} `;
    }

    // Add message
    logMessage += message;

    // Add additional args
    if (args.length > 0) {
      logMessage += ' ' + args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg) : arg
      ).join(' ');
    }

    console.log(logMessage);
  }

  error(message, ...args) {
    this.log('error', message, ...args);
  }

  warn(message, ...args) {
    this.log('warn', message, ...args);
  }

  info(message, ...args) {
    this.log('info', message, ...args);
  }

  debug(message, ...args) {
    this.log('debug', message, ...args);
  }
}

/**
 * Configuration manager
 */
class ConfigManager {
  constructor(configPath = './config.json') {
    this.configPath = configPath;
    this.config = {};
    this.defaults = {
      agents: {
        timeout: 30000,
        retries: 3,
        concurrency: 2
      },
      logging: {
        level: 'info',
        file: './logs/agentdev.log'
      },
      generation: {
        language: 'javascript',
        includeTests: true,
        includeDocs: true
      }
    };
  }

  async load() {
    try {
      if (exists(this.configPath)) {
        this.config = await readJson(this.configPath);
      } else {
        this.config = { ...this.defaults };
        await this.save();
      }
    } catch (error) {
      console.warn(`Failed to load config: ${error.message}`);
      this.config = { ...this.defaults };
    }

    return this.config;
  }

  async save() {
    await ensureDir(path.dirname(this.configPath));
    await writeJson(this.configPath, this.config);
  }

  get(key, defaultValue) {
    const keys = key.split('.');
    let value = this.config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return value;
  }

  set(key, value) {
    const keys = key.split('.');
    let current = this.config;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k] || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k];
    }

    current[keys[keys.length - 1]] = value;
  }

  merge(newConfig) {
    this.config = deepMerge(this.config, newConfig);
  }
}

/**
 * Task runner with concurrency control
 */
class TaskRunner {
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
    this.queue = [];
    this.running = 0;
    this.results = [];
    this.errors = [];
  }

  async run(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    while (this.running < this.maxConcurrent && this.queue.length > 0) {
      const { task, resolve, reject } = this.queue.shift();
      this.running++;

      (async () => {
        try {
          const result = await task();
          this.results.push(result);
          resolve(result);
        } catch (error) {
          this.errors.push(error);
          reject(error);
        } finally {
          this.running--;
          this.processQueue();
        }
      })();
    }
  }

  async waitAll() {
    while (this.running > 0 || this.queue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return {
      results: this.results,
      errors: this.errors,
      total: this.results.length + this.errors.length
    };
  }
}

/**
 * Template renderer
 */
class TemplateRenderer {
  constructor(delimiters = ['{{', '}}']) {
    this.delimiters = delimiters;
  }

  render(template, data) {
    const [start, end] = this.delimiters;
    const pattern = new RegExp(`${start}(.*?)${end}`, 'g');

    return template.replace(pattern, (match, key) => {
      const value = this.getValue(data, key.trim());
      return value !== undefined ? value : match;
    });
  }

  getValue(obj, path) {
    const keys = path.split('.');
    let value = obj;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  }
}

module.exports = {
  exists,
  ensureDir,
  readJson,
  writeJson,
  deepMerge,
  isObject,
  generateId,
  formatTimestamp,
  parseArgs,
  Logger,
  ConfigManager,
  TaskRunner,
  TemplateRenderer
};