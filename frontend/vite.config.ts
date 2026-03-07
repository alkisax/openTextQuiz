import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(({ mode }) => ({
base:
  process.env.GH_PAGES
    ? "/openTextQuiz/"
    : mode === "production"
    ? "/open-text/"
    : "/",
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
}))
