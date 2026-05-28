// Đảm bảo đã import ROLE_PERMISSIONS ở trên đầu file
import {
  UserRole,
  ROLE_PERMISSIONS,
  UserDepartment,
  UserPositions,
} from './constants/user.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { _QueryFilter, Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { adminDTO } from '../auth/dto/adminDTO';
import { getMeDTO } from '../auth/dto/getMeDTO';
import { ResetPasswordDTO } from '../auth/dto/ResetPasswordDTO';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    createUserDto: CreateUserDto,
    isPublicRegister: boolean = false,
  ): Promise<User> {
    // 1. Ép Role nếu là đăng ký công khai
    if (isPublicRegister) {
      createUserDto.role = UserRole.GUEST;
      // Xóa permissions nếu khách cố tình gửi lên để đảm bảo an toàn
      createUserDto.permissions = [];
    }

    // 2. Băm Password
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // 3. Xác định Role & Permissions mặc định
    const role = createUserDto.role || UserRole.USER;
    const defaultPermissions = ROLE_PERMISSIONS[role] || [];

    // 4. Xử lý Department & Position (Dùng toán tử ?? để an toàn hơn ||)
    const deptId = createUserDto.departmentId ?? 'CXD';
    const posId = createUserDto.positionId ?? 'CXD';

    const departmentObj = {
      id: deptId,
      name:
        UserDepartment[deptId as keyof typeof UserDepartment] ||
        'Chưa xác định',
    };

    const positionsObj = {
      id: posId,
      name:
        UserPositions[posId as keyof typeof UserPositions] || 'Chưa xác định',
    };

    // 5. Gộp dữ liệu - SỬ DỤNG DESTRUCTURING ĐỂ LOẠI BỎ TRƯỜNG THỪA
    // Cách này giúp bạn không cần dùng lệnh delete (userData as any).departmentId;
    const { password, departmentId, positionId, ...rest } = createUserDto;
    console.log(password, departmentId, positionId, rest);
    const userData = {
      ...rest, // Chứa các trường còn lại (userName, fullName, role, permissions...)
      passwordHash: hashedPassword,
      role,
      isActive: false,
      permissions:
        rest.permissions && rest.permissions.length > 0
          ? rest.permissions
          : defaultPermissions,
      department: departmentObj,
      positions: positionsObj,
    };

    const newUser = new this.userModel(userData);
    return await newUser.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // 3. Xác định Role & Permissions mặc định
    const role = updateUserDto.role || UserRole.USER;
    const defaultPermissions = ROLE_PERMISSIONS[role] || [];

    // 4. Xử lý Department & Position (Dùng toán tử ?? để an toàn hơn ||)
    const deptId = updateUserDto.departmentId ?? 'CXD';
    const posId = updateUserDto.positionId ?? 'CXD';

    const departmentObj = {
      id: deptId,
      name:
        UserDepartment[deptId as keyof typeof UserDepartment] ||
        'Chưa xác định',
    };

    const positionsObj = {
      id: posId,
      name:
        UserPositions[posId as keyof typeof UserPositions] || 'Chưa xác định',
    };

    // 5. Gộp dữ liệu - SỬ DỤNG DESTRUCTURING ĐỂ LOẠI BỎ TRƯỜNG THỪA
    // Cách này giúp bạn không cần dùng lệnh delete (userData as any).departmentId;
    const { departmentId, positionId, ...rest } = updateUserDto;
    console.log(departmentId, positionId, rest);
    const userData = {
      ...rest, // Chứa các trường còn lại (userName, fullName, role, permissions...)
      role,
      isActive: false,
      permissions:
        rest.permissions && rest.permissions.length > 0
          ? rest.permissions
          : defaultPermissions,
      department: departmentObj,
      positions: positionsObj,
    };

    // 1. Dùng findByIdAndUpdate để tìm và cập nhật luôn
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: userData }, // Sử dụng $set để đảm bảo chỉ cập nhật các field được gửi lên
        {
          returnDocument: 'after', // Trả về bản ghi SAU KHI đã cập nhật (mặc định là trả về bản ghi cũ)
          runValidators: true, // Đảm bảo các quy tắc Validate trong Schema vẫn được áp dụng
        },
      )
      .exec();

    // 2. Kiểm tra nếu không tìm thấy
    if (!updatedUser) {
      throw new NotFoundException(`Không tồn tại user với id: ${id}`);
    }

    return updatedUser;
  }

  async updateMe(userId: string, meDto: getMeDTO): Promise<User> {
    const userData = {
      fullName: meDto.fullName,
      email: meDto.email,
      department: {
        id: meDto.department.id ?? 'CXD',
        name: meDto.department.name ?? 'Chưa xác định',
      },
      positions: {
        id: meDto.positions.id ?? 'CXD',
        name: meDto.positions.name ?? 'Chưa xác định',
      },
    };
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: userData }, // Sử dụng $set để đảm bảo chỉ cập nhật các field được gửi lên
        {
          returnDocument: 'after', // Trả về bản ghi SAU KHI đã cập nhật (mặc định là trả về bản ghi cũ)
          runValidators: true, // Đảm bảo các quy tắc Validate trong Schema vẫn được áp dụng
        },
      )
      .exec();

    // 2. Kiểm tra nếu không tìm thấy
    if (!updatedUser) {
      throw new NotFoundException(`Không tồn tại user với id: ${userId}`);
    }

    return updatedUser;
  }

  async updateMeReset(userId: string, meDto: ResetPasswordDTO): Promise<User> {
    // 1. Kiểm tra mật khẩu mới và mật khẩu xác nhận
    if (meDto.newPassword !== meDto.confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không trùng khớp!');
    }

    // 2. Tìm User trong DB bằng userId

    const user = await this.userModel.findById(userId).select('+passwordHash');
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản người dùng!');
    }
    // 3. Lấy chuỗi mật khẩu băm

    const currentPasswordHash = user.passwordHash || '';
    // 4. Kiểm tra tính chính xác của mật khẩu hiện tại
    const isMatch = await bcrypt.compare(
      meDto.currentPassword,
      currentPasswordHash,
    );

    if (!isMatch) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác!');
    }

    // 5. Kiểm tra mật khẩu mới không được giống mật khẩu cũ
    const isSameAsOld = await bcrypt.compare(
      meDto.newPassword,
      currentPasswordHash,
    );

    if (isSameAsOld) {
      throw new BadRequestException(
        'Mật khẩu mới không được trùng với mật khẩu hiện tại!',
      );
    }
    // 6. Mã hóa mật khẩu mới

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(meDto.newPassword, saltRounds);

    // 7. Cập nhật thẳng vào SQL Database
    const userData = {
      passwordHash: hashedNewPassword,
    };
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: userData }, // Sử dụng $set để đảm bảo chỉ cập nhật các field được gửi lên
        {
          returnDocument: 'after', // Trả về bản ghi SAU KHI đã cập nhật (mặc định là trả về bản ghi cũ)
          runValidators: true, // Đảm bảo các quy tắc Validate trong Schema vẫn được áp dụng
        },
      )
      .exec();
    // 2. Kiểm tra nếu không tìm thấy
    if (!updatedUser) {
      throw new NotFoundException(`Không tồn tại user với id: ${userId}`);
    }

    return updatedUser;
  }

  async updateAdmin(id: string, adminDTO: adminDTO): Promise<User> {
    const deptID = adminDTO.department?.id ?? 'CXD';
    const posId = adminDTO.positions?.id ?? 'CXD';
    const userData = {
      fullName: adminDTO.fullName,
      email: adminDTO.email,
      role: adminDTO.role ?? 'GUEST',
      permissions: ROLE_PERMISSIONS[adminDTO.role ?? 'GUEST'] || [],
      department: {
        id: deptID ?? 'CXD',
        name:
          UserDepartment[deptID as keyof typeof UserDepartment] ||
          'Chưa xác định',
      },
      positions: {
        id: adminDTO.positions?.id ?? 'CXD',
        name:
          UserPositions[posId as keyof typeof UserPositions] || 'Chưa xác định',
      },
    };
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: userData }, // Sử dụng $set để đảm bảo chỉ cập nhật các field được gửi lên
        {
          returnDocument: 'after', // Trả về bản ghi SAU KHI đã cập nhật (mặc định là trả về bản ghi cũ)
          runValidators: true, // Đảm bảo các quy tắc Validate trong Schema vẫn được áp dụng
        },
      )
      .exec();

    // 2. Kiểm tra nếu không tìm thấy
    if (!updatedUser) {
      throw new NotFoundException(`Không tồn tại user với id: ${id}`);
    }

    return updatedUser;
  }

  async toggleActive(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    console.log(`Trạng thái hiện tại của user ${id}:`, user.isActive);
    return await this.userModel
      .findByIdAndUpdate(
        id,
        { isActive: !user.isActive }, // Đảo ngược: true thành false, false thành true
        { new: true },
      )
      .exec();
  }

  async getAllUser(
    mode: 'all' | 'active' | 'inactive' = 'all',
  ): Promise<UserDocument[]> {
    console.log(`Chay GetAllUser với chế độ: ${mode}`);

    // 1. Khởi tạo query object mặc định trống (tương đương với 'all')
    const filter: _QueryFilter<UserDocument> = {};

    // 2. Thay đổi filter dựa theo mode
    if (mode === 'active') {
      filter.isActive = true;
    } else if (mode === 'inactive') {
      filter.isActive = false;
    }
    // Nếu mode === 'all', filter giữ nguyên là {} (lấy hết cả true và false)

    // 3. Thực thi query DB
    return await this.userModel
      .find(filter) // Truyền filter động vào đây
      .sort({ updatedAt: -1 })
      .select('-permissions -__v')
      .exec();
  }

  async getUser(username: string): Promise<UserDocument[]> {
    console.log(`Chay GetAllUser với chế độ: ${username}`);

    // 1. Khởi tạo query object mặc định trống (tương đương với 'all')
    const filter: _QueryFilter<UserDocument> = {};
    filter.userName = username;

    // Nếu mode === 'all', filter giữ nguyên là {} (lấy hết cả true và false)

    // 3. Thực thi query DB
    return await this.userModel
      .find(filter) // Truyền filter động vào đây
      .select('-permissions -__v')
      .exec();
  }

  async remove(id: string): Promise<any> {
    // BẮT BUỘC phải có dòng này để xóa trong MongoDB
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException(`Không tìm thấy user với id: ${id}`);
    }

    return deletedUser;
  }

  async deleteSoft(id: string): Promise<User> {
    const deletedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { isActive: false }, // Chỉ cập nhật đúng trường này
        { new: true }, // Trả về dữ liệu sau khi đã sửa để kiểm tra
      )
      .exec();

    if (!deletedUser) {
      throw new NotFoundException(`Không tồn tại user với id: ${id}`);
    }

    return deletedUser;
  }

  async findAll(): Promise<User[]> {
    // .find() lấy tất cả bản ghi
    // .exec() giúp trả về một Promise chuẩn của Mongoose
    return await this.userModel.find().select('-permissions -__v').exec();
  }

  async findOne(id: string): Promise<User> {
    // 2 cách viết: findOne({ userName: name }) && findById(id)
    const user = await this.userModel
      .findById(id)
      .populate('department') // Nhớ thêm các dòng này để lấy thông tin "tươi" nhất
      .populate('positions')
      .exec();
    if (!user) {
      throw new NotFoundException(`Không tồn tại user với id:${id}`);
    }
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10; // Độ phức tạp của mã hóa
    return await bcrypt.hash(password, saltOrRounds);
  }

  async findWithPassword(userName: string) {
    // .select('+password') giúp lấy ra trường bị ẩn
    return await this.userModel
      .findOne({ userName })
      .select('+passwordHash')
      .exec();
  }
}
