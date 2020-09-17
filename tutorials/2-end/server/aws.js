import aws from 'aws-sdk';

// const AWS_ACCESSKEYID = 'xxxxxx';
// const AWS_SECRETACCESSKEY= 'xxxxxx';


export default function sendEmail(options) {
  aws.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  });

  const ses = new aws.SES({ apiVersion: 'latest' });

  return new Promise((resolve, reject) => {
    ses.sendEmail(
      {
        Source: options.from,
        Destination: {
          CcAddresses: options.cc,
          ToAddresses: options.to,
        },
        Message: {
          Subject: {
            Data: options.subject,
          },
          Body: {
            Html: {
              Data: options.body,
            },
          },
        },
        ReplyToAddresses: options.replyTo,
      },
      (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      },
    );
  });
}
