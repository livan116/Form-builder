import { createSlice } from '@reduxjs/toolkit'

// This slice handles undo/redo functionality
const initialState = {
  past: [],
  future: []
}

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    recordState: (state, action) => {
      // Add current state to past
      state.past.push(action.payload)
      
      // Clear future when a new action is performed
      state.future = []
      
      // Limit history size to prevent memory issues
      if (state.past.length > 20) {
        state.past.shift()
      }
    },
    
    undo: (state, action) => {
      const { currentState } = action.payload
      
      if (state.past.length > 0) {
        // Move current state to future
        state.future.unshift(currentState)
        
        // Return most recent past state
        return {
          past: state.past.slice(0, -1),
          future: state.future
        }
      }
      
      return state
    },
    
    redo: (state, action) => {
      const { currentState } = action.payload
      
      if (state.future.length > 0) {
        // Move current state to past
        state.past.push(currentState)
        
        // Return most recent future state
        return {
          past: state.past,
          future: state.future.slice(1)
        }
      }
      
      return state
    },
    
    clearHistory: () => {
      return initialState
    }
  }
})

export const {
  recordState,
  undo,
  redo,
  clearHistory
} = historySlice.actions

export default historySlice.reducer