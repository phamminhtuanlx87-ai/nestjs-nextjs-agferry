import { SetMetadata } from '@nestjs/common';

// Thêm export ở đây
export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
