import { ClipboardEvent } from 'react';
import { FieldValues, UseFormSetValue, FieldPath, PathValue } from 'react-hook-form';

export const ClipboardUtil = {
  /**
   * Tự động bóc tách dữ liệu cột Excel và phân bổ thông minh từ vị trí ô đang focus trở xuống
   * @param e Sự kiện Clipboard dán
   * @param currentFieldName Tên hoặc mã của ô input đang thực hiện dán (ticket.ma_loai_ve)
   * @param allFields Trong một nhóm, danh sách chứa tất cả các mã loại vé theo đúng thứ tự hiển thị
   * @param setValue Hàm gán dữ liệu chuẩn từ useForm, được kiểm soát kiểu nghiêm ngặt
   */
  pasteExcelColumn: <T extends FieldValues>(
    e: ClipboardEvent<HTMLInputElement>,
    currentFieldName: FieldPath<T>,
    allFields: FieldPath<T>[],
    setValue: UseFormSetValue<T>
  ) => {
    // 1. Chặn trình duyệt dán chuỗi thô mặc định
    e.preventDefault();

    // 2. Bóc tách dữ liệu dòng từ bộ nhớ tạm
    const rawData = e.clipboardData.getData('text');
    const rows = rawData.split(/\r?\n/).map(row => row.trim()).filter(row => row !== '');

    // 3. Tìm vị trí (index) của ô mà kế toán đang đặt chuột và bấm Ctrl+V
    const startIndex = allFields.indexOf(currentFieldName);
    if (startIndex === -1) return; 

    // 4. Duyệt qua mảng dữ liệu từ Excel và phân bổ dần xuống các ô phía dưới
    rows.forEach((rowValue, i) => {
      const targetIndex = startIndex + i;
      
      // Nếu số dòng copy từ Excel vượt quá số lượng hàng còn lại phía dưới giao diện thì dừng
      if (targetIndex >= allFields.length) return;

      // Lọc sạch mọi ký tự lạ, chỉ giữ lại số nguyên sạch
      const cleanNumber = Number(rowValue.replace(/[^0-9]/g, '')) || 0;
      const targetFieldName = allFields[targetIndex];

      // Đẩy giá trị vào form (Ép kiểu về PathValue của T để react-hook-form chấp nhận hoàn hảo)
      setValue(
        targetFieldName,
        cleanNumber as unknown as PathValue<T, FieldPath<T>>,
        {
        shouldValidate: true,
        shouldDirty: true,
      });
    });
  }
};