export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  tokenType: string;
  email: string;
  role: string;
};
