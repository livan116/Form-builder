import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { toggleTheme } from '../../redux/slices/uiSlice'
import { FiMoon, FiSun, FiHome, FiPlus } from 'react-icons/fi'

function Header() {
  const { theme } = useSelector(state => state.ui)
  const { currentFormId } = useSelector(state => state.form)
  const dispatch = useDispatch()
  const location = useLocation()
  
  const isBuilder = location.pathname === '/' || location.pathname.startsWith('/builder')
  
  return (
    <header className="bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg 
                className="h-8 w-8 text-primary-500" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">FormCraft</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isBuilder && currentFormId && (
              <div className="hidden sm:flex space-x-2">
                <Link 
                  to={`/preview/${currentFormId}`}
                  className="btn-outline"
                >
                  Preview
                </Link>
                <Link 
                  to={`/form/${currentFormId}`}
                  className="btn-outline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Form
                </Link>
                <Link 
                  to={`/responses/${currentFormId}`}
                  className="btn-outline"
                >
                  Responses
                </Link>
              </div>
            )}
            
            {!isBuilder && (
              <Link to="/" className="icon-btn" title="Home">
                <FiHome className="h-5 w-5" />
              </Link>
            )}
            
            <Link to="/" className="icon-btn" title="Create New Form">
              <FiPlus className="h-5 w-5" />
            </Link>
            
            <button 
              onClick={() => dispatch(toggleTheme())}
              className="icon-btn"
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header