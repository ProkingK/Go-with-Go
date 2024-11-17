const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/game'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function createGame(request: CreateGameRequest): Promise<Game> {
  const response = await fetch(`${API_BASE}`, {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new ApiError(response.status, error.error)
  }

  return response.json()
}

export async function getGame(id: string): Promise<Game> {
  const response = await fetch(`${API_BASE}/${id}`)

  if (!response.ok) {
    const error = await response.json()
    throw new ApiError(response.status, error.error)
  }

  return response.json()
}

export async function makeMove(gameId: string, move: Move): Promise<Game> {
  const response = await fetch(`${API_BASE}/${gameId}/move`, {
    method: 'POST',
    body: JSON.stringify(move),
    headers: { 'Content-Type': 'application/json' }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new ApiError(response.status, error.error)
  }

  return response.json()
}

export async function passMove(gameId: string): Promise<Game> {
  const response = await fetch(`${API_BASE}/${gameId}/pass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new ApiError(response.status, error.error)
  }

  return response.json()
}

export async function resignGame(gameId: string): Promise<Game> {
  const response = await fetch(`${API_BASE}/${gameId}/resign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new ApiError(response.status, error.error)
  }

  return response.json()
}
