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
