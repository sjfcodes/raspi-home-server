import { compare, genSalt, hash } from 'bcryptjs';
import { v4 } from 'uuid';
import * as crypto from 'crypto';

import { logger } from '../config/logger';

export function handleError(err: any): void {
    logger.error(err.stack || err);
}

export function hashPassword(plainPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
        genSalt((err, salt) => {
            if (err) {
                reject(err);
            }

            hash(plainPassword, salt, (error, hashedVal) => {
                if (error) {
                    reject(error);
                }

                resolve(hashedVal);
            });
        });
    });
}

/**
 * Compares plain password with hashed password
 *
 * @param plainPassword Plain password to compare
 * @param hashedPassword Hashed password to compare
 * @returns whether passwords match
 */
export function verifyPassword(
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        compare(plainPassword, hashedPassword, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
}

/**
 * Hash string with sha256 algorithm
 *
 * @param text String to hash
 * @returns Returns hashed string
 */
export function hashString(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
}

export function generateUuid(): string {
    return v4();
}

export function getDate() {
    return new Date().toISOString();
}
