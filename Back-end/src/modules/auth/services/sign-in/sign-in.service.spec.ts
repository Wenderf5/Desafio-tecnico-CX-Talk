import { Test, TestingModule } from '@nestjs/testing';
import { SignInService } from './sign-in.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { profilePhoto } from 'generated/prisma';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('SignInService', () => {
  let signInService: SignInService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn()
            }
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue("fake-tonken")
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('fake-secret')
          }
        }
      ]
    }).compile();

    signInService = module.get<SignInService>(SignInService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should return a JWT when credentials are valid', async () => {
    const mockUser = {
      id: "123",
      name: "test",
      email: "test@gmail.com",
      password: "fake-hash-password",
      profilePhoto: ("PHOTO1" as profilePhoto)
    }

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await signInService.signIn('test@gmail.com', '12345678');

    expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: mockUser.email } });
    expect(result).toBe('fake-tonken');
  });

  it('should throw NotFoundException if user does not exist', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

    const promise = signInService.signIn('test@gmail.com', '12345678');

    await expect(promise).rejects.toBeInstanceOf(NotFoundException);
    await expect(promise).rejects.toThrow('User not found');
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const mockUser = {
      id: "123",
      name: "test",
      email: "test@gmail.com",
      password: "fake-hash-password",
      profilePhoto: ("PHOTO1" as profilePhoto)
    }

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const promise = signInService.signIn('test@gmail.com', 'wrongpassword');

    await expect(promise).rejects.toThrow('Invalid password');
    await expect(promise).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
