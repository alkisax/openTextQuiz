import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"

const Navbar = () => {
  return (
    <nav className="border-b bg-background">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        <div className="font-semibold text-lg">
          ΠΕΓΠ
        </div>

        <div className="flex gap-3">

          <NavLink to="/">
            {({ isActive }) => (
              <Button variant={isActive ? "default" : "ghost"}>
                Αρχική
              </Button>
            )}
          </NavLink>

          <NavLink to="/language-test">
            {({ isActive }) => (
              <Button variant={isActive ? "default" : "ghost"}>
                Κατανόηση Γλώσσας
              </Button>
            )}
          </NavLink>

          <NavLink to="/test-full">
            {({ isActive }) => (
              <Button variant={isActive ? "default" : "ghost"}>
                Γνώσεων
              </Button>
            )}
          </NavLink>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
