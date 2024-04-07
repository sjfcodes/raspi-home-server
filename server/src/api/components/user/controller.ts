// import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { UtilityService } from '../../../services/utility';

import { User } from './model';
import { UserRepository } from './repository';
import { logger } from '../../../config/logger';
import { Repository } from '../helper';

const user: User = {
    id: 0,
    email: ' email',
    firstname: ' firstname',
    lastname: ' lastname',
    password: ' password',
    active: true,
    created: new Date().toISOString(),
};

const repo: Repository<User> = {
    find: (options: unknown) => Promise.resolve([user]),
    findOne: (options: unknown) => Promise.resolve(user),
    read: (options: unknown) => Promise.resolve(user),
    readAll: (options: unknown) => Promise.resolve([user]),
    remove: (options: unknown) => Promise.resolve(user),
    save: (options: unknown) => Promise.resolve(user),
};

export class UserController {
	private readonly repo: UserRepository;
	constructor() {
		this.repo = new UserRepository(repo);
		logger.debug('this.repo', this.repo)
		this.readUsers.bind(this);
	}

	/**
	 * Read users
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	// @bind
	async readUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const users: User[] = await this.repo.readAll({}, true);

			return res.json(users);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	// @bind
	async readUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;

			const user: User | undefined = await this.repo.read({
				where: {
					id: +userID
				}
			});

			return res.json(user);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read user by email
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	// @bind
	async readUserByEmail(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { email } = req.query;

			const user = await this.repo.readByEmail(email as string);

			return res.json(user);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	// @bind
	async createUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { email, firstname, lastname, password, active } = req.body;

			const existingUser: User | undefined = await this.repo.read({
				where: {
					email
				}
			});

			if (existingUser) {
				return res.status(400).json({ error: 'Email is already taken' });
			}

			const user: User = new User(
				undefined as unknown as number,
				email,
				firstname,
				lastname,
				await UtilityService.hashPassword(password),
				active
			);
			const newUser: User = await this.repo.save(user);

			return res.json(newUser);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Update user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	// @bind
	async updateUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;
			const { email, firstname, lastname, password, active } = req.body;

			if (!userID) {
				return res.status(400).json({ error: 'Invalid request' });
			}

			const existingUser: User | undefined = await this.repo.read({
				where: {
					id: +userID
				}
			});

			if (!existingUser) {
				return res.status(404).json({ error: 'User not found' });
			}

			existingUser.email = email;
			existingUser.firstname = firstname;
			existingUser.lastname = lastname;
			existingUser.password = await UtilityService.hashPassword(password);
			existingUser.active = active;

			const updatedUser: User = await this.repo.save(existingUser);

			return res.json(updatedUser);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	// @bind
	async deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;

			const user: User | undefined = await this.repo.read({
				where: {
					id: +userID
				}
			});

			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}

			await this.repo.delete(user);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
