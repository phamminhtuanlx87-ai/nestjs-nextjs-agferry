import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  Req,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { SanLuongDoanhThuService } from './san-luong-doanh-thu.service';
import { CreateSanLuongDoanhThuDto } from './dto/create-san-luong-doanh-thu.dto';
import { UpdateSanLuongDoanhThuDto } from './dto/update-san-luong-doanh-thu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/constants/user.constants';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetSanLuongDto } from './dto/get-san-luong-doanh-thi.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { FilterToolbarDto } from './dto/filter-toolbar.dto';
import { GetChartSanLuongDoanhThuDto } from './dto/get-chart-san-luong-doanh-thu.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER)
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

  @SkipThrottle({ default: true })
  @Get('check-data')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
  async checkData(@Query() query: GetSanLuongDto, @Res() res) {
    const result = await this.sanLuongDoanhThuService.checkVaLayDuLieu(query);

    // Trả về response chuẩn JSON
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Lấy dữ liệu thàng công',
      data: result,
    });
  }

  @Get()
  @SkipThrottle({ default: true })
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
  async findAll(@Query() filters: FilterToolbarDto) {
    // 🌟 PHẢI CÓ chữ "await" ở đây để đợi dữ liệu từ MongoDB Aggregate quét xong
    const result = await this.sanLuongDoanhThuService.findAll(filters);
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy dữ liệu thàng công',
      data: result,
    };
  }

  @Get('chart')
  @SkipThrottle({ default: true })
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
  async layDuLieuBieuDo(@Query() filters: GetChartSanLuongDoanhThuDto) {
    const result = await this.sanLuongDoanhThuService.layDuLieuBieuDo(filters);

    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy dữ liệu biểu đồ thành công',
      data: result,
    };
  }

  @Get('ttsanluongchart')
  @SkipThrottle({ default: true })
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
  async layDuLieuTyTrongSanLuong(
    @Query() filters: GetChartSanLuongDoanhThuDto,
  ) {
    const result =
      await this.sanLuongDoanhThuService.layDuLieuTyTrongSanLuong(filters);

    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy dữ liệu biểu đồ thành công',
      data: result,
    };
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

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.sanLuongDoanhThuService.remove(id);
  // }
}
