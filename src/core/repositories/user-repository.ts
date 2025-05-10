import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "../models/user";

export class UserRepository {
	public async insert(user: User): Promise<void> {
		await db.insert(userTable).values({ ...user });
	}

	public async update(user: User): Promise<void> {
		await db
			.update(userTable)
			.set({ ...user, id: user.id, updatedAt: new Date() })
			.where(eq(userTable.id, user.id));
	}

	public async findByUsername(username: string): Promise<User | null> {
		const existingUser = await db.query.user.findFirst({
			where: eq(userTable.username, username),
		});

		if (!existingUser) {
			return null;
		}

		return existingUser;
	}

	public async findById(id: string): Promise<User | null> {
		const existingUser = await db.query.user.findFirst({
			where: eq(userTable.id, id),
		});

		if (!existingUser) {
			return null;
		}

		return existingUser;
	}
}
