import { serviceHost } from "@shared/constants/env";
import { grpcClientOptions, servicePort } from "@shared/options/hello.option";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";

import { AppModule } from "src/app";

import { RpcExceptionInterceptor } from "./common";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    grpcClientOptions,
  );

  app.useGlobalInterceptors(new RpcExceptionInterceptor());

  await app.listen();

  Logger.log(
    `Microservice is listening on ${serviceHost}:${servicePort}`,
    "Bootstrap",
  );
}
bootstrap();
