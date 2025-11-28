import React from 'react'

const Home = () => {
  return (
    <>
    <div>Home</div>
    <h2>Welcome to the Speech Recognition Notes App</h2>
    <p>This application allows you to create, manage, and store notes using speech recognition technology. To get started, please register for an account or log in if you already have one.</p>
    <ul>
      <li><strong>Register:</strong> Create a new account to start using the app.</li> <a href="/register">Register</a> 
      <li ><strong>Login:</strong> Access your account to manage your notes.</li> <a href="/login">Login</a>
    </ul>
    </>
  )
}

export default Home