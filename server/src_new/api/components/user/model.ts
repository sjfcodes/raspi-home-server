export class User {
	constructor(id: number, email: string, firstname: string, lastname: string) {
		this.id = id;
		this.email = email;
		this.firstname = firstname;
		this.lastname = lastname;
		this.created = new Date().toISOString();
	}

	public id: number;
	public email: string;
	public firstname: string;
	public lastname: string;
	public created: string;


	// static deserialize(obj: User): User {
	// 	const user: User = new User(obj.id, obj.email, obj.firstname, obj.lastname, obj.password, obj.active);
	// 	user.userRole = obj.userRole;
	// 	return user;
	// }

	// public static mockTestUser(): User {
	// 	const user = new User(1, 'test@email.com', 'testFirstname', 'testLastname', 'testPassword', true);
	// 	user.userRole = new UserRole(1, 'Admin');
	// 	return user;
	// }
}
