import { useContext, useEffect } from "react"
import { api } from "../services/apiClient"
import { AuthContext } from "../contexts/AuthContext"
import { withSSRAuth } from "../utils/withSSRAuth"
import { setupApiClient } from "../services/api"
import Can from "../components/Can"

const Dashboard = () => {
  const { user, signOut } = useContext(AuthContext)

  useEffect(() => {
    api.get('/me')
      .then(response => console.log(response))
      .catch(err => console.log(err))
  }, [])

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>

      <button onClick={signOut}>
        sign out
      </button>

      <Can permissions={ ['metrics.list'] }>
        <div>Métricas</div>
      </Can>
    </>
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