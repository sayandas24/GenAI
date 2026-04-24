export interface Chat {
  _id: string;
  content: string;
  role: "user" | "model";
  createdAt: string;
  updatedAt: string;
}

export interface GetChatsResponse {
  message: string;
  chats: Chat[];
}

export interface CreateChatResponse {
  message: string;
  response: string;
}

export interface ClearChatResponse {
  message: string;
}
