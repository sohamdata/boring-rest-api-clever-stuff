import express from "express";
import { merge, get } from "lodash";
import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { sessionToken } = req.cookies;
        if (!sessionToken) {
            return res.status(403).json({ message: 'Not logged in / No session token' });
        }

        const currUser = await getUserBySessionToken(sessionToken);
        if (!currUser) {
            return res.status(403).json({ message: 'Not logged in / Invalid session token' });
        }

        merge(req, { identity: { currUser } });
        return next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currUserId = get(req, 'identity._id') as string;

        if (!currUserId) {
            return res.status(403).json({ message: 'No user id' });
        }

        if (currUserId !== id) {
            return res.status(403).json({ message: 'bro, you cannot delete other users. what do you think you are? an admin? (there is no admin)' });
        }

        next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
