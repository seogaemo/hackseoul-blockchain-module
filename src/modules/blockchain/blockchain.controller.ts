import { Controller } from "@nestjs/common";

import { BlockchainService } from "./blockchain.service";

@Controller()
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}
}
