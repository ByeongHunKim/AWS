import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as AWS from 'aws-sdk'

@Injectable()
export class StorageService {
    readonly storageBaseUrl: string
    readonly bucketName: string
    private readonly storage: AWS.S3

    constructor(readonly configService: ConfigService) {
        this.storageBaseUrl = configService.getOrThrow<string>('storage.baseUrl')
        this.bucketName = configService.getOrThrow<string>('storage.bucketName')

        // todo : s3 policy need to be added in ECS task role
        // todo : check properties meaning
        this.storage = new AWS.S3({
            endpoint: this.storageBaseUrl,
            s3ForcePathStyle: true,
            signatureVersion: 'v4',
            apiVersion: 'latest',
            region: 'ap-northeast-2',
        })
    }

    async uploadProfileImage(key: string, file: Buffer): Promise<string> {
        const params = {
            Bucket: this.bucketName,
            Key: key,
            Body: file,
        }

        // todo : is putObject correct?
        await this.storage.putObject(params).promise()

        return `${this.storageBaseUrl}/${key}`
    }
}
