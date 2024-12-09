import { Document } from 'mongoose';

export interface User extends Document {
  readonly id: number;
  readonly name: string;
  readonly phone: number;
  readonly email: string;
  readonly password: string;
  readonly role: string;
}