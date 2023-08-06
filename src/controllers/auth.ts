import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { authentication, randomString } from "../helpers";

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.sendStatus(400);
        }
        const userExists = await getUserByEmail(email);
        if (userExists) {
            return res.sendStatus(400);
        }

        const salt = randomString();
        const user = await createUser({
            username,
            email,
            authentication: {
                salt,
                password: authentication(salt, password)
            },
        });

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.sendStatus(400);
        }
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }
        // console.log(user);

        const { salt, password: dbPass } = user.authentication;
        const hash = authentication(salt, password);

        if (hash !== dbPass) {
            return res.status(403).json({ message: 'Invalid password' });
        }

        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();

        res.cookie('sessionToken', user.authentication.sessionToken, { domain: 'localhost', path: '/', });
        return res.status(200).json({ message: 'Logged in', user: user });

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
