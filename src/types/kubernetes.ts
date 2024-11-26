export interface ResourceConfig {
  resourceType: string;
  name: string;
  namespace: string;
  replicas: number;
  image: string;
  port: number;
  labels: Record<string, string>;
  env: Array<{ name: string; value: string }>;
  volumes: Array<{ name: string; type: string; size?: string }>;
  configMapData?: Record<string, string>;
  secretData?: Record<string, string>;
  healthCheck?: {
    enabled: boolean;
    path: string;
    port: number;
    initialDelaySeconds?: number;
    periodSeconds?: number;
  };
  resources?: {
    requests: {
      cpu: string;
      memory: string;
    };
    limits: {
      cpu: string;
      memory: string;
    };
  };
  [key: string]: unknown; // Add index signature for dynamic access
}

export interface FormField {
  label: string;
  type: 'text' | 'number' | 'select';
  key: string;
  placeholder?: string;
  options?: string[];
  condition?: (data: ResourceConfig) => boolean;
}