import { Injectable } from "@nestjs/common";

@Injectable()
export class HelloService {
  public sayHello(name?: string): string {
    return `Hello ${name ?? "Hackseoul"}!`;
  }
}
