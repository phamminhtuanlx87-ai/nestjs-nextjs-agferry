import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from './constants/user.constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN) // Chỉ Admin mới được truy cập vào tất cả API trong Controller này
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {
    console.log('Khởi tạo UserService');
  }

  @Get() //users
  async index() {
    // Thêm await ở đây để đợi dữ liệu từ Database trả về
    const result = await this.userService.findAll();
    return {
      message: 'Lấy dữ liệu Danh sách người dùng thành công!',
      data: result,
    };
  }

  // Chỉ Admin mới được dùng API này
  @Post()
  adminCreate(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, false);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return {
      message: `Lấy dữ liệu người dùng thành công, UrerID: ${id}`,
      data: user,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Patch(':id/toggle')
  async toggleActive(@Param('id') id: string) {
    return await this.userService.toggleActive(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedUser = await this.userService.remove(id);
    return {
      statusCode: 200,
      message: `Xóa người dùng thành công, UrerID${id}`,
      data: { deletedUser },
    };
  }

  //dùng chung cho tất cả user
  // @Public()
  // @Get('news')
  // findAllNews() {
  //   return 'Ai cũng xem được tin tức phà An Giang!';
  // }
  // Trường hợp 1: Chỉ cần đăng nhập là xem được (không quan trọng role nào):
  // @Get('me')
  // getProfile() {
  //   return 'Thông tin cá nhân';
  // } // JwtAuthGuard tự động gác cửa rồi

  // Trường hợp 2: Cần đăng nhập VÀ phải đúng Role:
  // @Roles(UserRole.AD) // Chỉ Admin mới được vào
  // @Delete(':id')
  // remove() {  }
}
