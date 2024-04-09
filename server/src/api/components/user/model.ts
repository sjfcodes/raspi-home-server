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
}
