// const { S3 } = require("@aws-sdk/client-s3")
// const s3 = new S3({
// 	credentials: {
// 		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// 		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// 		region: process.env.AWS_REGION,
// 	},
// 	region: process.env.AWS_REGION
// })

import { S3Client } from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-providers';
import { loadSharedConfigFiles } from '@aws-sdk/shared-ini-file-loader';

const profile = 'myprofile';

const s3Client = new S3Client({
  credentials: fromIni({ profile }),
  region: (await loadSharedConfigFiles()).configFile?.[profile]?.region,
});

console.log(s3Client)

// s3Client.putObject({
// 	Bucket: process.env.AWS_BUCKET,
// 	Key: 'test.txt',
// 	Body: 'Hello World!',
// })
