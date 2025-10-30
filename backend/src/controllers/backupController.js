import archiver from 'archiver';
import extract from 'extract-zip';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建备份
export const createBackup = async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `webtool-backup-${timestamp}.zip`;
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${backupFileName}"`);

    // 创建压缩流
    const archive = archiver('zip', {
      zlib: { level: 9 } // 最高压缩级别
    });

    // 错误处理
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).json({ error: 'Failed to create backup' });
    });

    // 将压缩流输出到响应
    archive.pipe(res);

    // 添加数据库文件
    const dbPath = path.join(__dirname, '../../database.db');
    if (fs.existsSync(dbPath)) {
      archive.file(dbPath, { name: 'database.db' });
    }

    // 添加上传的文件目录
    const uploadsPath = path.join(__dirname, '../../uploads');
    if (fs.existsSync(uploadsPath)) {
      // 获取所有上传的文件，排除 .gitkeep
      const files = fs.readdirSync(uploadsPath).filter(file => file !== '.gitkeep');
      files.forEach(file => {
        const filePath = path.join(uploadsPath, file);
        if (fs.statSync(filePath).isFile()) {
          archive.file(filePath, { name: `uploads/${file}` });
        }
      });
    }

    // 完成压缩
    await archive.finalize();

    console.log(`Backup created: ${backupFileName}`);
  } catch (error) {
    console.error('Create backup error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to create backup' });
    }
  }
};

// 恢复备份
export const restoreBackup = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No backup file uploaded' });
    }

    const zipFilePath = req.file.path;
    const tempExtractPath = path.join(__dirname, '../../temp-restore');

    // 创建临时解压目录
    if (!fs.existsSync(tempExtractPath)) {
      fs.mkdirSync(tempExtractPath, { recursive: true });
    }

    // 解压 zip 文件
    await extract(zipFilePath, { dir: path.resolve(tempExtractPath) });

    // 检查必需的文件
    const extractedDbPath = path.join(tempExtractPath, 'database.db');
    if (!fs.existsSync(extractedDbPath)) {
      // 清理临时文件
      fs.rmSync(tempExtractPath, { recursive: true, force: true });
      fs.unlinkSync(zipFilePath);
      return res.status(400).json({ error: 'Invalid backup file: database.db not found' });
    }

    // 关闭当前数据库连接
    db.close();

    // 备份当前数据库（以防恢复失败）
    const currentDbPath = path.join(__dirname, '../../database.db');
    const backupCurrentDbPath = path.join(__dirname, '../../database.db.backup');
    if (fs.existsSync(currentDbPath)) {
      fs.copyFileSync(currentDbPath, backupCurrentDbPath);
    }

    // 恢复数据库
    fs.copyFileSync(extractedDbPath, currentDbPath);

    // 恢复上传的文件
    const extractedUploadsPath = path.join(tempExtractPath, 'uploads');
    const uploadsPath = path.join(__dirname, '../../uploads');
    
    if (fs.existsSync(extractedUploadsPath)) {
      // 清空现有上传目录（除了 .gitkeep）
      const existingFiles = fs.readdirSync(uploadsPath).filter(file => file !== '.gitkeep');
      existingFiles.forEach(file => {
        fs.unlinkSync(path.join(uploadsPath, file));
      });

      // 复制恢复的文件
      const restoredFiles = fs.readdirSync(extractedUploadsPath);
      restoredFiles.forEach(file => {
        const srcPath = path.join(extractedUploadsPath, file);
        const destPath = path.join(uploadsPath, file);
        if (fs.statSync(srcPath).isFile()) {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    }

    // 清理临时文件
    fs.rmSync(tempExtractPath, { recursive: true, force: true });
    fs.unlinkSync(zipFilePath);

    // 重新初始化数据库连接
    const Database = (await import('better-sqlite3')).default;
    const newDb = new Database(currentDbPath);
    
    // 更新数据库连接
    Object.assign(db, newDb);

    res.json({ 
      message: 'Backup restored successfully',
      info: 'Please restart the server to ensure all changes take effect'
    });

    console.log('Backup restored successfully');

    // 建议重启服务器
    console.log('Please restart the server to ensure all changes take effect');
  } catch (error) {
    console.error('Restore backup error:', error);

    // 尝试恢复原数据库
    const currentDbPath = path.join(__dirname, '../../database.db');
    const backupCurrentDbPath = path.join(__dirname, '../../database.db.backup');
    
    if (fs.existsSync(backupCurrentDbPath)) {
      try {
        fs.copyFileSync(backupCurrentDbPath, currentDbPath);
        console.log('Rolled back to previous database');
      } catch (rollbackError) {
        console.error('Failed to rollback:', rollbackError);
      }
    }

    res.status(500).json({ error: 'Failed to restore backup: ' + error.message });
  }
};

// 获取备份信息
export const getBackupInfo = (req, res) => {
  try {
    const dbPath = path.join(__dirname, '../../database.db');
    const uploadsPath = path.join(__dirname, '../../uploads');

    let dbSize = 0;
    let uploadsSize = 0;
    let fileCount = 0;

    // 获取数据库大小
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      dbSize = stats.size;
    }

    // 获取上传文件大小和数量
    if (fs.existsSync(uploadsPath)) {
      const files = fs.readdirSync(uploadsPath).filter(file => file !== '.gitkeep');
      fileCount = files.length;
      files.forEach(file => {
        const filePath = path.join(uploadsPath, file);
        if (fs.statSync(filePath).isFile()) {
          uploadsSize += fs.statSync(filePath).size;
        }
      });
    }

    // 格式化文件大小
    const formatSize = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    res.json({
      database: {
        size: dbSize,
        sizeFormatted: formatSize(dbSize)
      },
      uploads: {
        size: uploadsSize,
        sizeFormatted: formatSize(uploadsSize),
        fileCount: fileCount
      },
      total: {
        size: dbSize + uploadsSize,
        sizeFormatted: formatSize(dbSize + uploadsSize)
      }
    });
  } catch (error) {
    console.error('Get backup info error:', error);
    res.status(500).json({ error: 'Failed to get backup info' });
  }
};
