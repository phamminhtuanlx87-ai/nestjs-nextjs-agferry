import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SanLuongDoanhThuDocument = SanLuongDoanhThu & Document;

// ==========================================
// 1. SUB-SCHEMA: CHI TIẾT SẢN LƯỢNG TỪNG LOẠI VÉ
// ==========================================
@Schema({ _id: false }) // Không cần sinh _id tự động cho từng phần tử mảng để nhẹ DB
class ChiTietSanLuong {
  @Prop({ type: String, required: true })
  ma_loai_ve!: string; // Ví dụ: "HK_DI_BO", "XK_THO_SO", "XK_45C"

  @Prop({ type: Number, required: true, min: 0 })
  so_luot_xe!: number; // Sản lượng nhập vào

  @Prop({ type: Number, required: true, min: 0 })
  gia_ve_ap_dung!: number; // Giá vé bốc tự động tại thời điểm ngay_nhap

  @Prop({ type: Number, required: true, min: 0 })
  tong_doanh_thu!: number; // so_luot_xe * gia_ve_ap_dung
}

// ==========================================
// 2. SUB-SCHEMA: CHI TIẾT TỪNG NHÓM DOANH THU LỚN
// ==========================================
@Schema({ _id: false })
class ChiTietDoanhThuNhom {
  @Prop({ type: Number, required: true, default: 0 })
  dtt_ve!: number; // Doanh thu thuần sau khi trừ thuế, bảo hiểm

  @Prop({ type: Number, required: true, default: 0 })
  dt_theo_ve!: number; // Doanh thu gộp theo vé

  @Prop({ type: Number, default: 0 })
  bhhk?: number; // Mức bảo hiểm áp dụng (Ví dụ: 9)

  @Prop({ type: Number, default: 0 })
  bhhk_thanh_tien?: number; // Thành tiền bảo hiểm hành khách

  @Prop({ type: Number, required: true, default: 0 })
  vat!: number; // Tỷ lệ VAT (Ví dụ: 0.08 hoặc 0.1)

  @Prop({ type: Number, required: true, default: 0 })
  vat_thanh_tien!: number; // Thành tiền thuế VAT đầu ra
}

// ==========================================
// 3. MAIN SCHEMA: PHIÊN NHẬP LIỆU DOANH THU TỔNG HỢP
// ==========================================
@Schema({
  collection: 'san_luong_doanh_thu',
  timestamps: true, // Tự động quản lý createdAt và updatedAt cho vết hệ thống
})
export class SanLuongDoanhThu {
  @Prop({ type: Date, required: true, index: true })
  ngay_nhap!: Date; // Ngày áp dụng (ví dụ: ngày 28/06/2026)

  @Prop({ type: String, required: true, index: true })
  thang_nam!: string; // Định dạng "YYYY-MM" phục vụ gom nhóm báo cáo tháng cực nhanh

  @Prop({ type: String, required: true, index: true })
  ma_ben!: string; // Mã bến phà áp dụng (Ví dụ: "VC", "AH")

  @Prop({ type: String, required: true })
  nguoi_nhap!: string; // Lưu ID người nhập (thay cho nguoi_nhap: { $oid: ... })

  // Mảng lưu chi tiết sản lượng thô phục vụ giao diện
  @Prop({ type: [ChiTietSanLuong], required: true, default: [] })
  chi_tiet_san_luong!: ChiTietSanLuong[];

  // Khối dữ liệu phân rã của Vé Lượt
  @Prop({ type: ChiTietDoanhThuNhom, required: true })
  doanh_thu_theo_ve!: ChiTietDoanhThuNhom;

  // Khối dữ liệu phân rã của Vé Tháng
  @Prop({ type: ChiTietDoanhThuNhom, required: true })
  doanh_thu_ve_thang!: ChiTietDoanhThuNhom;

  // Khối dữ liệu phân rã của Vé Quý
  @Prop({ type: ChiTietDoanhThuNhom, required: true })
  doanh_thu_ve_qui!: ChiTietDoanhThuNhom;

  // Khối dữ liệu phân rã của Vé Năm
  @Prop({ type: ChiTietDoanhThuNhom, required: true })
  doanh_thu_ve_nam!: ChiTietDoanhThuNhom;

  @Prop({ type: Number, required: true, default: 0 })
  doanh_thu_dh_tai_chinh!: number; // Doanh thu hoạt động tài chính (Thường cuối tháng mới nhập)

  @Prop({ type: Number, required: true, default: 0 })
  doanh_thu_khac!: number; // Doanh thu khác phát sinh

  @Prop({ type: Number, required: true, default: 0, index: true })
  doanh_thu_thuan_tong_cong!: number; // Tổng Doanh thu thuần cuối cùng để kéo Dashboard
}

export const SanLuongDoanhThuSchema =
  SchemaFactory.createForClass(SanLuongDoanhThu);

// ==========================================
// 4. COMPOUND INDEXES (CHỈ MỤC HỖN HỢP TỐI ƯU TRUY VẤN)
// ==========================================
// Tối ưu hóa tuyệt đối tốc độ tìm kiếm khi lọc báo cáo theo Bến + Thời gian (Tháng hoặc Ngày)
SanLuongDoanhThuSchema.index({ ma_ben: 1, thang_nam: 1 });
SanLuongDoanhThuSchema.index({ ma_ben: 1, ngay_nhap: -1 });
