import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

import { MINIO_ACCESS_KEY, MINIO_ENDPOINT, MINIO_SECRET_KEY } from '@/config/minio';

export class S3Service {
    private static instance: S3Service;
    private readonly client: S3Client;
    private readonly isLocal: boolean;

    private constructor() {
        this.isLocal = process.env.NODE_ENV === 'development';
        const config: S3ClientConfig = this.isLocal ?
            this.getLocalConfig() :
            this.getProductionConfig();

        this.client = new S3Client(config);
    }

    private getLocalConfig(): S3ClientConfig {
        return {
            endpoint: MINIO_ENDPOINT,
            credentials: {
                accessKeyId: MINIO_ACCESS_KEY,
                secretAccessKey: MINIO_SECRET_KEY,
            },
            region: 'us-east-1',
            forcePathStyle: true,
        };
    }

    private getProductionConfig(): S3ClientConfig {
        return {
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        };
    }

    public static getInstance(): S3Service {
        if (!S3Service.instance) {
            S3Service.instance = new S3Service();
        }
        return S3Service.instance;
    }

    public getClient(): S3Client {
        return this.client;
    }
}

export const getS3Client = () => S3Service.getInstance().getClient();
