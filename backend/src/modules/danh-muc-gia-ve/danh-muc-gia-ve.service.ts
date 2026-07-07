import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateDanhMucGiaVeDto } from './dto/update-danh-muc-gia-ve.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  DanhMucGiaVe,
  DanhMucGiaVeDocument,
} from './entities/danh-muc-gia-ve.entity';
import { Model } from 'mongoose';
import { QueryFilter } from 'mongoose';
import {
  CreateDanhMucGiaVeDto,
  LichSuGiaDTO,
} from './dto/create-danh-muc-gia-ve.dto';

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

  async findAll(ngay?: string) {
    // 1. Tạo object điều kiện mặc định
    // const queryCondition: QueryFilter<DanhMucGiaVeDocument> = {
    //   kich_hoat: true,
    // };
    // // 2. Nếu frontend có truyền ngày lên, thêm điều kiện: ngay_ap_dung <= ngay được chọn
    // if (ngay) {
    //   const endOfSelectedDay = new Date(ngay);
    //   endOfSelectedDay.setHours(23, 59, 59, 999);
    //   // Truy vấn linh hoạt bằng cách ép kiểm tra cả dạng Date Object và chuỗi ISO string phòng hờ dữ liệu lệch kiểu
    //   queryCondition.$or = [
    //     { ngay_ap_dung: { $lte: endOfSelectedDay } },
    //     { ngay_ap_dung: { $lte: ngay } },
    //     {
    //       'lich_su_gia.ngay_ap_dung': { $lte: endOfSelectedDay.toISOString() },
    //     },
    //   ];
    // }
    // // 3. Thực thi query thống nhất theo chuẩn Mongoose của anh
    // return await this.danhMucGiaVeModel
    //   .find(queryCondition)
    //   .sort({ ngay_ap_dung: -1, updatedAt: -1 }) // Ưu tiên ngày áp dụng mới nhất lên đầu
    //   .select('-permissions -__v')
    //   .exec();

    // 1. Khởi tạo điều kiện lọc mặc định
    const queryCondition: QueryFilter<any> = {
      kich_hoat: true,
    };

    // 2. Lấy dữ liệu từ DB lên
    // Ép kiểu trực tiếp sang mảng DTO của anh bằng cú pháp 'as unknown as CreateDanhMucGiaVeDto[]'
    const danhSachGiaVe = (await this.danhMucGiaVeModel
      .find(queryCondition)
      .sort({ updatedAt: -1 }) // Ưu tiên bản ghi vừa cập nhật
      .select('-permissions -__v')
      .lean()) as unknown as CreateDanhMucGiaVeDto[];

    // 3. Kiểm tra và lọc lịch sử giá vé gần nhất dựa trên ngày nhập từ frontend
    if (ngay) {
      // Ép ngày nhập về mốc thời gian cuối ngày dưới dạng số (Timestamp) để so sánh chuẩn xác
      const endOfSelectedDay = new Date(ngay);
      endOfSelectedDay.setHours(23, 59, 59, 999);
      const mốcThờiGianNhập = endOfSelectedDay.getTime();

      for (const ve of danhSachGiaVe) {
        if (ve.lich_su_gia && Array.isArray(ve.lich_su_gia)) {
          // Bước A: Lọc các mốc lịch sử nhỏ hơn hoặc bằng ngày nhập
          const cacMocHopLe = ve.lich_su_gia.filter((lichSu: LichSuGiaDTO) => {
            return new Date(lichSu.ngay_ap_dung).getTime() <= mốcThờiGianNhập;
          });

          // Bước B: Sắp xếp mốc mới nhất lên đầu mảng (Vị trí index 0)
          cacMocHopLe.sort((a: LichSuGiaDTO, b: LichSuGiaDTO) => {
            return (
              new Date(b.ngay_ap_dung).getTime() -
              new Date(a.ngay_ap_dung).getTime()
            );
          });

          // Bước C: Gán đè lại mảng lịch sử giá đã sắp xếp ngăn nắp
          ve.lich_su_gia = cacMocHopLe;
        }
      }
    }

    // Trả về mảng dữ liệu sạch, an toàn kiểu theo đúng cấu trúc DTO
    return danhSachGiaVe;
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
