import type { ReactNode } from "react"
import Navbar from "@/components/Navbar"

type Props = {
	children: ReactNode
}

const Layout = ({ children }: Props) => {
	return (
		<div className="min-h-screen bg-muted/30">
			<Navbar />
			<main className="pt-6">{children}</main>
		</div>
	)
}

export default Layout
