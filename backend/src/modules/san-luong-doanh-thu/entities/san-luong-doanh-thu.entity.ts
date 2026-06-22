import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SanLuongDoanhThuDocument = SanLuongDoanhThu & Document;

@Schema({
  collection: 'san_luong_doanh_thu', // Đặt tên bảng theo chuẩn snake_case
  timestamps: true, // Tự động thêm createdAt và updatedAt để quản lý vết hệ thống
})
export class SanLuongDoanhThu {
  @Prop({ type: Date, required: true })
  ngay_nhap!: Date; // Ngày nhân viên nhập liệu (dùng để so khớp ngày áp dụng giá vé)

  @Prop({ type: String, required: true, index: true })
  thang_nam!: string; // Định dạng "YYYY-MM" phục vụ gom nhóm báo cáo nhanh theo tháng

  @Prop({ type: String, required: true, index: true })
  ma_ben!: string; // Mã bến phà (Ví dụ: TC, VC, AH, TO, OM, NG, TG, MR)

  @Prop({ type: String, required: true, index: true })
  ma_loai_ve!: string; // Mã loại vé (Ví dụ: "XK_DUOI_7C") liên kết sang danhmucgiave

  @Prop({ type: Number, required: true, min: 0 })
  san_luong!: number; // Số lượng phương tiện chạy qua phà

  // ==========================================
  // CƠ CHẾ SNAPSHOT: CHỐT CỨNG ĐƠN GIÁ VÀ TIỀN
  // ==========================================

  @Prop({ type: Number, required: true, min: 0 })
  gia_ve_ap_dung!: number; // Giá vé bốc tự động tại thời điểm ngay_nhap, chốt cứng không đổi

  @Prop({ type: Number, required: true, min: 0 })
  tong_doanh_thu!: number; // Tính toán bằng: san_luong * gia_ve_ap_dung và lưu chết vào DB

  @Prop({ type: String })
  created_by!: string;

  @Prop({ type: String })
  updated_by!: string;
}

export const SanLuongDoanhThuSchema =
  SchemaFactory.createForClass(SanLuongDoanhThu);

// Tạo compound index (Chỉ mục hỗn hợp) tối ưu hóa tốc độ truy vấn cho các báo cáo theo bến và thời gian
SanLuongDoanhThuSchema.index({ ma_ben: 1, thang_nam: 1 });
SanLuongDoanhThuSchema.index({ ma_loai_ve: 1, ngay_nhap: -1 });
