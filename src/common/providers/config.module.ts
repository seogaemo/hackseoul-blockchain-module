import { Module } from "@nestjs/common";
import { ConfigModule, ConfigModuleOptions } from "@nestjs/config";

import { ConfigValidator } from "src/common";

const options: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: ".env",
  validationSchema: ConfigValidator,
};

@Module({
  imports: [ConfigModule.forRoot(options)],
})
export class SGMConfigModule {}
