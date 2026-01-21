"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { gql } from "../../lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const validateEmail = (value: string) => {
    return value
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  }

  async function handleRegister(e?: FormEvent) {
    e?.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!email || !password) {
        setError("Fields cannot be empty")
        return
      }

      if (!validateEmail(email)) {
        setError("Please enter a valid email address")
        return
      }

      await gql(
        `
        mutation Register($email:String!,$password:String!){
          register(email:$email,password:$password)
        }
        `,
        { email, password }
      )

      router.push("/")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={container}>
      <form style={card} onSubmit={handleRegister}>
        <h1>Register</h1>
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
          {loading ? "Saving..." : "Create account"}
        </button>
        <button type="button" onClick={() => router.push("/")}>
          Back to login
        </button>
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