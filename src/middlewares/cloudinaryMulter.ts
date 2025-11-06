import multer from 'multer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import streamifier from 'streamifier';

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter for images only
const imageFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, gif)'));
  }
};

// File filter for documents and images
const documentFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image and document files are allowed'));
  }
};

// Base multer configuration
const createMulterUpload = (fileFilter: any, fileSize: number = 5 * 1024 * 1024) => {
  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: fileSize
    }
  });
};

// Upload single file to Cloudinary
const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: folder,
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error('Upload failed - no result'));
        }
      }
    );
    
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Middleware to upload file to Cloudinary after multer processing
const createCloudinaryMiddleware = (folder: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.file) {
        // Upload single file to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer, folder);
        
        // Add Cloudinary result to request object
        (req.file as any).cloudinary = result;
        (req.file as any).path = result.secure_url; // For compatibility with existing code
      }
      
      if (req.files && Array.isArray(req.files)) {
        // Upload multiple files to Cloudinary
        const uploadPromises = req.files.map(async (file: Express.Multer.File) => {
          const result = await uploadToCloudinary(file.buffer, folder);
          (file as any).cloudinary = result;
          (file as any).path = result.secure_url; // For compatibility with existing code
          return result;
        });
        
        await Promise.all(uploadPromises);
      }
      
      next();
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({
        success: false,
        message: 'File upload failed: ' + error.message
      });
    }
  };
};

// Employee profile picture upload configuration
const employeeMulter = createMulterUpload(imageFilter, 5 * 1024 * 1024); // 5MB
const employeeCloudinaryMiddleware = createCloudinaryMiddleware('employees/profile-pictures');

// General file upload configuration
const generalMulter = createMulterUpload(documentFilter, 10 * 1024 * 1024); // 10MB
const generalCloudinaryMiddleware = createCloudinaryMiddleware('uploads');

// Multiple files upload configuration
const multipleMulter = createMulterUpload(documentFilter, 10 * 1024 * 1024); // 10MB per file
const multipleCloudinaryMiddleware = createCloudinaryMiddleware('uploads/multiple');

// Combined middleware functions
export const uploadEmployeeFiles = [
  employeeMulter.single('profilePicture'),
  employeeCloudinaryMiddleware
];

export const uploadSingleFile = [
  generalMulter.single('file'),
  generalCloudinaryMiddleware
];

export const uploadMultipleFiles = [
  multipleMulter.array('files', 10),
  multipleCloudinaryMiddleware
];

// Export individual components for custom use
export { uploadToCloudinary };