#!/usr/bin/env node

/**
 * AgentDev CLI - Command line interface for AgentDev Suite
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const execAsync = promisify(exec);

// Load agents
const RequirementAnalyzer = require('../agents/requirement-analyzer');
const CodeGenerator = require('../agents/code-generator');
const TestEngineer = require('../agents/test-engineer');

// Load utils
const { Logger, ConfigManager, parseArgs } = require('../lib/utils');

class AgentDevCLI {
  constructor() {
    this.logger = new Logger();
    this.configManager = new ConfigManager();
    this.agents = {
      requirementAnalyzer: new RequirementAnalyzer(),
      codeGenerator: new CodeGenerator(),
      testEngineer: new TestEngineer()
    };
  }

  /**
   * Initialize a new agent development project
   */
  async init(projectName, options = {}) {
    console.log(`🚀 Initializing new AgentDev project: ${projectName}`);

    const projectPath = path.join(process.cwd(), projectName);

    // Check if directory already exists
    if (fs.existsSync(projectPath)) {
      throw new Error(`Directory ${projectPath} already exists`);
    }

    // Create project structure
    const dirs = [
      'agents',
      'skills',
      'lib',
      'tests',
      'docs',
      'config',
      'logs',
      'generated'
    ];

    dirs.forEach(dir => {
      fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
    });

    // Create basic files
    const files = {
      'README.md': `# ${projectName}\n\nAgent development project created with AgentDev Suite.\n`,
      'package.json': JSON.stringify({
        name: projectName,
        version: '1.0.0',
        description: 'Agent development project',
        main: 'index.js',
        scripts: {
          test: 'node tests/run.js',
          start: 'node index.js'
        },
        dependencies: {},
        devDependencies: {}
      }, null, 2),
      'config/default.json': JSON.stringify({
        agents: {
          timeout: 30000,
          retries: 3
        },
        logging: {
          level: 'info'
        }
      }, null, 2),
      'agents/example-agent.js': `// Example agent implementation
module.exports = class ExampleAgent {
  constructor(config) {
    this.config = config;
  }

  async process(input) {
    console.log('Processing:', input);
    return { success: true, result: 'processed' };
  }
};`,
      'skills/example-skill.md': `# Example Skill

This is an example skill for agent development.

## Usage

Example skill description.

## Best Practices

- Practice 1
- Practice 2
`,
      'index.js': `// Main entry point
const ExampleAgent = require('./agents/example-agent');

async function main() {
  console.log('AgentDev project started');

  const agent = new ExampleAgent({});
  const result = await agent.process('test input');

  console.log('Result:', result);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };`
    };

    Object.entries(files).forEach(([filePath, content]) => {
      const fullPath = path.join(projectPath, filePath);
      const dir = path.dirname(fullPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(fullPath, content, 'utf8');
    });

    console.log(`✅ Project created at: ${projectPath}`);
    console.log('\nNext steps:');
    console.log(`  cd ${projectName}`);
    console.log('  npm install');
    console.log('  node index.js');

    return projectPath;
  }

  /**
   * Analyze requirements from file or text
   */
  async analyze(input, outputFile) {
    console.log('🔍 Analyzing requirements...');

    let requirementsText;

    if (fs.existsSync(input)) {
      requirementsText = await readFile(input, 'utf8');
    } else {
      requirementsText = input;
    }

    // Load constraints if available
    const constraintsFile = path.join(process.cwd(), 'config', 'constraints.json');
    if (fs.existsSync(constraintsFile)) {
      await this.agents.requirementAnalyzer.loadConstraints(constraintsFile);
    }

    const results = await this.agents.requirementAnalyzer.analyze(requirementsText);

    // Save results
    const outputPath = outputFile || 'requirement-analysis.json';
    await this.agents.requirementAnalyzer.saveResults(outputPath);

    console.log('✅ Analysis complete!');
    console.log(`📊 Found ${results.totalRequirements} requirements`);
    console.log(`📄 Results saved to: ${outputPath}`);

    return results;
  }

  /**
   * Generate code from specification
   */
  async generate(specFile, outputDir) {
    console.log('💻 Generating code...');

    const specData = await readFile(specFile, 'utf8');
    const spec = JSON.parse(specData);

    const results = await this.agents.codeGenerator.generate(spec, outputDir);

    console.log('✅ Code generation complete!');
    console.log(`📊 Generated ${results.summary.totalFiles} files`);
    console.log(`📁 Output directory: ${outputDir || './generated'}`);

    return results;
  }

  /**
   * Run tests
   */
  async test(testPattern, options = {}) {
    console.log('🧪 Running tests...');

    // Find test files
    let testFiles = [];
    if (testPattern) {
      const glob = require('glob');
      testFiles = glob.sync(testPattern, { absolute: true });
    } else {
      // Default to tests directory
      const testsDir = path.join(process.cwd(), 'tests');
      if (fs.existsSync(testsDir)) {
        testFiles = fs.readdirSync(testsDir)
          .filter(file => file.endsWith('.test.js') || file.endsWith('.spec.js'))
          .map(file => path.join(testsDir, file));
      }
    }

    if (testFiles.length === 0) {
      console.warn('⚠️ No test files found');
      return { passed: 0, failed: 0, total: 0 };
    }

    console.log(`Found ${testFiles.length} test files`);

    const results = await this.agents.testEngineer.executeTests(testFiles, options);

    console.log('✅ Test execution complete!');
    console.log(`📊 Results: ${results.passed} passed, ${results.failed} failed`);

    if (results.errors.length > 0) {
      console.warn(`⚠️ ${results.errors.length} errors occurred during execution`);
    }

    return results;
  }

  /**
   * Run full development workflow
   */
  async workflow(requirementsFile, options = {}) {
    console.log('🔄 Starting full development workflow...');

    // 1. Analyze requirements
    console.log('\n=== Phase 1: Requirement Analysis ===');
    const analysis = await this.analyze(requirementsFile, 'analysis.json');

    // 2. Generate specification for code generation
    console.log('\n=== Phase 2: Specification Creation ===');
    const spec = this.createSpecificationFromAnalysis(analysis);
    const specFile = 'generated-spec.json';
    await writeFile(specFile, JSON.stringify(spec, null, 2), 'utf8');
    console.log(`📄 Specification created: ${specFile}`);

    // 3. Generate code
    console.log('\n=== Phase 3: Code Generation ===');
    const codegenResult = await this.generate(specFile, './generated-code');

    // 4. Generate tests
    console.log('\n=== Phase 4: Test Generation ===');
    // For demo, use first generated file
    const firstGeneratedFile = codegenResult.generatedFiles[0];
    if (firstGeneratedFile) {
      const code = await readFile(firstGeneratedFile.path, 'utf8');
      const testResult = await this.agents.testEngineer.generateTests(code, spec);
      console.log(`✅ Generated ${testResult.testCases} test cases`);
    }

    // 5. Run tests
    console.log('\n=== Phase 5: Test Execution ===');
    const testDir = path.join(process.cwd(), 'tests');
    const testFiles = fs.existsSync(testDir)
      ? fs.readdirSync(testDir)
          .filter(f => f.endsWith('.test.js'))
          .map(f => path.join(testDir, f))
      : [];

    if (testFiles.length > 0) {
      const testResults = await this.test(testFiles);
      console.log(`📊 Test results: ${testResults.passed}/${testResults.total} passed`);
    }

    console.log('\n✅ Full workflow complete!');
    console.log('📁 Generated files in ./generated-code');
    console.log('📄 Analysis saved to analysis.json');

    return {
      analysis,
      codegen: codegenResult,
      success: true
    };
  }

  /**
   * Create specification from analysis results
   */
  createSpecificationFromAnalysis(analysis) {
    // Convert requirements to code generation spec
    const mainReq = analysis.requirements[0] || { description: 'Default component' };

    return {
      name: mainReq.id.replace('REQ-', 'Component'),
      description: mainReq.description,
      type: 'class',
      constructorParams: 'config',
      constructorBody: 'this.config = config;',
      methods: [
        {
          name: 'process',
          params: 'input',
          body: `// Process input according to requirement
// ${mainReq.description}
return input;`,
          access: 'public'
        }
      ],
      testCases: [
        'should process input correctly',
        'should handle edge cases',
        'should return expected output'
      ]
    };
  }

  /**
   * List available agents
   */
  listAgents() {
    const registryPath = path.join(__dirname, '..', 'agents', 'registry.json');

    if (!fs.existsSync(registryPath)) {
      console.log('No agent registry found');
      return [];
    }

    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

    console.log('🤖 Available Agents:');
    console.log('====================');

    Object.entries(registry.agents).forEach(([id, agent]) => {
      console.log(`\n${id}:`);
      console.log(`  Name: ${agent.name}`);
      console.log(`  Description: ${agent.description}`);
      console.log(`  Capabilities: ${agent.capabilities.join(', ')}`);
    });

    console.log('\n🔗 Available Workflows:');
    console.log('======================');

    Object.entries(registry.workflows).forEach(([name, agents]) => {
      console.log(`\n${name}:`);
      console.log(`  Agents: ${agents.join(' → ')}`);
    });

    return registry;
  }

  /**
   * Show agent status and health
   */
  async status() {
    console.log('📊 AgentDev Suite Status');
    console.log('========================');

    const agents = [
      { name: 'Requirement Analyzer', instance: this.agents.requirementAnalyzer, status: 'ready' },
      { name: 'Code Generator', instance: this.agents.codeGenerator, status: 'ready' },
      { name: 'Test Engineer', instance: this.agents.testEngineer, status: 'ready' }
    ];

    agents.forEach(agent => {
      console.log(`\n${agent.name}:`);
      console.log(`  Status: ${agent.status}`);
      console.log(`  Options: ${Object.keys(agent.instance.options || {}).length} configured`);
    });

    // Check for generated files
    const generatedDirs = ['./generated', './generated-code', './tests'];
    generatedDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        console.log(`\n📁 ${dir}: ${files.length} files`);
      }
    });

    return { agents: agents.length, allReady: true };
  }

  /**
   * Show help information
   */
  showHelp() {
    console.log('AgentDev Suite - Agent Development Tools');
    console.log('========================================');
    console.log('\nUsage: agentdev <command> [options]');
    console.log('\nCommands:');
    console.log('  init <project-name>     Initialize new agent development project');
    console.log('  analyze <input>         Analyze requirements from file or text');
    console.log('  generate <spec-file>    Generate code from specification');
    console.log('  test [pattern]          Run tests (default: tests/**/*.test.js)');
    console.log('  workflow <req-file>     Run full development workflow');
    console.log('  list-agents             List available agents and workflows');
    console.log('  status                  Show agent status and health');
    console.log('  help                    Show this help message');
    console.log('\nExamples:');
    console.log('  agentdev init my-agent-project');
    console.log('  agentdev analyze requirements.txt');
    console.log('  agentdev generate spec.json');
    console.log('  agentdev test');
    console.log('  agentdev workflow requirements.txt');
    console.log('\nFor more information, visit: https://github.com/gongxh13/agentdev-suite');
  }

  /**
   * Parse and execute command
   */
  async run(argv) {
    const args = parseArgs(argv);
    const command = args._ ? args._[0] : null;

    if (!command || command === 'help') {
      this.showHelp();
      return;
    }

    try {
      switch (command) {
        case 'init':
          const projectName = args._[1];
          if (!projectName) {
            throw new Error('Project name required');
          }
          await this.init(projectName, args);
          break;

        case 'analyze':
          const input = args._[1];
          if (!input) {
            throw new Error('Input file or text required');
          }
          await this.analyze(input, args.output);
          break;

        case 'generate':
          const specFile = args._[1];
          if (!specFile) {
            throw new Error('Specification file required');
          }
          await this.generate(specFile, args.output || './generated');
          break;

        case 'test':
          await this.test(args._[1], args);
          break;

        case 'workflow':
          const reqFile = args._[1];
          if (!reqFile) {
            throw new Error('Requirements file required');
          }
          await this.workflow(reqFile, args);
          break;

        case 'list-agents':
          await this.listAgents();
          break;

        case 'status':
          await this.status();
          break;

        default:
          console.error(`Unknown command: ${command}`);
          this.showHelp();
          process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      if (error.stack && args.debug) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
}

// CLI entry point
if (require.main === module) {
  const cli = new AgentDevCLI();
  cli.run(process.argv.slice(2)).catch(error => {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = AgentDevCLI;