import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CongTrinhDocument = HydratedDocument<CongTrinh>;

// 1. Schema cho File đính kèm
@Schema({ _id: false }) // Không cần tạo ID riêng cho từng link file
class FileLink {
  @Prop({ required: true })
  link_name: string;

  @Prop({ required: true })
  link_url: string;
}

// 2. Schema cho từng Giai Đoạn
@Schema({ _id: false })
class GiaiDoan {
  @Prop({ required: true })
  ma_hieu: string;

  @Prop({ required: true })
  ten_giai_doan: string;

  @Prop()
  ma_don_vi?: string;

  @Prop()
  ten_don_vi?: string;

  @Prop({ type: Number })
  tong_gia_tri?: number;

  @Prop({ type: Number })
  chi_phi_xay_dung?: number;

  @Prop({ type: Number })
  chenh_lech_tgt?: number;

  @Prop({ type: Number })
  chenh_lech_cpxd?: number;

  @Prop({ type: Number })
  so_ngay_tc_pgv?: number;

  @Prop({ type: Number })
  so_ngay_tc_thuc_te?: number;

  @Prop()
  dia_diem_tc?: string;

  @Prop()
  ngay_thuc_hien?: Date;

  @Prop()
  ngay_hoan_thanh?: Date;

  // Thêm mảng file_links theo yêu cầu của Tuấn
  @Prop({ type: [FileLink], default: [] })
  file_links: FileLink[];
}
@Schema({
  timestamps: true, // Tự động tạo createdAt, updatedAt
  collection: 'congtrinh',
})
export class CongTrinh {
  @Prop({ required: true, trim: true })
  ten_cong_trinh: string;

  @Prop({ required: true, trim: true, unique: true })
  ma_cong_trinh: string;

  @Prop({ default: 'Cty Cổ phần Phà An Giang' })
  don_vi_chu_quan: string;

  @Prop({ default: Date.now })
  ngay_tao_du_an: Date;

  @Prop({ default: true })
  isActive: boolean;
  // Lồng mảng GiaiDoan vào đây
  @Prop({ type: [GiaiDoan], default: [] })
  giai_doan: GiaiDoan[];
}

export const CongTrinhSchema = SchemaFactory.createForClass(CongTrinh);
CongTrinhSchema.pre('save', function () {
  if (this.ten_cong_trinh) {
    this.ten_cong_trinh = this.ten_cong_trinh
      .trim() // Xóa khoảng trắng 2 đầu
      .replace(/\s+/g, ' ') // Thu gọn khoảng trắng ở giữa thành 1 khoảng duy nhất
      .split(' ') // Cắt chuỗi thành mảng các từ
      .join(' '); // Ghép lại thành chuỗi hoàn chỉnh
  }
  // Không cần gọi next() nếu dùng hàm async
});
