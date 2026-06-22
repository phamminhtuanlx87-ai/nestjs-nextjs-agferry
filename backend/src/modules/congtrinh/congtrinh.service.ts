import { Injectable, NotFoundException } from '@nestjs/common';
import { CongTrinh, CongTrinhDocument } from './schemas/congtrinh.schemas';
import { Model, QueryFilter } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CongTrinhDto } from './dto/create-congtrinh';

@Injectable()
export class CongtrinhService {
  constructor(
    @InjectModel(CongTrinh.name)
    private readonly congTrinhModel: Model<CongTrinhDocument>, // Sử dụng cái type Hydrated mà mình vừa nói ở trên
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
    console.log('Chay GetAll');
    return await this.congTrinhModel
      .find({ isActive: true })
      .sort({ updatedAt: -1 })
      .select('-permissions -__v')
      .exec();
  }

  async findAll(filter: {
    month?: number;
    year?: number;
  }): Promise<CongTrinhDocument[]> {
    const query: QueryFilter<CongTrinhDocument> = { isActive: true };

    if (filter.month && filter.year) {
      // Ngày bắt đầu tháng (ví dụ: 2026-01-01 00:00:00)
      const startDate = new Date(filter.year, 0, 1);

      // Ngày đầu tiên của tháng sau (ví dụ: 2026-02-01 00:00:00)
      const endDate = new Date(filter.year, filter.month, 1);

      query.$or = [
        // TRƯỜNG HỢP 1: Công trình nằm trong kỳ lũy kế của năm được chọn
        {
          ngay_tao_du_an: {
            $gte: startDate,
            $lt: endDate,
          },
        },
        // TRƯỜNG HỢP 2: Công trình tạo trước đó nhưng CHƯA quyết toán (Ví dụ: Từ 2025 kéo dài qua)
        {
          ngay_tao_du_an: { $lt: endDate }, // Được tạo bất kỳ lúc nào trước mốc thời gian lọc này
          $or: [
            { ngay_quyet_toan: { $exists: false } }, // Chưa từng có trường ngày quyết toán
            { ngay_quyet_toan: null }, // Hoặc ngày quyết toán đang để trống
            { ngay_quyet_toan: { $gte: endDate } }, // Hoặc công trình mãi tới tương lai (sau mốc kết thúc) mới quyết toán
          ],
        },
      ];
    }
    return await this.congTrinhModel
      .find(query)
      .sort({ updatedAt: -1 })
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
