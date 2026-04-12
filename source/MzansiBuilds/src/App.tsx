import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'

export default function App() {

  return (
    <div className="">
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  )
}

