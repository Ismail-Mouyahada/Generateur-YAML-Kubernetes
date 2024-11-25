import { dump } from 'js-yaml';
import { ResourceConfig } from '../types/kubernetes';

function sanitizeConfig(config: ResourceConfig) {
  const sanitized = { ...config };
  Object.keys(sanitized).forEach((key) => {
    if (sanitized[key] === undefined || sanitized[key] === '') {
      delete sanitized[key];
    }
  });
  return sanitized;
}

export function generateYAML(config: ResourceConfig): string {
  const sanitizedConfig = sanitizeConfig(config);
  
  switch (config.resourceType) {
    case 'Deployment':
      return generateDeployment(sanitizedConfig);
    case 'Service':
      return generateService(sanitizedConfig);
    case 'ConfigMap':
      return generateConfigMap(sanitizedConfig);
    case 'Secret':
      return generateSecret(sanitizedConfig);
    case 'PersistentVolumeClaim':
      return generatePVC(sanitizedConfig);
    default:
      return '# Resource type not supported';
  }
}

function generateDeployment(config: ResourceConfig): string {
  const deployment = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: config.name,
      namespace: config.namespace,
      labels: {
        app: config.name,
        ...config.labels,
      },
    },
    spec: {
      replicas: config.replicas,
      selector: {
        matchLabels: {
          app: config.name,
        },
      },
      template: {
        metadata: {
          labels: {
            app: config.name,
            ...config.labels,
          },
        },
        spec: {
          containers: [
            {
              name: config.name,
              image: config.image,
              ports: [
                {
                  containerPort: config.port,
                },
              ],
              ...(config.env.length > 0 && {
                env: config.env,
              }),
              ...(config.healthCheck?.enabled && {
                livenessProbe: {
                  httpGet: {
                    path: config.healthCheck.path,
                    port: config.healthCheck.port,
                  },
                  initialDelaySeconds: config.healthCheck.initialDelaySeconds,
                  periodSeconds: config.healthCheck.periodSeconds,
                },
                readinessProbe: {
                  httpGet: {
                    path: config.healthCheck.path,
                    port: config.healthCheck.port,
                  },
                  initialDelaySeconds: config.healthCheck.initialDelaySeconds,
                  periodSeconds: config.healthCheck.periodSeconds,
                },
              }),
              resources: config.resources,
            },
          ],
        },
      },
    },
  };

  return dump(deployment, { indent: 2 });
}

function generateService(config: ResourceConfig): string {
  const service = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: config.name,
      namespace: config.namespace,
      labels: {
        app: config.name,
        ...config.labels,
      },
    },
    spec: {
      selector: {
        app: config.name,
      },
      ports: [
        {
          protocol: 'TCP',
          port: config.port,
          targetPort: config.port,
        },
      ],
      type: 'ClusterIP',
    },
  };

  return dump(service, { indent: 2 });
}

function generateConfigMap(config: ResourceConfig): string {
  const configMap = {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {
      name: config.name,
      namespace: config.namespace,
    },
    data: config.configMapData || {},
  };

  return dump(configMap, { indent: 2 });
}

function generateSecret(config: ResourceConfig): string {
  const secret = {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name: config.name,
      namespace: config.namespace,
    },
    type: 'Opaque',
    data: Object.entries(config.secretData || {}).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: Buffer.from(value).toString('base64'),
      }),
      {}
    ),
  };

  return dump(secret, { indent: 2 });
}

function generatePVC(config: ResourceConfig): string {
  const pvc = {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      name: config.name,
      namespace: config.namespace,
    },
    spec: {
      accessModes: ['ReadWriteOnce'],
      resources: {
        requests: {
          storage: config.volumes[0]?.size || '1Gi',
        },
      },
      storageClassName: 'standard',
    },
  };

  return dump(pvc, { indent: 2 });
}