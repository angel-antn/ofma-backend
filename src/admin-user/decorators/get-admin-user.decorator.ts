import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const getAdminUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const adminUser = context.switchToHttp().getRequest().user;
    if (!adminUser) {
      throw new InternalServerErrorException('user not found (request)');
    }
    return adminUser;
  },
);
