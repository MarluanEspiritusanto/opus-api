import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(
    exception: HttpException,
    host: ArgumentsHost
  ): Response<any, Record<string, any>> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    const managedResponse = {
      success: false,
      data: {
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
      },
    };

    this.logger.error(exception.message);

    return response.status(status).json(managedResponse);
  }
}
