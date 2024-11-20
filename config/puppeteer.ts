import { MINIO_BUCKET, MINIO_ENDPOINT } from '@/config/minio';

const CHROMIUM_VERSION = '131';

const CHROMIUM_FILE = `chromium-v${CHROMIUM_VERSION}.0.0-pack.tar`;

export const executablePath = `${MINIO_ENDPOINT}/${MINIO_BUCKET}/${CHROMIUM_FILE}`;
