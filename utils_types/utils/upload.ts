import { env } from '#/env';

type UploadApiOptions = import('cloudinary').UploadApiOptions;
type CloudinaryV2 = typeof import('cloudinary').v2;

interface UploadOptions {
  folder?: string;
  asset_folder?: string;
  public_id?: string;
  tags?: string[];
  context?: Record<string, string>;
  metadata?: Record<string, string | number | boolean>;
  upload_preset?: string;
  resource_type?: UploadApiOptions['resource_type'];
  overwrite?: boolean;
  invalidate?: boolean;
}

let isCloudinaryConfigured = false;
let cloudinaryInstance: CloudinaryV2 | null = null;

const getCloudinary = async (): Promise<CloudinaryV2> => {
  if (cloudinaryInstance) {
    return cloudinaryInstance;
  }

  if (process.env.CLOUDINARY_URL) {
    delete process.env.CLOUDINARY_URL;
  }

  const mod = await import('cloudinary');
  cloudinaryInstance = mod.v2;
  return cloudinaryInstance;
};

const configureCloudinary = async (): Promise<CloudinaryV2> => {
  if (isCloudinaryConfigured && cloudinaryInstance) return cloudinaryInstance;

  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_SECRET) {
    throw new Error('Cloudinary env vars are missing');
  }

  const cloudinary = await getCloudinary();

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_secret: env.CLOUDINARY_SECRET,
    api_key: env.CLOUDINARY_API_KEY,
  });

  isCloudinaryConfigured = true;

  return cloudinary;
};

export const uploadFile = async (file: File | Blob, options: UploadOptions = {}): Promise<string> => {
  if (!file) {
    throw new Error('No file provided');
  }

  const cloudinary = await configureCloudinary();

  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('Only image uploads are supported for profile photos');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length === 0) {
    throw new Error('File is empty');
  }

  const mimeType = file.type;
  const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;

  const uploadOptions: UploadApiOptions = {
    folder: options.folder ?? options.asset_folder,
    public_id: options.public_id,
    tags: options.tags,
    context: options.context,
    metadata: options.metadata,
    upload_preset: options.upload_preset,
    resource_type: options.resource_type ?? 'image',
    overwrite: options.overwrite,
    invalidate: options.invalidate,
  };

  const result = await cloudinary.uploader.upload(base64, uploadOptions);
  if (!result.secure_url) {
    throw new Error('Cloudinary upload did not return a secure URL');
  }

  return result.secure_url;
};

export default uploadFile;