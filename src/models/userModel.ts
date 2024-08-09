import { User } from "@prisma/client";

export type UserResponse = {
  id: string;
  username: string;
  name: string;
  token?: string;
};

export type CreateUserRequest = {
    username: string;
    name: string;
    password: string;
}

export type LoginUserRequest = {
    username: string;
    password: string;
}

export type UpdateUserRequest = {
  name?: string;
  password: string;
}

export type SearchContactRequest = {
  name?: string;
  phone?: string;
  email?: string;
  page: number;
  perPage: number;
}

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    username: user.username,
    name: user.name
  };
}
