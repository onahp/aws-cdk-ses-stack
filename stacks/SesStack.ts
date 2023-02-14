import { 
  StackContext 
} from "sst/constructs";
import { 
  Duration,
  aws_route53 as route53,
  aws_ses as ses,
} from "aws-cdk-lib";


/*
 *
 * AWS SES stack that allows for domain and email setup and verification 
 * You will need to provide your own domain and email address to use this stack.
 * You will also need to manually verify your domain with SES and setup DKIM.
 *
 * @params { stack, app } - StackContext
 *
*/
export function SesStack(this: any, { stack, app }: StackContext) {


  // The two const variables below are important to note and are used throughout
  // the rest of the code.
  const domain = ``; // Enter domain here
  const domainRecord = `${app.stage}.${domain}`;
  const appRecord = `${app.stage}-${app.name}`;

  // Verify domain with SES and setup DKIM 
  // You will have to manually go onto AWS SES and verify the domain 
  // by publishing the records (click of a button) or transferring the records 
  // to your DNS provider
  new ses.EmailIdentity(stack, `${appRecord}-identity-domain`, {
    identity: ses.Identity.domain(domainRecord),
    dkimIdentity: ses.DkimIdentity.easyDkim(
      ses.EasyDkimSigningKeyLength.RSA_2048_BIT,
    ),
    dkimSigning: true,
  });

  // Create email identities for verification and use in SES/Cognito
  // This is intended to go in tandem with the domain verification above
  new ses.EmailIdentity(stack, `${appRecord}-identity`, {
    identity: ses.Identity.email(`dev@${domainRecord}`),
    dkimSigning: true,
  });


  // #########################################################################################
  // #########################################################################################
  // !! IMPORTANT NOTE !!
  // The below should only be used if you intend to connect SES with your own email provider
  // to recieve emails. (i.e - Google, Yahoo, Outlook, etc.)
  // #########################################################################################
  // #########################################################################################


  // Setup our variables for our cname records and our hosted zone required for SES.
  let iterator:number = 0;
  const cnameRecord:number = 3;

  const hostedZone = route53.HostedZone.fromHostedZoneAttributes(stack, domainRecord, {
    hostedZoneId: "Enter your zone id here", // Attach your hosted zone id here
    zoneName: domain, // Attach your domain address here.
  });

  // Setup mx records for SES to mail client
  // Generally speaking, there are 2 mail servers required. You will need to 
  // get there from your email provider and add them here within the `values`
  // array
  new route53.MxRecord(this, `${appRecord}-mx-record`, {
    values: [
      {
        hostName: `Enter value 1 provided by vendor`, // Enter hostname provider by vendor
        priority: 10,
      },
      {
        hostName: `Enter value 2 provided by vendor`, // Enter hostname provider by vendor
        priority: 20,
      },
    ],
    zone: hostedZone,

    // Properties
    recordName: domainRecord,
    comment: `Mx record for ${domainRecord}`,
    deleteExisting: true,
    ttl: Duration.seconds(60),
  });

  // Setup cname records for SES to mail client.
  // We are iterating three times to create three cname records (standard number of records)
  // This may vary depending on your email provider. You will need to adjust the below accordingly.
  // As such, for your case - you may not need a while loop since the records are uniquely different.
  iterator = 0;
  while (iterator < cnameRecord) {
    let record = iterator + 1;
    new route53.CnameRecord(stack, `${appRecord}-cname-record-${record}`, {
      zone: hostedZone,
      domainName: `Enter domain value here`, // Attach your provided domain record from vendor
      recordName: `Enter record value here`, // Attach your provided record name from vendor
      comment: `Cname record for ${domainRecord}`,
      deleteExisting: true,
      ttl: Duration.seconds(60),
    })
    iterator++;
  }

  // Setup txt records for SES to mail client. This is generally 1 record to set up.
  new route53.TxtRecord(stack, `${appRecord}-txt-record`, {
    zone: hostedZone,
    values: [
      `Enter your txt record value here` // Attach your provided txt record from your vendor
    ],
    recordName: domainRecord,
    comment: `Cname record for ${domainRecord}`,
    deleteExisting: true,
    ttl: Duration.seconds(60),
  });


  // Print outputs
  stack.addOutputs({
    AppRecord: appRecord,
  });

}
