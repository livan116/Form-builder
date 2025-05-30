import { useSelector, useDispatch } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { reorderFields, addField, setCurrentStep } from '../../redux/slices/formSlice'
import { setSelectedField } from '../../redux/slices/uiSlice'
import FormField from './FormField'
import EmptyState from '../ui/EmptyState'
import StepNavigation from './StepNavigation'
import { FiPlus } from 'react-icons/fi'

function FormCanvas() {
  const dispatch = useDispatch()
  const { forms, currentFormId, currentStepIndex } = useSelector(state => state.form)
  const { selectedFieldId, previewMode } = useSelector(state => state.ui)
  
  if (!currentFormId || !forms[currentFormId]) {
    return <EmptyState message="Create or select a form to get started" />
  }
  
  const currentForm = forms[currentFormId]
  const currentStep = currentForm.steps[currentStepIndex]
  
  const handleDragEnd = (result) => {
    if (!result.destination) return
    
    dispatch(reorderFields({
      sourceIndex: result.source.index,
      destinationIndex: result.destination.index
    }))
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    const fieldType = e.dataTransfer.getData('fieldType')
    if (fieldType) {
      dispatch(addField({ fieldType }))
    }
  }
  
  const handleFieldSelect = (fieldId) => {
    dispatch(setSelectedField(fieldId))
  }
  
  const getPreviewClass = () => {
    switch (previewMode) {
      case 'tablet':
        return 'max-w-[768px]'
      case 'mobile':
        return 'max-w-[375px]'
      default:
        return 'max-w-4xl'
    }
  }
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <StepNavigation 
        steps={currentForm.steps} 
        currentIndex={currentStepIndex}
        onStepChange={(index) => dispatch(setCurrentStep(index))}
      />
      
      <div className={`flex-grow overflow-auto transition-all duration-300 mx-auto w-full ${getPreviewClass()}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 m-4">
          <div className="mb-6">
            <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">
              {currentForm.title || 'Untitled Form'}
            </h2>
            {currentForm.description && (
              <p className="text-gray-600 dark:text-gray-300">{currentForm.description}</p>
            )}
          </div>
          
          {currentStep.title && (
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">
              {currentStep.title}
            </h3>
          )}
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="form-fields">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`min-h-[200px] transition-colors ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                >
                  {currentStep.fields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[200px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                      <p className="text-gray-500 dark:text-gray-400 mb-2">Drag and drop fields here</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm">or</p>
                      <button 
                        className="mt-2 btn-primary flex items-center"
                        onClick={() => dispatch(addField({ fieldType: 'text' }))}
                      >
                        <FiPlus className="mr-1" /> Add a field
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentStep.fields.map((field, index) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`${snapshot.isDragging ? 'dragging' : ''}`}
                            >
                              <FormField
                                field={field}
                                isSelected={selectedFieldId === field.id}
                                dragHandleProps={provided.dragHandleProps}
                                onSelect={() => handleFieldSelect(field.id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  )
}

export default FormCanvas