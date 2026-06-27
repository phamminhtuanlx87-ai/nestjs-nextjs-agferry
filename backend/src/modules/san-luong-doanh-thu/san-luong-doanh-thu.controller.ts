import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SanLuongDoanhThuService } from './san-luong-doanh-thu.service';
import { CreateSanLuongDoanhThuDto } from './dto/create-san-luong-doanh-thu.dto';
import { UpdateSanLuongDoanhThuDto } from './dto/update-san-luong-doanh-thu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/constants/user.constants';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('san-luong-doanh-thu')
export class SanLuongDoanhThuController {
  constructor(
    private readonly sanLuongDoanhThuService: SanLuongDoanhThuService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
  async create(@Body() createDto: CreateSanLuongDoanhThuDto, @Req() req: any) {
    // 🕵️‍♂️ BÓC TÁCH TOKEN: Lấy ID của nhân viên kế toán đang đăng nhập hệ thống từ JWT
    const userId = (req.user?.userId || 'SYSTEM_AN_GIANG') as string;
    // Đẩy cả DTO thô và ID người dùng xuống tầng Service giải quyết
    const result = await this.sanLuongDoanhThuService.create(createDto, userId);

    return {
      statusCode: HttpStatus.CREATED,
      message:
        'Nạp số liệu sản lượng và tự động chốt doanh thu thành công thành công rồi!',
      data: result,
    };
  }

  @Get()
  findAll() {
    const result = this.sanLuongDoanhThuService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy dữ liệu thàng công',
      data: result,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sanLuongDoanhThuService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSanLuongDoanhThuDto: UpdateSanLuongDoanhThuDto,
    @Req() req: any,
  ) {
    const userId = (req.user?.userId || 'SYSTEM_AN_GIANG') as string;

    return this.sanLuongDoanhThuService.update(
      id,
      updateSanLuongDoanhThuDto,
      userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sanLuongDoanhThuService.remove(id);
  }
}
