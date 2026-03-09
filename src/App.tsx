import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ToolPage from './pages/ToolPage'
import { AppProvider } from './context/AppContext'

const basename = import.meta.env.BASE_URL

function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tool/:id" element={<ToolPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
