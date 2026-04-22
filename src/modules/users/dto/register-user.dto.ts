import { IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  userName: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;
  // Tuyệt đối không để trường 'role' hay 'permissions' ở đây
}
