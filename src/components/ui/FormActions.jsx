import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteForm, duplicateForm } from '../../redux/slices/formSlice'
import { useNavigate } from 'react-router-dom'
import { FiMoreVertical, FiCopy, FiTrash2, FiDownload } from 'react-icons/fi'

function FormActions({ formId }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  
  const handleDeleteForm = () => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      dispatch(deleteForm(formId))
      navigate('/')
    }
  }
  
  const handleDuplicateForm = () => {
    dispatch(duplicateForm(formId))
    setShowMenu(false)
  }
  
  const handleExportForm = () => {
    // Get form from localStorage
    const savedForms = localStorage.getItem('formBuilder_forms')
    if (savedForms) {
      const forms = JSON.parse(savedForms)
      const form = forms[formId]
      
      if (form) {
        // Create a Blob with the form data
        const blob = new Blob([JSON.stringify(form, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        
        // Create a link and trigger download
        const a = document.createElement('a')
        a.href = url
        a.download = `${form.title || 'form'}.json`
        document.body.appendChild(a)
        a.click()
        
        // Clean up
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    }
    
    setShowMenu(false)
  }
  
  return (
    <div className="relative">
      <button
        className="icon-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        onClick={() => setShowMenu(!showMenu)}
        aria-label="Form actions"
      >
        <FiMoreVertical size={20} />
      </button>
      
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              onClick={handleDuplicateForm}
            >
              <FiCopy className="mr-2" size={16} />
              Duplicate Form
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              onClick={handleExportForm}
            >
              <FiDownload className="mr-2" size={16} />
              Export Form
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 flex items-center"
              onClick={handleDeleteForm}
            >
              <FiTrash2 className="mr-2" size={16} />
              Delete Form
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormActions