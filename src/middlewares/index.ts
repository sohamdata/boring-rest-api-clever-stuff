import express from "express";
import { merge, get } from "lodash";
import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { sessionToken } = req.cookies;
        if (!sessionToken) {
            return res.status(403).json({ message: 'No session token' });
        }

        const currUser = await getUserBySessionToken(sessionToken);
        if (!currUser) {
            return res.status(403).json({ message: 'Invalid session token' });
        }

        merge(req, { identity: { currUser } });
        return next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
