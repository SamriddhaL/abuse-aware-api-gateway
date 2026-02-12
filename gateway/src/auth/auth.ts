import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const users = [
    { username: 'alice', password: 'pass123', roles: ['user'] },
    { username: 'bob', password: 'adminpass', roles: ['admin'] },
];

const refreshStore: Record<string, string> = {};

@Injectable()
export class Auth {
    constructor(private jwtService: JwtService) {}

    validateUser(user: { username: string; password: string }) {
        const exactUser = users.find(u => u.username === user.username);
        if (!exactUser) {
            return null;
        }
        if (exactUser.password === user.password) {
            return exactUser;
        }
        return null;
    }


    login(user: { username: string }) {
        const exactUser = users.find(u => u.username === user.username);

        const payload = {
            username: user.username,
            roles: exactUser!.roles,
        };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });

        refreshStore[user.username] = refreshToken;

        return {
            accessToken,
            refreshToken,
        };
    }

    refresh(refreshToken: string) {
        let payload: any;

        try {
            payload = this.jwtService.verify(refreshToken);
        } catch {
            return null;
        }

    const storedToken = refreshStore[payload.username];
    if (!storedToken || storedToken !== refreshToken) {
        return null;
    }

    const newAccessToken = this.jwtService.sign(
    {
        username: payload.username,
        roles: payload.roles,
    },
    { expiresIn: '15m' },
    );

    return { accessToken: newAccessToken };
    }
}
