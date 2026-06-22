import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDanhMucGiaVeDto } from './dto/create-danh-muc-gia-ve.dto';
import { UpdateDanhMucGiaVeDto } from './dto/update-danh-muc-gia-ve.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  DanhMucGiaVe,
  DanhMucGiaVeDocument,
} from './entities/danh-muc-gia-ve.entity';
import { Model } from 'mongoose';

@Injectable()
export class DanhMucGiaVeService {
  constructor(
    @InjectModel(DanhMucGiaVe.name)
    private readonly danhMucGiaVeModel: Model<DanhMucGiaVeDocument>, // Sử dụng cái type Hydrated mà mình vừa nói ở trên
  ) {}

  async create(createDanhMucGiaVeDto: CreateDanhMucGiaVeDto) {
    // 1. CHỦ ĐỘNG TÌM KIẾM: Bảo Mongo tìm xem có ai xài mã này chưa
    const exisitingGiaVe = await this.danhMucGiaVeModel
      .findOne({
        ma_loai_ve: createDanhMucGiaVeDto.ma_loai_ve,
      })
      .exec();

    // 2. CHẶN LỖI BẰNG TAY: Nếu tìm thấy bản ghi (không phải null) thì ném lỗi lập tức
    if (exisitingGiaVe) {
      throw new ConflictException(
        `Mã loại vé [${createDanhMucGiaVeDto.ma_loai_ve}] đã được sử dụng rồi anh Tuấn ơi, vui lòng nhập mã khác!`,
      );
    }

    // 3. LƯU DỮ LIỆU: Nếu vượt qua bước kiểm tra trên thì mới tiến hành lưu
    const newGiaVe = new this.danhMucGiaVeModel(createDanhMucGiaVeDto);
    return await newGiaVe.save();
  }

  async findAll() {
    return await this.danhMucGiaVeModel
      .find({ kich_hoat: true })
      .sort({ updatedAt: -1 })
      .select('-permissions -__v')
      .exec();
  }

  async findOne(id: string) {
    return await this.danhMucGiaVeModel
      .find({ kich_hoat: true, _id: id })
      .sort({ createdAt: -1 })
      .select('-permissions -__v')
      .exec();
  }

  async update(id: string, updateDanhMucGiaVeDto: UpdateDanhMucGiaVeDto) {
    return await this.danhMucGiaVeModel
      .findByIdAndUpdate(id, updateDanhMucGiaVeDto, { new: true })
      .exec();
  }

  async softRemove(id: string) {
    const danhmuc = await this.danhMucGiaVeModel.findById(id);
    if (!danhmuc) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID: ${id}`);
    }
    danhmuc.kich_hoat = false;
    return await danhmuc.save();
  }

  async remove(id: string) {
    return await this.danhMucGiaVeModel.findByIdAndDelete(id).exec();
  }
}
