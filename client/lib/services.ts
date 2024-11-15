const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function createGame(request: CreateGameRequest): Promise<Game> {
  const response = await fetch(`${API_BASE}/game`, {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(response.status, error.error);
  }

  return response.json();
}

export async function getGame(id: string): Promise<Game> {
  const response = await fetch(`${API_BASE}/game/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(response.status, error.error);
  }

  return response.json();
}

export async function makeMove(gameId: string, move: Move): Promise<Game> {
  const response = await fetch(`${API_BASE}/game/${gameId}/move`, {
    method: 'POST',
    body: JSON.stringify(move),
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(response.status, error.error);
  }

  return response.json();
}
