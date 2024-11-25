import React from 'react';
import { FormField as FormFieldType, ResourceConfig } from '../types/kubernetes';

interface Props {
  field: FormFieldType;
  value: any;
  onChange: (value: any) => void;
}

export default function FormField({ field, value, onChange }: Props) {
  const baseClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500";

  switch (field.type) {
    case 'select':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700">{field.label}</label>
          <select
            className={baseClassName}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case 'number':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700">{field.label}</label>
          <input
            type="number"
            className={baseClassName}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            placeholder={field.placeholder}
            min={1}
          />
        </div>
      );

    default:
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700">{field.label}</label>
          <input
            type="text"
            className={baseClassName}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
          />
        </div>
      );
  }
}