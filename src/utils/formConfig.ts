import { FormField } from '../types/kubernetes';

export const resourceFields: FormField[] = [
  {
    label: 'Resource Type',
    type: 'select',
    key: 'resourceType',
    options: ['Deployment', 'Service', 'ConfigMap', 'Secret', 'PersistentVolumeClaim'],
  },
  {
    label: 'Name',
    type: 'text',
    key: 'name',
    placeholder: 'my-application',
  },
  {
    label: 'Namespace',
    type: 'text',
    key: 'namespace',
    placeholder: 'default',
  },
  {
    label: 'Replicas',
    type: 'number',
    key: 'replicas',
    condition: (data) => data.resourceType === 'Deployment',
  },
  {
    label: 'Container Image',
    type: 'text',
    key: 'image',
    placeholder: 'nginx:latest',
    condition: (data) => data.resourceType === 'Deployment',
  },
  {
    label: 'Container Port',
    type: 'number',
    key: 'port',
    condition: (data) => ['Deployment', 'Service'].includes(data.resourceType),
  },
];