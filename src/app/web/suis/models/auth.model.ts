import { User } from './user.model';
export class Auth {
    public accessToken: string;
	public expiresAt: number;
	public user: User;

}