# Registration API Documentation

## Overview
The Registration API allows users to submit registration forms with personal information, address details, and document uploads. Files are automatically uploaded to Cloudinary and stored with their metadata in MongoDB.

## Environment Setup
Add the following variables to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## API Endpoints

### POST /api/registration
Submit a new registration form with documents.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `name` (string, required): Full name (min 2 characters)
- `dateOfBirth` (string, required): Date in YYYY-MM-DD format
- `contactNumber` (string, required): Phone number (10-15 digits)
- `maritalStatus` (string, required): One of: single, married, divorced, widowed
- `street` (string, required): Street address (min 3 characters)
- `city` (string, required): City name (min 2 characters)
- `state` (string, required): State name (min 2 characters)
- `pincode` (string, required): Postal code (5-10 digits)
- `country` (string, required): Country name (min 2 characters)
- `documents[]` (files, required): Array of document files

**Supported File Types:**
- Images: JPEG, JPG, PNG, GIF
- Documents: PDF, DOC, DOCX, TXT
- Max file size: 10MB per file
- Max files: 10 files

**Example Response:**
```json
{
  "success": true,
  "message": "Registration created successfully",
  "data": {
    "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
    "name": "John Doe",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "contactNumber": "1234567890",
    "maritalStatus": "single",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "pincode": "10001",
      "country": "USA"
    },
    "documents": [
      {
        "title": "passport.pdf",
        "url": "https://res.cloudinary.com/your-cloud/document.pdf",
        "uploadedAt": "2023-10-31T15:30:00.000Z"
      }
    ],
    "status": 1,
    "createdAt": "2023-10-31T15:30:00.000Z"
  }
}
```

### GET /api/registrations
Get all registrations with pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

### GET /api/registration/:id
Get a specific registration by ID.

### PATCH /api/registration/:id/status
Update registration status.

**Body:**
```json
{
  "status": 2  // 1: pending, 2: approved, 3: rejected
}
```

### DELETE /api/registration/:id
Delete a registration by ID.

## Frontend Integration Example

```typescript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('dateOfBirth', '1990-01-01');
formData.append('contactNumber', '1234567890');
formData.append('maritalStatus', 'single');
formData.append('street', '123 Main St');
formData.append('city', 'New York');
formData.append('state', 'NY');
formData.append('pincode', '10001');
formData.append('country', 'USA');

// Append multiple files
files.forEach(file => {
  formData.append('documents', file);
});

const response = await fetch('/api/registration', {
  method: 'POST',
  body: formData
});
```

## Database Schema

### Registration Model
- `name`: String (required)
- `dateOfBirth`: Date (required)  
- `contactNumber`: String (required)
- `maritalStatus`: Enum ['single', 'married', 'divorced', 'widowed'] (required)
- `address`: Object (required)
  - `street`: String (required)
  - `city`: String (required)
  - `state`: String (required)
  - `pincode`: String (required)
  - `country`: String (required)
- `documents`: Array of Objects
  - `title`: String (original filename)
  - `url`: String (Cloudinary URL)
  - `uploadedAt`: Date (auto-generated)
- `status`: Number (1: pending, 2: approved, 3: rejected)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)