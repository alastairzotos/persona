import { PersonaAdapter } from "@bitmetro/persona-node";
import { UserDetail, UserDetails } from "@bitmetro/persona-types";

export interface User {
  _id: string;
  email: string;
  details: UserDetails;
}

export class MyAdapter implements PersonaAdapter<User> {
  getUser(email: string): Promise<User> {
    return Promise.resolve({
      _id: '12345',
      email,
      details: {
        first_name: 'Joe',
      }
    });
  }

  createUser(email: string, details: Partial<Record<UserDetail, string>>): Promise<User> {
    return Promise.resolve({
      _id: '12345',
      email,
      details
    })
  }
}
