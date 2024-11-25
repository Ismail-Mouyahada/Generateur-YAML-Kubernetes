import React from 'react';
import { FileCode2, Github } from 'lucide-react';
import GitHubProfile from './GitHubProfile';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <FileCode2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">K8s YAML Generator</h1>
              <p className="text-sm text-blue-200">Create Kubernetes configurations with ease</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <GitHubProfile />
            <a
              href="https://github.com/Ismail-Mouyahada"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}