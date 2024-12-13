import { PersonaAdapter } from "@bitmetro/persona-node";
import { UserDetail } from "@bitmetro/persona-types";
import { MockDb, User } from "./mock-db";

const mockDb = new MockDb();

export class MyAdapter implements PersonaAdapter<User> {
  async getUserByEmail(email: string) {
    console.log('revalidating');
    return await mockDb.getUserByEmail(email);
  }

  async createUser(email: string, details: Partial<Record<UserDetail, string>>, registerState: string) {
    console.log('oauth:', registerState);
    return await mockDb.createUser({ email, firstName: details.first_name! });
  }

  async createUserWithPasswordHash(email: string, details: Partial<Record<UserDetail, string>>, passwordHash: string, registerState: string) {
    console.log('default:', registerState);
    return await mockDb.createUser({
      email,
      firstName: 'test',//details.first_name!,
      passwordHash,
    })
  }

  async getUserPasswordHash(user: User) {
    const found = await mockDb.getUserByEmail(user.email, false);

    return found?.passwordHash;
  }

  async exchangeJwtPayloadForUser(payload: User) {
    return await this.getUserByEmail(payload.email);
  }
}
