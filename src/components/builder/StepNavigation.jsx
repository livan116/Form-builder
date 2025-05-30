import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addStep, updateStepTitle, removeStep } from '../../redux/slices/formSlice'
import { FiPlus, FiX, FiEdit2, FiCheck } from 'react-icons/fi'

function StepNavigation({ steps, currentIndex, onStepChange }) {
  const dispatch = useDispatch()
  const [editingStepIndex, setEditingStepIndex] = useState(null)
  const [editStepTitle, setEditStepTitle] = useState('')
  
  const handleAddStep = () => {
    dispatch(addStep())
  }
  
  const handleRemoveStep = (index, e) => {
    e.stopPropagation()
    dispatch(removeStep(index))
  }
  
  const startEditingStep = (index, title, e) => {
    e.stopPropagation()
    setEditingStepIndex(index)
    setEditStepTitle(title)
  }
  
  const saveStepTitle = (e) => {
    e.stopPropagation()
    dispatch(updateStepTitle({
      stepIndex: editingStepIndex,
      title: editStepTitle
    }))
    setEditingStepIndex(null)
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-2 flex items-center overflow-x-auto">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex-shrink-0 flex items-center px-4 py-2 cursor-pointer rounded-full mr-2 ${
              currentIndex === index
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => onStepChange(index)}
          >
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mr-2 ${
              currentIndex === index
                ? 'bg-primary-500 text-white'
                : 'bg-gray-400 dark:bg-gray-600 text-white'
            }`}>
              {index + 1}
            </div>
            
            {editingStepIndex === index ? (
              <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editStepTitle}
                  onChange={(e) => setEditStepTitle(e.target.value)}
                  className="input-field py-1 px-2 text-sm"
                  autoFocus
                />
                <button 
                  className="ml-2 text-success-500 hover:text-success-600"
                  onClick={saveStepTitle}
                >
                  <FiCheck size={16} />
                </button>
              </div>
            ) : (
              <>
                <span className="truncate max-w-[150px]">{step.title}</span>
                <div className="ml-2 flex items-center">
                  <button
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-1"
                    onClick={(e) => startEditingStep(index, step.title, e)}
                    title="Edit step title"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  {steps.length > 1 && (
                    <button
                      className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400"
                      onClick={(e) => handleRemoveStep(index, e)}
                      title="Remove step"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        
        <button
          className="flex-shrink-0 flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
          onClick={handleAddStep}
        >
          <FiPlus size={16} className="mr-1" />
          <span>Add Step</span>
        </button>
      </div>
    </div>
  )
}

export default StepNavigation