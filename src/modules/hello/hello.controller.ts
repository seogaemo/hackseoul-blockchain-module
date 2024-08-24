import {
  HelloServiceController,
  HelloServiceControllerMethods,
  SayHello,
  SayHelloResponse,
} from "@shared/generated/hello.proto";
import { Observable } from "rxjs";

import { Controller } from "@nestjs/common";

import { HelloService } from "./hello.service";

@Controller()
@HelloServiceControllerMethods()
export class HelloController implements HelloServiceController {
  constructor(private readonly helloService: HelloService) {}

  public sayHello(
    request: SayHello,
  ):
    | Promise<SayHelloResponse>
    | Observable<SayHelloResponse>
    | SayHelloResponse {
    return { message: this.helloService.sayHello(request.name) };
  }
}
