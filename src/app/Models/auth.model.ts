export interface AuthModel {
	message: string;
	email: string;
	username: string;
	isAuthenticated: boolean;
	token: string;
	roles: string[];
}