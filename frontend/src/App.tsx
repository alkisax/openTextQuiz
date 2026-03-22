import { BrowserRouter, Route, Routes } from "react-router-dom"
import ScrollToTop from "./components/ScrollToTop"
import Layout from "./layout/Layout"
import { GeographyFullWrap } from "./pages/GeographyFullWrap"
import GeoMapPageWrap from "./pages/GeoMapPageWrap"
import LanguagePageWrap from "./pages/LanguagePageWrap"
import OpenText from "./pages/OpenText"
import { TestFullWrap } from "./pages/TestFullWrap"
import AudioTest from "./test-full/pages/AudioTest"
// import Home from "./pages/Home"
import EntryPoint from "./test-full/pages/EntryPoint"
import LanguagePagePicker from "./test-full/pages/LanguagePagePicker"
import CoreTestFullPagePicker from "./core-transfer/pages/CoreTestFullPagePicker"

const App = () => {
	return (
		<BrowserRouter basename={import.meta.env.BASE_URL}>
			<ScrollToTop />
			<Layout>
				<Routes>
					<Route path="/" element={<EntryPoint />} />
          <Route path='/core-test' element={<CoreTestFullPagePicker />} />
					<Route path="/open-text-page" element={<OpenText />} />
					<Route path="/geography-maps" element={<GeoMapPageWrap />} />
					<Route path="/language-test" element={<LanguagePageWrap />} />
					<Route path="/geography-full" element={<GeographyFullWrap />} />
					<Route path="/test-full" element={<TestFullWrap />} />
					<Route path="/audio-test" element={<AudioTest />} />
					<Route path="/language-test-full" element={<LanguagePagePicker />} />
				</Routes>
			</Layout>
		</BrowserRouter>
	)
}

export default App
