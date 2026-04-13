import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages'
import { UserAuthentication } from './pages'

const App = () => {
    let [token, setToken] = useState(false);

  return (
    <>
    <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'/login'} element={<UserAuthentication setToken={setToken}/>} />
    </Routes>
    </>
  )
}

export default App