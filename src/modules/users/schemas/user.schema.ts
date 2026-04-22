import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  UserDepartment,
  UserPermission,
  UserPositions,
  UserRole,
} from '../constants/user.constants';

@Schema({
  timestamps: true, // Tự động quản lý createdAt và updatedAt cho bạn
  collection: 'users', // Tên collection trong MongoDB
})
export class User extends Document {
  @Prop({ required: true, unique: true, trim: true })
  userName: string;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false }) // select: false sẽ ẩn mật khẩu khỏi các câu lệnh query mặc định
  passwordHash: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: null })
  googleId: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole), // Chỉ cho phép các giá trị trong UserRole
    default: UserRole.USER,
  })
  role: string;

  // Sửa từ string sang mảng string để chứa được 7 quyền như dữ liệu của bạn
  @Prop({
    type: [String],
    enum: Object.values(UserPermission), // Chỉ cho phép các quyền đã định nghĩa
    default: [
      UserPermission.USER_UPDATE,
      UserPermission.USER_VIEW,
      UserPermission.PROJECT_CREATE,
      UserPermission.PROJECT_UPDATE,
      UserPermission.PROJECT_VIEW,
    ],
  })
  permissions: string[];

  // Định nghĩa rõ cấu trúc object phòng ban
  @Prop({
    type: {
      id: { type: String, enum: Object.keys(UserDepartment) }, // Chặn ID phải nằm trong Keys (PKT, PDU...)
      name: { type: String, enum: Object.values(UserDepartment) }, // Chặn Name phải nằm trong Values
    },
    _id: false, // Không tạo _id riêng cho object này
    default: null,
  })
  department: {
    id: string;
    name: string;
  };

  @Prop({
    type: {
      id: { type: String, enum: Object.keys(UserPositions) }, // Chặn ID phải nằm trong Keys (CT, TGD...)
      name: { type: String, enum: Object.values(UserPositions) }, // Chặn Name phải nằm trong Values
    },
    _id: false, // Không tạo _id riêng cho object này
    default: null,
  })
  positions: {
    id: string;
    name: string;
  };
}
// Tạo Schema từ Class trên
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', function () {
  if (this.fullName) {
    this.fullName = this.fullName.trim().replace(/\s+/g, ' ');
  }
  // Không cần gọi next() nếu dùng hàm async
});
