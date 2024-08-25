import { Module } from "@nestjs/common";

import { PrismaModule } from "src/common/modules";

import { BlockchainController } from "./blockchain.controller";
import { BlockchainService } from "./blockchain.service";

@Module({
  imports: [PrismaModule],
  controllers: [BlockchainController],
  providers: [BlockchainService],
})
export class BlockchainModule {}
