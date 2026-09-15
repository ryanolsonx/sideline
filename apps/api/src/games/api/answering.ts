import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';

export const NOT_YOURS = 'NOT_YOURS';
export const NOT_FOUND = 'NOT_FOUND';
export const NOT_SIGNED_IN = 'NOT_SIGNED_IN';
export const REFUSED = 'REFUSED';

/**
 * Names each refusal so the app can say which one happened. This app has no secrets, so a
 * game that belongs to someone else says so rather than pretending not to exist.
 */
export async function answering<T>(work: () => Promise<T>): Promise<T> {
  try {
    return await work();
  } catch (error) {
    if (error instanceof ForbiddenException) {
      throw new GraphQLError(error.message, { extensions: { code: NOT_YOURS } });
    }
    if (error instanceof NotFoundException) {
      throw new GraphQLError(error.message, { extensions: { code: NOT_FOUND } });
    }
    if (error instanceof UnauthorizedException) {
      throw new GraphQLError(error.message, { extensions: { code: NOT_SIGNED_IN } });
    }
    if (error instanceof BadRequestException) {
      throw new GraphQLError(error.message, { extensions: { code: REFUSED } });
    }
    throw error;
  }
}
