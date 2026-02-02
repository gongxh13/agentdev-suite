#!/usr/bin/env node

/**
 * Deployment Agent
 *
 * Handles deployment planning, configuration management, and monitoring setup.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class DeploymentAgent {
  constructor(options = {}) {
    this.options = {
      environment: 'development',
      platform: 'docker',
      autoRollback: true,
      healthCheckTimeout: 30000,
      monitoringEnabled: true,
      ...options
    };

    this.deploymentPlans = [];
    this.configurations = {};
    this.monitoringConfig = null;
  }

  /**
   * Create deployment plan
   */
  async createPlan(application, targetEnv = 'production') {
    console.log(`📋 Creating deployment plan for ${application.name} to ${targetEnv}`);

    const plan = {
      id: `deploy-${Date.now()}`,
      application,
      targetEnvironment: targetEnv,
      timestamp: new Date().toISOString(),
      steps: [],
      rollbackSteps: [],
      validationChecks: [],
      estimatedDuration: 0
    };

    // Generate deployment steps based on platform
    plan.steps = this.generateDeploymentSteps(application, targetEnv);

    // Generate rollback steps
    if (this.options.autoRollback) {
      plan.rollbackSteps = this.generateRollbackSteps(plan.steps);
    }

    // Add validation checks
    plan.validationChecks = this.generateValidationChecks(application);

    // Calculate estimated duration
    plan.estimatedDuration = this.estimateDuration(plan.steps);

    this.deploymentPlans.push(plan);

    console.log(`✅ Deployment plan created: ${plan.id}`);
    console.log(`📊 Steps: ${plan.steps.length}, Estimated: ${plan.estimatedDuration}s`);

    return plan;
  }

  /**
   * Generate deployment steps based on platform
   */
  generateDeploymentSteps(application, targetEnv) {
    const platform = this.options.platform;
    const steps = [];

    // Common pre-deployment steps
    steps.push({
      id: 'prep-1',
      name: 'Validate configuration',
      command: 'validate-config',
      timeout: 5000,
      retry: 2
    });

    steps.push({
      id: 'prep-2',
      name: 'Check dependencies',
      command: 'check-dependencies',
      timeout: 10000
    });

    // Platform-specific steps
    switch (platform) {
      case 'docker':
        steps.push(...this.generateDockerSteps(application, targetEnv));
        break;
      case 'kubernetes':
        steps.push(...this.generateKubernetesSteps(application, targetEnv));
        break;
      case 'serverless':
        steps.push(...this.generateServerlessSteps(application, targetEnv));
        break;
      default:
        steps.push(...this.generateGenericSteps(application, targetEnv));
    }

    // Common post-deployment steps
    steps.push({
      id: 'post-1',
      name: 'Health check',
      command: 'health-check',
      timeout: this.options.healthCheckTimeout,
      retry: 3
    });

    steps.push({
      id: 'post-2',
      name: 'Update monitoring',
      command: 'update-monitoring',
      timeout: 5000
    });

    return steps;
  }

  /**
   * Generate Docker deployment steps
   */
  generateDockerSteps(application, targetEnv) {
    return [
      {
        id: 'docker-1',
        name: 'Build Docker image',
        command: `docker build -t ${application.name}:${targetEnv} .`,
        timeout: 300000
      },
      {
        id: 'docker-2',
        name: 'Push to registry',
        command: `docker push ${application.name}:${targetEnv}`,
        timeout: 120000
      },
      {
        id: 'docker-3',
        name: 'Deploy to Docker host',
        command: `docker-compose -f docker-compose.${targetEnv}.yml up -d`,
        timeout: 60000
      }
    ];
  }

  /**
   * Generate Kubernetes deployment steps
   */
  generateKubernetesSteps(application, targetEnv) {
    return [
      {
        id: 'k8s-1',
        name: 'Apply configurations',
        command: `kubectl apply -f k8s/${targetEnv}/`,
        timeout: 60000
      },
      {
        id: 'k8s-2',
        name: 'Rollout deployment',
        command: `kubectl rollout status deployment/${application.name}`,
        timeout: 300000
      }
    ];
  }

  /**
   * Generate generic deployment steps
   */
  generateGenericSteps(application, targetEnv) {
    return [
      {
        id: 'generic-1',
        name: 'Copy files',
        command: `rsync -avz ./ ${targetEnv}-server:/opt/${application.name}/`,
        timeout: 120000
      },
      {
        id: 'generic-2',
        name: 'Restart service',
        command: `ssh ${targetEnv}-server "systemctl restart ${application.name}"`,
        timeout: 30000
      }
    ];
  }

  /**
   * Generate rollback steps
   */
  generateRollbackSteps(deploymentSteps) {
    const rollbackSteps = [];

    // Reverse the deployment steps for rollback
    for (let i = deploymentSteps.length - 1; i >= 0; i--) {
      const step = deploymentSteps[i];
      const rollbackStep = this.createRollbackStep(step);

      if (rollbackStep) {
        rollbackSteps.push(rollbackStep);
      }
    }

    return rollbackSteps;
  }

  /**
   * Create rollback step for a deployment step
   */
  createRollbackStep(step) {
    // Simple rollback logic based on step type
    if (step.id.startsWith('docker-3')) {
      return {
        id: `rollback-${step.id}`,
        name: `Rollback ${step.name}`,
        command: 'docker-compose down',
        timeout: step.timeout
      };
    } else if (step.id.startsWith('k8s-2')) {
      return {
        id: `rollback-${step.id}`,
        name: `Rollback ${step.name}`,
        command: 'kubectl rollout undo',
        timeout: step.timeout
      };
    } else if (step.id.startsWith('generic-2')) {
      return {
        id: `rollback-${step.id}`,
        name: `Rollback ${step.name}`,
        command: `ssh server "systemctl stop ${step.service}"`,
        timeout: step.timeout
      };
    }

    return null;
  }

  /**
   * Generate validation checks
   */
  generateValidationChecks(application) {
    return [
      {
        id: 'val-1',
        name: 'Port availability',
        check: `check-port ${application.port || 3000}`,
        expected: 'available'
      },
      {
        id: 'val-2',
        name: 'Database connectivity',
        check: 'check-database',
        expected: 'connected'
      },
      {
        id: 'val-3',
        name: 'External dependencies',
        check: 'check-dependencies',
        expected: 'all_available'
      },
      {
        id: 'val-4',
        name: 'Disk space',
        check: 'check-disk-space',
        expected: 'sufficient'
      }
    ];
  }

  /**
   * Estimate deployment duration
   */
  estimateDuration(steps) {
    // Sum timeouts with some buffer
    const totalMs = steps.reduce((sum, step) => sum + (step.timeout || 30000), 0);
    return Math.ceil(totalMs / 1000); // Convert to seconds
  }

  /**
   * Manage configuration for environment
   */
  async manageConfiguration(appConfig, environment) {
    console.log(`⚙️ Managing configuration for ${environment} environment`);

    const config = {
      environment,
      application: appConfig.name,
      timestamp: new Date().toISOString(),
      variables: {},
      secrets: {},
      services: {}
    };

    // Process configuration based on environment
    switch (environment) {
      case 'development':
        config.variables = this.createDevConfig(appConfig);
        break;
      case 'staging':
        config.variables = this.createStagingConfig(appConfig);
        break;
      case 'production':
        config.variables = this.createProdConfig(appConfig);
        config.secrets = this.extractSecrets(appConfig);
        break;
    }

    // Add service configurations
    config.services = this.configureServices(appConfig, environment);

    // Store configuration
    this.configurations[environment] = config;

    // Generate configuration files
    await this.generateConfigFiles(config, environment);

    console.log(`✅ Configuration managed for ${environment}`);
    return config;
  }

  /**
   * Create development configuration
   */
  createDevConfig(appConfig) {
    return {
      NODE_ENV: 'development',
      DEBUG: appConfig.name + ':*',
      API_URL: 'http://localhost:3000',
      DATABASE_URL: 'mongodb://localhost:27017/dev',
      LOG_LEVEL: 'debug',
      CACHE_ENABLED: false
    };
  }

  /**
   * Create staging configuration
   */
  createStagingConfig(appConfig) {
    return {
      NODE_ENV: 'staging',
      DEBUG: 'app:*',
      API_URL: `https://staging.${appConfig.domain || 'example.com'}`,
      DATABASE_URL: process.env.STAGING_DB_URL || 'mongodb://staging-db:27017/staging',
      LOG_LEVEL: 'info',
      CACHE_ENABLED: true
    };
  }

  /**
   * Create production configuration
   */
  createProdConfig(appConfig) {
    return {
      NODE_ENV: 'production',
      DEBUG: '',
      API_URL: `https://${appConfig.domain || 'example.com'}`,
      DATABASE_URL: process.env.PROD_DB_URL,
      LOG_LEVEL: 'warn',
      CACHE_ENABLED: true,
      RATE_LIMIT: 100,
      SECURE_COOKIES: true
    };
  }

  /**
   * Extract secrets from configuration
   */
  extractSecrets(appConfig) {
    const secrets = {};

    // Identify potential secrets
    const secretPatterns = ['key', 'secret', 'token', 'password', 'auth'];

    Object.entries(appConfig).forEach(([key, value]) => {
      if (secretPatterns.some(pattern => key.toLowerCase().includes(pattern))) {
        secrets[key] = '[SECRET]';
      }
    });

    return secrets;
  }

  /**
   * Configure services
   */
  configureServices(appConfig, environment) {
    const services = {};

    if (appConfig.database) {
      services.database = {
        type: appConfig.database.type || 'mongodb',
        host: environment === 'production' ? 'prod-db-cluster' : `${environment}-db`,
        port: appConfig.database.port || 27017,
        name: `${appConfig.name}_${environment}`
      };
    }

    if (appConfig.cache) {
      services.cache = {
        type: 'redis',
        host: environment === 'production' ? 'redis-cluster' : 'redis',
        port: 6379
      };
    }

    if (appConfig.queue) {
      services.queue = {
        type: 'rabbitmq',
        host: environment === 'production' ? 'rabbitmq-cluster' : 'rabbitmq',
        port: 5672
      };
    }

    return services;
  }

  /**
   * Generate configuration files
   */
  async generateConfigFiles(config, environment) {
    const configDir = path.join(process.cwd(), 'config', environment);
    await this.ensureDir(configDir);

    // Generate .env file
    const envContent = Object.entries(config.variables)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    await writeFile(path.join(configDir, '.env'), envContent, 'utf8');

    // Generate services configuration
    const servicesContent = JSON.stringify(config.services, null, 2);
    await writeFile(path.join(configDir, 'services.json'), servicesContent, 'utf8');

    // Generate deployment configuration
    const deploymentConfig = {
      environment,
      application: config.application,
      variables: Object.keys(config.variables),
      services: Object.keys(config.services),
      secrets: Object.keys(config.secrets)
    };

    await writeFile(
      path.join(configDir, 'deployment.json'),
      JSON.stringify(deploymentConfig, null, 2),
      'utf8'
    );

    console.log(`📄 Configuration files generated in ${configDir}`);
  }

  /**
   * Setup monitoring for application
   */
  async setupMonitoring(application, environment) {
    if (!this.options.monitoringEnabled) {
      console.log('⚠️ Monitoring disabled by configuration');
      return null;
    }

    console.log(`📊 Setting up monitoring for ${application.name} in ${environment}`);

    this.monitoringConfig = {
      application: application.name,
      environment,
      timestamp: new Date().toISOString(),
      metrics: this.selectMetrics(application),
      alerts: this.configureAlerts(application, environment),
      dashboards: this.createDashboards(application),
      integrations: this.setupIntegrations()
    };

    // Generate monitoring configuration files
    await this.generateMonitoringConfig();

    console.log('✅ Monitoring setup complete');
    return this.monitoringConfig;
  }

  /**
   * Select metrics to monitor
   */
  selectMetrics(application) {
    const baseMetrics = [
      'cpu_usage',
      'memory_usage',
      'disk_usage',
      'network_io',
      'request_rate',
      'error_rate',
      'response_time',
      'uptime'
    ];

    const appSpecificMetrics = [];

    if (application.type === 'api') {
      appSpecificMetrics.push(
        'endpoint_availability',
        'api_latency',
        'concurrent_connections'
      );
    }

    if (application.database) {
      appSpecificMetrics.push(
        'db_connections',
        'query_performance',
        'replication_lag'
      );
    }

    if (application.cache) {
      appSpecificMetrics.push(
        'cache_hit_rate',
        'cache_memory_usage',
        'eviction_rate'
      );
    }

    return [...baseMetrics, ...appSpecificMetrics];
  }

  /**
   * Configure alerts
   */
  configureAlerts(application, environment) {
    const alerts = [
      {
        name: 'high_cpu',
        metric: 'cpu_usage',
        threshold: environment === 'production' ? 80 : 90,
        duration: '5m',
        severity: 'critical'
      },
      {
        name: 'high_memory',
        metric: 'memory_usage',
        threshold: 85,
        duration: '5m',
        severity: 'warning'
      },
      {
        name: 'high_error_rate',
        metric: 'error_rate',
        threshold: 5, // 5%
        duration: '10m',
        severity: 'critical'
      }
    ];

    if (application.type === 'api') {
      alerts.push({
        name: 'high_latency',
        metric: 'response_time',
        threshold: 1000, // 1 second
        duration: '5m',
        severity: 'warning'
      });
    }

    return alerts;
  }

  /**
   * Create dashboards
   */
  createDashboards(application) {
    return {
      overview: {
        title: `${application.name} - Overview`,
        panels: [
          { type: 'timeseries', metric: 'cpu_usage', title: 'CPU Usage' },
          { type: 'timeseries', metric: 'memory_usage', title: 'Memory Usage' },
          { type: 'stat', metric: 'request_rate', title: 'Requests/sec' },
          { type: 'stat', metric: 'error_rate', title: 'Error Rate' }
        ]
      },
      performance: {
        title: `${application.name} - Performance`,
        panels: [
          { type: 'timeseries', metric: 'response_time', title: 'Response Time' },
          { type: 'histogram', metric: 'response_time_distribution', title: 'Response Time Distribution' },
          { type: 'timeseries', metric: 'endpoint_availability', title: 'Endpoint Availability' }
        ]
      }
    };
  }

  /**
   * Setup integrations
   */
  setupIntegrations() {
    return {
      notification: ['slack', 'email'],
      ticketing: ['jira'],
      logging: ['elasticsearch', 'splunk'],
      tracing: ['jaeger', 'zipkin']
    };
  }

  /**
   * Generate monitoring configuration
   */
  async generateMonitoringConfig() {
    const monitoringDir = path.join(process.cwd(), 'monitoring');
    await this.ensureDir(monitoringDir);

    // Generate Prometheus config
    const prometheusConfig = this.generatePrometheusConfig();
    await writeFile(
      path.join(monitoringDir, 'prometheus.yml'),
      prometheusConfig,
      'utf8'
    );

    // Generate Grafana dashboards
    const dashboardsDir = path.join(monitoringDir, 'dashboards');
    await this.ensureDir(dashboardsDir);

    Object.entries(this.monitoringConfig.dashboards).forEach(async ([name, dashboard]) => {
      const dashboardConfig = JSON.stringify(dashboard, null, 2);
      await writeFile(
        path.join(dashboardsDir, `${name}.json`),
        dashboardConfig,
        'utf8'
      );
    });

    // Generate alert rules
    const alertRules = this.generateAlertRules();
    await writeFile(
      path.join(monitoringDir, 'alerts.yml'),
      alertRules,
      'utf8'
    );

    console.log(`📄 Monitoring configuration generated in ${monitoringDir}`);
  }

  /**
   * Generate Prometheus configuration
   */
  generatePrometheusConfig() {
    return `global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: '${this.monitoringConfig.application}'
    static_configs:
      - targets: ['localhost:9090']
    metrics_path: '/metrics'
    scheme: 'http'
`;
  }

  /**
   * Generate alert rules
   */
  generateAlertRules() {
    const rules = this.monitoringConfig.alerts.map(alert => `
- alert: ${alert.name}
  expr: ${alert.metric} > ${alert.threshold}
  for: ${alert.duration}
  labels:
    severity: ${alert.severity}
  annotations:
    summary: "High ${alert.metric}"
    description: "${alert.metric} is above threshold (${alert.threshold}) for ${alert.duration}"
`).join('');

    return `groups:
- name: ${this.monitoringConfig.application}
  rules:${rules}`;
  }

  /**
   * Execute deployment plan
   */
  async executePlan(planId) {
    const plan = this.deploymentPlans.find(p => p.id === planId);

    if (!plan) {
      throw new Error(`Deployment plan ${planId} not found`);
    }

    console.log(`🚀 Executing deployment plan: ${planId}`);
    console.log(`📦 Application: ${plan.application.name}`);
    console.log(`🌍 Environment: ${plan.targetEnvironment}`);

    const results = {
      planId,
      startTime: new Date().toISOString(),
      steps: [],
      status: 'in_progress'
    };

    try {
      // Execute each step
      for (const step of plan.steps) {
        const stepResult = await this.executeStep(step);
        results.steps.push(stepResult);

        if (!stepResult.success) {
          console.error(`❌ Step failed: ${step.name}`);

          // Execute rollback if enabled
          if (this.options.autoRollback) {
            console.log('🔄 Starting rollback...');
            await this.executeRollback(plan, results.steps);
          }

          results.status = 'failed';
          results.error = stepResult.error;
          break;
        }
      }

      if (results.status !== 'failed') {
        results.status = 'success';
        console.log('✅ Deployment completed successfully!');
      }
    } catch (error) {
      results.status = 'error';
      results.error = error.message;
      console.error(`💥 Deployment failed: ${error.message}`);
    }

    results.endTime = new Date().toISOString();
    results.duration = new Date(results.endTime) - new Date(results.startTime);

    return results;
  }

  /**
   * Execute a single step
   */
  async executeStep(step) {
    console.log(`  ▶️ Executing: ${step.name}`);

    // For demo purposes, simulate command execution
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate random success/failure
    const success = Math.random() > 0.1; // 90% success rate

    return {
      stepId: step.id,
      name: step.name,
      success,
      timestamp: new Date().toISOString(),
      duration: 1000,
      ...(success ? {} : { error: 'Simulated step failure' })
    };
  }

  /**
   * Execute rollback
   */
  async executeRollback(plan, executedSteps) {
    console.log('🔄 Executing rollback steps...');

    // Find and execute rollback steps in reverse order
    for (let i = executedSteps.length - 1; i >= 0; i--) {
      const step = executedSteps[i];
      const rollbackStep = plan.rollbackSteps.find(rs => rs.id === `rollback-${step.stepId}`);

      if (rollbackStep && step.success) {
        await this.executeStep(rollbackStep);
      }
    }

    console.log('✅ Rollback completed');
  }

  /**
   * Ensure directory exists
   */
  async ensureDir(dirPath) {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }
}

// CLI interface
if (require.main === module) {
  const agent = new DeploymentAgent();
  const [,, command, ...args] = process.argv;

  if (!command) {
    console.log('Usage: node deployment-agent.js <command> [args]');
    console.log('Commands:');
    console.log('  plan <app-config-json> [environment]');
    console.log('  config <app-config-json> <environment>');
    console.log('  monitor <app-config-json> <environment>');
    console.log('  execute <plan-id>');
    process.exit(1);
  }

  (async () => {
    try {
      switch (command) {
        case 'plan':
          const [planConfigFile, planEnv = 'production'] = args;
          if (!planConfigFile) {
            throw new Error('Application config file required');
          }
          const planConfig = JSON.parse(await readFile(planConfigFile, 'utf8'));
          const plan = await agent.createPlan(planConfig, planEnv);
          console.log('✅ Deployment plan created');
          console.log(`📄 Plan ID: ${plan.id}`);
          break;

        case 'config':
          const [configFile, configEnv] = args;
          if (!configFile || !configEnv) {
            throw new Error('Config file and environment required');
          }
          const appConfig = JSON.parse(await readFile(configFile, 'utf8'));
          const config = await agent.manageConfiguration(appConfig, configEnv);
          console.log('✅ Configuration managed');
          console.log(`📁 Config files generated in config/${configEnv}/`);
          break;

        case 'monitor':
          const [monitorFile, monitorEnv] = args;
          if (!monitorFile || !monitorEnv) {
            throw new Error('App config file and environment required');
          }
          const monitorConfig = JSON.parse(await readFile(monitorFile, 'utf8'));
          const monitoring = await agent.setupMonitoring(monitorConfig, monitorEnv);
          console.log('✅ Monitoring setup complete');
          console.log(`📊 Metrics configured: ${monitoring.metrics.length}`);
          break;

        case 'execute':
          const [planId] = args;
          if (!planId) {
            throw new Error('Plan ID required');
          }
          const result = await agent.executePlan(planId);
          console.log('✅ Deployment execution complete');
          console.log(`📊 Status: ${result.status}`);
          console.log(`⏱️ Duration: ${result.duration}ms`);
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

module.exports = DeploymentAgent;