import { db } from "@/db";
import { user } from "@/db/schema";

const devUser = await db.insert(user).values({
	id: "test-user",
	username: "test-user",
	fullname: "Test User",
	avatarUrl: "https://github.com/test-user.png",
	email: "test-user@gmail.com",
	clerkId: "user_2wtVroIHUMMi496FhyzFWT0ETG4",
	curriculumVitae: {},
});

console.log(devUser);
