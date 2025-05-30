import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loadFromLocalStorage } from './redux/slices/formSlice'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import FormBuilderPage from './pages/FormBuilderPage'
import FormPreviewPage from './pages/FormPreviewPage'
import FormFillPage from './pages/FormFillPage'
import FormResponsesPage from './pages/FormResponsesPage'
import NotFoundPage from './pages/NotFoundPage'
import ThemeProvider from './components/providers/ThemeProvider'

function App() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    // Load forms from localStorage on app initialization
    dispatch(loadFromLocalStorage())
  }, [dispatch])

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<FormBuilderPage />} />
            <Route path="/builder/:formId" element={<FormBuilderPage />} />
            <Route path="/preview/:formId" element={<FormPreviewPage />} />
            <Route path="/form/:formId" element={<FormFillPage />} />
            <Route path="/responses/:formId" element={<FormResponsesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App