import React from 'react'

function DropdownField({ field, value, onChange, isReadOnly, error }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      </div>
      
      <select
        value={value || ''}
        onChange={onChange}
        disabled={isReadOnly}
        className={`input-field ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
        required={field.required}
      >
        <option value="">{field.placeholder || 'Select an option'}</option>
        {field.options && field.options.map(option => (
          <option key={option.id} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
      
      {field.helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{field.helpText}</p>
      )}
      
      {error && (
        <p className="text-xs text-error-500">{error}</p>
      )}
    </div>
  )
}

export default DropdownField