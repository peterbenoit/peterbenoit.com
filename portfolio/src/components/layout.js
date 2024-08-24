import React from 'react'
import { Link } from 'gatsby'

const Layout = ({ children }) => (
  <div>
    <header className="bg-gray-800 p-4 text-white">
      <nav className="container mx-auto">
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/about" className="mr-4">About</Link>
        <Link to="/projects" className="mr-4">Projects</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
    <main>{children}</main>
  </div>
)

export default Layout
