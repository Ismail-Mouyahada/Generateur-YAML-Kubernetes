import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-400 mb-2">
            © {new Date().getFullYear()} Kubernetes YAML Generator. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Created by <a href="https://github.com/Ismail-Mouyahada" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">Ismail MOUYAHADA</a>
          </p>
          <p className="text-xs text-gray-600 mt-4 max-w-2xl mx-auto">
            Commercial use, redistribution, or modification of this application is strictly prohibited.
            All rights are exclusively reserved by Ismail MOUYAHADA.
          </p>
        </div>
      </div>
    </footer>
  );
}