import { Navigate, Route, Routes } from 'react-router-dom'
import AppChrome from './components/chrome/AppChrome'
import ArchivePage from './pages/ArchivePage'
import FocusPage from './pages/FocusPage'
import MethodologyPage from './pages/MethodologyPage'
import QueryPage from './pages/QueryPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppChrome />}>
        <Route index element={<Navigate to="/query" replace />} />
        <Route path="query" element={<QueryPage />} />
        <Route path="archive" element={<ArchivePage />} />
        <Route path="methodology" element={<MethodologyPage />} />
        <Route path="focus" element={<FocusPage />} />
        <Route path="*" element={<Navigate to="/query" replace />} />
      </Route>
    </Routes>
  )
}

export default App
