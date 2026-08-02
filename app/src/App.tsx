import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Crags from './pages/Crags'
import CragDetail from './pages/CragDetail'
import RoutesPage from './pages/Routes'
import Community from './pages/Community'
import Plan from './pages/Plan'
import Services from './pages/Services'
import Sources from './pages/Sources'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/crags" element={<Crags />} />
        <Route path="/crags/:slug" element={<CragDetail />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/community" element={<Community />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/services" element={<Services />} />
        <Route path="/sources" element={<Sources />} />
      </Route>
    </Routes>
  )
}
