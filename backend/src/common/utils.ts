import { createHmac, randomBytes } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { diskStorage } from 'multer';
import path from 'node:path';

export const slug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const randomCode = (prefix: string) => `${prefix}-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${randomBytes(3).toString('hex').toUpperCase()}`;
export const verifyRazorpaySignature = (order: string, payment: string, signature: string) =>
  createHmac('sha256', process.env.RAZORPAY_SECRET || '').update(`${order}|${payment}`).digest('hex') === signature;

export const uploadStorage = (folder: string) => diskStorage({
  destination: (_request, _file, callback) => {
    const destination = path.resolve(process.env.UPLOAD_DIR || 'uploads', folder);
    mkdirSync(destination, { recursive: true });
    callback(null, destination);
  },
  filename: (_request, file, callback) => callback(null, `${Date.now()}-${randomBytes(4).toString('hex')}${path.extname(file.originalname).toLowerCase()}`),
});

export const publicUploadPath = (folder: string, file?: Express.Multer.File) => file ? `${folder}/${file.filename}` : null;
