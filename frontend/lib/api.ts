const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/graphql"

type GraphQLResponse<T> = {
  data?: T
  errors?: { message: string }[]
}

export async function gql<T = any>(query: string, variables?: Record<string, unknown>, token?: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: token })
    },
    body: JSON.stringify({ query, variables })
  })
  if (!res.ok) {
    throw new Error(`API error ${res.status}`)
  }
  const json = (await res.json()) as GraphQLResponse<T>
  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }
  return json
}
