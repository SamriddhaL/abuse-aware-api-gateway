import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const users = [
    { username: 'alice', password: 'pass123', roles: ['user'] },
    { username: 'bob', password: 'adminpass', roles: ['admin'] },
];

const refreshStore: Record<string, string> = {};

@Injectable()
export class Auth {
    constructor(private jwtService: JwtService) { }

    validateUser(user: { username: string; password: string }) {
        const exactUser = users.find(u => u.username === user.username);
        if (!exactUser) return null;
        if (exactUser.password === user.password) return exactUser;
        return null;
    }

    async login(user: { username: string }) {
        const exactUser = users.find(u => u.username === user.username)!;

        const payload = {
            username: user.username,
            roles: exactUser.roles,
        };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });

        // 🔐 HASH before storing
        refreshStore[user.username] = await bcrypt.hash(refreshToken, 10);

        return {
            accessToken,
            refreshToken,
        };
    }

    async refresh(refreshToken: string) {
        let payload: any;

        try {
            payload = this.jwtService.verify(refreshToken);
        } catch {
            return null;
        }

        const storedHash = refreshStore[payload.username];
        if (!storedHash) return null;

        const isValid = await bcrypt.compare(refreshToken, storedHash);
        if (!isValid) return null;

        const newAccessToken = this.jwtService.sign(
            {
                username: payload.username,
                roles: payload.roles,
            },
            { expiresIn: '15m' },
        );

        const newRefreshToken = this.jwtService.sign(
            {
                username: payload.username,
                roles: payload.roles,
            },
            { expiresIn: '7d' },
        );

        // overwrite old hash
        refreshStore[payload.username] = await bcrypt.hash(
            newRefreshToken,
            10,
        );

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
}
