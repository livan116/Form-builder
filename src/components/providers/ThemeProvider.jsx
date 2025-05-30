import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadThemeFromStorage } from '../../redux/slices/uiSlice'

function ThemeProvider({ children }) {
  const { theme } = useSelector(state => state.ui)
  const dispatch = useDispatch()
  
  useEffect(() => {
    // Load theme preference from localStorage on initial load
    dispatch(loadThemeFromStorage())
  }, [dispatch])
  
  useEffect(() => {
    // Apply theme to the document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])
  
  return children
}

export default ThemeProvider