import { IsNotEmpty, IsString } from 'class-validator';

export class GetSanLuongDto {
  @IsNotEmpty()
  @IsString()
  ngay!: string; // Chuỗi định dạng YYYY-MM-DD từ FE gửi lên

  @IsNotEmpty()
  @IsString()
  ma_ben!: string; // Ví dụ: "AN_HOA"
}
