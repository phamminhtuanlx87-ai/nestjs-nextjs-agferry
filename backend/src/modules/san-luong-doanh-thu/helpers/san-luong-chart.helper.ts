// san-luong-chart.helper.ts
import { Model } from 'mongoose';
import { DuLieuComboChartDto } from '../dto/chart-san-luong-doanh-thu-response.dto';
import dayjs from 'dayjs';
import { DuLieuTyTrongDto } from '../dto/chart-ty-trong-doanh-thu-response.dto';
import { MAPPING_CHUNG_LOAI_FIELD } from '../constants/mapping_ben_pha';

/**
 * Hàm xử lý Aggregate, Mapping và Sắp xếp dữ liệu biểu đồ cho ngày Hôm Nay (theo Nhóm Con)
 *
 * @param sanLuongModel Model Mongoose để truy vấn cơ sở dữ liệu
 * @param dieuKienLoc Bộ lọc ngày_nhap, ma_ben... đã được tính toán từ trước
 * @param thuTuUuTien Mảng các key sắp xếp thứ tự ưu tiên (THU_TU_UU_TIEN)
 * @param mappingField Record mapping nhãn tiếng Việt (MAPPING_CHUNG_LOAI_FIELD)
 */
const MUI_GIO_VIET_NAM = 'Asia/Ho_Chi_Minh';

export async function getBieuDoHomNay(
  sanLuongModel: Model<any>,
  dieuKienLoc: any,
  thuTuUuTien: string[],
  mappingField: Record<string, string>,
): Promise<DuLieuComboChartDto[]> {
  // 1. Thực hiện truy vấn Aggregate trong MongoDB[cite: 1]
  const duLieuTongHop = await sanLuongModel
    .aggregate([
      // Lọc theo ngày hôm nay[cite: 1]
      { $match: dieuKienLoc },

      // Trải phẳng mảng chi tiết sản lượng thành các bản ghi độc lập[cite: 1]
      {
        $unwind: {
          path: '$chi_tiet_san_luong',
          preserveNullAndEmptyArrays: false, // Bỏ qua mảng rỗng để tránh bản ghi rác[cite: 1]
        },
      },

      // Chiếu xuất các trường cần thiết ra để tầng sau xử lý cho nhẹ dữ liệu[cite: 1]
      {
        $project: {
          nhom_con: '$chi_tiet_san_luong.nhom_con',
          so_luot_xe: '$chi_tiet_san_luong.so_luot_xe',
          tong_doanh_thu: '$chi_tiet_san_luong.tong_doanh_thu',
        },
      },

      // Gom nhóm theo nhóm con (Hành Khách, Xe Máy, Xe Tải...)[cite: 1]
      {
        $group: {
          _id: '$nhom_con', // Tiêu chí gom nhóm chính xác theo trường nhom_con[cite: 1]
          san_luong: { $sum: { $ifNull: ['$so_luot_xe', 0] } }, // Cộng dồn số lượt xe[cite: 1]
          doanh_thu: { $sum: { $ifNull: ['$tong_doanh_thu', 0] } }, // Cộng dồn tổng doanh thu[cite: 1]
        },
      },

      // Sắp xếp tạm thời kết quả theo _id từ A -> Z[cite: 1]
      { $sort: { _id: 1 } },
    ])
    .exec(); //[cite: 1]

  // 2. Map dữ liệu thô từ DB sang cấu trúc DTO hiển thị ở Frontend[cite: 1]
  const duLieu: DuLieuComboChartDto[] = duLieuTongHop.map((item) => ({
    nhom: item._id,
    nhan: mappingField[item._id] || item._id, // Ưu tiên nhãn map tiếng Việt[cite: 1]
    san_luong: item.san_luong,
    doanh_thu: item.doanh_thu,
  })); //[cite: 1]

  // 3. Sắp xếp lại mảng dữ liệu theo đúng thứ tự ưu tiên hiển thị[cite: 1]
  duLieu.sort((a: any, b: any) => {
    const indexA = thuTuUuTien.indexOf(String(a.nhom ?? ''));
    const indexB = thuTuUuTien.indexOf(String(b.nhom ?? ''));

    // Nếu không tìm thấy trong cấu hình Record, đẩy về cuối cùng (vị trí 99)[cite: 1]
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB); //[cite: 1]
  });

  return duLieu;
}

export async function getBieuDoNgay(
  sanLuongModel: Model<any>,
  dieuKienLoc: any,
  groupBy: any,
): Promise<DuLieuComboChartDto[]> {
  const duLieuTongHop = await sanLuongModel
    .aggregate([
      { $match: dieuKienLoc },
      {
        $project: {
          ngay: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$ngay_nhap',
              timezone: MUI_GIO_VIET_NAM,
            },
          },
          ma_ben: '$ma_ben',
          san_luong: {
            $sum: {
              $map: {
                input: { $ifNull: ['$chi_tiet_san_luong', []] },
                as: 'chiTiet',
                in: { $ifNull: ['$$chiTiet.so_luot_xe', 0] },
              },
            },
          },
          doanh_thu: { $ifNull: ['$doanh_thu_thuan_tong_cong', 0] },
        },
      },
      {
        $group: {
          _id: groupBy,
          san_luong: { $sum: '$san_luong' },
          doanh_thu: { $sum: '$doanh_thu' },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .exec();
  const duLieu = duLieuTongHop.map((item) => ({
    nhom: item._id,
    nhan: dayjs(item._id as Date).format('DD/MM'),
    san_luong: item.san_luong,
    doanh_thu: item.doanh_thu,
  }));

  return duLieu;
}

export async function getBieuDoQui(
  sanLuongModel: Model<any>,
  dieuKienLoc: any,
  groupBy: any,
): Promise<DuLieuComboChartDto[]> {
  const duLieuTongHop = await sanLuongModel
    .aggregate([
      { $match: dieuKienLoc },
      {
        $project: {
          thang: { $substr: ['$thang_nam', 5, 2] },
          ma_ben: '$ma_ben',
          san_luong: {
            $sum: {
              $map: {
                input: { $ifNull: ['$chi_tiet_san_luong', []] },
                as: 'chiTiet',
                in: { $ifNull: ['$$chiTiet.so_luot_xe', 0] },
              },
            },
          },
          doanh_thu: { $ifNull: ['$doanh_thu_thuan_tong_cong', 0] },
        },
      },
      // 3. Quy đổi số tháng sang tên Quý tương ứng
      {
        $project: {
          qui: {
            $switch: {
              branches: [
                {
                  case: { $in: ['$thang', ['01', '02', '03']] },
                  then: 'Q1',
                },
                {
                  case: { $in: ['$thang', ['04', '05', '06']] },
                  then: 'Q2',
                },
                {
                  case: { $in: ['$thang', ['07', '08', '09']] },
                  then: 'Q3',
                },
                {
                  case: { $in: ['$thang', ['10', '11', '12']] },
                  then: 'Q4',
                },
              ],
              default: 'Không xác định',
            },
          },
          san_luong: 1,
          doanh_thu: 1,
        },
      },

      {
        $group: {
          _id: groupBy,
          san_luong: { $sum: '$san_luong' },
          doanh_thu: { $sum: '$doanh_thu' },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .exec();
  // Mảng thứ tự hiển thị và mapping nhãn tiếng Việt cho đẹp mắt
  const QUI_MAPPING: Record<string, string> = {
    Q1: 'Quý I',
    Q2: 'Quý II',
    Q3: 'Quý III',
    Q4: 'Quý IV',
  };

  // 6. Map kết quả trả về cho client hiển thị
  const duLieu = duLieuTongHop.map((item) => ({
    nhom: item._id,
    nhan: QUI_MAPPING[item._id] || item._id, // Trả ra nhãn "Quý I", "Quý II"... để trục X biểu đồ hiển thị
    san_luong: item.san_luong,
    doanh_thu: item.doanh_thu,
  }));

  // Sắp xếp lại danh sách Quý phòng trường hợp MongoDB sắp xếp chuỗi không theo ý muốn
  const uuTienQui = ['Q1', 'Q2', 'Q3', 'Q4'];
  duLieu.sort(
    (a, b) =>
      uuTienQui.indexOf(String(a.nhom)) - uuTienQui.indexOf(String(b.nhom)),
  );
  return duLieu;
}

export async function getBieuDoNam(
  sanLuongModel: Model<any>,
  dieuKienLoc: any,
  groupBy: any,
): Promise<DuLieuComboChartDto[]> {
  const duLieuTongHop = await sanLuongModel
    .aggregate([
      { $match: dieuKienLoc },
      {
        $project: {
          thang: '$thang_nam',
          ma_ben: '$ma_ben',
          san_luong: {
            $sum: {
              $map: {
                input: { $ifNull: ['$chi_tiet_san_luong', []] },
                as: 'chiTiet',
                in: { $ifNull: ['$$chiTiet.so_luot_xe', 0] },
              },
            },
          },
          doanh_thu: { $ifNull: ['$doanh_thu_thuan_tong_cong', 0] },
        },
      },
      // 3. Quy đổi số tháng sang tên Quý tương ứng
      {
        $group: {
          _id: groupBy,
          san_luong: { $sum: '$san_luong' },
          doanh_thu: { $sum: '$doanh_thu' },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .exec();

  // 6. Map kết quả trả về cho client hiển thị
  const duLieu = duLieuTongHop.map((item) => ({
    nhom: item._id,
    nhan: `Tháng ${dayjs(item._id as Date).format('MM') || item._id}`, // Trả ra nhãn "Quý I", "Quý II"... để trục X biểu đồ hiển thị
    san_luong: item.san_luong,
    doanh_thu: item.doanh_thu,
  }));

  return duLieu;
}

export async function getBieuDoTyTrongSanLuong(
  sanLuongModel: Model<any>,
  dieuKienLoc: any,
): Promise<DuLieuTyTrongDto[]> {
  const duLieuTongHop = await sanLuongModel
    .aggregate([
      { $match: dieuKienLoc },
      {
        $unwind: {
          path: '$chi_tiet_san_luong',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$chi_tiet_san_luong.nhom_con',
          san_luong: {
            $sum: { $ifNull: ['$chi_tiet_san_luong.so_luot_xe', 0] },
          },
          doanh_thu: {
            $sum: { $ifNull: ['$chi_tiet_san_luong.tong_doanh_thu', 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .exec();

  // Bước mới: tính tổng để làm mẫu số tính %
  const tongSanLuong = duLieuTongHop.reduce(
    (tong, item) => tong + item.san_luong,
    0,
  );

  const tongDoanhThu = duLieuTongHop.reduce(
    (tong, item) => tong + item.doanh_thu,
    0,
  );

  const duLieu = duLieuTongHop.map((item) => ({
    nhom: item._id,
    nhan: MAPPING_CHUNG_LOAI_FIELD[
      item._id as keyof typeof MAPPING_CHUNG_LOAI_FIELD
    ],
    san_luong: item.san_luong,
    doanh_thu: item.doanh_thu,
    // Tránh chia cho 0 nếu tongSanLuong = 0 (không có dữ liệu)
    ty_trong_san_luong:
      tongSanLuong > 0
        ? Math.round((item.san_luong / tongSanLuong) * 1000) / 10
        : 0,
    ty_trong_doanh_thu:
      tongDoanhThu > 0
        ? Math.round((item.doanh_thu / tongDoanhThu) * 1000) / 10
        : 0,
  }));

  return duLieu;
}

export async function getBieuDoTyTrongDoanhThu(
  sanLuongModel: Model<any>,
  dieuKienLoc: any,
): Promise<DuLieuTyTrongDto[]> {
  const duLieuTongHop = await sanLuongModel
    .aggregate([
      { $match: dieuKienLoc },
      {
        $unwind: {
          path: '$chi_tiet_san_luong',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$chi_tiet_san_luong.nhom_con',
          doanh_thu: {
            $sum: { $ifNull: ['$chi_tiet_san_luong.tong_doanh_thu', 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .exec();

  return duLieuTongHop.map((item) => ({
    nhom: item._id,
    nhan: MAPPING_CHUNG_LOAI_FIELD[
      item._id as keyof typeof MAPPING_CHUNG_LOAI_FIELD
    ],
    doanh_thu: item.doanh_thu,
  }));
}
