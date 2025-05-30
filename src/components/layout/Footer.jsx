import React from 'react'

function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="mt-auto py-4 px-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {currentYear} FormCraft. All rights reserved.</p>
        <p className="mt-1">Build beautiful forms with ease.</p>
      </div>
    </footer>
  )
}

export default Footer