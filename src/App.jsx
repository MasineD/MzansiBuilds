import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages'
import { UserAuthentication } from './pages'
import { Overview } from './pages'
import { Projects } from './pages'
import { CelebrationWall } from './pages'

const App = () => {
    let [token, setToken] = useState(false);

  return (
    <>
    <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'/login'} element={<UserAuthentication setToken={setToken}/>} />
        {/* Protected routes to the features */}
        {token ? <Route path={'/overview'} element={<Overview />} />: ''}
        {token ? <Route path={'/projects'} element={<Projects />} />: ''}
        {token ? <Route path={'/celebration-wall'} element={<CelebrationWall />} />: ''}
    </Routes>
    </>
  )
}

export default App