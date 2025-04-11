import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import prisma from '../prisma';

class UserController {
    static async createUser(req: Request, res: Response) {
        const { name, email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });

            res.status(201).json({
                message: 'User created successfully',
                user,
            });
        } catch (error: unknown) {
            if (error instanceof Error && error.message) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Unknown error occurred while creating user' });
            }
        }
    }

    // Get all users
    static async getUsers(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching users' });
        }
    }

    // Get a user by email
    static async getUserByEmail(req: Request, res: Response) {
        const { email } = req.params;
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching user' });
        }
    }
}

export default UserController;
