declare interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  thumbnail: string | undefined;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}

declare interface Authentication {
  user: User | null;
  tokens: Tokens | null;
}
