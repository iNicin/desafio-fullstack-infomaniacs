type ApiErrorPayload = { error?: string; message?: string };

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as ApiErrorPayload;
    return data.error || data.message || `Erro HTTP ${res.status}`;
  } catch {
    return `Erro HTTP ${res.status}`;
  }
}

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export async function apiLogin(payload: LoginRequest): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await parseErrorMessage(res);
    throw new Error(msg);
  }

  const data = (await res.json()) as LoginResponse;
  return data;
}
