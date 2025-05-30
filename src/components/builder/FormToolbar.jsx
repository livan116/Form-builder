import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateFormTitle, updateFormDescription, loadTemplate } from '../../redux/slices/formSlice'
import { setPreviewMode } from '../../redux/slices/uiSlice'
import { FiMonitor, FiTablet, FiSmartphone, FiSave, FiShare2, FiCopy, FiFileText } from 'react-icons/fi'

function FormToolbar() {
  const dispatch = useDispatch()
  const { forms, currentFormId } = useSelector(state => state.form)
  const { previewMode } = useSelector(state => state.ui)
  const [showTemplates, setShowTemplates] = useState(false)
  
  if (!currentFormId || !forms[currentFormId]) return null
  
  const currentForm = forms[currentFormId]
  
  const handleTitleChange = (e) => {
    dispatch(updateFormTitle(e.target.value))
  }
  
  const handleDescriptionChange = (e) => {
    dispatch(updateFormDescription(e.target.value))
  }
  
  const loadFormTemplate = (templateType) => {
    dispatch(loadTemplate(templateType))
    setShowTemplates(false)
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={currentForm.title}
            onChange={handleTitleChange}
            placeholder="Form Title"
            className="text-xl font-medium bg-transparent border-0 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-0 px-0 w-full text-gray-900 dark:text-white placeholder-gray-400"
          />
          <input
            type="text"
            value={currentForm.description || ''}
            onChange={handleDescriptionChange}
            placeholder="Form Description (optional)"
            className="mt-2 text-sm bg-transparent border-0 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-0 px-0 w-full text-gray-600 dark:text-gray-300 placeholder-gray-400"
          />
        </div>
        
        <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3">
          <div className="flex items-center space-x-1 border border-gray-200 dark:border-gray-700 rounded-md">
            <button
              className={`p-1.5 ${previewMode === 'desktop' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'} rounded-l-md`}
              onClick={() => dispatch(setPreviewMode('desktop'))}
              title="Desktop view"
            >
              <FiMonitor size={18} />
            </button>
            <button
              className={`p-1.5 ${previewMode === 'tablet' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => dispatch(setPreviewMode('tablet'))}
              title="Tablet view"
            >
              <FiTablet size={18} />
            </button>
            <button
              className={`p-1.5 ${previewMode === 'mobile' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'} rounded-r-md`}
              onClick={() => dispatch(setPreviewMode('mobile'))}
              title="Mobile view"
            >
              <FiSmartphone size={18} />
            </button>
          </div>
          
          <div className="relative">
            <button
              className="btn-outline py-1 flex items-center"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <FiFileText size={16} className="mr-1" />
              <span>Templates</span>
            </button>
            
            {showTemplates && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                <div className="p-2">
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    onClick={() => loadFormTemplate('contact')}
                  >
                    Contact Form
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    onClick={() => loadFormTemplate('survey')}
                  >
                    Survey Template
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="hidden sm:flex items-center space-x-2">
            <Link
              to={`/form/${currentFormId}`}
              className="btn-secondary py-1 flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiShare2 size={16} className="mr-1" />
              <span>Share</span>
            </Link>
            
            <Link
              to={`/preview/${currentFormId}`}
              className="btn-primary py-1"
            >
              Preview
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormToolbar