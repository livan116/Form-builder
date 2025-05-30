import React from 'react'

function CheckboxField({ field, value = [], onChange, isReadOnly, error }) {
  const handleCheckboxChange = (optionValue, checked) => {
    if (!onChange) return
    
    let newValue = [...(value || [])]
    
    if (checked) {
      newValue.push(optionValue)
    } else {
      newValue = newValue.filter(val => val !== optionValue)
    }
    
    onChange(newValue)
  }
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      </div>
      
      <div className="space-y-2 mt-2">
        {field.options && field.options.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              type="checkbox"
              id={`${field.id}-${option.id}`}
              value={option.value}
              checked={value?.includes(option.value) || false}
              onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
              disabled={isReadOnly}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
            />
            <label
              htmlFor={`${field.id}-${option.id}`}
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              {option.value}
            </label>
          </div>
        ))}
      </div>
      
      {field.helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{field.helpText}</p>
      )}
      
      {error && (
        <p className="text-xs text-error-500">{error}</p>
      )}
    </div>
  )
}

export default CheckboxField