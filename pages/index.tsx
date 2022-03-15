import { useState } from 'react'
import styles from '../styles/Home.module.css'

const Home = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    const data = {
      email,
      password
    }
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