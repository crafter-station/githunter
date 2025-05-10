/**
 * User search metadata for Upstash Vector
 */
export type UserSearchMetadata = {
	username: string;
	fullname: string;
	avatarUrl: string;
	field: "username" | "fullname";
	country?: string;
};
