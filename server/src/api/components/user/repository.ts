// import { bind } from 'decko';
// import { getManager } from 'typeorm';

import { AbsRepository, Repository } from '../helper';

import { User } from './model';

export class UserRepository extends AbsRepository<User> {
    constructor(repo: Repository<User>) {
        super('user', repo, ['userRole']);
        this.readByEmail.bind(this)
    }

    /**
     * Read user by email from db
     *
     * @param email Email to search for
     * @returns User
     */
    readByEmail(email: string): Promise<User | undefined> {
        return this.read({
            where: {
                email,
            },
        });
    }
}
