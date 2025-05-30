import { useDispatch } from 'react-redux'
import { addField } from '../../redux/slices/formSlice'
import { FiType, FiAlignLeft, FiList, FiCheckSquare, FiCalendar, FiMail, FiPhone, FiLink, FiFileText } from 'react-icons/fi'

const FIELD_TYPES = [
  { type: 'text', label: 'Text Field', icon: <FiType /> },
  { type: 'textarea', label: 'Text Area', icon: <FiAlignLeft /> },
  { type: 'dropdown', label: 'Dropdown', icon: <FiList /> },
  { type: 'checkbox', label: 'Checkbox Group', icon: <FiCheckSquare /> },
  { type: 'date', label: 'Date Picker', icon: <FiCalendar /> },
  { type: 'email', label: 'Email Field', icon: <FiMail /> },
  { type: 'tel', label: 'Phone Field', icon: <FiPhone /> },
  { type: 'url', label: 'URL Field', icon: <FiLink /> },
  { type: 'number', label: 'Number Field', icon: <FiFileText /> },
]

function FieldsPanel() {
  const dispatch = useDispatch()
  
  const handleAddField = (fieldType) => {
    dispatch(addField({ fieldType }))
  }
  
  const handleDragStart = (e, fieldType) => {
    e.dataTransfer.setData('fieldType', fieldType)
    e.dataTransfer.effectAllowed = 'copy'
  }
  
  return (
    <div className="h-full overflow-auto p-4">
      <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Form Fields</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Drag fields onto the form or click to add them to the end
      </p>
      
      <div className="grid grid-cols-1 gap-3">
        {FIELD_TYPES.map((field) => (
          <div
            key={field.type}
            className="field-card flex items-center cursor-grab active:cursor-grabbing"
            draggable
            onDragStart={(e) => handleDragStart(e, field.type)}
            onClick={() => handleAddField(field.type)}
          >
            <div className="p-2 mr-3 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-md">
              {field.icon}
            </div>
            <span className="text-gray-700 dark:text-gray-300">{field.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FieldsPanel