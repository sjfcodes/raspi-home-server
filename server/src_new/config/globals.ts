
export const env = {
    REDIS_URL: process.env.REDIS_URL || '',
    NODE_ENV: process.env.NODE_ENV || 'development',
    NODE_PORT: process.env.NODE_PORT || process.env.PORT || 3000,
};