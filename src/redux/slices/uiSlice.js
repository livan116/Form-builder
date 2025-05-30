import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedFieldId: null,
  previewMode: 'desktop', // 'desktop', 'tablet', 'mobile'
  theme: 'light', // 'light', 'dark'
  sidebarView: 'fields', // 'fields', 'properties'
  isConfigPanelOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedField: (state, action) => {
      state.selectedFieldId = action.payload
      state.isConfigPanelOpen = !!action.payload
    },
    
    setPreviewMode: (state, action) => {
      state.previewMode = action.payload
    },
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('formBuilder_theme', state.theme)
    },
    
    setTheme: (state, action) => {
      state.theme = action.payload
      localStorage.setItem('formBuilder_theme', state.theme)
    },
    
    setSidebarView: (state, action) => {
      state.sidebarView = action.payload
    },
    
    toggleConfigPanel: (state) => {
      state.isConfigPanelOpen = !state.isConfigPanelOpen
    },
    
    closeConfigPanel: (state) => {
      state.isConfigPanelOpen = false
      state.selectedFieldId = null
    },
    
    loadThemeFromStorage: (state) => {
      const savedTheme = localStorage.getItem('formBuilder_theme')
      if (savedTheme) {
        state.theme = savedTheme
      }
    }
  }
})

export const {
  setSelectedField,
  setPreviewMode,
  toggleTheme,
  setTheme,
  setSidebarView,
  toggleConfigPanel,
  closeConfigPanel,
  loadThemeFromStorage
} = uiSlice.actions

export default uiSlice.reducer