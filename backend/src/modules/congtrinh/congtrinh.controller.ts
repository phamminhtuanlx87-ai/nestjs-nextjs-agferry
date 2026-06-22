import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/constants/user.constants';
import { CongTrinhDto } from './dto/create-congtrinh';
import { CongtrinhService } from './congtrinh.service';
import { SkipThrottle } from '@nestjs/throttler';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
@Controller('congtrinh')
export class CongtrinhController {
  constructor(private readonly congTrinhService: CongtrinhService) {
    console.log('Khởi tạo CongTrinhService');
  }
  // API này thừa hưởng toàn bộ Guard và Roles ở trên
  @Public()
  @SkipThrottle()
  @Get()
  async getAll(@Query('month') month?: string, @Query('year') year?: string) {
    // Kiểm tra nếu có month hoặc year thì gọi findAll, không thì gọi getAll (hoặc gộp chung)

    if (month || year) {
      const filter = {
        month: month ? parseInt(month) : undefined,
        year: year ? parseInt(year) : undefined,
      };
      const result = await this.congTrinhService.findAll(filter);
      return {
        statusCode: 201, // Thêm cái này để frontend dễ check
        message: 'Lấy danh sách công trình thành công!',
        data: result,
      };
    }
    const result = await this.congTrinhService.getAll();
    return {
      statusCode: 201, // Thêm cái này để frontend dễ check
      message: 'Lấy danh sách công trình thành công!',
      data: result,
    };
  }

  // API này ghi đè quyền: Chỉ Admin mới được xóa
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return `Chỉ Admin mới vào được đây, ID: ${id}`;
  }

  @Post()
  async create(@Body() createCongTrinhDto: CongTrinhDto) {
    const result = await this.congTrinhService.create(createCongTrinhDto);
    return {
      statusCode: 201, // Thêm cái này để frontend dễ check
      message: 'Tạo công trình thành công!',
      data: result,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCongTrinhDto: CongTrinhDto,
  ) {
    const result = await this.congTrinhService.update(id, updateCongTrinhDto);
    return {
      statusCode: 200, // Thêm cái này để frontend dễ check
      message: 'Cập nhật công trình thành công!',
      data: result,
    };
  }

  @Patch(':id/soft-delete')
  async softDelete(@Param('id') id: string) {
    const result = await this.congTrinhService.softDelete(id);
    return {
      statusCode: 200, // Thêm cái này để frontend dễ check
      message: 'Đã tạm khóa công trình thành công!',
      data: result,
    };
  }

  @Public()
  @SkipThrottle() //API GET này sẽ ĐƯỢC THẢ TỰ DO, không bị chặn nữa
  @Get(':id')
  async getCongtrinh(@Param('id') id: string) {
    const result = await this.congTrinhService.getCongtrinh(id);
    console.log('result:');
    return {
      statusCode: 200, // Thêm cái này để frontend dễ check
      message: 'Đã lấy thông tin công trình thành công!',
      data: result,
    };
  }

  // API ngoại lệ: Mở cửa hoàn toàn (Ví dụ: khách xem danh sách công trình công cộng)
  @Public()
  @SkipThrottle() //API GET này sẽ ĐƯỢC THẢ TỰ DO, không bị chặn nữa
  @Get('dscongtrinh')
  getPublic() {
    return 'Ai cũng thấy, không cần token';
  }
}
