import { Injectable, NotFoundException } from '@nestjs/common';
import { CongTrinh, CongTrinhDocument } from './schemas/congtrinh.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CongTrinhDto } from './dto/create-congtrinh';

@Injectable()
export class CongtrinhService {
  constructor(
    @InjectModel(CongTrinh.name)
    private congTrinhModel: Model<CongTrinhDocument>, // Sử dụng cái type Hydrated mà mình vừa nói ở trên
  ) {}

  async create(dto: CongTrinhDto): Promise<CongTrinhDocument> {
    const newProject = new this.congTrinhModel(dto);
    const count = await this.congTrinhModel
      .countDocuments()
      .where(
        'ma_cong_trinh',
        new RegExp(`^${newProject.ma_cong_trinh}-\\d{3}$`),
      );
    const maCT = newProject.ma_cong_trinh;
    newProject.ma_cong_trinh = `${maCT}-${(count + 1).toString().padStart(3, '0')}`;
    return await newProject.save();
  }

  async update(id: string, dto: CongTrinhDto): Promise<CongTrinhDocument> {
    // 1. Tìm bản ghi cũ
    const project = await this.congTrinhModel.findById(id);

    // 2. Nếu không thấy thì báo lỗi 404 ngay lập tức
    if (!project) {
      throw new NotFoundException(`Không tìm thấy công trình với ID: ${id}`);
    }

    // 3. Ghi đè dữ liệu mới vào bản ghi cũ (Object.assign)
    Object.assign(project, dto);

    // 4. Lưu lại - Cách này sẽ kích hoạt Middleware .pre('save')
    // giúp fullName hay các trường khác được dọn dẹp lại nếu có logic xử lý
    return await project.save();
  }

  async getAll(): Promise<CongTrinhDocument[]> {
    return await this.congTrinhModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-permissions -__v')
      .exec();
  }

  async getCongtrinh(id: string): Promise<CongTrinhDocument[]> {
    return await this.congTrinhModel
      .find({ isActive: true, _id: id })
      .sort({ createdAt: -1 })
      .select('-permissions -__v')
      .exec();
  }

  async softDelete(id: string): Promise<CongTrinhDocument> {
    const project = await this.congTrinhModel.findById(id);
    if (!project) {
      throw new NotFoundException(`Không tìm thấy công trình với ID: ${id}`);
    }
    project.isActive = false;
    return await project.save();
  }
}
