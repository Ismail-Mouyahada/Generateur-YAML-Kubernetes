import { z } from 'zod';
import { ResourceConfig } from '../types/kubernetes';

const resourceSchema = z.object({
  resourceType: z.string().min(1, 'Resource type is required'),
  name: z.string()
    .min(1, 'Name is required')
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 'Name must be lowercase alphanumeric with optional hyphens'),
  namespace: z.string().min(1, 'Namespace is required'),
  replicas: z.number().min(0).optional(),
  image: z.string().optional(),
  port: z.number().min(1).max(65535).optional(),
  env: z.array(
    z.object({
      name: z.string().min(1, 'Environment variable name is required'),
      value: z.string(),
    })
  ),
});

export function validateResource(config: ResourceConfig): string[] {
  try {
    resourceSchema.parse(config);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map((err) => err.message);
    }
    return ['An unknown error occurred'];
  }
}