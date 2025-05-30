import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { createForm, loadForm } from '../redux/slices/formSlice'
import { loadResponsesFromLocalStorage } from '../redux/slices/responsesSlice'
import FormToolbar from '../components/builder/FormToolbar'
import FormCanvas from '../components/builder/FormCanvas'
import FieldsPanel from '../components/builder/FieldsPanel'
import ConfigPanel from '../components/builder/ConfigPanel'
import FormActions from '../components/ui/FormActions'
import EmptyState from '../components/ui/EmptyState'

function FormBuilderPage() {
  const { formId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { forms, currentFormId } = useSelector(state => state.form)
  const { isConfigPanelOpen } = useSelector(state => state.ui)
  
  useEffect(() => {
    // Load responses for viewing
    dispatch(loadResponsesFromLocalStorage())
    
    if (formId) {
      // If we have a form ID in the URL, try to load that form
      if (forms[formId]) {
        dispatch(loadForm(formId))
      } else {
        // If form doesn't exist, redirect to the main page
        navigate('/')
      }
    } else if (!currentFormId) {
      // If no current form is loaded and no form ID is provided, create a new form
      dispatch(createForm())
    }
  }, [dispatch, formId, forms, currentFormId, navigate])
  
  if (!currentFormId) {
    return <EmptyState />
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800/50">
        <h1 className="text-lg font-medium text-gray-800 dark:text-gray-200">Form Builder</h1>
        <FormActions formId={currentFormId} />
      </div>
      
      <FormToolbar />
      
      <div className="flex-grow flex overflow-hidden">
        <div className="w-64 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 hidden md:block">
          <FieldsPanel />
        </div>
        
        <div className="flex-grow overflow-auto">
          <FormCanvas />
        </div>
        
        {isConfigPanelOpen && (
          <div className="w-80 flex-shrink-0">
            <ConfigPanel />
          </div>
        )}
      </div>
    </div>
  )
}

export default FormBuilderPage