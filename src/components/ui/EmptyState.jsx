import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'

function EmptyState({ message = "No data available", showCreateButton = true }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 h-full">
      <div className="text-center">
        <svg 
          className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" 
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">{message}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new form.
        </p>
        
        {showCreateButton && (
          <div className="mt-6">
            <Link
              to="/"
              className="btn-primary flex items-center justify-center mx-auto"
            >
              <FiPlus className="mr-2" />
              Create New Form
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmptyState