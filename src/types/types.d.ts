declare interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  thumbnail: string | undefined;
}

declare interface SearchUser {
  id: number;
  name: string;
  thumbnail: string;
  username: string;
  status: string;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}

declare interface Authentication {
  user: User | null;
  tokens: Tokens | null;
}

declare interface Connection {
  id: number;
  sender: User;
  receiver: User;
  accepted?: boolean;
  created_at: string;
  updated_at: string;
}

declare interface MessagePreview {
  id: Connection.id;
  friend: User;
  preview: string;
  updated_at: Connection.updated_at;
}

declare interface Message {
  id: number;
  connection: Connection;
  sender: User;
  content: string;
  created_at: string;
  is_my_message: boolean;
}

declare interface MessageData {
  messages: Message | Message[];
  user: User;
}
