 import { Copy, Download, Archive } from 'lucide-react';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import { ResourceConfig } from '../types/kubernetes';

interface Props {
  yaml: string;
  config: ResourceConfig;
}

export default function YAMLActions({ yaml, config }: Props) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(yaml);
    toast.success('YAML copied to clipboard');
  };

  const handleDownload = (format: 'yaml' | 'zip') => {
    if (format === 'yaml') {
      const blob = new Blob([yaml], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.name}-k8s.yaml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('YAML downloaded');
    } else {
      const zip = new JSZip();
      zip.file(`${config.name}-k8s.yaml`, yaml);
      
      // Add additional resources if needed
      if (config.resourceType === 'Deployment') {
        const serviceYaml = generateServiceYaml(config);
        zip.file(`${config.name}-service.yaml`, serviceYaml);
      }

      zip.generateAsync({ type: 'blob' })
        .then((content) => {
          const url = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${config.name}-k8s.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success('ZIP archive downloaded');
        });
    }
  };

  return (
    <div className="space-x-2">
      <button
        onClick={handleCopy}
        className="inline-flex items-center space-x-2 bg-gray-100 py-2 px-4 rounded-md hover:bg-gray-200"
      >
        <Copy className="h-4 w-4" />
        <span>Copy</span>
      </button>
      <button
        onClick={() => handleDownload('yaml')}
        className="inline-flex items-center space-x-2 bg-gray-100 py-2 px-4 rounded-md hover:bg-gray-200"
      >
        <Download className="h-4 w-4" />
        <span>Download YAML</span>
      </button>
      <button
        onClick={() => handleDownload('zip')}
        className="inline-flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 my-4 rounded-md hover:bg-blue-700"
      >
        <Archive className="h-4 w-4" />
        <span>Download ZIP</span>
      </button>
    </div>
  );
}

function generateServiceYaml(config: ResourceConfig): string {
  return `apiVersion: v1
kind: Service
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  selector:
    app: ${config.name}
  ports:
    - protocol: TCP
      port: ${config.port}
      targetPort: ${config.port}
  type: ClusterIP`;
}