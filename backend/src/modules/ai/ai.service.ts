import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { InjectModel } from '@nestjs/mongoose';
import {
  CongTrinh,
  CongTrinhDocument,
} from '../congtrinh/schemas/congtrinh.schemas';
import { Model } from 'mongoose';
import {
  SanLuongDoanhThu,
  SanLuongDoanhThuDocument,
} from '../san-luong-doanh-thu/entities/san-luong-doanh-thu.entity';
import { AiModelType, DEFAULT_AI_MODEL } from './constants.ts/ai-model';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;
  private readonly logger = new Logger(AiService.name);
  constructor(
    private configService: ConfigService,
    @InjectModel(CongTrinh.name)
    private congTrinhModel: Model<CongTrinhDocument>,
    @InjectModel(SanLuongDoanhThu.name)
    private sanLuongModel: Model<SanLuongDoanhThuDocument>,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.ai = new GoogleGenAI({ apiKey });
  }

  async getMongoFilter(
    userQuestion: string,
    modelName: AiModelType = DEFAULT_AI_MODEL,
  ): Promise<Record<string, any>> {
    const currentYear = new Date().getFullYear();
    const systemInstruction = `
      Bạn là trợ lý AI CHUYÊN MÔN phân tích câu hỏi tiếng Việt thành JSON Query cho MongoDB của hệ thống Quản lý Công trình & Sản lượng Doanh thu (AGFerryDB).

      HỆ THỐNG CÓ 2 COLLECTION CHÍNH:

      1. Collection 'congtrinh':
        - ten_cong_trinh (string)
        - ma_cong_trinh (string)
        - don_vi_chu_quan (string)
        - ngay_tao_du_an (string format ISODate YYYY-MM-DDTHH:mm:ss.sssZ)
        - Mảng con 'giai_doan':
          + giai_doan.ten_giai_doan (string - Các giá trị: "Dự toán", "Thẩm tra dự toán", "Phê duyệt dự toán", "Thi công & Nghiệm thu", "Thi công", "Nghiệm thu", "Dự toán bổ sung (PS)", "Thẩm tra dự toán bổ sung", "Phê duyệt dự toán bổ sung", "Quyết toán")
          + giai_doan.ten_don_vi (string)
          + giai_doan.dia_diem_tc (string)
          + giai_doan.tong_gia_tri (number)
          + giai_doan.chi_phi_xay_dung (number)
          + giai_doan.so_ngay_tc_thuc_te (number)
          + giai_doan.ngay_thuc_hien (string format ISODate YYYY-MM-DDTHH:mm:ss.sssZ)
        
      2. Collection 'san_luong_doanh_thu':
        - ngay_nhap (string format ISODate YYYY-MM-DDTHH:mm:ss.sssZ)
        - thang_nam (string YYYY-MM)
        - ma_ben (string - Mã bến: AH: An Hoà, TO: Trà Ôn, MR: Mương Ranh, NG: Năng Gù, TG: Thuận Giang, TC: Tân Châu, VC: Vàm Cống, OM: Ô Môi)
        - doanh_thu_hd_tai_chinh (number)
        - doanh_thu_khac (number)
        - doanh_thu_thuan_tong_cong (number)
        - Mảng con 'doanh_thu_theo_ve': dtt_ve, dt_theo_ve, bhhk_thanh_tien, vat, vat_thanh_tien
        - Mảng con 'chi_tiet_san_luong': ma_loai_ve, so_luot_xe, gia_ve_ap_dung, tong_doanh_thu, nhom_cha, nhom_con

      QUY TẮC PHẠM VI & ĐỊNH DẠNG TRẢ VỀ:
      - Chỉ trả về DUY NHẤT 1 chuỗi JSON hợp lệ theo cấu trúc:
        {
          "targetCollection": "congtrinh" | "san_luong_doanh_thu" | "outOfScope",
          "filter": { ...đoạn filter MongoDB... }
        }
      - KHÔNG dùng markdown code block, KHÔNG viết câu dẫn hay bất kỳ ký tự dư thừa nào.
      - Dùng BẮT BUỘC $regex kèm $options: "i" cho các trường dạng string (trừ mã bến ma_ben).
      - Dùng dot notation cho mảng con (ví dụ: "giai_doan.dia_diem_tc", "chi_tiet_san_luong.so_luot_xe").
      - Với câu hỏi LẠC ĐỀ (thời tiết, toán học, giá dầu, tin tức ngoài...): trả về { "targetCollection": "outOfScope", "filter": {} }.
     

      QUY TẮC THỜI GIAN VÀ NĂM MẶC ĐỊNH (CỰC CỲ QUAN TRỌNG):
      - Năm hiện tại của hệ thống là: ${currentYear}.
      - NẾU người dùng hỏi khoảng tháng/thời gian mà KHÔNG NÓI RÕ NĂM (Ví dụ: "tháng 1 đến tháng 6", "tháng 3 này"...), BẮT BUỘC phải dùng năm hiện tại là ${currentYear}.
      - TUYỆT ĐỐI KHÔNG TỰ Ý LẤY NĂM 2024 HAY CÁC NĂM CŨ KHÁC.
          Ví dụ: 
          Hỏi: "Phê duyệt trong tháng 1 đến tháng 6"
          -> Query phải ra năm ${currentYear}:
          {
            "giai_doan.ngay_thuc_hien": {
              "$gte": "${currentYear}-01-01T00:00:00.000Z",
              "$lte": "${currentYear}-06-30T23:59:59.999Z"
            }
          }

      QUY TẮC MÁY HỌC NGHIỆP VỤ BẢNG CÔNG TRÌNH:
      1. "Đang lập dự toán / khảo sát / làm thủ tục":
        -> Lọc các công trình CÓ giai đoạn Dự toán / Thẩm tra VÀ KHÔNG CÓ các giai đoạn Thi công, Nghiệm thu, Quyết toán phía sau.
        -> Query: { "giai_doan.ten_giai_doan": { "$regex": "Dự toán|Thẩm tra dự toán|Khảo sát", "$options": "i" }, "giai_doan.ten_giai_doan": { "$not": { "$regex": "Thi công|Nghiệm thu|Quyết toán", "$options": "i" } } }

      2. "Đang thi công / Đang nghiệm thu":
        -> Lọc công trình CÓ giai đoạn Thi công hoặc Nghiệm thu VÀ KHÔNG CÓ giai đoạn Quyết toán phía sau.
        -> Query: { "giai_doan.ten_giai_doan": { "$regex": "Thi công|Nghiệm thu", "$options": "i" }, "giai_doan.ten_giai_doan": { "$not": { "$regex": "Quyết toán", "$options": "i" } } }

      3. "Đang làm thủ tục quyết toán":
        -> Lọc công trình đang làm dự toán bổ sung/phát sinh.
        -> Query: { "giai_doan.ten_giai_doan": { "$regex": "Dự toán bổ sung|Thẩm tra dự toán bổ sung|Phê duyệt dự toán bổ sung|Dự toán phát sinh", "$options": "i" } }

      4. "Đã xong / Hoàn thành / Quyết toán":
        -> Query: { "giai_doan.ten_giai_doan": { "$regex": "Quyết toán", "$options": "i" } }

      5. Tra cứu thời gian theo Giai đoạn (Ví dụ: "phê duyệt từ tháng 2 đến tháng 4 năm 2026"):
        -> Dùng trường "giai_doan.ngay_thuc_hien".
        -> QUY TẮC NGHIÊM NGẶT VỀ DATE: TUYỆT ĐỐI KHÔNG DÙNG $regex CHO CÁC TRƯỜNG NGÀY THÁNG (ngay_tao_du_an, ngay_thuc_hien, ngay_nhap). Phải dùng $gte và $lte dạng ISODate string.
        -> Query: { "giai_doan.ten_giai_doan": { "$regex": "Phê duyệt dự toán", "$options": "i" }, "giai_doan.ngay_thuc_hien": { "$gte": "2026-02-01T00:00:00.000Z", "$lte": "2026-04-30T23:59:59.999Z" } }
      
      6. Tra cứu phê duyệt / được duyệt: Dùng regex bắt tất cả các dạng phê duyệt: 
        { "giai_doan.ten_giai_doan": { "$regex": "Phê duyệt dự toán|Phê duyệt dự toán bổ sung|Phê duyệt dự toán phát sinh", "$options": "i" } }

      QUY TẮC MÁY HỌC BẢNG SẢN LƯỢNG DOANH THU:
      - Tra cứu bến phà -> Quy đổi tên bến ra mã ma_ben (Vàm Cống -> "VC", An Hoà -> "AH", Năng Gù -> "NG", Trà Ôn -> "TO", Mương Ranh -> "MR", Thuận Giang -> "TG", Tân Châu -> "TC", Ô Môi -> "OM").
      - Tra cứu theo Năm cho thang_nam -> Dùng regex bắt đầu bằng năm. Ví dụ năm 2026: { "thang_nam": { "$regex": "^2026", "$options": "i" } }

      VÍ DỤ MẪU CHUẨN:
      1. Hỏi: "Công trình nào đang thi công?"
      -> { "targetCollection": "congtrinh", "filter": { "giai_doan.ten_giai_doan": { "$regex": "Thi công|Nghiệm thu", "$options": "i" }, "giai_doan.ten_giai_doan": { "$not": { "$regex": "Quyết toán", "$options": "i" } } } }

      2. Hỏi: "Các công trình được phê duyệt dự toán từ tháng 2 đến tháng 4 năm 2026"
      -> { "targetCollection": "congtrinh", "filter": { "giai_doan.ten_giai_doan": { "$regex": "Phê duyệt dự toán", "$options": "i" }, "giai_doan.ngay_thuc_hien": { "$gte": "2026-02-01T00:00:00.000Z", "$lte": "2026-04-30T23:59:59.999Z" } } }

      3. Hỏi: "Doanh thu phà Vàm Cống tháng 03 năm 2026"
      -> { "targetCollection": "san_luong_doanh_thu", "filter": { "ma_ben": "VC", "thang_nam": "2026-03" } }

      `;
    try {
      const response = await this.ai.models.generateContent({
        model: modelName,
        contents: `Câu hỏi của khách: "${userQuestion}"`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });
      const responseText = response.text;
      return JSON.parse(responseText as string);
    } catch (error) {
      this.logger.error('Lỗi parse JSON từ Gemini:', error);
      return {};
    }
  }

  // --- BƯỚC 2 & 3: Lọc DB và Viết câu trả lời ---
  async chatWithAi(
    userQuestion: string,
    modelName: AiModelType = DEFAULT_AI_MODEL,
  ) {
    // 1. Phân tích câu hỏi lấy Intent (targetCollection) và Filter từ Gemini
    const aiAnalysis = await this.getMongoFilter(userQuestion);
    this.logger.log(`Generated AI Analysis: ${JSON.stringify(aiAnalysis)}`);

    const { targetCollection, filter } = aiAnalysis;

    // 🔴 1. CHẶN NGUYÊN TỪ ĐẦU: Nếu phát hiện câu hỏi ngoài phạm vi
    if (targetCollection === 'outOfScope' || !targetCollection) {
      return {
        answer:
          'Tôi là trợ lý AI quản lý Công trình & Sản lượng Doanh thu phà. Tôi chỉ hỗ trợ các thông tin liên quan đến dự án, công trình, tiến độ thi công, hoặc báo cáo sản lượng, doanh thu của các bến phà trong hệ thống. Bạn vui lòng đặt câu hỏi liên quan nhé!',
        dbData: [],
      };
    }

    // 2. Query trực tiếp vào Database MongoDB dựa trên targetCollection
    let rawData: any[] = [];
    const safeFilter = (filter as Record<string, any>) || {};
    if (targetCollection === 'san_luong_doanh_thu') {
      rawData = await this.sanLuongModel.find(safeFilter).limit(10).exec();
      const simplifiedData = rawData.map((item) => ({
        ngay_nhap: item.ngay_nhap,
        thang_nam: item.thang_nam,
        ma_ben: item.ma_ben,
        loai_du_lieu: item.loai_du_lieu,
        // Đưa các chỉ số quan trọng ra ngoài thay vì để sâu trong array chi_tiet_san_luong
        chi_tiet: item.chi_tiet_san_luong?.map((ct: any) => ({
          loai_ve: ct.ma_loai_ve,
          so_luot_xe: ct.so_luot_xe,
          doanh_thu: ct.tong_doanh_thu,
        })),
      }));
      // 4. Đưa dữ liệu thô + Câu hỏi gốc cho Gemini viết lại câu trả lời mượt mà
      const answerPrompt = `
        Bạn là trợ lý tư vấn dữ liệu hệ thống AGFerryDB.
        Dưới đây là DỮ LIỆU CÓ THẬT lấy từ Database:
        ${JSON.stringify(simplifiedData, null, 2)}

        CÂU HỎI CỦA NGUỜI DÙNG: "${userQuestion}"

        YÊU CẦU:
        1. Dựa VÀO ĐÚNG DỮ LIỆU TRÊN để trả lời. Dữ liệu đã có sẵn, KHÔNG ĐƯỢC trả lời là không có dữ liệu.
        2. Hãy cộng tổng hoặc trích xuất số liệu doanh thu/sản lượng chính xác cho người dùng.
        3. Trả lời bằng tiếng Việt tự nhiên, ngắn gọn, lịch sự.
        `;
      try {
        const finalResponse = await this.ai.models.generateContent({
          model: modelName,
          contents: answerPrompt,
        });

        return {
          answer: finalResponse.text, // Câu trả lời hiển thị cho user
          targetCollection, // Debug collection đã query
          filterUsed: filter, // Debug điều kiện filter
          dbData: rawData, // Dữ liệu gốc trả về từ Mongo
        };
      } catch (error) {
        console.error('Lỗi Gemini API:', error);
        return {
          answer:
            'Hệ thống AI hiện đang bận hoặc vượt quá lượt truy cập trong ngày. Vui lòng thử lại sau ít phút.',
        };
      }
    } else if (targetCollection === 'congtrinh') {
      rawData = await this.congTrinhModel.find(safeFilter).limit(5).exec();
      const simplifiedData = rawData.map((ct) => ({
        ten_cong_trinh: ct.ten_cong_trinh,
        ma_cong_trinh: ct.ma_cong_trinh,
        don_vi_chu_quan: ct.don_vi_chu_quan,
        // Trích xuất thông tin các giai đoạn ra ngoài
        danh_sach_giai_doan: ct.giai_doan?.map((gd: any) => ({
          ten_giai_doan: gd.ten_giai_doan,
          don_vi_thuc_hien: gd.ten_don_vi,
          tong_gia_tri: gd.tong_gia_tri,
          chi_phi_xay_dung: gd.chi_phi_xay_dung,
        })),
      }));
      // 1. Xử lý dữ liệu ưu tiên bổ sung/phát sinh
      const processedData = rawData.map((ct: any) => ({
        ten_cong_trinh: ct.ten_cong_trinh,
        ma_cong_trinh: ct.ma_cong_trinh,
        don_vi_chu_quan: ct.don_vi_chu_quan,
        // Lấy thông tin phê duyệt theo logic ưu tiên (Phát sinh/Bổ sung > Dự toán gốc)
        giai_doan_duyet: this.extractValueAndCost(ct.giai_doan),
      }));

      // 2. Tạo Prompt gửi tới Gemini AI
      const answerPrompt = `
        Bạn là trợ lý AI chuyên nghiệp phân tích dữ liệu Công trình cho hệ thống AGFerryDB.

        DỮ LIỆU CÔNG TRÌNH TỪ DATABASE (Tổng cộng ${rawData.length} công trình tìm thấy):
        ${JSON.stringify(processedData, null, 2)}

        CÂU HỎI CỦA NGUỜI DÙNG: "${userQuestion}"

        YÊU CẦU TRẢ LỜI:
        1. Thông báo rõ số lượng công trình tìm thấy (Ví dụ: "Hệ thống tìm thấy ${simplifiedData.length} công trình..."). KHÔNG ĐƯỢC tự điền ký tự lạ như xx&xx.
        2. Với mỗi công trình, hãy liệt kê rõ ràng các thông tin:
          - Tên công trình & Mã công trình
          - Đơn vị chủ quản
          - Tên giai đoạn được duyệt (lấy từ giai_doan_duyet.ten_giai_doan)
          - Tổng giá trị & Chi phí xây dựng (hãy định dạng lại số tiền cho dễ đọc, ví dụ: 16,202,466,666 VNĐ).
        3. Trình bày bằng Markdown có gạch đầu dòng hoặc bảng để người dùng dễ quan sát.
        `;
      try {
        const finalResponse = await this.ai.models.generateContent({
          model: modelName,
          contents: answerPrompt,
        });

        return {
          answer: finalResponse.text, // Câu trả lời hiển thị cho user
          targetCollection, // Debug collection đã query
          filterUsed: filter, // Debug điều kiện filter
          dbData: rawData, // Dữ liệu gốc trả về từ Mongo
        };
      } catch (error) {
        console.error('Lỗi Gemini API:', error);
        return {
          answer:
            'Hệ thống AI hiện đang bận hoặc vượt quá lượt truy cập trong ngày. Vui lòng thử lại sau ít phút.',
        };
      }
    }
    // 3. Nếu không tìm thấy dữ liệu trong DB
    if (!rawData || rawData.length === 0) {
      return {
        answer:
          'Rất tiếc, hệ thống không tìm thấy dữ liệu nào phù hợp với yêu cầu của bạn.',
        filterUsed: filter,
        dbData: [],
      };
    }
  }
  private extractValueAndCost(giaiDoanList: any) {
    if (!giaiDoanList) return null;
    const list = Array.isArray(giaiDoanList) ? giaiDoanList : [giaiDoanList];
    if (list.length === 0) return null;

    const pheDuyetList = list.filter((gd: any) => {
      const name = String(gd?.ten_giai_doan ?? '');
      return /Phê duyệt dự toán/i.test(name);
    });

    if (pheDuyetList.length === 0) return null;

    // Ưu tiên lấy bổ sung/phát sinh trước
    const phatSinhGd = pheDuyetList.find((gd: any) => {
      const name = String(gd?.ten_giai_doan ?? '');
      return /bổ sung|phát sinh/i.test(name);
    });

    const selectedGd =
      phatSinhGd ||
      pheDuyetList.find(
        (gd: any) =>
          typeof gd?.ten_giai_doan === 'string' &&
          gd.ten_giai_doan.trim() === 'Phê duyệt dự toán',
      ) ||
      pheDuyetList[0];

    return {
      ten_giai_doan: selectedGd?.ten_giai_doan,
      tong_gia_tri: selectedGd?.tong_gia_tri,
      chi_phi_xay_dung: selectedGd?.chi_phi_xay_dung,
      ngay_thuc_hien: selectedGd?.ngay_thuc_hien,
    };
  }
}
