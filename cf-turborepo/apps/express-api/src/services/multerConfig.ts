import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Път до временната директория за файлове
const tempDir = path.join(__dirname, '../../temp');

// Създаваме временната директория, ако не съществува
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Конфигурация на multer за запазване на файлове във временна директория
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Генерираме уникално име на файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExt);
  }
});

// Филтър за файлове - позволяваме само изображения
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    // Приемаме файла
    cb(null, true);
  } else {
    // Отхвърляме файла
    cb(new Error('Only image files are allowed'));
  }
};

// Ограничения за файловете
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB максимален размер
};

// Създаваме multer instance с нашата конфигурация
const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload; 