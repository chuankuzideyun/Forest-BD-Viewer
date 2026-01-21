"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { gql } from "../lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const validateEmail = (value: string) => {
    return value.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  }

  async function handleLogin(e?: FormEvent) {
    e?.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!validateEmail(email)) {
        setError("Please enter a valid email address")
        return
      }
      if (!password) {
        setError("Password required")
        return
      }

      const res = await gql<{ login: string }>(
        `
        mutation Login($email:String!,$password:String!){
          login(email:$email,password:$password)
        }
        `,
        { email, password }
      )

      const token = res.data?.login
      if (!token) {
        setError("Invalid credentials")
        return
      }

      localStorage.setItem("token", token)
      router.push("/map")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={container}>
      <form style={card} onSubmit={handleLogin}>
        <h1>Login</h1>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
        <p>
          No account?{" "}
          <button type="button" onClick={() => router.push("/register")}>
            Register
          </button>
        </p>
      </form>
    </div>
  )
}

const container = {
  display: "flex",
  height: "100vh",
  justifyContent: "center",
  alignItems: "center",
  background: "#f5f5f5"
}

const card = {
  background: "white",
  padding: 24,
  width: 320,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  borderRadius: 8
}