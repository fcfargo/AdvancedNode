const S3 = require('aws-sdk/clients/s3');
const key = require('../config/dev');
const { v1: uuidv1 } = require('uuid');
const requireLogin = require('../middlewares/requireLogin');

const s3Client = new S3({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: key.accessKeyId,
    secretAccessKey: key.secretAccessKey,
  },
});

module.exports = (app) => {
  app.get('/api/upload', requireLogin, async (req, res) => {
    const params = {
      Bucket: 'blog-dev-fcfargo.jpeg',
      Key: `${req.user.id}/${uuidv1()}`,
      ContentType: 'jpeg',
    };
    s3Client.getSignedUrl('putObject', params, (err, url) => res.send({ key: params.Key, url }));
  });
};
