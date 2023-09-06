import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const getUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;
    if (!user) {
      throw new InternalServerErrorException('user not found (request)');
    }
    return user;
  },
);
