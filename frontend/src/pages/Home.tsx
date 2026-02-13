import { Button, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom"

const Home = () => {
	const navigate = useNavigate()

	return (
		<Stack
			spacing={2}
			alignItems="center"
			justifyContent="center"
			sx={{ minHeight: "100vh" }}
		>
			<Button
				variant="contained"
				size="large"
				onClick={() => navigate("/open-text-page")}
			>
				Open Text
			</Button>

			<Button
				variant="contained"
				size="large"
				onClick={() => navigate("/geography-maps")}
			>
				Geography Maps
			</Button>

			<Button
				variant="contained"
				size="large"
				onClick={() => navigate("/language-test")}
			>
				Language Test
			</Button>
		</Stack>
	)
}

export default Home
