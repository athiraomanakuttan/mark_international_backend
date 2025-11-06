import { Router } from 'express';
import { UploadController } from '../controller/uploadController';
import { uploadSingleFile, uploadMultipleFiles } from '../middlewares/cloudinaryMulter';
import authenticationMiddleware from '../middlewares/authenticationMiddleware';

const uploadRouter = Router();
const uploadController = new UploadController();

// Apply authentication middleware to all upload routes
uploadRouter.use(authenticationMiddleware);

// Single file upload endpoint
uploadRouter.post(
  '/single',
  ...uploadSingleFile,
  uploadController.uploadFile.bind(uploadController)
);

// Multiple files upload endpoint
uploadRouter.post(
  '/multiple',
  ...uploadMultipleFiles,
  uploadController.uploadMultipleFiles.bind(uploadController)
);

export { uploadRouter };