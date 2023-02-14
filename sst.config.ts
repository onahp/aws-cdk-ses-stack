import { SSTConfig } from "sst";
import { SesStack } from "./stacks/SesStack";


/*
 * App configuration to instantiate all stacks
*/
export default {

  config(_input) {
    return {
      name: "aws-cdk-ses-stack",
      region: "ap-southeast-2",
    }
  },
  stacks(app) {
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
      architecture: "arm_64",
      nodejs: {
        format: "esm"
      },
    }),
    app
      .stack(SesStack)
  }

} satisfies SSTConfig
