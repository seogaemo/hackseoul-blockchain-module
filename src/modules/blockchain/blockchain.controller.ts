import {
  BlockchainServiceController,
  BlockchainServiceControllerMethods,
  CreatePipelineRequest,
  CreateProdItemRequest,
  GetProdItemResponse,
} from "@shared/generated/blockchain.proto";
import { Uid } from "@shared/generated/messages/messages.proto";
import { Observable } from "rxjs";

import { Controller } from "@nestjs/common";

import { BlockchainService } from "./blockchain.service";

@Controller()
@BlockchainServiceControllerMethods()
export class BlockchainController implements BlockchainServiceController {
  constructor(private readonly blockchainService: BlockchainService) {}

  getProdItem(
    request: Uid,
  ):
    | Promise<GetProdItemResponse>
    | Observable<GetProdItemResponse>
    | GetProdItemResponse {
    return this.blockchainService.getProdItem(request.uid);
  }

  createProdItem(
    request: CreateProdItemRequest,
  ): Promise<Uid> | Observable<Uid> | Uid {
    return this.blockchainService.createProdItem(request);
  }

  createPipeline(
    request: CreatePipelineRequest,
  ): Promise<Uid> | Observable<Uid> | Uid {
    return this.blockchainService.createPipeline(request);
  }
}
