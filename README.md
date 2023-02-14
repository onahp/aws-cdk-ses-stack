# aws-cdk-ses-stack
This is a CDK SES stack that creates a domain and email identity. The stack 
is built in combination with SST and CDK written. The stack will also automate the process
of creating a DKIM record for the domain and email identity. You will need to manually verify
the domain on AWS SES resource as is required by AWS 

(https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domains.html)

## Getting Started
Clone the repository and simply run one of the following:

- `NPM`
```bash
npm i
```

- `PNPM` (preferred)

```bash
pnpm i
```

Use CDK or SST to run the application to deploy the stack either through a 
pipeline or manually deployed through your local machine.
