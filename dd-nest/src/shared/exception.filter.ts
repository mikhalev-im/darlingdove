import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

interface ErrorResponse {
  code?: string;
  message?: string;
  statusCode: number;
  data?: object;
}

const isClassValidatorError = (exceptionResponse: any) => {
  return (
    Array.isArray(exceptionResponse.message) &&
    exceptionResponse.message[0] instanceof ValidationError
  );
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const res: ErrorResponse = {
      statusCode: exception.getStatus(),
    };

    const errResponse: any = exception.getResponse();

    switch (typeof errResponse) {
      case 'string':
        res.message = errResponse;
        break;
      case 'object':
        if (isClassValidatorError(errResponse)) {
          res.message = 'Validation error';
          res.code = 'ValidationError';
          res.data = errResponse.message;
        } else {
          // manual error data
          Object.assign(res, errResponse);
        }
        break;
    }

    response
      .status(res.statusCode)
      .type('application/json')
      .send(res);
  }
}
