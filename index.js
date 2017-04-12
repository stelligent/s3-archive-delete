'use strict';
const moment = require('moment')
const async = require('async')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()


const archiveBucketName = 'stelligentsia-labs'
const archiveBucketPrefix = 'archive-' + moment().format('YYYY-MM-DD')
const safeBuckets = [
  'ftpfrontendpipeline-ftpfrontendbucket-eblys920aisn',
  'stelligent-github-backups'
]

s3.listBuckets((err, data) => {
  data.Buckets.map(bucket => {
    console.log(bucket.Name)
    return true
    // if (bucket.Name !== archiveBucketName && safeBuckets.indexOf(bucket.Name) === -1)
      // archiveBucket(bucket.Name, deleteBucket)
  })
})

const archiveBucket = (bucketName) => {
  s3.listObjects({Bucket: bucketName}, (err, data) => {
    console.log(data)
    if (data && data.Contents.length > 0) {
      async.each(data.Contents, (file, cb) => {
        const params = {
          Bucket: archiveBucketName,
          CopySource: bucketName + '/' + file.Key,
          Key: archiveBucketPrefix + '/' + bucketName + '/' + file.Key
        }
        s3.copyObject(params, copyErr => {
          if (copyErr) console.error(copyErr)
          else cb()
        })
      }, () => {
        async.each(data.Contents, (file, cb) => {
          s3.deleteObject({ Bucket: bucketName, CopySource: bucketName + '/' + file.Key }, delErr => {
            if (delErr) console.error(delErr)
            else cb()
          })
        }, () => {deleteBucket(bucketName)})
      })
    } else {deleteBucket(bucketName)}
  })
}

const deleteBucket = bucketName => {
  s3.deleteBucket({ Bucket: bucketName }, err => {
    if (err) console.error(err)
    else console.log('Delete ' + bucketName)
  })
}
