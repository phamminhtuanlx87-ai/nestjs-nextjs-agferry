# AI ENGINEERING GUIDE

Version: 2.0.0

Project: Quản lý Phà An Giang

Author: Phạm Minh Tuấn

Last Updated: 2026-06-27

---

# Table of Contents

1. Project Information
2. Philosophy
3. AI Role
4. Review Priority
5. Coding Standards
6. Backend Standards (NestJS)
7. Frontend Standards (NextJS)
8. Database Standards (MongoDB)
9. API Standards
10. UI/UX Standards
11. Security Standards
12. Performance Standards
13. Testing Standards
14. Git Convention
15. Business Rules
16. Deployment Checklist
17. Lessons Learned
18. Changelog
19. AI Instruction

---

# 1. Project Information

## Mục tiêu

* Xây dựng hệ thống quản lý phà có khả năng bảo trì trên 10 năm.
* Ưu tiên tính ổn định.
* Ưu tiên dễ bảo trì.
* Không tối ưu sớm.

## Tech Stack

* Next.js
* NestJS
* MongoDB
* TypeScript
* TailwindCSS

## Engineering Principles

Nguyên tắc

- Đơn giản trước.
- Không tối ưu sớm.
- Code phải dễ đọc.
- Một hàm chỉ làm một việc.
- Không copy code.
- Không hardcode.
- Luôn validate dữ liệu.
- Luôn log lỗi.
- Không để TODO khi merge.
- Luôn ưu tiên maintainability.

Nếu có nhiều cách viết,
hãy chọn cách dễ đọc nhất.

AI khi review phải tuân thủ toàn bộ tài liệu này.

### Nguyên tắc đặt tên

- Không đặt tên vô nghĩa. 
- Ưu tiên ngắn gọn.
- Ưu tiên tên có ý nghĩa rõ ràng:
```
        Dự án cho phép sử dụng tiếng Việt không dấu theo camelCase.

        Ví dụ:tongTien danhSachHoSo nguoiDung ngayTao
```
- Đặt đúng chuẩn Quy tắc đặt tên biến (Variable) camelCase
- Boolean nên bắt đầu bằng ```is```
- Đặt tên hằng số: Toàn bộ viết HOA ```UPPER_SNAKE_CASE```
- Đặt tên hàm: Luôn bắt đầu bằng động từ ```layDanhSach(), themHoSo(), capNhatThongTin(),xoaNguoiDung(), kiemTraDangNhap() ...```

- Đặt tên class ```PascalCase ChuCaiDauMoiTuVietHoa```
- Biến tạm: Chỉ dùng khi phạm vi nhỏ ``` item, index, key, value, current, next, prev ```

### Quy ước khuyến nghị cho dự án Next.js/TypeScript

Với các dự án hiện đại (Next.js, React, TypeScript), mình khuyên dùng quy ước sau để vừa giữ được tiếng Việt dễ hiểu, vừa gần với chuẩn quốc tế:
```
| Thành phần      | Quy ước                                               | Ví dụ                                |
| --------------- | ----------------------------------------------------- | ------------------------------------ |
| Biến            | `camelCase`                                           | `tongTien`, `danhSachHoSo`           |
| Hàm             | `camelCase` + động từ                                 | `layDanhSachHoSo()`, `capNhatHoSo()` |
| Hằng số         | `UPPER_SNAKE_CASE`                                    | `DEFAULT_PAGE_SIZE`, `MAX_FILE_SIZE` |
| Class           | `PascalCase`                                          | `QuanLyHoSo`                         |
| Interface       | `PascalCase`                                          | `HoSo`, `NguoiDung`                  |
| Enum            | `PascalCase`                                          | `TrangThaiHoSo`                      |
| Enum value      | `PascalCase`                                          | `DangXuLy`, `DaHoanThanh`            |
| Component React | `PascalCase`                                          | `BangHoSo.tsx`, `TheThongTin.tsx`    |
| Hook            | `camelCase` bắt đầu bằng `use`                        | `useHoSo()`, `useDangNhap()`         |
| Thư mục         | `kebab-case`                                          | `quan-ly-ho-so`, `bao-cao`           |
| File tiện ích   | `camelCase` hoặc `kebab-case` (thống nhất toàn dự án) | `formatNgay.ts`, `kiemTraQuyen.ts`   |
```

## Không được phép

- Không dùng any nếu không thật sự cần.
- Không dùng var.
- Không hardcode.
- Không duplicate code.
- Không commit code lỗi.
- Không bỏ qua warning.
- Không để console.log trong Production.


## Current Status

Production

Current Module

* Sản lượng
* Doanh thu

Completed

* Authentication
* Dashboard
* Hồ sơ
* Account

---

# 2. Philosophy

(Chỉ chứa tư duy làm phần mềm)

---

# 3. AI Role

(AI phải đóng vai trò gì)

---

# 4. Review Priority

(AI review theo thứ tự)

---

# 5 → 16

Đây là nơi quy định chi tiết.

Chưa cần viết ngay.

Làm tới đâu bổ sung tới đó.

---

# 17. Lessons Learned

Đây là phần quan trọng nhất.

Mỗi lần gặp bug hoặc học được điều gì mới thì ghi vào đây.

Ví dụ:

## 2026-06-27

### Recharts

Không dùng height:100%.

Luôn tạo parent fixed height.

Lý do:
...

---

### MongoDB

Projection trước Lookup.

Lý do:
...

---

### NestJS

DTO luôn validate bằng class-validator.

Lý do:
...

---

# 18. Changelog

## v2.0.0

* Khởi tạo tài liệu.

## v2.0.1

* Thêm Coding Rule.

## v2.0.2

* Thêm Mongo Rule.

...

---

# 19. AI Instruction

Đây là nơi AI đọc cuối cùng.

Yêu cầu AI luôn tuân thủ toàn bộ tài liệu trên.

# AI Memory
## Những điều AI phải luôn nhớ

Đây là dự án Production.

Không phải Demo.

Mọi review đều ưu tiên:

Business

Maintainability

Security

Sau đó mới tới Performance.

Nếu có nhiều cách viết:

Ưu tiên cách dễ đọc.

Không ưu tiên code ngắn.

AI không được thay đổi nghiệp vụ khi chưa hỏi lại.

Nếu chưa chắc chắn phải hỏi.

Không được tự suy đoán Business Rule.

---


# Các Kiến Thức Cần Nhớ

## Nestjs 
### Lệnh tạo cottroller service module

- ```nest g resource modules/danh-muc-gia-ve --no-spec```

### Cách viết DTO Update có thêm trường cần thiết

``` export class UpdateDanhMucGiaVeDto extends PartialType(CreateDanhMucGiaVeDto) {
  // 🌟 Trường mới hoàn toàn 1: Bắt buộc phải điền khi Update
  @IsString({ message: 'Lý do cập nhật phải là chuỗi văn bản' })
  @IsNotEmpty({ message: 'Không được để trống lý do cập nhật giá vé' })
  ly_do_cap_nhat!: string;

  // 🌟 Trường mới hoàn toàn 2: Không bắt buộc (Optional), thích truyền thì truyền
  @IsString({ message: 'ID người cập nhật phải là chuỗi văn bản' })
  @IsOptional()
  nguoi_cap_nhat?: string;
}
```

## CẨM NANG TRI THỨC BACKEND (NESTJS + MONGOOSE) - DỰ ÁN PHÀ AN GIANG
**1. Lệnh CLI Thần Tốc & Quy Tắc Đặt Tên (Naming Convention)**

Khi tạo một module nghiệp vụ mới trong NestJS, thay vì tạo tay rườm rà, ta sử dụng lệnh gộp một dòng để tự động sinh ra cấu trúc CRUD chuẩn, đồng thời chỉ định đúng thư mục chứa module và loại bỏ file test (.spec.ts):
```nest g resource modules/danh-muc-gia-ve --no-spec``

    ***Quy tắc đặt tên đồng bộ toàn hệ thống:***
- Thư mục / Tên file: Dùng ```kebab-case``` (chữ thường, gạch ngang) $\rightarrow$ ```modules/danh-muc-gia-ve/```.
- Tên Class (Code hình thức): Dùng ```PascalCase``` (Viết hoa chữ đầu, viết liền) $\rightarrow$ ```DanhMucGiaVeService```, DanhMucGiaVeController.
- Tên Bảng (MongoDB Collection): Dùng ```snake_case``` (chữ thường, gạch dưới) $\rightarrow$ ```danh_muc_gia_ve```.
- Trường dữ liệu nhạy cảm: Đổi trường ```nhom_lon``` (dễ hiểu nhầm khi viết không dấu) thành ```nhom_cha``` để ghép cặp văn minh với nhom_con (Ví dụ: nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH").

**2. Kiến Trúc Dữ Liệu Đa Tầng (Entity & Schema Gộp)**

Trong NestJS + Mongoose, ta sử dụng Decorator (@Schema, @Prop) để gộp Entity (đại diện Class trong code) và Schema (cấu trúc dưới DB) vào làm một nhằm tối ưu quản lý, dưới đây là điểm lưu ý:

```
export type DanhMucGiaVeDocument = HydratedDocument<DanhMucGiaVe>;
```
```
@Schema({ _id: false })
class GiaTheoBen {
  @Prop({ required: true }) ma_nhom_ben: string; // CHUNG | TC_VC
  @Prop({ required: true }) gia_ve: number;
}
```
```

  @Prop({ required: true, unique: true }) ma_loai_ve: string;

  @Prop({ default: true }) kich_hoat: boolean;

```
```
export const DanhMucGiaVeSchema = SchemaFactory.createForClass(DanhMucGiaVe);
```

**3. Ràng Buộc Dữ Liệu Nâng Cao (Validation DTO)**

Để kiểm tra dữ liệu Frontend gửi lên có đúng định dạng đa tầng (Mảng trong Mảng) hay không, ta sử dụng ```class-validator``` kết hợp ```@ValidateNested và @Type``` từ class-transformer:

- Create DTO: Khai báo các Class con trước (```GiaTheoBenDTO``` $\rightarrow$ ```LichSuGiaDTO)```, sau đó mới gọi trong Class cha (CreateDanhMucGiaVeDto). Dùng ```@IsDateString()``` thay vì ```@IsDate()``` để tương thích tốt với chuỗi JSON ngày tháng từ Client gửi lên.

- Update DTO: Sử dụng ```PartialType``` để kế thừa toàn bộ các trường từ file Create nhưng chuyển chúng về dạng tùy chọn ```(Optional)```. Nếu Update có thêm trường riêng biệt (ví dụ: ly_do_cap_nhat), ta khai báo trực tiếp vào trong cặp ngoặc nhọn:
```
export class UpdateDanhMucGiaVeDto extends PartialType(CreateDanhMucGiaVeDto) {
  @IsString({ message: 'Lý do cập nhật phải là chuỗi văn bản' })
  @IsNotEmpty({ message: 'Không được để trống lý do cập nhật giá vé' })
  ly_do_cap_nhat!: string; // Trường mở rộng riêng cho lệnh Update
}
```