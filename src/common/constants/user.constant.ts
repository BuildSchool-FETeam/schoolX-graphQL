export enum UserType {
  INSTRUCTOR,
  LEARNER,
}

export interface TokenType {
  id: string
  email: string
  type?: UserType
  isActive?: 0 | 1
  role: string
  isAdmin: boolean
}
