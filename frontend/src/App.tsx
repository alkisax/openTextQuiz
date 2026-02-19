import { BrowserRouter, Route, Routes } from "react-router-dom"
import GeoMapPageWrap from "./pages/GeoMapPageWrap"
import Home from "./pages/Home"
import OpenText from "./pages/OpenText"
import LanguagePageWrap from "./pages/LanguagePageWrap"
import { GeographyFullWrap } from "./pages/GeographyFullWrap"
import { TestFullWrap } from "./pages/TestFullWrap"
import AudioTest from "./test-full/pages/AudioTest"
import Layout from "./layout/Layout"
import ScrollToTop from "./components/ScrollToTop"


const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/open-text-page" element={<OpenText />} />
          <Route path="/geography-maps" element={<GeoMapPageWrap />} />
          <Route path="/language-test" element={<LanguagePageWrap />} />
          <Route path="/geography-full" element={<GeographyFullWrap />} />
          <Route path="/test-full" element={<TestFullWrap />} />
          <Route path="/audio-test" element={<AudioTest />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
