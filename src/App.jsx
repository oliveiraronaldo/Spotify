import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./assets/pages/Home/Home"
import Artista from "./assets/pages/Artista/Artista"
import Album from "./assets/pages/Album/Album"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/artista/:id" element={<Artista />} />
          <Route path="/album/:name/:id" element={<Album />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
