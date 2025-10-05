import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
// import { Role } from 'src/constants';
import { RecoverPasswordDto, ResetPasswordDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AccessTokenGuard } from './guards/access-token.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ******** LOGIN ********
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() credentials: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(credentials);

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return {
      user,
      message: 'Login successful',
    };
  }

  // ******** RECOVER PASSWORD ********
  @Post('recover-password')
  @ApiOperation({ summary: 'Recover password' })
  @ApiBody({ type: RecoverPasswordDto })
  @ApiResponse({ status: 200, description: 'Password recovery email sent' })
  @HttpCode(HttpStatus.OK)
  recoverPassword(@Body() body: RecoverPasswordDto) {
    return this.authService.recoverPassword(body);
  }

  // ******** RESET PASSWORD ********

  @Post('reset-password/:token')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @HttpCode(HttpStatus.OK)
  resetPassword(@Param('token') token: string, @Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(token, body);
  }

  // ******** LOGOUT ********

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user and clear cookies' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });

    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });

    return {
      message: 'Logout successful',
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  @ApiOperation({ summary: 'Info user logged' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @HttpCode(HttpStatus.OK)
  getMe(@GetCurrentUser('userId') userId: string) {
    return this.authService.getMe(userId);
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  checkAuthStatus(@Req() req: Request) {

    const token = req.cookies?.token;
    return {
      isAuthenticated: !!token,
      token: token ? 'exists' : 'not found',
    };
  }
}
