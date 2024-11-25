import React from 'react';
import { ResourceConfig } from '../types/kubernetes';

interface Template {
  name: string;
  description: string;
  config: Partial<ResourceConfig>;
}

const templates: Template[] = [
  {
    name: 'Web Application',
    description: 'Basic web application deployment with service',
    config: {
      resourceType: 'Deployment',
      name: 'web-app',
      replicas: 2,
      image: 'nginx:latest',
      port: 80,
      healthCheck: {
        enabled: true,
        path: '/health',
        port: 80,
      },
    },
  },
  {
    name: 'Database',
    description: 'Stateful database deployment with persistent storage',
    config: {
      resourceType: 'StatefulSet',
      name: 'database',
      replicas: 1,
      image: 'postgres:latest',
      port: 5432,
      env: [
        { name: 'POSTGRES_DB', value: 'myapp' },
        { name: 'POSTGRES_USER', value: 'admin' },
      ],
      volumes: [
        { name: 'data', type: 'PersistentVolumeClaim', size: '10Gi' },
      ],
    },
  },
];

interface Props {
  onSelect: (template: Partial<ResourceConfig>) => void;
}

export default function ResourceTemplates({ onSelect }: Props) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Templates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <button
            key={template.name}
            onClick={() => onSelect(template.config)}
            className="text-left p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <h4 className="font-medium text-blue-600">{template.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}