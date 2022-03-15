import { useContext } from "react"
import { AuthContext } from "../styles/contexts/AuthContext"

const Dashboard = () => {
  const { user } = useContext(AuthContext)

  return (
    <h1>dash</h1>
  )
}

export default Dashboard