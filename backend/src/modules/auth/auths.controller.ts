import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/loginDto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { Public } from 'src/common/decorators/public.decorator';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { adminDTO } from './dto/adminDTO';
import { UserRole } from '../users/constants/user.constants';
import { Roles } from 'src/common/decorators/roles.decorator';
import { getMeDTO } from './dto/getMeDTO';
import { ResetPasswordDTO } from './dto/ResetPasswordDTO';
import { RolesGuard } from './guards/roles.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  //API dùng chung -------------------------------------
  @Public() // Cho phép truy cập mà không cần JWT
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // Ghi đè cấu hình: Trong 15 phút (900.000 ms), chỉ cho phép gọi tối đa 3 lần
  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    // 1. Xác thực xem username/password có đúng không
    // Hàm này trả về object { message, user } như bạn đã viết ở Service
    const authData = await this.authService.validateUser(
      loginDto.userName,
      loginDto.password,
    );
    // 2. Lấy thông tin user vừa xác thực thành công để tạo Token
    // Chúng ta truyền authData.user vào hàm login
    const tokenData = await this.authService.login(authData.user);

    // 3. Trả về cả thông tin user và access_token cho Client
    return {
      ...authData, // Gồm message và thông tin user sạch
      ...tokenData, // Gồm access_token và một số info user rút gọn
    };
  }

  @Public() // Mở khóa cho khách đăng ký
  @Throttle({ default: { limit: 3, ttl: 900000 } }) // Ghi đè cấu hình: Trong 15 phút (900.000 ms), chỉ cho phép gọi tối đa 3 lần
  @Post('register')
  register(@Body() registerDto: RegisterUserDto) {
    // Gọi sang userService với tham số báo hiệu đây là đăng ký công khai
    return this.usersService.create(registerDto, true);
  }
  // -------------------------------------

  @UseGuards(JwtAuthGuard)
  @SkipThrottle()
  @Get('me')
  async getProfile(@Request() req: any) {
    // 1. Lấy userId đã được Passport giải mã và đặt vào req.user
    const userId = req.user.userId;

    // 2. Gọi trực tiếp UsersService để lấy thông tin chi tiết
    const result = await this.usersService.findOne(userId as string);
    return {
      statusCode: 200, // Thêm cái này để frontend dễ check
      message: 'Lấy thông tin người đăng nhập thành công!',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req: any, @Body() updateMeDto: getMeDTO) {
    const userId = req.user?.userId as string;
    const result = await this.usersService.updateMe(userId, updateMeDto);
    return {
      statusCode: 200, // Thêm cái này để frontend dễ check
      message: 'Cập nhật công trình thành công!',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/reset')
  async updateMeReset(
    @Req() req: any,
    @Body() resetPasswordDto: ResetPasswordDTO, // Đổi từ getMeDTO sang ResetPasswordDTO
  ) {
    const userId = req.user.userId as string; // Lấy userId an toàn từ Token mã hóa

    // Gọi sang tầng Service xử lý logic kiểm tra & cập nhật
    const result = await this.usersService.updateMeReset(
      userId,
      resetPasswordDto,
    );

    return {
      statusCode: 200,
      message: 'Thay đổi mật khẩu bảo mật thành công!',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/update')
  async updateAdmin(@Param('id') id: string, @Body() updateMeDto: adminDTO) {
    const result = await this.usersService.updateAdmin(id, updateMeDto);
    return {
      statusCode: 200, // Thêm cái này để frontend dễ check
      message: 'Cập nhật thành công!',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/toggle')
  async toggleActive(@Param('id') id: string) {
    const result = await this.usersService.toggleActive(id);
    return {
      statusCode: 200, // Thêm cái này để frontend dễ check
      message: 'Cập nhật thành công!',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/:mode')
  async getAllUser(@Param('mode') mode: 'all' | 'active' | 'inactive') {
    const result = await this.usersService.getAllUser(mode);
    return {
      statusCode: 200,
      message: 'Lấy danh sách thành viên thành công!', // Sửa lại message
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/:username')
  async getSser(@Param('username') username: string) {
    const result = await this.usersService.getUser(username);
    return {
      statusCode: 200,
      message: 'Lấy danh sách thành viên thành công!', // Sửa lại message
      data: result,
    };
  }

  // Hàm này tạo ra cả Access Token và Refresh Token
  @Public() // Cho phép gọi mà không cần token vì đây là hàm tạo token
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
