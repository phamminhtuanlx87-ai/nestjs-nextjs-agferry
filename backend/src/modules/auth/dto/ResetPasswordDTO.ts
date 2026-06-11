import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  currentPassword!: string; // Mật khẩu cũ hiện tại

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Mật khẩu mới phải có tối thiểu 6 ký tự' })
  newPassword!: string; // Mật khẩu mới

  @IsString()
  @IsNotEmpty()
  confirmPassword!: string; // Xác nhận mật khẩu mới
}
