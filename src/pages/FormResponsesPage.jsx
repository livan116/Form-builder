import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { loadForm } from '../redux/slices/formSlice'
import { loadResponsesFromLocalStorage, clearFormResponses, deleteResponse } from '../redux/slices/responsesSlice'
import { FiArrowLeft, FiTrash, FiDownload, FiEye } from 'react-icons/fi'
import EmptyState from '../components/ui/EmptyState'

function FormResponsesPage() {
  const { formId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { forms } = useSelector(state => state.form)
  const { responses } = useSelector(state => state.responses)
  const [selectedResponse, setSelectedResponse] = useState(null)
  
  useEffect(() => {
    // Load responses
    dispatch(loadResponsesFromLocalStorage())
    
    if (formId && forms[formId]) {
      dispatch(loadForm(formId))
    } else if (formId) {
      // Form doesn't exist
      navigate('/')
    }
  }, [dispatch, formId, forms, navigate])
  
  if (!formId || !forms[formId]) {
    return <EmptyState message="Form not found" />
  }
  
  const currentForm = forms[formId]
  const formResponses = responses[formId] || []
  
  const handleClearResponses = () => {
    if (window.confirm('Are you sure you want to delete all responses? This action cannot be undone.')) {
      dispatch(clearFormResponses(formId))
    }
  }
  
  const handleDeleteResponse = (responseId) => {
    if (window.confirm('Are you sure you want to delete this response?')) {
      dispatch(deleteResponse({ formId, responseId }))
      if (selectedResponse?.id === responseId) {
        setSelectedResponse(null)
      }
    }
  }
  
  const handleExportResponses = () => {
    if (formResponses.length === 0) return
    
    // Convert to CSV
    const fields = []
    const allFields = currentForm.steps.flatMap(step => step.fields)
    
    // Column headers
    let csvContent = 'Timestamp,'
    allFields.forEach(field => {
      fields.push(field.id)
      csvContent += `"${field.label}",`
    })
    csvContent = csvContent.slice(0, -1) + '\n'
    
    // Data rows
    formResponses.forEach(response => {
      const date = new Date(response.timestamp)
      csvContent += `"${date.toLocaleString()}",`
      
      fields.forEach(fieldId => {
        const value = response.data[fieldId] || ''
        const formattedValue = Array.isArray(value) ? value.join(', ') : value
        csvContent += `"${formattedValue}",`
      })
      
      csvContent = csvContent.slice(0, -1) + '\n'
    })
    
    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${currentForm.title}_responses.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }
  
  const findFieldLabel = (fieldId) => {
    const allFields = currentForm.steps.flatMap(step => step.fields)
    const field = allFields.find(f => f.id === fieldId)
    return field ? field.label : 'Unknown Field'
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center">
            <Link to={`/builder/${formId}`} className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Responses: {currentForm.title}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {formResponses.length} {formResponses.length === 1 ? 'response' : 'responses'} received
          </p>
        </div>
        
        {formResponses.length > 0 && (
          <div className="flex space-x-2">
            <button
              className="btn-outline py-1 flex items-center"
              onClick={handleExportResponses}
            >
              <FiDownload className="mr-1" /> Export CSV
            </button>
            <button
              className="btn-outline py-1 flex items-center text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 hover:border-error-300 dark:hover:border-error-700"
              onClick={handleClearResponses}
            >
              <FiTrash className="mr-1" /> Clear All
            </button>
          </div>
        )}
      </div>
      
      {formResponses.length === 0 ? (
        <div className="card p-8 text-center">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No Responses Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Share your form with others to start collecting responses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/form/${formId}`}
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Form
            </Link>
            <Link
              to={`/builder/${formId}`}
              className="btn-outline"
            >
              Back to Editor
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 overflow-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  All Responses
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                {formResponses.map((response) => (
                  <div 
                    key={response.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedResponse?.id === response.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                    onClick={() => setSelectedResponse(response)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(response.timestamp)}
                        </p>
                        
                        <div className="mt-1">
                          {currentForm.steps[0].fields.slice(0, 2).map(field => {
                            const value = response.data[field.id]
                            return (
                              <p key={field.id} className="text-sm truncate max-w-[200px]">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {field.label}:
                                </span>{' '}
                                <span className="text-gray-600 dark:text-gray-400">
                                  {Array.isArray(value) ? value.join(', ') : value || '—'}
                                </span>
                              </p>
                            )
                          })}
                        </div>
                      </div>
                      
                      <button
                        className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteResponse(response.id)
                        }}
                        title="Delete response"
                      >
                        <FiTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedResponse ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Response Details
                  </h2>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(selectedResponse.timestamp)}
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {currentForm.steps.map((step, stepIndex) => (
                    <div key={step.id} className="space-y-4">
                      {currentForm.steps.length > 1 && (
                        <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 pb-2 border-b border-gray-200 dark:border-gray-700">
                          {step.title || `Step ${stepIndex + 1}`}
                        </h3>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {step.fields.map(field => {
                          const value = selectedResponse.data[field.id]
                          
                          return (
                            <div key={field.id} className="space-y-1">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {field.label}
                              </label>
                              
                              {field.type === 'textarea' ? (
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3 text-gray-700 dark:text-gray-300 text-sm min-h-[80px]">
                                  {value || '—'}
                                </div>
                              ) : Array.isArray(value) ? (
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3 text-gray-700 dark:text-gray-300 text-sm">
                                  {value.length > 0 ? value.join(', ') : '—'}
                                </div>
                              ) : (
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3 text-gray-700 dark:text-gray-300 text-sm">
                                  {value || '—'}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <FiEye className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                    Select a response to view details
                  </h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    Click on any response from the list to see all submitted information
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FormResponsesPage