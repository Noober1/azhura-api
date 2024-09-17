import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

/**
 * Pagination Api Decorator
 * @param required - Is query page and size are required?
 * @returns void
 */
export function ApiPagination(required: boolean = false) {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required,
      description: 'Page index',
      type: Number,
    }),
    ApiQuery({
      name: 'size',
      required,
      description: 'The amount of data to get',
      type: Number,
    }),
  );
}
