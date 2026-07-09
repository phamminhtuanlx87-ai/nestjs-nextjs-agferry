import { IsOptional, IsString } from 'class-validator';

export class FilterToolbarDto {
  @IsOptional()
  @IsString()
  time?: string; // Hôm nay, Hôm qua, 7 ngày gần nhất, Tháng này...

  @IsOptional()
  @IsString()
  location?: string; // Tất cả bến, Bến An Hòa...

  @IsOptional()
  @IsString()
  metric?: string; // Tổng doanh thu, Tổng lượt xe...

  @IsOptional()
  @IsString()
  compare?: string; // Hôm qua, Tuần trước, Tháng trước...

  @IsOptional()
  @IsString()
  search?: string;
}
