import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'

const IndexPage = () => (
  <main className="container mx-auto p-4">
    <h1 className="text-4xl font-bold">Welcome to My Portfolio</h1>
    <p className="mt-2">I’m Peter Benoit, a web developer and software engineer.</p>
    <Link to="/about" className="text-blue-500">Learn more about me</Link>
  </main>
)

export default IndexPage
