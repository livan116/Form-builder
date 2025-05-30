import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { loadForm, setCurrentStep } from '../redux/slices/formSlice'
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi'
import TextField from '../components/fields/TextField'
import TextareaField from '../components/fields/TextareaField'
import DropdownField from '../components/fields/DropdownField'
import CheckboxField from '../components/fields/CheckboxField'
import DateField from '../components/fields/DateField'
import EmailField from '../components/fields/EmailField'
import PhoneField from '../components/fields/PhoneField'
import UrlField from '../components/fields/UrlField'
import NumberField from '../components/fields/NumberField'
import EmptyState from '../components/ui/EmptyState'

function FormPreviewPage() {
  const { formId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { forms } = useSelector(state => state.form)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formValues, setFormValues] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  useEffect(() => {
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
  const steps = currentForm.steps
  const currentStep = steps[currentStepIndex]
  
  const validateField = (field, value) => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required'
    }
    
    if (field.validation) {
      const { minLength, maxLength, pattern, min, max } = field.validation
      
      if (typeof value === 'string') {
        if (minLength && value.length < minLength) {
          return `Minimum length is ${minLength} characters`
        }
        
        if (maxLength && value.length > maxLength) {
          return `Maximum length is ${maxLength} characters`
        }
        
        if (pattern && !new RegExp(pattern).test(value)) {
          return 'Please enter a valid format'
        }
      }
      
      if (field.type === 'number' && value !== undefined && value !== '') {
        const numValue = Number(value)
        if (min !== undefined && min !== '' && numValue < min) {
          return `Minimum value is ${min}`
        }
        if (max !== undefined && max !== '' && numValue > max) {
          return `Maximum value is ${max}`
        }
      }
    }
    
    return null
  }
  
  const validateStep = () => {
    const newErrors = {}
    let isValid = true
    
    currentStep.fields.forEach(field => {
      const error = validateField(field, formValues[field.id])
      if (error) {
        newErrors[field.id] = error
        isValid = false
      }
    })
    
    setFormErrors(newErrors)
    return isValid
  }
  
  const handleNext = () => {
    if (validateStep()) {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1)
      } else {
        setIsSubmitted(true)
      }
    }
  }
  
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }
  
  const handleFieldChange = (fieldId, value) => {
    setFormValues({
      ...formValues,
      [fieldId]: value
    })
    
    // Clear error when user starts typing
    if (formErrors[fieldId]) {
      const newErrors = { ...formErrors }
      delete newErrors[fieldId]
      setFormErrors(newErrors)
    }
  }
  
  const renderField = (field) => {
    const props = {
      field,
      value: formValues[field.id],
      onChange: (e) => handleFieldChange(field.id, e.target.value),
      error: formErrors[field.id]
    }
    
    switch (field.type) {
      case 'text':
        return <TextField {...props} />
      case 'textarea':
        return <TextareaField {...props} />
      case 'dropdown':
        return <DropdownField {...props} />
      case 'checkbox':
        return <CheckboxField 
          {...props} 
          onChange={(value) => handleFieldChange(field.id, value)} 
        />
      case 'date':
        return <DateField {...props} />
      case 'email':
        return <EmailField {...props} />
      case 'tel':
        return <PhoneField {...props} />
      case 'url':
        return <UrlField {...props} />
      case 'number':
        return <NumberField {...props} />
      default:
        return <div>Unknown field type: {field.type}</div>
    }
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Preview: {currentForm.title}
        </h1>
        <Link
          to={`/builder/${formId}`}
          className="btn-outline"
        >
          Back to Editor
        </Link>
      </div>
      
      {currentForm.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-6">{currentForm.description}</p>
      )}
      
      {/* Step Progress */}
      {steps.length > 1 && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 relative">
                <div 
                  className={`h-1 ${
                    index <= currentStepIndex 
                      ? 'bg-primary-500' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
                <div className="absolute top-0 left-0 -translate-y-1/2">
                  <div 
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      index < currentStepIndex
                        ? 'bg-primary-500 text-white'
                        : index === currentStepIndex
                          ? 'bg-primary-500 text-white ring-4 ring-primary-100 dark:ring-primary-900/30'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {index < currentStepIndex ? <FiCheck /> : index + 1}
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="absolute top-0 left-full -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-8 h-1 ${
                      index < currentStepIndex 
                        ? 'bg-primary-500' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div key={`title-${step.id}`} className={`text-xs ${
                index === currentStepIndex 
                  ? 'text-primary-600 dark:text-primary-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.title}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {isSubmitted ? (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mb-4">
            <FiCheck className="text-success-500 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Form Submitted Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for your submission. This is a preview, so your data wasn't actually saved.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="btn-primary"
              onClick={() => {
                setFormValues({})
                setFormErrors({})
                setCurrentStepIndex(0)
                setIsSubmitted(false)
              }}
            >
              Submit Another Response
            </button>
            <Link to={`/builder/${formId}`} className="btn-outline">
              Back to Editor
            </Link>
          </div>
        </div>
      ) : (
        <div className="card p-6">
          {currentStep.title && (
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
              {currentStep.title}
            </h2>
          )}
          
          <div className="space-y-6">
            {currentStep.fields.map(field => (
              <div key={field.id}>
                {renderField(field)}
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-between">
            <button
              className="btn-outline"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
            >
              <FiArrowLeft className="mr-1" /> Previous
            </button>
            
            <button
              className="btn-primary"
              onClick={handleNext}
            >
              {currentStepIndex < steps.length - 1 ? (
                <>Next <FiArrowRight className="ml-1" /></>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormPreviewPage