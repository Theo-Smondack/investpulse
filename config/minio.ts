import { projectName } from '@/config/env';

export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'http://172.22.0.2:9000';
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || 'test';
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || '0987654321';
export const MINIO_BUCKET = process.env.MINIO_BUCKET || `${projectName}-bucket`;
