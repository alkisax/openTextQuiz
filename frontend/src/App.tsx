import { BrowserRouter, Route, Routes } from "react-router-dom"
import GeoMapPageWrap from "./pages/GeoMapPageWrap"
import Home from "./pages/Home"
import OpenText from "./pages/OpenText"
import LanguagePageWrap from "./pages/LanguagePageWrap"
import { GeographyFullWrap } from "./pages/GeographyFullWrap"

const App = () => {
	return (
		<BrowserRouter basename={import.meta.env.BASE_URL}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/open-text-page" element={<OpenText />} />
				<Route path="/geography-maps" element={<GeoMapPageWrap />} />
        <Route path="/language-test" element={<LanguagePageWrap />} />
        <Route path="/geography-full" element={<GeographyFullWrap />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
