import { useContext, useEffect } from "react"
import { api } from "../services/apiClient"
import { AuthContext } from "../contexts/AuthContext"
import { withSSRAuth } from "../utils/withSSRAuth"
import { setupApiClient } from "../services/api"

const Dashboard = () => {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    api.get('/me')
      .then(response => console.log(response))
      .catch(err => console.log(err))
  }, [])

  return (
    <h1>Dashboard: {user?.email}</h1>
  )
}

export default Dashboard

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context)
  const response = await apiClient.get('/me')

  console.log(response)

  return {
    props: {}
  }
})