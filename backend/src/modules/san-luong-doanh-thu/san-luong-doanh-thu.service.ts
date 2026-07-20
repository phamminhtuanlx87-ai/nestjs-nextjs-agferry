import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSanLuongDoanhThuDto } from './dto/create-san-luong-doanh-thu.dto';
import { UpdateSanLuongDoanhThuDto } from './dto/update-san-luong-doanh-thu.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  SanLuongDoanhThu,
  SanLuongDoanhThuDocument,
} from './entities/san-luong-doanh-thu.entity';
import { Model } from 'mongoose';
import {
  DanhMucGiaVe,
  DanhMucGiaVeDocument,
} from '../danh-muc-gia-ve/entities/danh-muc-gia-ve.entity';
import {
  ChiTietSanLuong,
  MA_GIA_VE,
  MAPPING_NHOM_VE,
} from './dto/chi_tiet_doanh_thu';
import dayjs from 'dayjs';
import { GetSanLuongDto } from './dto/get-san-luong-doanh-thi.dto';
import { FilterToolbarDto } from './dto/filter-toolbar.dto';
import {
  getCompareDateRange,
  getDateRange,
  layCauHinhFilterChart,
} from './utils/date-range.helper';
import {
  LoaiThoiGianBieuDo,
  MAP_TEN_BEN,
  MAPPING_CHUNG_LOAI_FIELD,
} from './constants/mapping_ben_pha';
import {
  ChartSanLuongDoanhThuResponseDto,
  DuLieuComboChartDto,
} from './dto/chart-san-luong-doanh-thu-response.dto';
import { GetChartSanLuongDoanhThuDto } from './dto/get-chart-san-luong-doanh-thu.dto';
import {
  getBieuDoHomNay,
  getBieuDoNam,
  getBieuDoNgay,
  getBieuDoQui,
  getBieuDoTyTrongSanLuong,
} from './helpers/san-luong-chart.helper';
import { DieuKienLocSanLuongType } from './types/dieu-kien-loc.type';
import {
  ChartTyTrongResponseDto,
  DuLieuTyTrongDto,
  NHOM_VE_KY,
  NHOM_VE_LUOT,
} from './dto/chart-ty-trong-doanh-thu-response.dto';
import { tinhTyTrongChoNhom } from './utils/tinh-ty-trong-nhom';

export const START_DATE_REALTIME = '2026-07-01';
export const LEGACY_DAY_SNAPSHOT = '20';

@Injectable()
export class SanLuongDoanhThuService {
  constructor(
    @InjectModel(SanLuongDoanhThu.name)
    private readonly sanLuongModel: Model<SanLuongDoanhThuDocument>,

    @InjectModel(DanhMucGiaVe.name)
    private readonly danhMucGiaVeModel: Model<DanhMucGiaVeDocument>,
  ) {}

  async create(dto: CreateSanLuongDoanhThuDto, userId: string) {
    // 🛡️ Tuyến phòng thủ 1: Xử lý múi giờ và đồng bộ dữ liệu lịch sử

    if (dto.ngay_nhap) {
      const targetDate = new Date(`${dto.ngay_nhap}T12:00:00.000Z`);
      const fenceDate = new Date(`${START_DATE_REALTIME}T12:00:00.000Z`);

      if (targetDate < fenceDate) {
        const thangNamCat = dto.ngay_nhap.substring(0, 7);
        dto.ngay_nhap = `${thangNamCat}-${LEGACY_DAY_SNAPSHOT}`;
      }
    }

    const ngayNhapDate = new Date(`${dto.ngay_nhap}T12:00:00.000Z`);

    // 🛑 PHÒNG TUYẾN 2: Chống trùng phiên (Mỗi bến trong 1 ngày chỉ có 1 document tổng)
    const trungPhien = await this.sanLuongModel
      .findOne({
        ma_ben: dto.ma_ben,
        ngay_nhap: ngayNhapDate,
      })
      .exec();

    if (trungPhien) {
      throw new ConflictException(
        `Báo cáo sản lượng của bến [${dto.ma_ben}] ngày ${dto.ngay_nhap} đã được nạp trước đó rồi! Hãy dùng tính năng chỉnh sửa.`,
      );
    }

    // 🛑 PHÒNG TUYẾN 3: Thuật toán tự động tra cứu biểu giá & nhân tiền cho từng dòng xe
    const mangChiTietCapNhat: ChiTietSanLuong[] = [];

    for (const xe of dto.chi_tiet_san_luong) {
      // Tìm danh mục giá của loại xe này
      const danhMucVe = await this.danhMucGiaVeModel
        .findOne({ ma_loai_ve: xe.ma_loai_ve, kich_hoat: true })
        .exec();

      if (!danhMucVe) {
        throw new BadRequestException(
          `Loại xe mã [${xe.ma_loai_ve}] không tồn tại hoặc đã bị ẩn khỏi hệ thống!`,
        );
      }

      // Săn tìm mức giá phù hợp với ngày nhập (Lấy ông mới nhất nhỏ hơn hoặc bằng ngày nhập)
      const lichSuPhuHop = danhMucVe.lich_su_gia
        .filter((ls) => new Date(ls.ngay_ap_dung) <= ngayNhapDate)
        .sort(
          (a, b) =>
            new Date(b.ngay_ap_dung).getTime() -
            new Date(a.ngay_ap_dung).getTime(),
        )[0];

      if (!lichSuPhuHop) {
        throw new BadRequestException(
          `Loại xe [${xe.ma_loai_ve}] chưa cấu hình biểu giá cho ngày ${dto.ngay_nhap}!`,
        );
      }

      // Lấy giá theo bến hoặc giá CHUNG
      const giaCuaBen =
        lichSuPhuHop.gia_theo_ben.find((g) => g.ma_nhom_ben === dto.ma_ben) ||
        lichSuPhuHop.gia_theo_ben.find((g) => g.ma_nhom_ben === 'CHUNG');

      if (!giaCuaBen) {
        throw new BadRequestException(
          `Không tìm thấy đơn giá cho bến ${dto.ma_ben} của loại xe [${xe.ma_loai_ve}]!`,
        );
      }
      const lichSuBHHK = danhMucVe.lich_su_bhhk
        .filter((ls) => new Date(ls.ngay_ap_dung) <= ngayNhapDate)
        .sort(
          (a, b) =>
            new Date(b.ngay_ap_dung).getTime() -
            new Date(a.ngay_ap_dung).getTime(),
        )[0];

      const bhhkDonGia = lichSuBHHK ? lichSuBHHK.gia_bhhk : 0;
      const bhhkThanhTien = Math.round(xe.so_luot_xe * bhhkDonGia);

      // Chốt cứng đơn giá và nhân tổng doanh thu dòng xe (Không tin Frontend gửi lên)
      const giaVeApDung = giaCuaBen.gia_ve;
      const tongDoanhThuDongXe = Math.round(xe.so_luot_xe * giaVeApDung);
      const cauHinhNhom = MAPPING_NHOM_VE[
        xe.ma_loai_ve as keyof typeof MA_GIA_VE
      ] || {
        nhom_cha: 'HANH_KHACH',
        nhom_con: 'HANH_KHACH',
      };
      mangChiTietCapNhat.push({
        ma_loai_ve: xe.ma_loai_ve,
        so_luot_xe: xe.so_luot_xe,
        gia_ve_ap_dung: giaVeApDung,
        tong_doanh_thu: tongDoanhThuDongXe,
        bhhk_don_gia: bhhkDonGia,
        bhhk_thanh_tien: bhhkThanhTien,
        nhom_cha: cauHinhNhom.nhom_cha,
        nhom_con: cauHinhNhom.nhom_con,
      });
    }
    //hết voòng for
    // Tự động sinh chuỗi YYYY-MM làm báo cáo
    const thangNam = `${ngayNhapDate.getFullYear()}-${String(ngayNhapDate.getMonth() + 1).padStart(2, '0')}`;
    // --- 1. KHỐI DOANH THU THEO VÉ (VÉ LƯỢT) ---
    const dt_theo_ve = mangChiTietCapNhat
      .filter((e) =>
        ['HANH_KHACH', 'XE_CAC_LOAI', 'THUE_BAO'].includes(e.nhom_cha),
      )
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    // Tính tổng tiền bảo hiểm hành khách của nhóm vé lượt
    const bhhk_thanh_tien = mangChiTietCapNhat
      .filter((e) =>
        ['HANH_KHACH', 'XE_CAC_LOAI', 'THUE_BAO'].includes(e.nhom_cha),
      )
      .reduce((total, e) => total + (e.bhhk_thanh_tien || 0), 0);

    // Thuế suất lấy từ FE gửi lên, mặc định là 8 nếu rỗng
    const vat_ve_luot = dto.doanh_thu_theo_ve?.vat ?? 8;
    const vat_thanh_tien_luot =
      ((dt_theo_ve - bhhk_thanh_tien) / (1 + vat_ve_luot / 100)) *
      (vat_ve_luot / 100);
    const dtt_ve_luot = dt_theo_ve - bhhk_thanh_tien - vat_thanh_tien_luot;
    const doanhThuTheoVe = {
      dtt_ve: dtt_ve_luot,
      dt_theo_ve: dt_theo_ve,
      bhhk_thanh_tien: bhhk_thanh_tien,
      vat: vat_ve_luot,
      vat_thanh_tien: vat_thanh_tien_luot,
    };
    //------------------------------------
    //Ve qui
    const dt_theo_ve_thang = mangChiTietCapNhat
      // 1. Lọc lấy các dòng thuộc nhóm cha cần tính tổng
      .filter((e) => ['VE_THANG'].includes(e.nhom_cha))
      // 2. Cộng dồn trường tong_doanh_thu (bắt đầu từ số 0)
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);
    const vat_ve_thang = dto.doanh_thu_ve_thang?.vat ?? 8;

    const vat_thanh_tien_ve_thang = Math.round(
      (dt_theo_ve_thang / (1 + vat_ve_thang / 100)) * (vat_ve_thang / 100),
    );
    const dtt_ve_thang = dt_theo_ve_thang - vat_thanh_tien_ve_thang;
    const doanhThuTheoVeThang = {
      dtt_ve: dtt_ve_thang,
      dt_theo_ve: dt_theo_ve_thang,
      vat: vat_ve_thang,
      vat_thanh_tien: vat_thanh_tien_ve_thang,
    };

    //------------------------------------
    //Ve qui
    const dt_theo_ve_qui = mangChiTietCapNhat
      // 1. Lọc lấy các dòng thuộc nhóm cha cần tính tổng
      .filter((e) => ['VE_QUI'].includes(e.nhom_cha))
      // 2. Cộng dồn trường tong_doanh_thu (bắt đầu từ số 0)
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const vat_ve_qui = dto.doanh_thu_ve_thang?.vat ?? 8;

    const vat_thanh_tien_ve_qui = Math.round(
      (dt_theo_ve_qui / (1 + vat_ve_qui / 100)) * (vat_ve_qui / 100),
    );
    const dtt_ve_qui = dt_theo_ve_qui - vat_thanh_tien_ve_qui;
    const doanhThuTheoVeQui = {
      dtt_ve: dtt_ve_qui,
      dt_theo_ve: dt_theo_ve_qui,
      vat: vat_ve_qui,
      vat_thanh_tien: vat_thanh_tien_ve_qui,
    };
    //------------------------------------
    //Ve Nam
    const dt_theo_ve_nam = mangChiTietCapNhat
      // 1. Lọc lấy các dòng thuộc nhóm cha cần tính tổng
      .filter((e) => ['VE_NAM'].includes(e.nhom_cha))
      // 2. Cộng dồn trường tong_doanh_thu (bắt đầu từ số 0)
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const vat_ve_nam = dto.doanh_thu_ve_thang?.vat ?? 8;

    const vat_thanh_tien_ve_nam = Math.round(
      (dt_theo_ve_nam / (1 + vat_ve_nam / 100)) * (vat_ve_nam / 100),
    );
    const dtt_ve_nam = dt_theo_ve_nam - vat_thanh_tien_ve_nam;
    const doanhThuTheoVeNam = {
      dtt_ve: dtt_ve_nam,
      dt_theo_ve: dt_theo_ve_nam,
      vat: vat_ve_nam,
      vat_thanh_tien: vat_thanh_tien_ve_nam,
    };

    const doanhThuKhac = dto.doanh_thu_khac ?? 0;
    const doanhThuHDTaiChinh = dto.doanh_thu_hd_tai_chinh ?? 0;
    const doanh_thu_thuan_tong_cong = Math.round(
      dtt_ve_luot + dtt_ve_thang + dtt_ve_qui + dtt_ve_nam + doanhThuHDTaiChinh,
    );
    // Tiến hành nạp dữ liệu sạch vào Database
    const loaiDuLieu = 'THUC_HIEN';
    const newRecord = new this.sanLuongModel({
      ...dto,
      ngay_nhap: ngayNhapDate,
      thang_nam: thangNam,
      chi_tiet_san_luong: mangChiTietCapNhat,
      nguoi_nhap: userId,
      doanh_thu_theo_ve: doanhThuTheoVe,
      doanh_thu_ve_thang: doanhThuTheoVeThang,
      doanh_thu_ve_qui: doanhThuTheoVeQui,
      doanh_thu_ve_nam: doanhThuTheoVeNam,
      doanh_thu_khac: doanhThuKhac,
      doanh_thu_hd_tai_chinh: doanhThuHDTaiChinh,
      loai_du_lieu: loaiDuLieu,
      doanh_thu_thuan_tong_cong: doanh_thu_thuan_tong_cong,
    });
    return await newRecord.save();
  }

  async findAll(filters: FilterToolbarDto) {
    try {
      // ==========================================
      // BƯỚC 1: XỬ LÝ KHOẢNG THỜI GIAN (DATE RANGE)
      // ==========================================
      const effectiveTimeType = filters.time || 'THANG_NAY';
      const currentRange = getDateRange(effectiveTimeType);
      const compareRange = getCompareDateRange(
        effectiveTimeType,
        filters.compare || 'KY_TRUOC',
      );

      // ==========================================
      // BƯỚC 2: TỐI ƯU HÓA TRUY VẤN SONG SONG VỚI PROMISE.ALL
      // (Gom toàn bộ lệnh đếm Doanh thu, Xe, Khách, Vé ĐK về làm 1 câu lệnh chung)
      // ==========================================
      const [currentData, compareData] = await Promise.all([
        this.executeAggregation(
          currentRange.fromDate,
          currentRange.toDate,
          filters.location,
          filters.search,
        ),
        compareRange.compareFromDate && compareRange.compareToDate
          ? this.executeAggregation(
              compareRange.compareFromDate,
              compareRange.compareToDate,
              filters.location,
              filters.search,
            )
          : null,
      ]);

      // ==========================================
      // BƯỚC 3: TÌM BẾN CÓ DOANH THU CAO NHẤT (GIỮ NGUYÊN BLOCK LOGIC CHUẨN)
      // ==========================================
      const dbDateExpr = {
        $cond: [
          { $eq: [{ $type: '$ngay_nhap' }, 'date'] },
          '$ngay_nhap',
          { $dateFromString: { dateString: '$ngay_nhap' } },
        ],
      };

      const matchConditions: any = {
        $expr: {
          $and: [
            { $gte: [dbDateExpr, currentRange.fromDate] },
            { $lte: [dbDateExpr, currentRange.toDate] },
          ],
        },
      };

      if (filters.location && filters.location !== 'ALL') {
        matchConditions.ma_ben = filters.location;
      }

      // 3.2. Chạy aggregate tìm bến cao nhất kỳ hiện tại
      const benCaoNhatResult = await this.sanLuongModel
        .aggregate([
          { $match: matchConditions },
          {
            $group: {
              _id: '$ma_ben',
              tongDoanhThuBen: { $sum: '$doanh_thu_thuan_tong_cong' },
            },
          },
          { $sort: { tongDoanhThuBen: -1 } },
          { $limit: 1 },
        ])
        .exec();
      const topBenRaw = benCaoNhatResult[0];
      const maBenCaoNhat = topBenRaw?._id || '';
      const doanhThuBenCaoNhat = topBenRaw?.tongDoanhThuBen || 0;

      const tenBenHienThi = maBenCaoNhat
        ? MAP_TEN_BEN[maBenCaoNhat] || `Bến ${maBenCaoNhat}`
        : 'Không có dữ liệu';

      let doanhThuBenCaoNhatQuaKhu = 0;
      if (
        maBenCaoNhat &&
        compareRange.compareFromDate &&
        compareRange.compareToDate
      ) {
        const matchCompareConditions: any = {
          ma_ben: maBenCaoNhat, // Ép cứng tìm theo đúng mã bến cao nhất vừa tìm được
          $expr: {
            $and: [
              { $gte: [dbDateExpr, compareRange.compareFromDate] },
              { $lte: [dbDateExpr, compareRange.compareToDate] },
            ],
          },
        };

        const compareBenResult = await this.sanLuongModel
          .aggregate([
            { $match: matchCompareConditions },
            {
              $group: {
                _id: '$ma_ben',
                tongDoanhThuBen: { $sum: '$doanh_thu_thuan_tong_cong' },
              },
            },
          ])
          .exec();

        doanhThuBenCaoNhatQuaKhu = compareBenResult[0]?.tongDoanhThuBen || 0;
      }
      // ==========================================
      // BƯỚC 4: TÍNH XU HƯỚNG TĂNG TRƯỞNG (TREND) RIÊNG BIỆT CHO TỪNG CARD
      // ==========================================
      const tinhTrend = (hienTai: number, quaKhu: number) => {
        const numHienTai = Number(hienTai) || 0;
        const numQuaKhu = Number(quaKhu) || 0;

        if (!compareData || numQuaKhu === 0) {
          return { type: 'flat', percentage: '0%' };
        }

        const phanTram = ((numHienTai - numQuaKhu) / numQuaKhu) * 100;
        return {
          type: phanTram > 0 ? 'up' : phanTram < 0 ? 'down' : 'flat',
          percentage: `${Math.abs(phanTram).toFixed(2).replace('.', ',')}%`,
        };
      };

      const bieuThucText =
        filters.compare === 'KY_TRUOC'
          ? 'so với kỳ trước'
          : filters.compare === 'CUNG_KY_NAM_TRUOC'
            ? 'so với cùng kỳ năm trước'
            : '';

      // ==========================================
      // BƯỚC 5: TRẢ DỮ LIỆU ĐÃ ĐƯỢC CHUẨN HÓA SẠCH VỀ FRONTEND
      // ==========================================
      return {
        // Dữ liệu số thô từ executeAggregation được định dạng hiển thị Tiếng Việt (.toLocaleString)
        tongDoanhThu: (currentData?.tongDoanhThu || 0).toLocaleString('vi-VN'),
        tongLuotXeCacLoai: (currentData?.tongLuotXeCacLoai || 0).toLocaleString(
          'vi-VN',
        ),
        tongLuotHanhKhach: (currentData?.tongLuotHanhKhach || 0).toLocaleString(
          'vi-VN',
        ),
        tongLuotVeDinhKy: (currentData?.tongLuotVeDinhKy || 0).toLocaleString(
          'vi-VN',
        ),
        tongLuotThueBao: (currentData?.tongLuotThueBao || 0).toLocaleString(
          'vi-VN',
        ),
        benCaoNhat: {
          ma_ben: tenBenHienThi,
          doanh_thu: doanhThuBenCaoNhat.toLocaleString('vi-VN'),
        },

        // Phân tách object trends theo từng key tương ứng, không nhét chung mảng
        trends:
          filters.compare !== 'KHONG_DOI_CHIEU'
            ? {
                tongDoanhThu: {
                  ...tinhTrend(
                    currentData?.tongDoanhThu as number,
                    compareData?.tongDoanhThu as number,
                  ),
                  text: bieuThucText,
                },
                tongLuotXeCacLoai: {
                  ...tinhTrend(
                    currentData?.tongLuotXeCacLoai as number,
                    compareData?.tongLuotXeCacLoai as number,
                  ),
                  text: bieuThucText,
                },
                tongLuotHanhKhach: {
                  ...tinhTrend(
                    currentData?.tongLuotHanhKhach as number,
                    compareData?.tongLuotHanhKhach as number,
                  ),
                  text: bieuThucText,
                },
                tongLuotThueBao: {
                  ...tinhTrend(
                    currentData?.tongLuotThueBao as number,
                    compareData?.tongLuotThueBao as number,
                  ),
                  text: bieuThucText,
                },
                tongLuotVeDinhKy: {
                  ...tinhTrend(
                    currentData?.tongLuotVeDinhKy as number,
                    compareData?.tongLuotVeDinhKy as number,
                  ),
                  text: bieuThucText,
                },
                // BỔ SUNG TẠI ĐÂY: Tính trend riêng cho bến cao nhất
                benCaoNhat: {
                  ...tinhTrend(
                    doanhThuBenCaoNhat as number,
                    doanhThuBenCaoNhatQuaKhu,
                  ),
                  text: bieuThucText,
                },
              }
            : null,
      };
    } catch (error) {
      console.error('Lỗi tại hàm findAll tối ưu hóa:', error);
      throw new InternalServerErrorException('Lỗi tính toán dữ liệu tổng hợp.');
    }
  }

  async layDuLieuBieuDo(
    filters: GetChartSanLuongDoanhThuDto,
  ): Promise<ChartSanLuongDoanhThuResponseDto> {
    // const khoangThoiGian = getDateRange(filters.time);
    const fenceDate = new Date(`${START_DATE_REALTIME}T12:00:00.000Z`);
    const { ngayBatDau, ngayKetThuc, groupBy, kieuChart } =
      layCauHinhFilterChart(filters);

    const dieuKienLoc: {
      ngay_nhap: { $gte: Date; $lte: Date };
      ma_ben?: string;
    } = {
      ngay_nhap: {
        $gte:
          ngayKetThuc < fenceDate
            ? new Date(`${dayjs(ngayBatDau).year()}-01-01T12:00:00.000Z`)
            : ngayBatDau,
        $lte: ngayKetThuc,
      },
    };

    if (filters.location !== 'ALL') {
      dieuKienLoc.ma_ben = filters.location;
    }

    // let duLieuTongHop;
    let duLieu: DuLieuComboChartDto[] = [];
    const THU_TU_UU_TIEN = Object.keys(MAPPING_CHUNG_LOAI_FIELD);
    switch (filters?.time) {
      case LoaiThoiGianBieuDo.HOM_QUA:
      case LoaiThoiGianBieuDo.HOM_NAY:
        duLieu = await getBieuDoHomNay(
          this.sanLuongModel,
          dieuKienLoc,
          THU_TU_UU_TIEN,
          MAPPING_CHUNG_LOAI_FIELD,
        );
        break;
      case LoaiThoiGianBieuDo.BAY_NGAY_GAN_NHAT:
      case LoaiThoiGianBieuDo.BA_MUOI_NGAY_GAN_NHAT:
      case LoaiThoiGianBieuDo.THANG_NAY:
        duLieu = await getBieuDoNgay(this.sanLuongModel, dieuKienLoc, groupBy);
        break;
      case LoaiThoiGianBieuDo.QUI_NAY:
        duLieu = await getBieuDoQui(this.sanLuongModel, dieuKienLoc, groupBy);
        break;
      case LoaiThoiGianBieuDo.NAM_NAY:
        duLieu = await getBieuDoNam(this.sanLuongModel, dieuKienLoc, groupBy);
        break;
    }
    return {
      don_vi_san_luong: 'lượt',
      don_vi_doanh_thu: 'đ',
      loai_nhom: kieuChart,
      tu_ngay: dayjs(ngayBatDau).format('YYYY-MM-DD'),
      den_ngay: dayjs(ngayKetThuc).format('YYYY-MM-DD'),
      du_lieu: duLieu,
    };
  }

  async layDuLieuTyTrongSanLuong(
    filters: GetChartSanLuongDoanhThuDto,
  ): Promise<ChartTyTrongResponseDto> {
    const { ngayBatDau, ngayKetThuc } = layCauHinhFilterChart(filters);

    const fenceDate = new Date(`${START_DATE_REALTIME}T12:00:00.000Z`);
    const dieuKienLoc: DieuKienLocSanLuongType = {
      ngay_nhap: {
        $gte:
          ngayKetThuc < fenceDate
            ? new Date(`${dayjs(ngayBatDau).year()}-01-01T12:00:00.000Z`)
            : ngayBatDau,
        $lte: ngayKetThuc,
      },
    };

    if (filters.location !== 'ALL') {
      dieuKienLoc.ma_ben = filters.location;
    }

    let duLieu: DuLieuTyTrongDto[] = [];

    duLieu = await getBieuDoTyTrongSanLuong(this.sanLuongModel, dieuKienLoc);
    const veLuot = duLieu.filter((item) =>
      (NHOM_VE_LUOT as readonly string[]).includes(
        item.nhom || NHOM_VE_LUOT[0],
      ),
    );
    const veKy = duLieu.filter((item) =>
      (NHOM_VE_KY as readonly string[]).includes(item.nhom || NHOM_VE_KY[0]),
    );

    const veLuotDaTinh = tinhTyTrongChoNhom(veLuot);
    const veKyDaTinh = tinhTyTrongChoNhom(veKy);

    return {
      don_vi_san_luong: 'lượt',
      don_vi_doanh_thu: 'đ',
      // loai_nhom: kieuChart,
      tu_ngay: dayjs(ngayBatDau).format('YYYY-MM-DD'),
      den_ngay: dayjs(ngayKetThuc).format('YYYY-MM-DD'),
      ve_luot: veLuotDaTinh,
      ve_ky: veKyDaTinh,
    };
  }

  async layDuLieuTyTrongDoanhThu(
    filters: GetChartSanLuongDoanhThuDto,
  ): Promise<ChartTyTrongResponseDto> {
    const { ngayBatDau, ngayKetThuc } = layCauHinhFilterChart(filters);

    const fenceDate = new Date(`${START_DATE_REALTIME}T12:00:00.000Z`);
    const dieuKienLoc: DieuKienLocSanLuongType = {
      ngay_nhap: {
        $gte:
          ngayKetThuc < fenceDate
            ? new Date(`${dayjs(ngayBatDau).year()}-01-01T12:00:00.000Z`)
            : ngayBatDau,
        $lte: ngayKetThuc,
      },
    };

    if (filters.location !== 'ALL') {
      dieuKienLoc.ma_ben = filters.location;
    }

    let duLieu: DuLieuTyTrongDto[] = [];

    duLieu = await getBieuDoTyTrongSanLuong(this.sanLuongModel, dieuKienLoc);
    const veLuot = duLieu.filter((item) =>
      (NHOM_VE_LUOT as readonly string[]).includes(
        item.nhom || NHOM_VE_LUOT[0],
      ),
    );
    const veKy = duLieu.filter((item) =>
      (NHOM_VE_KY as readonly string[]).includes(item.nhom || NHOM_VE_KY[0]),
    );

    const veLuotDaTinh = tinhTyTrongChoNhom(veLuot);
    const veKyDaTinh = tinhTyTrongChoNhom(veKy);

    return {
      don_vi_san_luong: 'lượt',
      don_vi_doanh_thu: 'đ',
      // loai_nhom: kieuChart,
      tu_ngay: dayjs(ngayBatDau).format('YYYY-MM-DD'),
      den_ngay: dayjs(ngayKetThuc).format('YYYY-MM-DD'),
      ve_luot: veLuotDaTinh,
      ve_ky: veKyDaTinh,
    };
  }

  private async executeAggregation(
    fromDate: Date,
    toDate: Date,
    location?: string,
    search?: string,
  ) {
    const matchStage: any = {
      ngay_nhap: { $gte: fromDate, $lte: toDate },
    };

    if (location && location !== 'ALL') {
      matchStage.ma_ben = location;
    }

    if (search) {
      matchStage.$or = [{ ma_ben: { $regex: search, $options: 'i' } }];
    }

    // 2. Thực hiện tính toán tổng hợp nâng cao cho mảng lồng nhau
    const result = await this.sanLuongModel
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            // Chỉ tiêu 1: Doanh thu thuần nằm ở tầng gốc (Root), tính tổng bình thường
            tongDoanhThu: { $sum: '$doanh_thu_thuan_tong_cong' },

            // Chỉ tiêu 2: Duyệt mảng chi_tiet_san_luong, nếu nhom_cha là "LUOT_XE" thì cộng dồn so_luot_xe
            tongLuotXeCacLoai: {
              $sum: {
                $sum: {
                  $map: {
                    input: '$chi_tiet_san_luong',
                    as: 'item',
                    in: {
                      $cond: [
                        { $eq: ['$$item.nhom_cha', 'XE_CAC_LOAI'] }, // Có thể db lưu là "LUOT_XE" hoặc chữ thường, bạn check lại hoa/thường nhé
                        '$$item.so_luot_xe',
                        0,
                      ],
                    },
                  },
                },
              },
            },

            // Chỉ tiêu 3: Duyệt mảng chi_tiet_san_luong, nếu nhom_cha là "HANH_KHACH" thì cộng dồn so_luot_xe
            tongLuotHanhKhach: {
              $sum: {
                $sum: {
                  $map: {
                    input: '$chi_tiet_san_luong',
                    as: 'item',
                    in: {
                      $cond: [
                        { $eq: ['$$item.nhom_cha', 'HANH_KHACH'] }, // Khớp đúng nhom_cha trong DB của bạn
                        '$$item.so_luot_xe', // Trong DB trường lưu số lượng của hành khách vẫn tên là so_luot_xe
                        0,
                      ],
                    },
                  },
                },
              },
            },
            // Chỉ tiêu 3: Duyệt mảng chi_tiet_san_luong, nếu nhom_cha là "HANH_KHACH" thì cộng dồn so_luot_xe
            tongLuotThueBao: {
              $sum: {
                $sum: {
                  $map: {
                    input: '$chi_tiet_san_luong',
                    as: 'item',
                    in: {
                      $cond: [
                        { $eq: ['$$item.nhom_cha', 'THUE_BAO'] }, // Khớp đúng nhom_cha trong DB của bạn
                        '$$item.so_luot_xe', // Trong DB trường lưu số lượng của hành khách vẫn tên là so_luot_xe
                        0,
                      ],
                    },
                  },
                },
              },
            },

            // Chỉ tiêu 4: Tính tổng vé định kỳ (Vé tháng/Vé quý)
            // Nếu DB của bạn có lưu trường tổng cộng sẵn ở đáy như doanh_thu_ve_thang thì cộng trường đó,
            // còn nếu lưu trong mảng chi_tiet_san_luong với nhom_cha là "VE_DINH_KY" thì sửa điều kiện dưới đây:
            tongLuotVeDinhKy: {
              $sum: {
                $sum: {
                  $map: {
                    input: '$chi_tiet_san_luong',
                    as: 'item',
                    in: {
                      $cond: [
                        {
                          $in: [
                            '$$item.nhom_cha',
                            ['VE_THANG', 'VE_QUI', 'VE_NAM'],
                          ],
                        },
                        '$$item.so_luot_xe',
                        0,
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      ])
      .exec();
    // Trả về dữ liệu sạch cho hàm findAll sử dụng, nếu rỗng trả về mặc định bằng 0
    return (
      result[0] || {
        tongDoanhThu: 0,
        tongLuotXeCacLoai: 0,
        tongLuotHanhKhach: 0,
        tongLuotVeDinhKy: 0,
        tongLuotThueBao: 0,
      }
    );
  }

  findOne(id: string) {
    return this.sanLuongModel.findById(id).exec();
  }

  async update(id: string, dto: UpdateSanLuongDoanhThuDto, userId: string) {
    // 1.1 Tìm bản ghi cũ trong DB bằng ID để lấy dữ liệu đối chiếu
    const banGhiCu = await this.sanLuongModel.findById(id).exec();
    if (!banGhiCu) {
      throw new NotFoundException(
        `Không tìm thấy dữ liệu sản lượng với ID: ${id}`,
      );
    }

    // =========================================================
    // BƯỚC 2: KIỂM TRA NỘI DUNG THAY ĐỔI (TRIỆT TIÊU LƯU THỪA)
    // =========================================================

    // 2.1 Lấy các giá trị doanh thu phụ từ DTO gửi lên (nếu không truyền thì giữ nguyên giá trị cũ trong DB)
    const doanhThuKhacMoi = dto.doanh_thu_khac ?? banGhiCu.doanh_thu_khac;
    const doanhThuTaiChinhMoi =
      dto.doanh_thu_hd_tai_chinh ?? banGhiCu.doanh_thu_hd_tai_chinh;
    const loaiDuLieuMoi =
      dto.loai_du_lieu || banGhiCu.loai_du_lieu || 'THUC_HIEN';

    // 2.2 Trích xuất mảng xe (Chỉ lấy mã xe và số lượt xe) để so sánh kết cấu gõ nhập
    const stringXeCu = JSON.stringify(
      banGhiCu.chi_tiet_san_luong.map((x) => ({
        ma_loai_ve: x.ma_loai_ve,
        so_luot_xe: x.so_luot_xe,
      })),
    );

    const stringXeMoi = dto.chi_tiet_san_luong
      ? JSON.stringify(
          dto.chi_tiet_san_luong.map((x) => ({
            ma_loai_ve: x.ma_loai_ve,
            so_luot_xe: x.so_luot_xe,
          })),
        )
      : stringXeCu;

    // 2.3 🌟 SO SÁNH TỔNG THỂ: Nếu số liệu xe và các khoản doanh thu giống hệt cũ -> Trả về kết quả luôn, không tính toán lại
    if (
      doanhThuKhacMoi === banGhiCu.doanh_thu_khac &&
      doanhThuTaiChinhMoi === banGhiCu.doanh_thu_hd_tai_chinh &&
      loaiDuLieuMoi === banGhiCu.loai_du_lieu &&
      stringXeCu === stringXeMoi
    ) {
      return banGhiCu; // Bẻ luồng sớm, Server không tốn 1 chút CPU nào để chạy tiếp xuống dưới
    }

    // 3.1 Cố định Ngày nhập và Mã bến từ bản ghi gốc trong DB (Bỏ qua DTO gửi lên)
    const ngayNhapGoc = banGhiCu.ngay_nhap;
    const maBenGoc = banGhiCu.ma_ben;

    const mangChiTietCapNhat: ChiTietSanLuong[] = [];

    // 3.2 Kiểm tra xem Frontend có truyền mảng sản lượng xe mới lên không
    if (dto.chi_tiet_san_luong && dto.chi_tiet_san_luong.length > 0) {
      for (const xe of dto.chi_tiet_san_luong) {
        // Tìm cấu hình loại vé trong danh mục
        const danhMucVe = await this.danhMucGiaVeModel
          .findOne({ ma_loai_ve: xe.ma_loai_ve, kich_hoat: true })
          .exec();

        if (!danhMucVe) {
          throw new BadRequestException(
            `Mã loại xe [${xe.ma_loai_ve}] không tồn tại trên hệ thống!`,
          );
        }

        // 🌟 Tối ưu: Dùng ngayNhapGoc của DB để quét tìm biểu giá lịch sử phù hợp
        const lichSuPhuHop = danhMucVe.lich_su_gia
          .filter((ls) => new Date(ls.ngay_ap_dung) <= ngayNhapGoc)
          .sort(
            (a, b) =>
              new Date(b.ngay_ap_dung).getTime() -
              new Date(a.ngay_ap_dung).getTime(),
          )[0];

        if (!lichSuPhuHop) {
          throw new BadRequestException(
            `Loại xe [${xe.ma_loai_ve}] chưa cấu hình biểu giá cho ngày này!`,
          );
        }

        // 🌟 Tối ưu: Dùng maBenGoc của DB để nhặt đơn giá của bến đó
        const giaCuaBen =
          lichSuPhuHop.gia_theo_ben.find((g) => g.ma_nhom_ben === maBenGoc) ||
          lichSuPhuHop.gia_theo_ben.find((g) => g.ma_nhom_ben === 'CHUNG');

        // Tìm giá Bảo hiểm hành khách (BHHK) an toàn, phòng lỗi trống mảng
        const lichSuBHHK = danhMucVe.lich_su_bhhk
          ?.filter((ls) => new Date(ls.ngay_ap_dung) <= ngayNhapGoc)
          .sort(
            (a, b) =>
              new Date(b.ngay_ap_dung).getTime() -
              new Date(a.ngay_ap_dung).getTime(),
          )[0];

        const bhhkDonGia = lichSuBHHK ? lichSuBHHK.gia_bhhk : 0;
        const bhhkThanhTien = Math.round(xe.so_luot_xe * bhhkDonGia);

        const giaVeApDung = giaCuaBen ? giaCuaBen.gia_ve : 0;
        const tongDoanhThuDongXe = Math.round(xe.so_luot_xe * giaVeApDung);

        // Map nhóm cha/nhóm con từ file cấu hình của anh
        const cauHinhNhom = MAPPING_NHOM_VE[
          xe.ma_loai_ve as keyof typeof MA_GIA_VE
        ] || {
          nhom_cha: 'HANH_KHACH',
          nhom_con: 'HANH_KHACH',
        };

        // Đẩy dòng xe đã được tính toán lại vào mảng tạm
        mangChiTietCapNhat.push({
          ma_loai_ve: xe.ma_loai_ve,
          so_luot_xe: xe.so_luot_xe,
          gia_ve_ap_dung: giaVeApDung,
          tong_doanh_thu: tongDoanhThuDongXe,
          bhhk_don_gia: bhhkDonGia,
          bhhk_thanh_tien: bhhkThanhTien,
          nhom_cha: (xe.nhom_cha ||
            cauHinhNhom.nhom_cha) as ChiTietSanLuong['nhom_cha'],
          nhom_con: (xe.nhom_con ||
            cauHinhNhom.nhom_con) as ChiTietSanLuong['nhom_con'],
        });
      }
    } else {
      // Nếu không truyền mảng xe mới, bê nguyên mảng cũ từ DB ra xài tiếp
      mangChiTietCapNhat.push(
        ...(banGhiCu.chi_tiet_san_luong.map((item) => ({
          ...item,
          nhom_cha: item.nhom_cha as ChiTietSanLuong['nhom_cha'],
          nhom_con: item.nhom_con as ChiTietSanLuong['nhom_con'],
        })) || []),
      );
    }
    // =========================================================
    // BƯỚC 4: KHỐI TÍNH TOÁN DOANH THU - TRIỆT TIÊU SAI SỐ LỆCH 1 ĐỒNG
    // =========================================================

    // --- 4.1 KHỐI DOANH THU THEO VÉ (VÉ LƯỢT) ---
    const dt_theo_ve = mangChiTietCapNhat
      .filter((e) =>
        ['HANH_KHACH', 'XE_CAC_LOAI', 'THUE_BAO'].includes(e.nhom_cha),
      )
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const bhhk_thanh_tien = mangChiTietCapNhat
      .filter((e) =>
        ['HANH_KHACH', 'XE_CAC_LOAI', 'THUE_BAO'].includes(e.nhom_cha),
      )
      .reduce((total, e) => total + (e.bhhk_thanh_tien || 0), 0);

    // Lấy thuế VAT mới, nếu không truyền lấy thuế cũ trong DB, mặc định bằng 8
    const vat_ve_luot =
      dto.doanh_thu_theo_ve?.vat ?? banGhiCu.doanh_thu_theo_ve?.vat ?? 8;
    const doanhThuGocTinhThueLuot = dt_theo_ve - bhhk_thanh_tien;
    // Làm tròn 1 lần duy nhất trên tổng khối để triệt tiêu sai số lẻ
    const vat_thanh_tien_luot = Math.round(
      (doanhThuGocTinhThueLuot / (1 + vat_ve_luot / 100)) * (vat_ve_luot / 100),
    );
    const dtt_ve_luot = doanhThuGocTinhThueLuot - vat_thanh_tien_luot;

    const doanhThuTheoVe = {
      dtt_ve: dtt_ve_luot,
      dt_theo_ve: dt_theo_ve,
      bhhk_thanh_tien: bhhk_thanh_tien,
      vat: vat_ve_luot,
      vat_thanh_tien: vat_thanh_tien_luot,
    };

    // --- 4.2 KHỐI DOANH THU VÉ THÁNG ---
    const dt_theo_ve_thang = mangChiTietCapNhat
      .filter((e) => ['VE_THANG'].includes(e.nhom_cha))
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const vat_ve_thang =
      dto.doanh_thu_ve_thang?.vat ?? banGhiCu.doanh_thu_ve_thang?.vat ?? 8;
    const vat_thanh_tien_thang = Math.round(
      (dt_theo_ve_thang / (1 + vat_ve_thang / 100)) * (vat_ve_thang / 100),
    );
    const dtt_ve_thang = dt_theo_ve_thang - vat_thanh_tien_thang;

    const doanhThuTheoVeThang = {
      dtt_ve: dtt_ve_thang,
      dt_theo_ve: dt_theo_ve_thang,
      vat: vat_ve_thang,
      vat_thanh_tien: vat_thanh_tien_thang,
    };

    // --- 4.3 KHỐI DOANH THU VÉ QUÝ ---
    const dt_theo_ve_qui = mangChiTietCapNhat
      .filter((e) => ['VE_QUI'].includes(e.nhom_cha))
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const vat_ve_qui =
      dto.doanh_thu_ve_qui?.vat ?? banGhiCu.doanh_thu_ve_qui?.vat ?? 8;
    const vat_thanh_tien_qui = Math.round(
      (dt_theo_ve_qui / (1 + vat_ve_qui / 100)) * (vat_ve_qui / 100),
    );
    const dtt_ve_qui = dt_theo_ve_qui - vat_thanh_tien_qui;

    const doanhThuTheoVeQui = {
      dtt_ve: dtt_ve_qui,
      dt_theo_ve: dt_theo_ve_qui,
      vat: vat_ve_qui,
      vat_thanh_tien: vat_thanh_tien_qui,
    };

    // --- 4.4 KHỐI DOANH THU VÉ NĂM ---
    const dt_theo_ve_nam = mangChiTietCapNhat
      .filter((e) => ['VE_NAM'].includes(e.nhom_cha))
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const vat_ve_nam =
      dto.doanh_thu_ve_nam?.vat ?? banGhiCu.doanh_thu_ve_nam?.vat ?? 8;
    const vat_thanh_tien_nam = Math.round(
      (dt_theo_ve_nam / (1 + vat_ve_nam / 100)) * (vat_ve_nam / 100),
    );
    const dtt_ve_nam = dt_theo_ve_nam - vat_thanh_tien_nam;

    const doanhThuTheoVeNam = {
      dtt_ve: dtt_ve_nam,
      dt_theo_ve: dt_theo_ve_nam,
      vat: vat_ve_nam,
      vat_thanh_tien: vat_thanh_tien_nam,
    };

    // --- 4.5 TỔNG DOANH THU THUẦN TỔNG CỘNG ---
    const doanhThuHDTaiChinh =
      dto.doanh_thu_hd_tai_chinh ?? banGhiCu.doanh_thu_hd_tai_chinh ?? 0;
    const doanhThuKhac = dto.doanh_thu_khac ?? banGhiCu.doanh_thu_khac ?? 0;

    // Cộng trực tiếp các số thuần lẻ sau khi đã triệt tiêu sai số tròn
    const doanhThuThuanTongCong =
      dtt_ve_luot + dtt_ve_thang + dtt_ve_qui + dtt_ve_nam + doanhThuHDTaiChinh;
    // =========================================================
    // BƯỚC 5: GHI DỮ LIỆU VÀO DATABASE VÀ HOÀN THÀNH HÀM
    // =========================================================

    const loaiDuLieuApDung =
      dto.loai_du_lieu || banGhiCu.loai_du_lieu || 'THUC_HIEN';

    const banGhiCapNhat = await this.sanLuongModel
      .findByIdAndUpdate(
        id,
        {
          ...dto, // Rải các trường khác từ Frontend gửi lên (nếu có)
          ngay_nhap: ngayNhapGoc, // 🌟 Khóa cứng: Luôn dùng ngày gốc của bản ghi trong DB
          ma_ben: maBenGoc, // 🌟 Khóa cứng: Luôn dùng bến gốc của bản ghi trong DB
          thang_nam: banGhiCu.thang_nam, // Giữ nguyên tháng năm cũ
          chi_tiet_san_luong: mangChiTietCapNhat,
          updated_by: userId, // Lưu vết ID tài khoản người thực hiện chỉnh sửa
          doanh_thu_theo_ve: doanhThuTheoVe,
          doanh_thu_ve_thang: doanhThuTheoVeThang,
          doanh_thu_ve_qui: doanhThuTheoVeQui,
          doanh_thu_ve_nam: doanhThuTheoVeNam,
          doanh_thu_hd_tai_chinh: doanhThuHDTaiChinh,
          doanh_thu_khac: doanhThuKhac,
          doanh_thu_thuan_tong_cong: doanhThuThuanTongCong,
          loai_du_lieu: loaiDuLieuApDung,
        },
        { new: true }, // 🌟 Trả về dữ liệu mới sau khi sửa để Frontend cập nhật lại State hiển thị
      )
      .exec();

    return banGhiCapNhat;
  }

  async checkVaLayDuLieu(
    query: GetSanLuongDto,
  ): Promise<SanLuongDoanhThu | null> {
    const { ngay, ma_ben } = query;

    // 1. Phân tích ngày bằng dayjs
    let ngayTruyVan = dayjs(ngay);
    const mocGioiHan = dayjs(START_DATE_REALTIME);

    // 2. 🌟 Bẻ ngày: Nếu ngày nhập < 01/08/2026 thì lấy ngày 20 của tháng đó
    if (ngayTruyVan.isBefore(mocGioiHan)) {
      ngayTruyVan = ngayTruyVan.date(20);
    }

    const tuNgay = ngayTruyVan.startOf('day').toDate(); // Tạo Object Date: 2026-06-20T00:00:00
    const denNgay = ngayTruyVan.endOf('day').toDate(); // Tạo Object Date: 2026-06-20T23:59:59

    // 3. Query vào MongoDB của Mongoose bằng khoảng thời gian Date
    const data = await this.sanLuongModel
      .findOne({
        ngay_nhap: {
          $gte: tuNgay,
          $lte: denNgay,
        },
        ma_ben: ma_ben,
      })
      .exec();
    // Trả về Object dữ liệu nếu tìm thấy, không thì trả về null
    return data;
  }

  async remove(id: string) {
    return await this.sanLuongModel.findByIdAndDelete(id).exec();
  }
}
