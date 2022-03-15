import { useContext, useState } from 'react'
import { AuthContext } from '../styles/contexts/AuthContext'
import styles from '../styles/Home.module.css'

const Home = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn, isAuthenticated } = useContext(AuthContext);

  const handleSubmit = async () => {
    const data = {
      email,
      password
    }

    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
      >
        Entrar
      </button>
    </form>
  )
}

export default Home