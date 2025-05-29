import sharp from 'sharp';
import cloudinary from './cloudinaryConfig';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

// Път до временната директория за файлове
const tempDir = path.join(__dirname, '../../temp');

// Създаваме временната директория, ако не съществува
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export class ImageService {
  /**
   * Качва изображение в Cloudinary
   * @param filePath Път до файла
   * @param folder Папка в Cloudinary (например 'campaigns', 'events')
   * @returns URL на каченото изображение
   */
  static async uploadImage(filePath: string, folder: string = 'campaigns'): Promise<string> {
    try {
      // Оптимизиране на изображението преди качване
      const optimizedImagePath = await this.optimizeImage(filePath);
      
      // Качване в Cloudinary
      const result = await cloudinary.uploader.upload(optimizedImagePath, {
        folder,
        resource_type: 'image',
      });
      
      // Изтриване на временните файлове
      await unlinkAsync(optimizedImagePath);
      if (filePath !== optimizedImagePath) {
        await unlinkAsync(filePath);
      }
      
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Оптимизира изображение с помощта на sharp
   * @param filePath Път до оригиналния файл
   * @returns Път до оптимизирания файл
   */
  static async optimizeImage(filePath: string): Promise<string> {
    try {
      const fileExt = path.extname(filePath);
      const fileName = path.basename(filePath, fileExt);
      const outputPath = path.join(tempDir, `${fileName}-optimized${fileExt}`);
      
      await sharp(filePath)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(outputPath);
      
      return outputPath;
    } catch (error) {
      console.error('Error optimizing image:', error);
      return filePath; // Връщаме оригиналния път, ако оптимизацията се провали
    }
  }
  
  /**
   * Изтрива изображение от Cloudinary
   * @param imageUrl URL на изображението за изтриване
   * @returns true ако изтриването е успешно
   */
  static async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Извличаме public_id от URL
      const urlParts = imageUrl.split('/');
      const fileNameWithExt = urlParts[urlParts.length - 1];
      const fileName = fileNameWithExt.split('.')[0];
      
      // Формираме public_id включващ папката
      let publicId = fileName;
      if (urlParts.includes('campaigns')) {
        publicId = `campaigns/${fileName}`;
      } else if (urlParts.includes('events')) {
        publicId = `events/${fileName}`;
      }
      
      // Изтриваме от Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }
  
  /**
   * Променя изображение (ресайз, кроп, ротация)
   * @param imageUrl URL на съществуващото изображение
   * @param transformations Обект с трансформации
   * @param folder Папка в Cloudinary
   * @returns URL на новото изображение
   */
  static transformImage(
    imageUrl: string, 
    transformations: {
      width?: number,
      height?: number,
      crop?: boolean,
      rotate?: number
    },
    folder: string = 'campaigns'
  ): string {
    // Извличаме публичното ID от URL
    const urlParts = imageUrl.split('/');
    const fileNameWithExt = urlParts[urlParts.length - 1];
    
    // Създаваме трансформации за URL
    let transformationString = '';
    
    if (transformations.width || transformations.height) {
      transformationString += `c_${transformations.crop ? 'crop' : 'fill'},`;
      if (transformations.width) transformationString += `w_${transformations.width},`;
      if (transformations.height) transformationString += `h_${transformations.height},`;
    }
    
    if (transformations.rotate) {
      transformationString += `a_${transformations.rotate},`;
    }
    
    // Премахваме последната запетая, ако има такава
    if (transformationString.endsWith(',')) {
      transformationString = transformationString.slice(0, -1);
    }
    
    // Вмъкваме трансформацията в URL
    const baseUrl = imageUrl.split('/upload/')[0];
    const imagePath = imageUrl.split('/upload/')[1];
    
    return `${baseUrl}/upload/${transformationString ? transformationString + '/' : ''}${imagePath}`;
  }
} 