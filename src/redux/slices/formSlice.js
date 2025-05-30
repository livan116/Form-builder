import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  forms: {},
  currentFormId: null,
  currentStepIndex: 0,
  // Default form template
  formTemplate: {
    id: '',
    title: 'Untitled Form',
    description: '',
    createdAt: null,
    updatedAt: null,
    steps: [
      {
        id: uuidv4(),
        title: 'Step 1',
        fields: []
      }
    ]
  }
}

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    createForm: (state) => {
      const newFormId = uuidv4()
      const timestamp = new Date().toISOString()
      
      state.forms[newFormId] = {
        ...JSON.parse(JSON.stringify(state.formTemplate)),
        id: newFormId,
        createdAt: timestamp,
        updatedAt: timestamp
      }
      
      state.currentFormId = newFormId
      state.currentStepIndex = 0
      
      // Save to localStorage
      localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
      
      return state
    },
    
    loadForm: (state, action) => {
      const formId = action.payload
      if (state.forms[formId]) {
        state.currentFormId = formId
        state.currentStepIndex = 0
      }
      return state
    },
    
    updateFormTitle: (state, action) => {
      if (state.currentFormId) {
        state.forms[state.currentFormId].title = action.payload
        state.forms[state.currentFormId].updatedAt = new Date().toISOString()
        localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
      }
    },
    
    updateFormDescription: (state, action) => {
      if (state.currentFormId) {
        state.forms[state.currentFormId].description = action.payload
        state.forms[state.currentFormId].updatedAt = new Date().toISOString()
        localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
      }
    },
    
    addField: (state, action) => {
      const { fieldType, index } = action.payload
      
      if (!state.currentFormId) return state
      
      const newField = {
        id: uuidv4(),
        type: fieldType,
        label: `New ${fieldType} field`,
        placeholder: '',
        required: false,
        helpText: '',
        options: fieldType === 'dropdown' || fieldType === 'checkbox' ? 
          [{ id: uuidv4(), value: 'Option 1' }] : [],
        validation: {
          minLength: 0,
          maxLength: 0,
          pattern: ''
        }
      }
      
      const currentStep = state.forms[state.currentFormId].steps[state.currentStepIndex]
      
      if (index !== undefined) {
        // Insert at specific position
        currentStep.fields.splice(index, 0, newField)
      } else {
        // Add to the end
        currentStep.fields.push(newField)
      }
      
      state.forms[state.currentFormId].updatedAt = new Date().toISOString()
      localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
    },
    
    updateField: (state, action) => {
      const { fieldId, updates } = action.payload
      
      if (!state.currentFormId) return state
      
      const currentStep = state.forms[state.currentFormId].steps[state.currentStepIndex]
      const fieldIndex = currentStep.fields.findIndex(field => field.id === fieldId)
      
      if (fieldIndex !== -1) {
        currentStep.fields[fieldIndex] = {
          ...currentStep.fields[fieldIndex],
          ...updates
        }
        
        state.forms[state.currentFormId].updatedAt = new Date().toISOString()
        localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
      }
    },
    
    removeField: (state, action) => {
      const fieldId = action.payload
      
      if (!state.currentFormId) return state
      
      const currentStep = state.forms[state.currentFormId].steps[state.currentStepIndex]
      const fieldIndex = currentStep.fields.findIndex(field => field.id === fieldId)
      
      if (fieldIndex !== -1) {
        currentStep.fields.splice(fieldIndex, 1)
        state.forms[state.currentFormId].updatedAt = new Date().toISOString()
        localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
      }
    },
    
    reorderFields: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload
      
      if (!state.currentFormId || sourceIndex === destinationIndex) return state
      
      const currentStep = state.forms[state.currentFormId].steps[state.currentStepIndex]
      const [removedField] = currentStep.fields.splice(sourceIndex, 1)
      currentStep.fields.splice(destinationIndex, 0, removedField)
      
      state.forms[state.currentFormId].updatedAt = new Date().toISOString()
      localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
    },
    
    addFieldOption: (state, action) => {
      const { fieldId } = action.payload
      
      if (!state.currentFormId) return state
      
      const currentStep = state.forms[state.currentFormId].steps[state.currentStepIndex]
      const field = currentStep.fields.find(field => field.id === fieldId)
      
      if (field && (field.type === 'dropdown' || field.type === 'checkbox')) {
        field.options.push({
          id: uuidv4(),
          value: `Option ${field.options.length + 1}`
        })
        
        state.forms[state.currentFormId].updatedAt = new Date().toISOString()
        localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
      }
    },
    
    updateFieldOption: (state, action) => {
      const { fieldId, optionId, value } = action.payload
      
      if (!state.currentFormId) return state
      
      const currentStep = state.forms[state.currentFormId].steps[state.currentStepIndex]
      const field = currentStep.fields.find(field => field.id === fieldId)
      
      if (field) {
        const option = field.options.find(opt => opt.id === optionId)
        if (option) {
          option.value = value
          state.forms[state.currentFormId].updatedAt = new Date().toISOString()
          localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
        }
      }
    },
    
    removeFieldOption: (state, action) => {
      const { fieldId, optionId } = action.payload
      
      if (!state.currentFormId) return state
      
      const currentStep = state.forms[state.currentFormId].steps[state.currentStepIndex]
      const field = currentStep.fields.find(field => field.id === fieldId)
      
      if (field) {
        field.options = field.options.filter(opt => opt.id !== optionId)
        state.forms[state.currentFormId].updatedAt = new Date().toISOString()
        localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
      }
    },
    
    addStep: (state) => {
      if (!state.currentFormId) return state
      
      const stepCount = state.forms[state.currentFormId].steps.length
      
      state.forms[state.currentFormId].steps.push({
        id: uuidv4(),
        title: `Step ${stepCount + 1}`,
        fields: []
      })
      
      state.forms[state.currentFormId].updatedAt = new Date().toISOString()
      localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
    },
    
    updateStepTitle: (state, action) => {
      const { stepIndex, title } = action.payload
      
      if (!state.currentFormId) return state
      
      const steps = state.forms[state.currentFormId].steps
      if (stepIndex >= 0 && stepIndex < steps.length) {
        steps[stepIndex].title = title
        state.forms[state.currentFormId].updatedAt = new Date().toISOString()
        localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
      }
    },
    
    removeStep: (state, action) => {
      const stepIndex = action.payload
      
      if (!state.currentFormId) return state
      
      const steps = state.forms[state.currentFormId].steps
      
      if (steps.length > 1 && stepIndex >= 0 && stepIndex < steps.length) {
        steps.splice(stepIndex, 1)
        
        // Adjust current step index if needed
        if (state.currentStepIndex >= steps.length) {
          state.currentStepIndex = steps.length - 1
        }
        
        state.forms[state.currentFormId].updatedAt = new Date().toISOString()
        localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
      }
    },
    
    setCurrentStep: (state, action) => {
      const stepIndex = action.payload
      
      if (!state.currentFormId) return state
      
      const steps = state.forms[state.currentFormId].steps
      if (stepIndex >= 0 && stepIndex < steps.length) {
        state.currentStepIndex = stepIndex
      }
    },
    
    loadFromLocalStorage: (state) => {
      const savedForms = localStorage.getItem('formBuilder_forms')
      if (savedForms) {
        state.forms = JSON.parse(savedForms)
      }
    },
    
    deleteForm: (state, action) => {
      const formId = action.payload
      
      if (state.forms[formId]) {
        delete state.forms[formId]
        
        if (state.currentFormId === formId) {
          state.currentFormId = null
          state.currentStepIndex = 0
        }
        
        localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
      }
    },
    
    duplicateForm: (state, action) => {
      const formId = action.payload
      
      if (state.forms[formId]) {
        const newFormId = uuidv4()
        const timestamp = new Date().toISOString()
        
        // Create deep copy of the form
        state.forms[newFormId] = JSON.parse(JSON.stringify(state.forms[formId]))
        
        // Update IDs and timestamps
        state.forms[newFormId].id = newFormId
        state.forms[newFormId].title = `${state.forms[formId].title} (Copy)`
        state.forms[newFormId].createdAt = timestamp
        state.forms[newFormId].updatedAt = timestamp
        
        localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
      }
    },
    
    // Load a predefined template
    loadTemplate: (state, action) => {
      const templateType = action.payload
      const newFormId = uuidv4()
      const timestamp = new Date().toISOString()
      
      let template = {
        ...JSON.parse(JSON.stringify(state.formTemplate)),
        id: newFormId,
        createdAt: timestamp,
        updatedAt: timestamp
      }
      
      // Predefined templates
      if (templateType === 'contact') {
        template.title = 'Contact Us Form'
        template.description = 'A simple contact form template'
        template.steps[0].fields = [
          {
            id: uuidv4(),
            type: 'text',
            label: 'Full Name',
            placeholder: 'Enter your full name',
            required: true,
            helpText: 'Please enter your first and last name',
            options: [],
            validation: { minLength: 2, maxLength: 100, pattern: '' }
          },
          {
            id: uuidv4(),
            type: 'text',
            label: 'Email Address',
            placeholder: 'Enter your email address',
            required: true,
            helpText: 'We\'ll never share your email with anyone else',
            options: [],
            validation: { minLength: 5, maxLength: 100, pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' }
          },
          {
            id: uuidv4(),
            type: 'textarea',
            label: 'Message',
            placeholder: 'Enter your message',
            required: true,
            helpText: 'How can we help you?',
            options: [],
            validation: { minLength: 10, maxLength: 500, pattern: '' }
          }
        ]
      } else if (templateType === 'survey') {
        template.title = 'Customer Feedback Survey'
        template.description = 'Gather customer feedback about your products or services'
        template.steps[0].title = 'Basic Information'
        template.steps[0].fields = [
          {
            id: uuidv4(),
            type: 'text',
            label: 'Name',
            placeholder: 'Enter your name',
            required: false,
            helpText: '',
            options: [],
            validation: { minLength: 0, maxLength: 100, pattern: '' }
          },
          {
            id: uuidv4(),
            type: 'text',
            label: 'Email',
            placeholder: 'Enter your email',
            required: true,
            helpText: '',
            options: [],
            validation: { minLength: 5, maxLength: 100, pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' }
          }
        ]
        
        // Add second step for survey
        template.steps.push({
          id: uuidv4(),
          title: 'Product Feedback',
          fields: [
            {
              id: uuidv4(),
              type: 'dropdown',
              label: 'How would you rate our product?',
              placeholder: 'Select an option',
              required: true,
              helpText: '',
              options: [
                { id: uuidv4(), value: 'Excellent' },
                { id: uuidv4(), value: 'Good' },
                { id: uuidv4(), value: 'Average' },
                { id: uuidv4(), value: 'Poor' },
                { id: uuidv4(), value: 'Very Poor' }
              ],
              validation: { minLength: 0, maxLength: 0, pattern: '' }
            },
            {
              id: uuidv4(),
              type: 'textarea',
              label: 'What do you like most about our product?',
              placeholder: 'Enter your answer',
              required: false,
              helpText: '',
              options: [],
              validation: { minLength: 0, maxLength: 500, pattern: '' }
            },
            {
              id: uuidv4(),
              type: 'textarea',
              label: 'How can we improve our product?',
              placeholder: 'Enter your answer',
              required: false,
              helpText: '',
              options: [],
              validation: { minLength: 0, maxLength: 500, pattern: '' }
            }
          ]
        })
      }
      
      state.forms[newFormId] = template
      state.currentFormId = newFormId
      state.currentStepIndex = 0
      
      localStorage.setItem('formBuilder_forms', JSON.stringify(state.forms))
    }
  }
})

export const {
  createForm,
  loadForm,
  updateFormTitle,
  updateFormDescription,
  addField,
  updateField,
  removeField,
  reorderFields,
  addFieldOption,
  updateFieldOption,
  removeFieldOption,
  addStep,
  updateStepTitle,
  removeStep,
  setCurrentStep,
  loadFromLocalStorage,
  deleteForm,
  duplicateForm,
  loadTemplate
} = formSlice.actions

export default formSlice.reducer