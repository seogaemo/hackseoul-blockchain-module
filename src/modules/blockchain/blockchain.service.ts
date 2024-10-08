import { status } from "@grpc/grpc-js";
import {
  CreatePipelineRequest,
  CreateProdItemRequest,
} from "@shared/generated/blockchain.proto";
import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import fetch from "node-fetch";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RpcException } from "@nestjs/microservices";

import { PrismaService } from "src/common/modules/prisma/prisma.service";

@Injectable()
export class BlockchainService {
  private readonly chainId: string =
    "73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d";

  private readonly api!: Api;
  private readonly rpc!: JsonRpc;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const eosioPrivateKey =
      this.configService.get<string>("EOSIO_PRIVATE_KEY")!;

    const signatureProvider = new JsSignatureProvider([eosioPrivateKey]);
    this.rpc = new JsonRpc(
      this.configService.get<string>("JUNGLE_TESTNET_RPC")!,
      { fetch },
    );

    this.api = new Api({
      rpc: this.rpc,
      signatureProvider,
      chainId: this.chainId,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    });
  }

  public async getTransaction(txId: string) {
    const url = `https://wax.hyperion.eosrio.io/v2/history/get_transaction?id=${txId}`;

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  async getPipelines(prodItemId: string) {
    return {
      pipelines: await this.prismaService.pipeline.findMany({
        where: {
          productItemId: prodItemId,
        },
      }),
    };
  }

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
    const prodItem = await this.prismaService.prodItem.create({
      data: data,
    });

    if (!prodItem) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: "ProdItem is not found",
      });
    }

    const res = (await this.api.transact(
      {
        actions: [
          {
            account: "seogaemotest",
            name: "trdyproditem",
            authorization: [
              {
                actor: "seogaemotest",
                permission: "owner",
              },
            ],
            data: {
              uid: prodItem.uid,
              title: prodItem.title,
              product_id: prodItem.productId,
              model_number: prodItem.modelNumber,
              created_at: prodItem.createdAt,
            },
          },
        ],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      },
    )) as any;

    await this.prismaService.prodItem.update({
      where: {
        uid: prodItem.uid,
      },
      data: {
        txId: res.transaction_id,
        blockNum: res.processed.block_num,
      },
    });

    return prodItem;
  }

  async createPipeline(data: CreatePipelineRequest) {
    const pipelineData = await this.prismaService.pipeline.create({
      data: data,
    });

    if (!pipelineData) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: "ProdItem is not found",
      });
    }

    const res = (await this.api.transact(
      {
        actions: [
          {
            account: "seogaemotest",
            name: "trdypipeline",
            authorization: [
              {
                actor: "seogaemotest",
                permission: "owner",
              },
            ],
            data: {
              uuid: pipelineData.uid,
              title: pipelineData.title,
              description: pipelineData.description,
              company_id: pipelineData.companyId,
              product_item_id: pipelineData.productItemId,
              created_at: pipelineData.createdAt,
            },
          },
        ],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      },
    )) as any;

    await this.prismaService.pipeline.update({
      where: {
        uid: pipelineData.uid,
      },
      data: {
        txId: res.transaction_id,
        blockNum: res.processed.block_num,
      },
    });

    return pipelineData;
  }
}
