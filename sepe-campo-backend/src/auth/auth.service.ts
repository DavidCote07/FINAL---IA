import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (!match) return null;
    // omit password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user as any;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(username: string, password: string, role?: string) {
    const existing = await this.usersService.findByUsername(username);
    if (existing) throw new UnauthorizedException('Usuario ya existe');
    const user = await this.usersService.create(username, password, role);
    return { id: user.id, username: user.username };
  }
}
