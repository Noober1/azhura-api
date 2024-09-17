import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

interface ApiFindOneOptions {
  OKDescription?: string;
  notfoundDescription?: string;
}

/**
 * findOne Api Decorator
 * @param required - Is query page and size are required?
 * @returns void
 */
export function ApiFindOne(options?: ApiFindOneOptions) {
  const defaultValue = {
    OKDescription: 'Returns single data',
    notfoundDescription: 'Data not found',
  };

  const opts = {
    ...defaultValue,
    ...options,
  };

  return applyDecorators(
    ApiOkResponse({
      description: opts.OKDescription,
    }),
    ApiNotFoundResponse({
      description: opts.notfoundDescription,
    }),
  );
}
