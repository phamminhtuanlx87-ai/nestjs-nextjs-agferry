import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DanhMucGiaVeService } from './danh-muc-gia-ve.service';
import { CreateDanhMucGiaVeDto } from './dto/create-danh-muc-gia-ve.dto';
import { UpdateDanhMucGiaVeDto } from './dto/update-danh-muc-gia-ve.dto';
import { UserRole } from '../users/constants/user.constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('danh-muc-gia-ve')
export class DanhMucGiaVeController {
  constructor(private readonly danhMucGiaVeService: DanhMucGiaVeService) {}

  @Post()
  async create(@Body() createDanhMucGiaVeDto: CreateDanhMucGiaVeDto) {
    const result = await this.danhMucGiaVeService.create(createDanhMucGiaVeDto);
    return {
      statusCode: HttpStatus.CREATED, // Thêm cái này để frontend dễ check
      message: 'Thêm mới danh mục giá vé thành công!',
      data: result,
    };
  }

  @SkipThrottle({ default: true })
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER, UserRole.GUEST)
  @Get()
  async findAll(@Query('ngay') ngay?: string) {
    const result = await this.danhMucGiaVeService.findAll(ngay);
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy danh sách danh mục giá vé thành công!',
      data: result,
    };
  }

  @SkipThrottle({ default: true })
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER, UserRole.GUEST)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.danhMucGiaVeService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDanhMucGiaVeDto: UpdateDanhMucGiaVeDto,
  ) {
    const result = await this.danhMucGiaVeService.update(
      id,
      updateDanhMucGiaVeDto,
    );
    return {
      statusCode: HttpStatus.OK, // Thêm cái này để frontend dễ check
      message: 'Cập nhật danh mục giá vé thành công!',
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.danhMucGiaVeService.remove(id);

    return {
      statusCode: HttpStatus.OK, // 200 OK
      message: 'Xóa mềm danh mục giá vé thành công!',
      data: result,
    };
  }

  @Delete(':id/softRemove')
  async softRemove(@Param('id') id: string) {
    // Gọi Service lấy data thô lên
    const result = await this.danhMucGiaVeService.softRemove(id);

    // 🎉 ĐÓNG GÓI ĐẸP ĐẼ Ở ĐÂY ĐỂ FRONTEND XÀI
    return {
      statusCode: HttpStatus.OK, // 200 OK
      message: 'Xóa mềm danh mục giá vé thành công!',
      data: result,
    };
  }
}
