import { IUser } from '@/types'

export enum Role {
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
}

export const MOCK_USERS: Record<Role, IUser> = {
  [Role.ADMIN]: {
    id: '1',
    username: 'admin',
    full_name: 'Admin User',
    email: 'admin@example.com',
    role: Role.ADMIN,
    code: 'ADM001',
    avatar: null,
    gender: 'MALE',
    date_of_birth: '1990-01-01',
    date_joined: '2025-01-01',
    phone_number: null,
    address: null,
  },
  [Role.TEACHER]: {
    id: '2',
    username: 'teacher',
    full_name: 'Teacher User',
    email: 'teacher@example.com',
    role: Role.TEACHER,
    code: 'TEA001',
    avatar: null,
    gender: 'FEMALE',
    date_of_birth: '1992-01-01',
    date_joined: '2025-01-01',
    phone_number: null,
    address: null,
  },
  [Role.STUDENT]: {
    id: '3',
    username: 'student',
    full_name: 'Student User',
    email: 'student@example.com',
    role: Role.STUDENT,
    code: 'STU001',
    avatar: null,
    gender: 'MALE',
    date_of_birth: '2000-01-01',
    date_joined: '2025-01-01',
    phone_number: null,
    address: null,
  },
}
