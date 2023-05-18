import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetToken = createParamDecorator<string>((data: string | undefined, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  if (!data) return request.user['refreshToken'];
  return request.user[data];
});
