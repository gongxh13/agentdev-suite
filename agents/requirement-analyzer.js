#!/usr/bin/env node

/**
 * Requirement Analyzer Agent
 *
 * Analyzes software requirements from natural language input and produces
 * structured specifications, acceptance criteria, and priority rankings.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class RequirementAnalyzer {
  constructor(options = {}) {
    this.options = {
      outputFormat: 'json',
      includeAcceptanceCriteria: true,
      prioritizeRequirements: true,
      validateAgainstConstraints: true,
      ...options
    };

    this.constraints = [];
    this.requirements = [];
    this.analysisResults = null;
  }

  /**
   * Load constraints from file or configuration
   */
  async loadConstraints(constraintsPath) {
    try {
      if (constraintsPath && fs.existsSync(constraintsPath)) {
        const data = await readFile(constraintsPath, 'utf8');
        this.constraints = JSON.parse(data);
      } else {
        // Default constraints
        this.constraints = [
          { type: 'technical', description: 'Must use existing technology stack' },
          { type: 'business', description: 'Must align with business objectives' },
          { type: 'regulatory', description: 'Must comply with relevant regulations' }
        ];
      }
    } catch (error) {
      console.error(`Error loading constraints: ${error.message}`);
      this.constraints = [];
    }
  }

  /**
   * Analyze requirements from text input
   */
  async analyze(text, context = {}) {
    console.log('🔍 Analyzing requirements...');

    // Parse requirements from text
    this.requirements = this.extractRequirements(text);

    // Structure requirements
    const structuredReqs = this.structureRequirements(this.requirements);

    // Add acceptance criteria
    if (this.options.includeAcceptanceCriteria) {
      structuredReqs.forEach(req => {
        req.acceptanceCriteria = this.generateAcceptanceCriteria(req);
      });
    }

    // Prioritize requirements
    if (this.options.prioritizeRequirements) {
      structuredReqs.forEach(req => {
        req.priority = this.calculatePriority(req, context);
      });
      structuredReqs.sort((a, b) => b.priority.score - a.priority.score);
    }

    // Validate against constraints
    if (this.options.validateAgainstConstraints) {
      structuredReqs.forEach(req => {
        req.validation = this.validateRequirement(req);
      });
    }

    this.analysisResults = {
      timestamp: new Date().toISOString(),
      totalRequirements: structuredReqs.length,
      requirements: structuredReqs,
      summary: this.generateSummary(structuredReqs),
      recommendations: this.generateRecommendations(structuredReqs)
    };

    return this.analysisResults;
  }

  /**
   * Extract individual requirements from text
   */
  extractRequirements(text) {
    const lines = text.split('\n');
    const requirements = [];

    lines.forEach(line => {
      line = line.trim();
      if (!line) return;

      // Simple heuristic for requirement detection
      if (line.toLowerCase().includes('must') ||
          line.toLowerCase().includes('should') ||
          line.toLowerCase().includes('need') ||
          line.toLowerCase().includes('require')) {
        requirements.push(line);
      }
    });

    return requirements;
  }

  /**
   * Structure raw requirements into formal format
   */
  structureRequirements(rawReqs) {
    return rawReqs.map((req, index) => ({
      id: `REQ-${index + 1}`,
      description: req,
      type: this.classifyRequirementType(req),
      source: 'user-input',
      stakeholders: this.extractStakeholders(req),
      dependencies: [],
      complexity: this.estimateComplexity(req),
      effortEstimate: this.estimateEffort(req)
    }));
  }

  /**
   * Classify requirement type
   */
  classifyRequirementType(req) {
    const reqLower = req.toLowerCase();

    if (reqLower.includes('user') || reqLower.includes('interface') || reqLower.includes('ui')) {
      return 'functional-ui';
    } else if (reqLower.includes('api') || reqLower.includes('endpoint') || reqLower.includes('service')) {
      return 'functional-api';
    } else if (reqLower.includes('performance') || reqLower.includes('speed') || reqLower.includes('time')) {
      return 'non-functional-performance';
    } else if (reqLower.includes('security') || reqLower.includes('auth') || reqLower.includes('access')) {
      return 'non-functional-security';
    } else if (reqLower.includes('data') || reqLower.includes('database') || reqLower.includes('store')) {
      return 'data';
    } else {
      return 'functional-general';
    }
  }

  /**
   * Extract stakeholders from requirement text
   */
  extractStakeholders(req) {
    const stakeholders = [];
    const reqLower = req.toLowerCase();

    if (reqLower.includes('user')) stakeholders.push('end-user');
    if (reqLower.includes('admin')) stakeholders.push('administrator');
    if (reqLower.includes('developer')) stakeholders.push('developer');
    if (reqLower.includes('business')) stakeholders.push('business-owner');

    return stakeholders.length > 0 ? stakeholders : ['end-user'];
  }

  /**
   * Estimate complexity of requirement
   */
  estimateComplexity(req) {
    const length = req.split(' ').length;
    const keywordCount = ['must', 'should', 'and', 'or', 'if', 'then'].filter(word =>
      req.toLowerCase().includes(word)
    ).length;

    if (length > 30 || keywordCount > 3) return 'high';
    if (length > 15 || keywordCount > 1) return 'medium';
    return 'low';
  }

  /**
   * Estimate effort for implementation
   */
  estimateEffort(req) {
    const complexity = this.estimateComplexity(req);
    const type = this.classifyRequirementType(req);

    // Simple estimation matrix
    const estimates = {
      'functional-ui': { low: 2, medium: 5, high: 8 },
      'functional-api': { low: 1, medium: 3, high: 5 },
      'non-functional-performance': { low: 3, medium: 6, high: 10 },
      'non-functional-security': { low: 4, medium: 8, high: 12 },
      'data': { low: 2, medium: 4, high: 6 },
      'functional-general': { low: 1, medium: 3, high: 5 }
    };

    return estimates[type][complexity] || 3;
  }

  /**
   * Generate acceptance criteria for a requirement
   */
  generateAcceptanceCriteria(req) {
    const criteria = [];

    // Basic criteria based on requirement type
    criteria.push(`✅ ${req.description} is implemented correctly`);

    if (req.type.includes('functional')) {
      criteria.push(`✅ Functionality works as specified without errors`);
      criteria.push(`✅ Edge cases are handled appropriately`);
    }

    if (req.type.includes('non-functional')) {
      criteria.push(`✅ Performance/security requirements are met`);
      criteria.push(`✅ Metrics are within acceptable ranges`);
    }

    if (req.type.includes('ui')) {
      criteria.push(`✅ User interface is intuitive and responsive`);
      criteria.push(`✅ Accessibility standards are met`);
    }

    return criteria;
  }

  /**
   * Calculate priority score for requirement
   */
  calculatePriority(req, context) {
    let score = 0;

    // Business value (higher for more stakeholders)
    score += req.stakeholders.length * 10;

    // Complexity penalty (lower priority for high complexity)
    if (req.complexity === 'high') score -= 5;
    if (req.complexity === 'low') score += 5;

    // Type-based priority
    if (req.type.includes('security')) score += 15;
    if (req.type.includes('performance')) score += 10;

    // Contextual factors
    if (context.urgent === true) score += 20;
    if (context.deadline) score += 10;

    // Categorize priority
    let level;
    if (score >= 30) level = 'critical';
    else if (score >= 20) level = 'high';
    else if (score >= 10) level = 'medium';
    else level = 'low';

    return { score, level };
  }

  /**
   * Validate requirement against constraints
   */
  validateRequirement(req) {
    const issues = [];

    this.constraints.forEach(constraint => {
      // Simple keyword matching for validation
      if (constraint.type === 'technical' && req.description.toLowerCase().includes('new technology')) {
        issues.push(`May violate technical constraint: ${constraint.description}`);
      }
      if (constraint.type === 'business' && req.description.toLowerCase().includes('competing')) {
        issues.push(`May violate business constraint: ${constraint.description}`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
      constraintsChecked: this.constraints.length
    };
  }

  /**
   * Generate summary of analysis
   */
  generateSummary(requirements) {
    const typeCount = {};
    const priorityCount = { critical: 0, high: 0, medium: 0, low: 0 };
    let totalEffort = 0;

    requirements.forEach(req => {
      typeCount[req.type] = (typeCount[req.type] || 0) + 1;
      if (req.priority) {
        priorityCount[req.priority.level] = (priorityCount[req.priority.level] || 0) + 1;
      }
      totalEffort += req.effortEstimate || 0;
    });

    return {
      totalRequirements: requirements.length,
      typeDistribution: typeCount,
      priorityDistribution: priorityCount,
      totalEffortEstimate: totalEffort,
      averageComplexity: this.calculateAverageComplexity(requirements)
    };
  }

  /**
   * Calculate average complexity
   */
  calculateAverageComplexity(requirements) {
    const scores = { low: 1, medium: 2, high: 3 };
    const total = requirements.reduce((sum, req) => sum + (scores[req.complexity] || 1), 0);
    return total / requirements.length;
  }

  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations(requirements) {
    const recommendations = [];

    // Check for high complexity requirements
    const highComplexity = requirements.filter(req => req.complexity === 'high');
    if (highComplexity.length > 0) {
      recommendations.push(`Consider breaking down ${highComplexity.length} high-complexity requirements into smaller tasks`);
    }

    // Check for validation issues
    const invalidReqs = requirements.filter(req => req.validation && !req.validation.isValid);
    if (invalidReqs.length > 0) {
      recommendations.push(`Review ${invalidReqs.length} requirements that may violate constraints`);
    }

    // Resource allocation suggestion
    const totalEffort = requirements.reduce((sum, req) => sum + (req.effortEstimate || 0), 0);
    if (totalEffort > 40) {
      recommendations.push(`Total effort estimate is ${totalEffort} points - consider phased implementation`);
    }

    return recommendations;
  }

  /**
   * Save analysis results to file
   */
  async saveResults(outputPath) {
    if (!this.analysisResults) {
      throw new Error('No analysis results to save. Run analyze() first.');
    }

    const output = this.options.outputFormat === 'json'
      ? JSON.stringify(this.analysisResults, null, 2)
      : this.formatAsMarkdown(this.analysisResults);

    await writeFile(outputPath, output, 'utf8');
    console.log(`📄 Results saved to: ${outputPath}`);
  }

  /**
   * Format results as markdown
   */
  formatAsMarkdown(results) {
    let markdown = `# Requirements Analysis Report\n\n`;
    markdown += `**Generated:** ${results.timestamp}\n\n`;

    markdown += `## Summary\n`;
    markdown += `- Total Requirements: ${results.totalRequirements}\n`;
    markdown += `- Total Effort Estimate: ${results.summary.totalEffortEstimate} points\n\n`;

    markdown += `## Requirements\n\n`;
    results.requirements.forEach(req => {
      markdown += `### ${req.id}: ${req.description}\n`;
      markdown += `- **Type:** ${req.type}\n`;
      markdown += `- **Complexity:** ${req.complexity}\n`;
      markdown += `- **Effort:** ${req.effortEstimate} points\n`;
      if (req.priority) {
        markdown += `- **Priority:** ${req.priority.level} (score: ${req.priority.score})\n`;
      }
      if (req.acceptanceCriteria) {
        markdown += `- **Acceptance Criteria:**\n`;
        req.acceptanceCriteria.forEach(criterion => {
          markdown += `  - ${criterion}\n`;
        });
      }
      markdown += `\n`;
    });

    if (results.recommendations.length > 0) {
      markdown += `## Recommendations\n\n`;
      results.recommendations.forEach(rec => {
        markdown += `- ${rec}\n`;
      });
    }

    return markdown;
  }
}

// CLI interface
if (require.main === module) {
  const analyzer = new RequirementAnalyzer();
  const [,, inputFile, outputFile] = process.argv;

  if (!inputFile) {
    console.log('Usage: node requirement-analyzer.js <input-file> [output-file]');
    console.log('Example: node requirement-analyzer.js requirements.txt analysis.json');
    process.exit(1);
  }

  (async () => {
    try {
      const text = await readFile(inputFile, 'utf8');
      const results = await analyzer.analyze(text);

      const outputPath = outputFile || 'requirement-analysis.json';
      await analyzer.saveResults(outputPath);

      console.log('✅ Analysis complete!');
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  })();
}

module.exports = RequirementAnalyzer;