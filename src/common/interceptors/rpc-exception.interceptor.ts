import { catchError } from "rxjs";

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
