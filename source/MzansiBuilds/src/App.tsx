import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Signin from './pages/signin'
import Signup from './pages/signup'

export default function App() {

  return (
    <div className="">
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  )
}

