import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-6xl font-bold text-primary-500">404</h1>
      <h2 className="mt-4 text-2xl font-medium text-gray-900 dark:text-white">Page Not Found</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-6 btn-primary">
        Go Home
      </Link>
    </div>
  )
}

export default NotFoundPage