import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import Layout from '@/components/Layout'
import DirectorDetail from '@/pages/DirectorDetail'
import Directors from '@/pages/Directors'
import EpisodeDetail from '@/pages/EpisodeDetail'
import Episodes from '@/pages/Episodes'
import GuestDetail from '@/pages/GuestDetail'
import Guests from '@/pages/Guests'
import Home from '@/pages/Home'
import MovieDetail from '@/pages/MovieDetail'
import Movies from '@/pages/Movies'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/episodes" element={<Episodes />} />
          <Route path="/episodes/:id" element={<EpisodeDetail />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/directors" element={<Directors />} />
          <Route path="/directors/:id" element={<DirectorDetail />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/guests/:id" element={<GuestDetail />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </>
  )
}
