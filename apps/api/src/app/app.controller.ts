import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { Public } from "../auth/decorators/public.decorator";
import {
  APP_API_OPERATION_SUMMARIES,
  APP_API_RESPONSE_DESCRIPTIONS,
  APP_HTTP_STATUS_CODES,
  HEALTH_SCHEMA_EXAMPLES,
} from "./constants";
import { API_TAGS, HEALTH_STATUS } from "../common/constants";

@ApiTags(API_TAGS.HEALTH)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: APP_API_OPERATION_SUMMARIES.GET_API_INFO })
  @ApiResponse({
    status: APP_HTTP_STATUS_CODES.OK,
    description: APP_API_RESPONSE_DESCRIPTIONS.API_WELCOME_MESSAGE,
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("health")
  @ApiOperation({ summary: APP_API_OPERATION_SUMMARIES.HEALTH_CHECK })
  @ApiResponse({
    status: APP_HTTP_STATUS_CODES.OK,
    description: APP_API_RESPONSE_DESCRIPTIONS.API_HEALTH_STATUS,
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: HEALTH_SCHEMA_EXAMPLES.STATUS_OK },
        timestamp: {
          type: "string",
          example: HEALTH_SCHEMA_EXAMPLES.TIMESTAMP_EXAMPLE,
        },
      },
    },
  })
  getHealth(): { status: string; timestamp: string } {
    return {
      status: HEALTH_STATUS.OK,
      timestamp: new Date().toISOString(),
    };
  }
}
