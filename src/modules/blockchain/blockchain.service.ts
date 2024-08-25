import { status } from "@grpc/grpc-js";
import {
  CreatePipelineRequest,
  CreateProdItemRequest,
} from "@shared/generated/blockchain.proto";

import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { PrismaService } from "src/common/modules/prisma/prisma.service";

@Injectable()
export class BlockchainService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProdItem(uid: string) {
    const res = await this.prismaService.prodItem.findUnique({
      where: {
        uid,
      },
    });

    if (!res) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: "ProdItem is not found",
      });
    }

    return res;
  }

  async createProdItem(data: CreateProdItemRequest) {
    const res = await this.prismaService.prodItem.create({
      data: data,
    });

    if (!res) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: "ProdItem is not found",
      });
    }

    return res;
  }

  async createPipeline(data: CreatePipelineRequest) {
    const res = await this.prismaService.pipeline.create({
      data: data,
    });

    if (!res) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: "ProdItem is not found",
      });
    }

    return res;
  }
}
