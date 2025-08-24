import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import { BasicUserInfo } from 'src/common/interfaces/index.interface';
import { CryptoService } from 'src/services/crypto/crypto.service';
import { hashPassword } from 'src/utils/password';
import { MessagingService } from '../../services/messaging/messaging.service';
import { PrismaService } from '../../services/prisma/prisma.service';
import { RegisterUserDto, ResetPasswordDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  private readonly user: Prisma.UserDelegate;
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
    private readonly messagingService: MessagingService,
    private readonly cryptoService: CryptoService,
  ) {
    this.user = prisma.user;
  }

  async getRaw<T extends Prisma.UserFindUniqueArgs>(
    input: Prisma.SelectSubset<T, Prisma.UserFindUniqueArgs>,
  ) {
    input.where = {
      ...input.where,
      isDeleted: false,
    };
    return this.user.findUnique<T>(input);
  }

  async get(input: { where: Prisma.UserWhereInput }) {
    const { where } = input;
    const user = await this.user.findFirst({
      where: { ...where },
    });
    if (!user) return undefined;
    return user;
  }

  async registerUserClient(
    body: RegisterUserDto,
  ): Promise<Partial<BasicUserInfo>> {
    const { email, password } = body;

    const passwordHashed = await hashPassword(password);

    const existingActiveUser = await this.get({
      where: {
        email,
      },
    });

    if (existingActiveUser) {
      throw new ConflictException(
        this.i18n.t('errors.conflict', { args: { model: 'User' } }),
      );
    }

    const user = await this.user
      .create({
        data: {
          email,
          password: passwordHashed,
          name: body.name,
        },
      })
      .catch((e) => {
        if (e.code === 'P2002') {
          throw new ConflictException(
            this.i18n.t('errors.conflict', { args: { model: 'User' } }),
          );
        }
        throw e;
      });

    return user;
  }

  async changePassword(id: string, body: ResetPasswordDto): Promise<User> {
    const updatedUserPassword = await this.user.update({
      where: { id },
      data: {
        password: await hashPassword(body.password),
      },
    });
    return updatedUserPassword;
  }
}
