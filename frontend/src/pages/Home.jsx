import React from 'react'

const Home = () => {
  return (
    <div className="min-h-screen bg-[rgb(240,244,242)] text-[rgb(15,23,42)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[rgb(27,67,50)] mb-4">Welcome to EchoNote</h1>
        <h2 className="text-2xl font-semibold text-[rgb(45,106,79)] mb-6">Speech Recognition Notes App</h2>
        <p className="text-[rgb(100,116,139)] mb-6">
          This application allows you to create, manage, and store notes using speech recognition technology. 
          To get started, please register for an account or log in if you already have one.
        </p>
        <ul className="space-y-4">
          <li className="flex items-center gap-3">
            <strong className="text-[rgb(15,23,42)]">Register:</strong> 
            <span className="text-[rgb(100,116,139)]">Create a new account to start using the app.</span>
            <a 
              href="/register" 
              className="bg-[rgb(45,106,79)] text-white px-4 py-2 rounded-lg hover:bg-[rgb(27,67,50)] transition-colors"
            >
              Register
            </a>
          </li>
          <li className="flex items-center gap-3">
            <strong className="text-[rgb(15,23,42)]">Login:</strong> 
            <span className="text-[rgb(100,116,139)]">Access your account to manage your notes.</span>
            <a 
              href="/login" 
              className="bg-[rgb(45,106,79)] text-white px-4 py-2 rounded-lg hover:bg-[rgb(27,67,50)] transition-colors"
            >
              Login
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Home