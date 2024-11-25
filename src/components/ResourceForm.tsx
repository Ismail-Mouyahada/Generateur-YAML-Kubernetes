import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { generateYAML } from '../utils/yamlGenerator';
import { validateResource } from '../utils/validator';
import { ResourceConfig } from '../types/kubernetes';
import FormField from './FormField';
import { resourceFields } from '../utils/formConfig';
import ResourceTemplates from './ResourceTemplates';
import YAMLActions from './YAMLActions';

SyntaxHighlighter.registerLanguage('yaml', yaml);

const initialConfig: ResourceConfig = {
  resourceType: 'Deployment',
  name: '',
  namespace: 'default',
  replicas: 1,
  image: '',
  port: 80,
  labels: {},
  env: [],
  volumes: [],
};

export default function ResourceForm() {
  const [formData, setFormData] = useState<ResourceConfig>(initialConfig);
  const [generatedYAML, setGeneratedYAML] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFieldChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTemplateSelect = (template: Partial<ResourceConfig>) => {
    setFormData((prev) => ({
      ...prev,
      ...template,
    }));
    generateAndValidate({
      ...formData,
      ...template,
    });
    toast.success('Template applied successfully');
  };

  const generateAndValidate = (config: ResourceConfig) => {
    const errors = validateResource(config);
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      const yaml = generateYAML(config);
      setGeneratedYAML(yaml);
    }
  };

  React.useEffect(() => {
    generateAndValidate(formData);
  }, [formData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Resource Configuration</h2>
            <p className="text-gray-600">Configure your Kubernetes resources with our intuitive form</p>
          </div>
          
          <ResourceTemplates onSelect={handleTemplateSelect} />
          
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2 text-red-600 mb-2">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-medium">Validation Errors</h3>
              </div>
              <ul className="list-disc list-inside space-y-1 text-red-600">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            {resourceFields.map((field) => (
              !field.condition || field.condition(formData) ? (
                <FormField
                  key={field.key}
                  field={field}
                  value={formData[field.key as keyof ResourceConfig]}
                  onChange={(value) => handleFieldChange(field.key, value)}
                />
              ) : null
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Generated YAML</h2>
            <p className="text-gray-600">Your Kubernetes configuration in YAML format</p>
          </div>
          <YAMLActions yaml={generatedYAML} config={formData} />
        </div>
        <div className="bg-gray-50 rounded-lg overflow-auto max-h-[calc(100vh-24rem)] border border-gray-200">
          <SyntaxHighlighter
            language="yaml"
            style={githubGist}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              background: 'transparent',
              fontSize: '0.875rem',
            }}
          >
            {generatedYAML || '# Your YAML will appear here...'}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}