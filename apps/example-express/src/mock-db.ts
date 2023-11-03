import { UserDetails } from "@bitmetro/persona-types";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  passwordHash?: string;
}

export class MockDb {
  private users: Record<string, User> = {};

  async getUserByEmail(email: string, excludePwd = true): Promise<User | undefined> {
    const user = Object.values(this.users).find((user) => user.email === email);

    if (!user) {
      return;
    }

    if (!excludePwd) {
      return user;
    }

    const noPwd = { ...user };
    delete noPwd['passwordHash'];

    return noPwd;
  }

  async createUser(user: Omit<User, '_id'>): Promise<User> {
    const _id = `${Math.floor(Math.random() * 1000)}`;

    const created: User = {
      _id,
      ...user,
    }

    this.users[_id] = created;

    return created;
  }
}
