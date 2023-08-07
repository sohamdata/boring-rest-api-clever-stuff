import express from 'express';
import { getUsers, updateUserById, deleteUserById } from '../db/users';
// import { getUserById } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        return res.json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);
        return res.json({ message: "User deleted successfully", deleted: deletedUser });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        if (!username && !email) {
            return res.status(400).json({ message: "No fields to update" });
        }

        // const user = await getUserById(id);
        // username ? user.username = username : null;
        // email ? user.email = email : null;

        // await user.save();

        // return res.json({ message: "User updated successfully", updated: user });

        // OR

        const updatedUser = await updateUserById(id, { username, email });
        return res.json({ message: "User updated successfully", updated: updatedUser });

    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
