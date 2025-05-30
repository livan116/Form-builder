import React from 'react'

function UrlField({ field, value, onChange, isReadOnly, error }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      </div>
      
      <input
        type="url"
        placeholder={field.placeholder}
        value={value || ''}
        onChange={onChange}
        disabled={isReadOnly}
        className={`input-field ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
        required={field.required}
      />
      
      {field.helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{field.helpText}</p>
      )}
      
      {error && (
        <p className="text-xs text-error-500">{error}</p>
      )}
    </div>
  )
}

export default UrlField