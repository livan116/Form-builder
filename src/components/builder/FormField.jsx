import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeField } from '../../redux/slices/formSlice'
import { FiEdit2, FiTrash2, FiMove } from 'react-icons/fi'
import TextField from '../fields/TextField'
import TextareaField from '../fields/TextareaField'
import DropdownField from '../fields/DropdownField'
import CheckboxField from '../fields/CheckboxField'
import DateField from '../fields/DateField'
import EmailField from '../fields/EmailField'
import PhoneField from '../fields/PhoneField'
import UrlField from '../fields/UrlField'
import NumberField from '../fields/NumberField'

function FormField({ field, isSelected, dragHandleProps, onSelect }) {
  const dispatch = useDispatch()
  const [isHovered, setIsHovered] = useState(false)
  
  const handleDelete = (e) => {
    e.stopPropagation()
    dispatch(removeField(field.id))
  }
  
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return <TextField field={field} isReadOnly={true} />
      case 'textarea':
        return <TextareaField field={field} isReadOnly={true} />
      case 'dropdown':
        return <DropdownField field={field} isReadOnly={true} />
      case 'checkbox':
        return <CheckboxField field={field} isReadOnly={true} />
      case 'date':
        return <DateField field={field} isReadOnly={true} />
      case 'email':
        return <EmailField field={field} isReadOnly={true} />
      case 'tel':
        return <PhoneField field={field} isReadOnly={true} />
      case 'url':
        return <UrlField field={field} isReadOnly={true} />
      case 'number':
        return <NumberField field={field} isReadOnly={true} />
      default:
        return <div>Unknown field type: {field.type}</div>
    }
  }
  
  return (
    <div
      className={`relative border rounded-lg transition-all duration-200 ${
        isSelected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 shadow-sm'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <div className="absolute top-0 right-0 flex space-x-1 p-2">
        {(isHovered || isSelected) && (
          <>
            <button
              className="icon-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={onSelect}
              title="Edit field"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              className="icon-btn text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400"
              onClick={handleDelete}
              title="Delete field"
            >
              <FiTrash2 size={16} />
            </button>
          </>
        )}
        <div
          {...dragHandleProps}
          className="icon-btn cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          title="Drag to reorder"
        >
          <FiMove size={16} />
        </div>
      </div>
      
      <div className="p-4">
        {renderField()}
      </div>
    </div>
  )
}

export default FormField