import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ToolPage from './pages/ToolPage'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tool/:id" element={<ToolPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
