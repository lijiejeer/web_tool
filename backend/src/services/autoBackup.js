import cron from 'node-cron';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BACKUP_DIR = path.join(__dirname, '../../backups');
const MAX_BACKUPS = 5;

// 确保备份目录存在
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// 创建备份
async function createAutoBackup() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0];
    const backupFileName = `auto-backup-${timestamp}.zip`;
    const backupPath = path.join(BACKUP_DIR, backupFileName);

    console.log(`[Auto Backup] Creating backup: ${backupFileName}`);

    const output = fs.createWriteStream(backupPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    return new Promise((resolve, reject) => {
      output.on('close', () => {
        console.log(`[Auto Backup] Backup created successfully: ${backupFileName} (${archive.pointer()} bytes)`);
        cleanOldBackups();
        resolve(backupPath);
      });

      archive.on('error', (err) => {
        console.error('[Auto Backup] Backup failed:', err);
        reject(err);
      });

      archive.pipe(output);

      // 添加数据库文件
      const dbPath = path.join(__dirname, '../../database.db');
      if (fs.existsSync(dbPath)) {
        archive.file(dbPath, { name: 'database.db' });
      }

      // 添加上传的文件目录
      const uploadsPath = path.join(__dirname, '../../uploads');
      if (fs.existsSync(uploadsPath)) {
        const files = fs.readdirSync(uploadsPath).filter(file => file !== '.gitkeep');
        files.forEach(file => {
          const filePath = path.join(uploadsPath, file);
          if (fs.statSync(filePath).isFile()) {
            archive.file(filePath, { name: `uploads/${file}` });
          }
        });
      }

      archive.finalize();
    });
  } catch (error) {
    console.error('[Auto Backup] Error creating backup:', error);
    throw error;
  }
}

// 清理旧备份，只保留最新的MAX_BACKUPS个
function cleanOldBackups() {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('auto-backup-') && file.endsWith('.zip'))
      .map(file => ({
        name: file,
        path: path.join(BACKUP_DIR, file),
        time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length > MAX_BACKUPS) {
      const filesToDelete = files.slice(MAX_BACKUPS);
      filesToDelete.forEach(file => {
        fs.unlinkSync(file.path);
        console.log(`[Auto Backup] Deleted old backup: ${file.name}`);
      });
    }
  } catch (error) {
    console.error('[Auto Backup] Error cleaning old backups:', error);
  }
}

// 获取备份列表
export function getAutoBackupList() {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('auto-backup-') && file.endsWith('.zip'))
      .map(file => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          createdAt: stats.mtime,
          path: filePath
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    return files;
  } catch (error) {
    console.error('[Auto Backup] Error getting backup list:', error);
    return [];
  }
}

// 初始化自动备份
export function initAutoBackup() {
  const backupSchedule = process.env.AUTO_BACKUP_SCHEDULE || 'daily';
  
  let cronExpression;
  
  switch (backupSchedule) {
    case 'daily':
      // 每天凌晨2点执行
      cronExpression = '0 2 * * *';
      console.log('[Auto Backup] Scheduled daily backup at 2:00 AM');
      break;
    case 'weekly':
      // 每周日凌晨2点执行
      cronExpression = '0 2 * * 0';
      console.log('[Auto Backup] Scheduled weekly backup on Sunday at 2:00 AM');
      break;
    case 'monthly':
      // 每月1号凌晨2点执行
      cronExpression = '0 2 1 * *';
      console.log('[Auto Backup] Scheduled monthly backup on the 1st at 2:00 AM');
      break;
    default:
      console.log('[Auto Backup] Auto backup disabled');
      return null;
  }

  // 创建定时任务
  const task = cron.schedule(cronExpression, async () => {
    console.log('[Auto Backup] Starting scheduled backup...');
    try {
      await createAutoBackup();
    } catch (error) {
      console.error('[Auto Backup] Scheduled backup failed:', error);
    }
  }, {
    scheduled: true,
    timezone: process.env.TZ || 'Asia/Shanghai'
  });

  console.log('[Auto Backup] Auto backup service initialized');
  
  return task;
}

// 手动触发备份
export async function triggerManualBackup() {
  return await createAutoBackup();
}

export { BACKUP_DIR, MAX_BACKUPS };
