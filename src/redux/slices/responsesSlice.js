import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  responses: {},
}

const responsesSlice = createSlice({
  name: 'responses',
  initialState,
  reducers: {
    submitFormResponse: (state, action) => {
      const { formId, formData } = action.payload
      
      if (!state.responses[formId]) {
        state.responses[formId] = []
      }
      
      const responseId = uuidv4()
      const timestamp = new Date().toISOString()
      
      state.responses[formId].push({
        id: responseId,
        timestamp,
        data: formData
      })
      
      // Save to localStorage
      localStorage.setItem('formBuilder_responses', JSON.stringify(state.responses))
      
      return state
    },
    
    deleteResponse: (state, action) => {
      const { formId, responseId } = action.payload
      
      if (state.responses[formId]) {
        state.responses[formId] = state.responses[formId].filter(
          response => response.id !== responseId
        )
        
        localStorage.setItem('formBuilder_responses', JSON.stringify(state.responses))
      }
      
      return state
    },
    
    loadResponsesFromLocalStorage: (state) => {
      const savedResponses = localStorage.getItem('formBuilder_responses')
      if (savedResponses) {
        state.responses = JSON.parse(savedResponses)
      }
    },
    
    clearFormResponses: (state, action) => {
      const formId = action.payload
      
      if (state.responses[formId]) {
        delete state.responses[formId]
        localStorage.setItem('formBuilder_responses', JSON.stringify(state.responses))
      }
      
      return state
    }
  }
})

export const {
  submitFormResponse,
  deleteResponse,
  loadResponsesFromLocalStorage,
  clearFormResponses
} = responsesSlice.actions

export default responsesSlice.reducer