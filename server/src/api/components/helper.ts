// import { bind } from 'decko';
import { Router } from 'express';
// import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

// import { AuthService } from '../../services/auth';
import { RedisService } from '../../services/redis';
import { logger } from '../../config/logger';

interface FindManyOptions<T> {}
interface FindOneOptions<T> {}
export interface Repository<T> {
    find: ({}: unknown) => Promise<T[]>
    findOne: ({}: unknown) => Promise<T>
    read: ({}: unknown) => Promise<T>
    readAll: ({}: unknown) => Promise<T[]>
    remove: ({}: unknown) => Promise<T>
    save: ({}: unknown) => Promise<T>
}

export interface IComponentRoutes<T> {
    readonly name: string;
    readonly controller: T;
    readonly router: Router;
    // authSerivce: AuthService;

    initRoutes(): void;
    initChildRoutes?(): void;
}

export abstract class AbsRepository<T> {
    protected readonly name: string;
    protected readonly repo: Repository<T>;
    protected readonly defaultRelations: string[];

    constructor(
        name: string,
        repo: Repository<T>,
        defaultRelations: string[] = []
    ) {
        this.name = name;
        this.repo = repo;
        this.defaultRelations = defaultRelations;
        this.readAll.bind(this);
    }

    /**
     * Delete cache entries
     */
    // @bind
    deleteFromCache() {
        RedisService.deleteByKey(this.name);
    }

    /**
     * Read all entities from db
     *
     * @param options Find options
     * @param cached Use cache
     * @returns Entity array
     */
    // @bind
    readAll(options: FindManyOptions<T> = {}, cached?: boolean): Promise<T[]> {
        if (Object.keys(options).length) {
            return this.repo.find({
                relations: this.defaultRelations,
                ...options,
            });
        }

        if (cached) {
            return RedisService.getAndSetObject<T[]>(this.name, () =>
                this.readAll({}, false)
            );
        }

        return this.repo.find({
            relations: this.defaultRelations,
        });
    }

    /**
     * Read a certain entity from db
     *
     * @param options Find options
     * @returns Entity
     */
    // @bind
    read(options: FindOneOptions<T>): Promise<T | undefined> {
        return this.repo.findOne({
            relations: this.defaultRelations,
            ...options,
        });
    }

    /**
     * Save new or updated entity to db
     *
     * @param entity Entity to save
     * @returns Saved entity
     */
    // @bind
    async save(entity: T): Promise<T> {
        const saved: T = await this.repo.save(entity);
        this.deleteFromCache();

        return saved;
    }

    /**
     * Delete entity from db
     *
     * @param entity Entity to delete
     * @returns Deleted entity
     */
    // @bind
    async delete(entity: T): Promise<T> {
        const deleted = await this.repo.remove(entity);
        this.deleteFromCache();

        return deleted;
    }
}
