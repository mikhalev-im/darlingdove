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
    const response: ErrorResponse = {
      statusCode: exception.getStatus(),
    };

    const errResponse: any = exception.getResponse();

    switch (typeof errResponse) {
      case 'string':
        response.message = errResponse;
        break;
      case 'object':
        if (isClassValidatorError(errResponse)) {
          response.message = 'Validation error';
          response.code = 'ValidationError';
          response.data = errResponse.message;
        } else {
          // manual error data
          Object.assign(response, errResponse);
        }
        break;
    }

    host
      .switchToHttp()
      .getResponse()
      .status(response.statusCode)
      .type('application/json')
      .send(response);
  }
}
