#!/usr/bin/env node

/**
 * Review Agent
 *
 * Performs automated code reviews and quality checks.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class ReviewAgent {
  constructor(options = {}) {
    this.options = {
      checkStyle: true,
      checkComplexity: true,
      checkSecurity: true,
      checkPerformance: true,
      checkDocumentation: true,
      maxCyclomaticComplexity: 10,
      maxLineLength: 100,
      ...options
    };

    this.rules = this.loadRules();
    this.reviewResults = [];
  }

  /**
   * Load review rules
   */
  loadRules() {
    return {
      style: [
        {
          id: 'indentation',
          description: 'Use consistent indentation (2 spaces)',
          check: (code) => {
            const lines = code.split('\n');
            const invalid = lines.filter(line => line.startsWith(' ') && !line.startsWith('  '));
            return invalid.length === 0;
          }
        },
        {
          id: 'line_length',
          description: 'Lines should not exceed maximum length',
          check: (code) => {
            const lines = code.split('\n');
            const longLines = lines.filter(line => line.length > this.options.maxLineLength);
            return longLines.length === 0;
          }
        }
      ],
      complexity: [
        {
          id: 'cyclomatic_complexity',
          description: 'Functions should have low cyclomatic complexity',
          check: (code) => {
            // Simplified complexity check
            const complexityIndicators = ['if', 'else', 'for', 'while', 'case', 'catch'];
            let complexity = 1; // Base complexity

            complexityIndicators.forEach(indicator => {
              const regex = new RegExp(`\\b${indicator}\\b`, 'g');
              const matches = code.match(regex);
              if (matches) complexity += matches.length;
            });

            return complexity <= this.options.maxCyclomaticComplexity;
          }
        }
      ],
      security: [
        {
          id: 'eval_usage',
          description: 'Avoid eval() function usage',
          check: (code) => !code.includes('eval(')
        },
        {
          id: 'console_log',
          description: 'Avoid console.log in production code',
          check: (code) => !code.includes('console.log(')
        }
      ],
      documentation: [
        {
          id: 'function_comments',
          description: 'Functions should have documentation comments',
          check: (code) => {
            const functionPattern = /function\s+\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>|class\s+\w+/g;
            const commentPattern = /\/\*\*[\s\S]*?\*\//g;

            const functions = code.match(functionPattern) || [];
            const comments = code.match(commentPattern) || [];

            // Simple check: at least one comment per two functions
            return comments.length >= Math.floor(functions.length / 2);
          }
        }
      ]
    };
  }

  /**
   * Review code file
   */
  async reviewFile(filePath) {
    console.log(`🔍 Reviewing: ${filePath}`);

    const code = await readFile(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const fileType = this.getFileType(fileName);

    const review = {
      file: filePath,
      type: fileType,
      timestamp: new Date().toISOString(),
      checks: {},
      issues: [],
      metrics: this.calculateMetrics(code),
      score: 0
    };

    // Run all checks
    Object.entries(this.rules).forEach(([category, rules]) => {
      if (this.options[`check${category.charAt(0).toUpperCase() + category.slice(1)}`]) {
        review.checks[category] = this.runChecks(rules, code, category);
        review.issues.push(...review.checks[category].filter(c => !c.passed));
      }
    });

    // Calculate overall score
    review.score = this.calculateScore(review);
    review.passed = review.score >= 80;

    this.reviewResults.push(review);

    return review;
  }

  /**
   * Run checks for a rule category
   */
  runChecks(rules, code, category) {
    return rules.map(rule => {
      const passed = rule.check(code);
      return {
        rule: rule.id,
        description: rule.description,
        category,
        passed,
        recommendation: passed ? null : this.getRecommendation(rule.id)
      };
    });
  }

  /**
   * Get recommendation for failed check
   */
  getRecommendation(ruleId) {
    const recommendations = {
      indentation: 'Use 2 spaces for indentation consistently',
      line_length: 'Break long lines into multiple lines',
      cyclomatic_complexity: 'Refactor complex functions into smaller ones',
      eval_usage: 'Use alternative approaches instead of eval()',
      console_log: 'Use proper logging library instead of console.log',
      function_comments: 'Add JSDoc comments to functions'
    };

    return recommendations[ruleId] || 'Review and fix the issue';
  }

  /**
   * Calculate code metrics
   */
  calculateMetrics(code) {
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    const commentLines = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('/*'));

    // Count functions
    const functionPatterns = [
      /function\s+\w+/g,
      /const\s+\w+\s*=\s*\([^)]*\)\s*=>/g,
      /class\s+\w+/g
    ];

    let functionCount = 0;
    functionPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) functionCount += matches.length;
    });

    return {
      lines: lines.length,
      nonEmptyLines: nonEmptyLines.length,
      commentLines: commentLines.length,
      functions: functionCount,
      commentRatio: lines.length > 0 ? (commentLines.length / lines.length) * 100 : 0
    };
  }

  /**
   * Calculate review score
   */
  calculateScore(review) {
    let totalChecks = 0;
    let passedChecks = 0;

    Object.values(review.checks).forEach(categoryChecks => {
      categoryChecks.forEach(check => {
        totalChecks++;
        if (check.passed) passedChecks++;
      });
    });

    if (totalChecks === 0) return 100;

    // Base score from checks
    let score = (passedChecks / totalChecks) * 70;

    // Bonus for good metrics
    const metrics = review.metrics;
    if (metrics.commentRatio > 20) score += 10;
    if (metrics.functions > 0 && metrics.lines / metrics.functions < 50) score += 10;
    if (metrics.nonEmptyLines / metrics.lines > 0.8) score += 10;

    return Math.min(100, Math.round(score));
  }

  /**
   * Get file type from extension
   */
  getFileType(fileName) {
    const extension = path.extname(fileName).toLowerCase();

    const types = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.py': 'python',
      '.java': 'java',
      '.go': 'go',
      '.rs': 'rust'
    };

    return types[extension] || 'unknown';
  }

  /**
   * Review multiple files
   */
  async reviewFiles(filePaths) {
    console.log(`📁 Reviewing ${filePaths.length} files...`);

    const results = [];

    for (const filePath of filePaths) {
      try {
        const review = await this.reviewFile(filePath);
        results.push(review);
        console.log(`  ${review.passed ? '✅' : '❌'} ${path.basename(filePath)}: ${review.score}/100`);
      } catch (error) {
        console.error(`  ⚠️ Failed to review ${filePath}: ${error.message}`);
      }
    }

    const summary = this.generateSummary(results);

    return {
      results,
      summary,
      totalFiles: results.length,
      passedFiles: results.filter(r => r.passed).length,
      failedFiles: results.filter(r => !r.passed).length
    };
  }

  /**
   * Generate review summary
   */
  generateSummary(results) {
    if (results.length === 0) {
      return {
        averageScore: 0,
        issuesByCategory: {},
        totalIssues: 0
      };
    }

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore = Math.round(totalScore / results.length);

    // Count issues by category
    const issuesByCategory = {};
    results.forEach(review => {
      review.issues.forEach(issue => {
        if (!issuesByCategory[issue.category]) {
          issuesByCategory[issue.category] = 0;
        }
        issuesByCategory[issue.category]++;
      });
    });

    const totalIssues = Object.values(issuesByCategory).reduce((a, b) => a + b, 0);

    return {
      averageScore,
      issuesByCategory,
      totalIssues,
      recommendations: this.generateRecommendations(results)
    };
  }

  /**
   * Generate recommendations based on review results
   */
  generateRecommendations(results) {
    const recommendations = [];

    // Check for common issues
    const allIssues = results.flatMap(r => r.issues);
    const issueCounts = {};

    allIssues.forEach(issue => {
      issueCounts[issue.rule] = (issueCounts[issue.rule] || 0) + 1;
    });

    // Generate recommendations for frequent issues
    Object.entries(issueCounts).forEach(([rule, count]) => {
      if (count > results.length * 0.3) { // Issue in >30% of files
        recommendations.push({
          issue: rule,
          count,
          recommendation: this.getRecommendation(rule),
          priority: 'high'
        });
      } else if (count > 0) {
        recommendations.push({
          issue: rule,
          count,
          recommendation: this.getRecommendation(rule),
          priority: 'medium'
        });
      }
    });

    // Check overall metrics
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    if (avgScore < 70) {
      recommendations.push({
        issue: 'low_overall_score',
        recommendation: 'Overall code quality needs improvement. Consider refactoring and adding more tests.',
        priority: 'high'
      });
    }

    return recommendations;
  }

  /**
   * Generate improvement suggestions
   */
  async suggestImprovements(code, context = {}) {
    console.log('💡 Generating improvement suggestions...');

    const suggestions = [];

    // Complexity analysis
    const complexity = this.analyzeComplexity(code);
    if (complexity > this.options.maxCyclomaticComplexity) {
      suggestions.push({
        type: 'refactoring',
        description: 'Function is too complex',
        details: `Cyclomatic complexity: ${complexity} (max: ${this.options.maxCyclomaticComplexity})`,
        suggestion: 'Break into smaller functions'
      });
    }

    // Length analysis
    const lines = code.split('\n');
    const longLines = lines.filter(line => line.length > this.options.maxLineLength);
    if (longLines.length > 0) {
      suggestions.push({
        type: 'style',
        description: 'Lines too long',
        details: `${longLines.length} lines exceed ${this.options.maxLineLength} characters`,
        suggestion: 'Break long lines or refactor'
      });
    }

    // Documentation check
    const documentedFunctions = this.countDocumentedFunctions(code);
    const totalFunctions = this.countTotalFunctions(code);
    if (totalFunctions > 0 && documentedFunctions / totalFunctions < 0.5) {
      suggestions.push({
        type: 'documentation',
        description: 'Insufficient documentation',
        details: `${documentedFunctions}/${totalFunctions} functions documented`,
        suggestion: 'Add JSDoc comments to functions'
      });
    }

    // Performance suggestions
    const perfIssues = this.analyzePerformance(code);
    suggestions.push(...perfIssues);

    return {
      suggestions,
      total: suggestions.length,
      byType: this.groupSuggestionsByType(suggestions)
    };
  }

  /**
   * Analyze code complexity
   */
  analyzeComplexity(code) {
    const complexityIndicators = ['if', 'else', 'for', 'while', 'case', 'catch', '&&', '||'];
    let complexity = 1;

    complexityIndicators.forEach(indicator => {
      const regex = new RegExp(`\\b${indicator}\\b`, 'g');
      const matches = code.match(regex);
      if (matches) complexity += matches.length;
    });

    return complexity;
  }

  /**
   * Count documented functions
   */
  countDocumentedFunctions(code) {
    const functionPattern = /function\s+\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>|class\s+\w+/g;
    const commentPattern = /\/\*\*[\s\S]*?\*\//g;

    const functions = code.match(functionPattern) || [];
    const comments = code.match(commentPattern) || [];

    // Simple approximation
    return Math.min(functions.length, comments.length);
  }

  /**
   * Count total functions
   */
  countTotalFunctions(code) {
    const functionPatterns = [
      /function\s+\w+/g,
      /const\s+\w+\s*=\s*\([^)]*\)\s*=>/g,
      /class\s+\w+/g
    ];

    let count = 0;
    functionPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) count += matches.length;
    });

    return count;
  }

  /**
   * Analyze performance issues
   */
  analyzePerformance(code) {
    const suggestions = [];

    // Check for nested loops
    const nestedLoopPattern = /for\s*\([^)]*\)\s*{[^}]*for\s*\([^)]*\)/g;
    if (nestedLoopPattern.test(code)) {
      suggestions.push({
        type: 'performance',
        description: 'Nested loops detected',
        details: 'Nested loops can cause O(n²) complexity',
        suggestion: 'Consider using more efficient algorithms or data structures'
      });
    }

    // Check for expensive operations in loops
    if (code.includes('.innerHTML') && code.includes('for') || code.includes('.innerHTML') && code.includes('while')) {
      suggestions.push({
        type: 'performance',
        description: 'DOM manipulation in loops',
        details: 'DOM operations are expensive inside loops',
        suggestion: 'Use document fragments or batch DOM updates'
      });
    }

    return suggestions;
  }

  /**
   * Group suggestions by type
   */
  groupSuggestionsByType(suggestions) {
    const groups = {};

    suggestions.forEach(suggestion => {
      if (!groups[suggestion.type]) {
        groups[suggestion.type] = [];
      }
      groups[suggestion.type].push(suggestion);
    });

    return groups;
  }

  /**
   * Generate review report
   */
  async generateReport(results, outputPath) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: results.summary,
      files: results.results.map(r => ({
        file: r.file,
        score: r.score,
        passed: r.passed,
        issues: r.issues.length,
        metrics: r.metrics
      })),
      recommendations: results.summary.recommendations
    };

    const reportContent = JSON.stringify(report, null, 2);
    await writeFile(outputPath, reportContent, 'utf8');

    console.log(`📄 Review report saved to: ${outputPath}`);

    return report;
  }
}

// CLI interface
if (require.main === module) {
  const reviewer = new ReviewAgent();
  const [,, command, ...args] = process.argv;

  if (!command) {
    console.log('Usage: node review-agent.js <command> [args]');
    console.log('Commands:');
    console.log('  review <files...>');
    console.log('  suggest <code-file>');
    console.log('  report <review-results-json> <output-file>');
    process.exit(1);
  }

  (async () => {
    try {
      switch (command) {
        case 'review':
          if (args.length === 0) {
            throw new Error('At least one file required');
          }
          const results = await reviewer.reviewFiles(args);
          console.log('✅ Review complete!');
          console.log(`📊 Summary: ${results.passedFiles}/${results.totalFiles} files passed`);
          console.log(`📈 Average score: ${results.summary.averageScore}/100`);
          break;

        case 'suggest':
          const [codeFile] = args;
          if (!codeFile) {
            throw new Error('Code file required');
          }
          const code = await readFile(codeFile, 'utf8');
          const suggestions = await reviewer.suggestImprovements(code);
          console.log('✅ Suggestions generated!');
          console.log(`📋 Found ${suggestions.total} suggestions`);
          suggestions.suggestions.forEach(s => {
            console.log(`\n${s.type.toUpperCase()}: ${s.description}`);
            console.log(`  ${s.suggestion}`);
          });
          break;

        case 'report':
          const [inputFile, outputFile] = args;
          if (!inputFile || !outputFile) {
            throw new Error('Input and output files required');
          }
          const reviewData = await readFile(inputFile, 'utf8');
          const reviewResults = JSON.parse(reviewData);
          await reviewer.generateReport(reviewResults, outputFile);
          console.log('✅ Report generated!');
          break;

        default:
          console.error(`Unknown command: ${command}`);
          process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  })();
}

module.exports = ReviewAgent;