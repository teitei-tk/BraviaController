import * as iot from "aws-iot-device-sdk";

import { Certificate } from "../clients";
import { defaultOption, subscriberName } from "../options/subscriber";

export class Subscriber {
  client: iot.device;

  constructor(certificateClient: Certificate) {
    const opt = Object.assign({}, defaultOption, {
      keyPath: certificateClient.privatePath(),
      certPath: certificateClient.certPath(),
      caPath: certificateClient.rootPath()
    });

    this.client = new iot.device(opt);
  }

  static initialize(): Subscriber {
    return new Subscriber(new Certificate());
  }

  subscription() {
    this.client.on("connect", () => {
      console.log("start connection");
      this.client.subscribe(subscriberName, { qos: 1 });
      console.log("start subscribe!");
    });

    this.client.on("message", (topic: string, payload: Buffer) => {
      console.log(`topic:${topic}, message: ${payload.toString()}`);
    });

    this.client.on("reconnect", () => {
      console.log("reconnect...");
    });

    this.client.on("offline", () => {
      console.log("status offline");
    });

    this.client.on("error", error => {
      console.error(error);
    });

    process.on("SIGINT", () => {
      console.log("Control + C");
      process.exit(0);
    });

    process.on("exit", () => {
      console.log("exit.");
      process.exit(0);
    });
  }
}
