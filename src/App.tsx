import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MedicalCaseSheet from './Navigation'
import NotFound from './NotFound'
import RespirationGM from './RespirationGM'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MedicalCaseSheet />} />
        <Route path="/medicine/respiratory" element={<RespirationGM />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
