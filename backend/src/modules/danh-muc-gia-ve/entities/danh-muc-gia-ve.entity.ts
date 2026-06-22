import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type DanhMucGiaVeDocument = HydratedDocument<DanhMucGiaVe>;
// Định nghĩa cấu trúc mảng con chứa giá theo bến
@Schema({ _id: false }) // Không cần tự sinh _id cho mảng con
class GiaTheoBen {
  @Prop({ required: true })
  ma_nhom_ben!: string;

  @Prop({ required: true })
  gia_ve!: number;
}

// Định nghĩa cấu trúc đợt lịch sử giá
@Schema({ _id: false })
class LichSuGia {
  @Prop({ required: true, type: Date })
  ngay_ap_dung!: Date;

  @Prop({ required: true, type: [GiaTheoBen] })
  gia_theo_ben!: GiaTheoBen[];
}

// ĐÂY CHÍNH LÀ ENTITY ĐỒNG THỜI LÀ SCHEMA GỐC
@Schema({ collection: 'danh_muc_gia_ve', timestamps: true })
export class DanhMucGiaVe extends Document {
  @Prop({ required: true, unique: true })
  ma_loai_ve!: string;

  @Prop({ required: true })
  ten_loai_ve!: string;

  @Prop({ required: true })
  nhom_cha!: string; //HANH_KHACH | XE_CAC_LOAI | THUE_BAO

  @Prop({ required: true })
  nhom_con!: string; // HANH_KHACH | XE_KHACH | XE_TAI

  @Prop({ required: true, type: [LichSuGia] })
  lich_su_gia!: LichSuGia[];

  @Prop({ default: true })
  kich_hoat!: boolean;
}

// Lệnh tạo ra Schema thực tế để NestJS đăng ký với MongoDB
export const DanhMucGiaVeSchema = SchemaFactory.createForClass(DanhMucGiaVe);
