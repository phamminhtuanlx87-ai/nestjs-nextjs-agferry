import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/loginDto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { Public } from 'src/common/decorators/public.decorator';
import { RegisterUserDto } from '../users/dto/register-user.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  //API dùng chung -------------------------------------
  @Public() // Cho phép truy cập mà không cần JWT
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
    const tokenData = this.authService.login(authData.user);

    // 3. Trả về cả thông tin user và access_token cho Client
    return {
      ...authData, // Gồm message và thông tin user sạch
      ...tokenData, // Gồm access_token và một số info user rút gọn
    };
  }

  @Public() // Mở khóa cho khách đăng ký
  @Post('register')
  register(@Body() registerDto: RegisterUserDto) {
    // Gọi sang userService với tham số báo hiệu đây là đăng ký công khai
    return this.usersService.create(registerDto, true);
  }
  // -------------------------------------

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    // 1. Lấy userId đã được Passport giải mã và đặt vào req.user
    const userId = req.user.userId;

    // 2. Gọi trực tiếp UsersService để lấy thông tin chi tiết
    return await this.usersService.findOne(userId as string);
  }
}
