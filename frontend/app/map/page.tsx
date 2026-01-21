"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Map from "../../components/Map"
import { gql } from "../../lib/api"

export default function Page() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem("token")
    if (!t) {
      router.push("/")
    } else {
      setToken(t)
    }
  }, [router])

  useEffect(() => {
    if (!token) return
    const verify = async () => {
      try {
        await gql(
          `
          query Verify { me { id } }
          `,
          undefined,
          token
        )
      } catch {
        localStorage.removeItem("token")
        router.push("/")
      }
    }
    verify()
  }, [router, token])

  if (!token) return null

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      {/* Logout button */}
      <button
        onClick={() => {
          localStorage.removeItem("token")
          router.push("/login")
        }}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          padding: "8px 12px",
          background: "#2e7d32",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      {/* Map */}
      <Map token={token} />
    </div>
  )
}
