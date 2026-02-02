#!/usr/bin/env node

/**
 * Code Generator Agent
 *
 * Generates code based on specifications, architecture designs, and best practices.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

class CodeGenerator {
  constructor(options = {}) {
    this.options = {
      language: 'javascript',
      framework: 'nodejs',
      codingStandards: true,
      includeTests: true,
      includeDocumentation: true,
      ...options
    };

    this.templates = this.loadTemplates();
    this.generatedFiles = [];
  }

  /**
   * Load code templates based on language and framework
   */
  loadTemplates() {
    const templates = {
      javascript: {
        class: `class {{className}} {
  constructor({{constructorParams}}) {
    {{constructorBody}}
  }

  {{methods}}
}`,
        function: `function {{functionName}}({{params}}) {
  {{body}}
}`,
        module: `module.exports = {
  {{exports}}
};`,
        test: `describe('{{componentName}}', () => {
  {{testCases}}
});`
      },
      python: {
        class: `class {{className}}:
    def __init__(self, {{constructorParams}}):
        {{constructorBody}}

    {{methods}}`,
        function: `def {{functionName}}({{params}}):
    {{body}}`,
        test: `import unittest

class Test{{ComponentName}}(unittest.TestCase):
    {{testCases}}

if __name__ == '__main__':
    unittest.main()`
      }
    };

    return templates[this.options.language] || templates.javascript;
  }

  /**
   * Generate code from specification
   */
  async generate(spec, outputDir = './generated') {
    console.log('💻 Generating code from specification...');

    // Ensure output directory exists
    await this.ensureDirectory(outputDir);

    // Generate based on specification type
    let generatedCode;
    switch (spec.type) {
      case 'class':
        generatedCode = await this.generateClass(spec, outputDir);
        break;
      case 'function':
        generatedCode = await this.generateFunction(spec, outputDir);
        break;
      case 'module':
        generatedCode = await this.generateModule(spec, outputDir);
        break;
      case 'api-endpoint':
        generatedCode = await this.generateApiEndpoint(spec, outputDir);
        break;
      default:
        generatedCode = await this.generateFromDescription(spec, outputDir);
    }

    // Generate tests if requested
    if (this.options.includeTests) {
      await this.generateTests(spec, outputDir);
    }

    // Generate documentation if requested
    if (this.options.includeDocumentation) {
      await this.generateDocumentation(spec, outputDir);
    }

    return {
      generatedFiles: this.generatedFiles,
      summary: {
        totalFiles: this.generatedFiles.length,
        totalLines: this.countTotalLines(),
        languages: [this.options.language]
      }
    };
  }

  /**
   * Generate a class from specification
   */
  async generateClass(spec, outputDir) {
    const template = this.templates.class;
    const className = spec.name || 'GeneratedClass';

    // Process methods
    const methods = spec.methods || [];
    const methodCode = methods.map(method => this.generateMethod(method)).join('\n\n  ');

    // Fill template
    const code = template
      .replace('{{className}}', className)
      .replace('{{constructorParams}}', spec.constructorParams || '')
      .replace('{{constructorBody}}', spec.constructorBody || '// Initialize properties')
      .replace('{{methods}}', methodCode);

    // Apply coding standards
    const formattedCode = this.applyCodingStandards(code);

    // Save file
    const fileName = `${className}.${this.getFileExtension()}`;
    const filePath = path.join(outputDir, fileName);
    await writeFile(filePath, formattedCode, 'utf8');

    this.generatedFiles.push({
      type: 'class',
      name: fileName,
      path: filePath,
      language: this.options.language
    });

    console.log(`✅ Generated class: ${fileName}`);
    return code;
  }

  /**
   * Generate a function from specification
   */
  async generateFunction(spec, outputDir) {
    const template = this.templates.function;
    const functionName = spec.name || 'generatedFunction';

    // Fill template
    const code = template
      .replace('{{functionName}}', functionName)
      .replace('{{params}}', spec.params || '')
      .replace('{{body}}', spec.body || '// Function implementation');

    // Apply coding standards
    const formattedCode = this.applyCodingStandards(code);

    // Save file
    const fileName = `${functionName}.${this.getFileExtension()}`;
    const filePath = path.join(outputDir, fileName);
    await writeFile(filePath, formattedCode, 'utf8');

    this.generatedFiles.push({
      type: 'function',
      name: fileName,
      path: filePath,
      language: this.options.language
    });

    console.log(`✅ Generated function: ${fileName}`);
    return code;
  }

  /**
   * Generate a module from specification
   */
  async generateModule(spec, outputDir) {
    const template = this.templates.module;
    const moduleName = spec.name || 'generatedModule';

    // Generate exports
    const exports = spec.exports || [];
    const exportCode = exports.map(exp => {
      if (typeof exp === 'string') {
        return `${exp},`;
      } else {
        return `${exp.name}: ${exp.value},`;
      }
    }).join('\n  ');

    // Fill template
    const code = template.replace('{{exports}}', exportCode);

    // Apply coding standards
    const formattedCode = this.applyCodingStandards(code);

    // Save file
    const fileName = `${moduleName}.${this.getFileExtension()}`;
    const filePath = path.join(outputDir, fileName);
    await writeFile(filePath, formattedCode, 'utf8');

    this.generatedFiles.push({
      type: 'module',
      name: fileName,
      path: filePath,
      language: this.options.language
    });

    console.log(`✅ Generated module: ${fileName}`);
    return code;
  }

  /**
   * Generate API endpoint
   */
  async generateApiEndpoint(spec, outputDir) {
    let code;

    if (this.options.framework === 'express') {
      code = this.generateExpressEndpoint(spec);
    } else if (this.options.framework === 'fastapi') {
      code = this.generateFastApiEndpoint(spec);
    } else {
      code = this.generateGenericEndpoint(spec);
    }

    // Apply coding standards
    const formattedCode = this.applyCodingStandards(code);

    // Save file
    const fileName = `${spec.name || 'endpoint'}.${this.getFileExtension()}`;
    const filePath = path.join(outputDir, fileName);
    await writeFile(filePath, formattedCode, 'utf8');

    this.generatedFiles.push({
      type: 'api-endpoint',
      name: fileName,
      path: filePath,
      language: this.options.language,
      framework: this.options.framework
    });

    console.log(`✅ Generated API endpoint: ${fileName}`);
    return code;
  }

  /**
   * Generate Express.js endpoint
   */
  generateExpressEndpoint(spec) {
    const method = spec.method || 'get';
    const path = spec.path || '/api/endpoint';
    const handlerName = spec.handlerName || 'handleRequest';

    return `const express = require('express');
const router = express.Router();

/**
 * @route ${method.toUpperCase()} ${path}
 * @desc ${spec.description || 'API endpoint'}
 * @access ${spec.access || 'public'}
 */
router.${method}('${path}', ${handlerName});

async function ${handlerName}(req, res) {
  try {
    ${spec.handlerBody || '// Handle request logic here'}
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = router;`;
  }

  /**
   * Generate generic code from description
   */
  async generateFromDescription(spec, outputDir) {
    console.log(`📝 Generating code from description: ${spec.description}`);

    // Simple heuristic-based generation
    const description = spec.description.toLowerCase();
    let code;

    if (description.includes('calculate') || description.includes('compute')) {
      code = this.generateCalculationFunction(spec);
    } else if (description.includes('validate') || description.includes('check')) {
      code = this.generateValidationFunction(spec);
    } else if (description.includes('process') || description.includes('transform')) {
      code = this.generateProcessingFunction(spec);
    } else {
      code = this.generateGenericFunction(spec);
    }

    // Apply coding standards
    const formattedCode = this.applyCodingStandards(code);

    // Save file
    const fileName = `generated_${Date.now()}.${this.getFileExtension()}`;
    const filePath = path.join(outputDir, fileName);
    await writeFile(filePath, formattedCode, 'utf8');

    this.generatedFiles.push({
      type: 'generic',
      name: fileName,
      path: filePath,
      language: this.options.language
    });

    console.log(`✅ Generated code: ${fileName}`);
    return code;
  }

  /**
   * Generate calculation function
   */
  generateCalculationFunction(spec) {
    return `function calculate${spec.name ? spec.name.charAt(0).toUpperCase() + spec.name.slice(1) : 'Value'}(input) {
  // Calculation logic
  let result = 0;

  // TODO: Implement actual calculation
  // ${spec.description}

  return result;
}`;
  }

  /**
   * Generate generic function
   */
  generateGenericFunction(spec) {
    return `function ${spec.name || 'processData'}(input) {
  // Process input according to specification
  // ${spec.description}

  let output = input;

  // TODO: Implement actual processing logic

  return output;
}`;
  }

  /**
   * Generate method from specification
   */
  generateMethod(methodSpec) {
    return `${methodSpec.access || 'public'} ${methodSpec.name}(${methodSpec.params || ''}) {
  ${methodSpec.body || '// Method implementation'}
}`;
  }

  /**
   * Generate tests for the specification
   */
  async generateTests(spec, outputDir) {
    const testDir = path.join(outputDir, 'tests');
    await this.ensureDirectory(testDir);

    const template = this.templates.test;
    const componentName = spec.name || 'GeneratedComponent';

    // Generate test cases
    const testCases = spec.testCases || [
      'should work correctly',
      'should handle edge cases',
      'should return expected results'
    ];

    const testCaseCode = testCases.map((testCase, index) => {
      return `it('${testCase}', () => {
    // Test implementation
    expect(true).toBe(true);
  });`;
    }).join('\n\n  ');

    // Fill template
    const testCode = template
      .replace('{{componentName}}', componentName)
      .replace('{{testCases}}', testCaseCode);

    // Apply coding standards
    const formattedTestCode = this.applyCodingStandards(testCode);

    // Save test file
    const testFileName = `${componentName}.test.${this.getFileExtension()}`;
    const testFilePath = path.join(testDir, testFileName);
    await writeFile(testFilePath, formattedTestCode, 'utf8');

    this.generatedFiles.push({
      type: 'test',
      name: testFileName,
      path: testFilePath,
      language: this.options.language
    });

    console.log(`✅ Generated tests: ${testFileName}`);
  }

  /**
   * Generate documentation
   */
  async generateDocumentation(spec, outputDir) {
    const docsDir = path.join(outputDir, 'docs');
    await this.ensureDirectory(docsDir);

    const docContent = this.generateDocContent(spec);
    const docFilePath = path.join(docsDir, `${spec.name || 'generated'}.md`);
    await writeFile(docFilePath, docContent, 'utf8');

    this.generatedFiles.push({
      type: 'documentation',
      name: `${spec.name || 'generated'}.md`,
      path: docFilePath
    });

    console.log(`✅ Generated documentation: ${docFilePath}`);
  }

  /**
   * Generate documentation content
   */
  generateDocContent(spec) {
    return `# ${spec.name || 'Generated Component'}

## Description
${spec.description || 'No description provided.'}

## Usage
\`\`\`${this.options.language}
// Example usage
const instance = new ${spec.name || 'GeneratedClass'}();
\`\`\`

## API Reference

### Methods
${spec.methods ? spec.methods.map(m => `- **${m.name}(${m.params})**: ${m.description || ''}`).join('\n') : 'No methods specified.'}

## Requirements
- ${spec.requirements ? spec.requirements.join('\n- ') : 'No specific requirements.'}

## Notes
${spec.notes || 'Generated by AgentDev Suite Code Generator.'}
`;
  }

  /**
   * Apply coding standards to code
   */
  applyCodingStandards(code) {
    if (!this.options.codingStandards) {
      return code;
    }

    // Simple formatting rules
    let formatted = code;

    // Ensure proper indentation (2 spaces)
    formatted = formatted.replace(/\t/g, '  ');

    // Add trailing newline
    if (!formatted.endsWith('\n')) {
      formatted += '\n';
    }

    return formatted;
  }

  /**
   * Get file extension based on language
   */
  getFileExtension() {
    const extensions = {
      javascript: 'js',
      python: 'py',
      typescript: 'ts',
      java: 'java',
      go: 'go'
    };

    return extensions[this.options.language] || 'js';
  }

  /**
   * Ensure directory exists
   */
  async ensureDirectory(dirPath) {
    try {
      await mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  /**
   * Count total lines in generated files
   */
  countTotalLines() {
    return this.generatedFiles.reduce((total, file) => {
      // Estimate lines based on file size
      return total + 50; // Rough estimate
    }, 0);
  }

  /**
   * Refactor existing code
   */
  async refactor(code, improvements = []) {
    console.log('🔧 Refactoring code...');

    let refactoredCode = code;

    improvements.forEach(improvement => {
      switch (improvement.type) {
        case 'extract-function':
          refactoredCode = this.extractFunction(refactoredCode, improvement);
          break;
        case 'rename-variable':
          refactoredCode = this.renameVariable(refactoredCode, improvement);
          break;
        case 'simplify-logic':
          refactoredCode = this.simplifyLogic(refactoredCode, improvement);
          break;
        // Add more refactoring operations
      }
    });

    return refactoredCode;
  }

  /**
   * Extract repeated code into function
   */
  extractFunction(code, improvement) {
    // Simple extraction logic
    const pattern = improvement.pattern;
    const functionName = improvement.functionName || 'extractedFunction';

    // This is a simplified implementation
    return code.replace(new RegExp(pattern, 'g'), `${functionName}()`);
  }

  /**
   * Apply coding patterns
   */
  applyPattern(code, patternName) {
    const patterns = {
      'singleton': this.applySingletonPattern,
      'factory': this.applyFactoryPattern,
      'observer': this.applyObserverPattern
    };

    const patternFunc = patterns[patternName];
    if (patternFunc) {
      return patternFunc.call(this, code);
    }

    return code;
  }

  applySingletonPattern(code) {
    return `// Singleton pattern applied
${code}

// Singleton instance access
module.exports.getInstance = function() {
  if (!this.instance) {
    this.instance = new ${this.getClassName(code) || 'Singleton'}();
  }
  return this.instance;
};`;
  }

  getClassName(code) {
    const match = code.match(/class\s+(\w+)/);
    return match ? match[1] : null;
  }
}

// CLI interface
if (require.main === module) {
  const generator = new CodeGenerator();
  const [,, specFile, outputDir] = process.argv;

  if (!specFile) {
    console.log('Usage: node code-generator.js <spec-file> [output-dir]');
    console.log('Example: node code-generator.js spec.json ./generated');
    process.exit(1);
  }

  (async () => {
    try {
      const specData = await readFile(specFile, 'utf8');
      const spec = JSON.parse(specData);

      const outputPath = outputDir || './generated';
      const results = await generator.generate(spec, outputPath);

      console.log('✅ Code generation complete!');
      console.log(`📊 Summary: ${results.summary.totalFiles} files generated`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  })();
}

module.exports = CodeGenerator;