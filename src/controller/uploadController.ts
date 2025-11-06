import { Request, Response } from 'express';

export class UploadController {
  // General file upload endpoint
  async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
        return;
      }

      // File is already uploaded to Cloudinary by middleware
      const cloudinaryUrl = req.file.path; // This is set by our Cloudinary middleware
      const publicId = (req.file as any).cloudinary?.public_id;

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          url: cloudinaryUrl,
          public_id: publicId,
          original_name: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    } catch (error: any) {
      console.error('Upload controller error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'File upload failed'
      });
    }
  }

  // Multiple files upload endpoint
  async uploadMultipleFiles(req: Request, res: Response): Promise<void> {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
        return;
      }

      // Files are already uploaded to Cloudinary by middleware
      const uploadedFiles = req.files.map((file: Express.Multer.File) => ({
        url: file.path, // This is set by our Cloudinary middleware
        public_id: (file as any).cloudinary?.public_id,
        original_name: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }));

      res.status(200).json({
        success: true,
        message: `${uploadedFiles.length} files uploaded successfully`,
        data: uploadedFiles
      });
    } catch (error: any) {
      console.error('Multiple upload controller error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Files upload failed'
      });
    }
  }
}