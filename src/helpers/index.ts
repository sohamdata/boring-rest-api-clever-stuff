import crypto from 'crypto';

export const randomString = () => crypto.randomBytes(128).toString('base64');

const SECRET = process.env.SECRET;

export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};
