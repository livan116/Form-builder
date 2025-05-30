import { useSelector, useDispatch } from 'react-redux'
import { updateField, addFieldOption, updateFieldOption, removeFieldOption } from '../../redux/slices/formSlice'
import { closeConfigPanel } from '../../redux/slices/uiSlice'
import { FiX, FiPlus, FiTrash } from 'react-icons/fi'

function ConfigPanel() {
  const dispatch = useDispatch()
  const { forms, currentFormId, currentStepIndex } = useSelector(state => state.form)
  const { selectedFieldId, isConfigPanelOpen } = useSelector(state => state.ui)
  
  if (!isConfigPanelOpen || !selectedFieldId || !currentFormId) return null
  
  const currentForm = forms[currentFormId]
  const currentStep = currentForm.steps[currentStepIndex]
  const field = currentStep.fields.find(f => f.id === selectedFieldId)
  
  if (!field) return null
  
  const handleUpdateField = (updates) => {
    dispatch(updateField({
      fieldId: selectedFieldId,
      updates
    }))
  }
  
  const handleAddOption = () => {
    dispatch(addFieldOption({ fieldId: selectedFieldId }))
  }
  
  const handleUpdateOption = (optionId, value) => {
    dispatch(updateFieldOption({
      fieldId: selectedFieldId,
      optionId,
      value
    }))
  }
  
  const handleRemoveOption = (optionId) => {
    dispatch(removeFieldOption({
      fieldId: selectedFieldId,
      optionId
    }))
  }
  
  return (
    <div className="h-full overflow-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-md">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Field Properties</h2>
        <button
          className="icon-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => dispatch(closeConfigPanel())}
        >
          <FiX size={20} />
        </button>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Basic Properties */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Basic Properties</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Label
            </label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => handleUpdateField({ label: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => handleUpdateField({ placeholder: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Help Text
            </label>
            <input
              type="text"
              value={field.helpText || ''}
              onChange={(e) => handleUpdateField({ helpText: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={field.required || false}
              onChange={(e) => handleUpdateField({ required: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
            />
            <label htmlFor="required" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Required Field
            </label>
          </div>
        </div>
        
        {/* Validation */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Validation</h3>
          
          {(field.type === 'text' || field.type === 'textarea' || field.type === 'email' || field.type === 'url') && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Min Length
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={field.validation?.minLength || 0}
                    onChange={(e) => handleUpdateField({ 
                      validation: { 
                        ...field.validation, 
                        minLength: parseInt(e.target.value) || 0 
                      }
                    })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Length
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={field.validation?.maxLength || 0}
                    onChange={(e) => handleUpdateField({ 
                      validation: { 
                        ...field.validation, 
                        maxLength: parseInt(e.target.value) || 0 
                      }
                    })}
                    className="input-field"
                  />
                </div>
              </div>
              
              {(field.type === 'email' || field.type === 'url' || field.type === 'text') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pattern (Regex)
                  </label>
                  <input
                    type="text"
                    value={field.validation?.pattern || ''}
                    onChange={(e) => handleUpdateField({ 
                      validation: { 
                        ...field.validation, 
                        pattern: e.target.value 
                      }
                    })}
                    className="input-field"
                    placeholder={field.type === 'email' ? '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' : ''}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {field.type === 'email' && 'Regular expression for email validation'}
                    {field.type === 'url' && 'Regular expression for URL validation'}
                    {field.type === 'text' && 'Custom validation pattern'}
                  </p>
                </div>
              )}
            </>
          )}
          
          {field.type === 'number' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Value
                </label>
                <input
                  type="number"
                  value={field.validation?.min || ''}
                  onChange={(e) => handleUpdateField({ 
                    validation: { 
                      ...field.validation, 
                      min: e.target.value ? parseInt(e.target.value) : '' 
                    }
                  })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Value
                </label>
                <input
                  type="number"
                  value={field.validation?.max || ''}
                  onChange={(e) => handleUpdateField({ 
                    validation: { 
                      ...field.validation, 
                      max: e.target.value ? parseInt(e.target.value) : '' 
                    }
                  })}
                  className="input-field"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Options (for dropdown and checkbox) */}
        {(field.type === 'dropdown' || field.type === 'checkbox') && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Options</h3>
              <button
                className="btn-outline text-sm flex items-center py-1"
                onClick={handleAddOption}
              >
                <FiPlus size={16} className="mr-1" /> Add Option
              </button>
            </div>
            
            <div className="space-y-2">
              {field.options.map((option, index) => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => handleUpdateOption(option.id, e.target.value)}
                    className="input-field"
                    placeholder={`Option ${index + 1}`}
                  />
                  <button
                    className="ml-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400"
                    onClick={() => handleRemoveOption(option.id)}
                    disabled={field.options.length <= 1}
                  >
                    <FiTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConfigPanel