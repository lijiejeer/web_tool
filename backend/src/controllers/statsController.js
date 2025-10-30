import db from '../config/database.js';

// 获取统计信息
export const getStats = (req, res) => {
  try {
    // 总数统计
    const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
    const cardCount = db.prepare('SELECT COUNT(*) as count FROM cards').get().count;
    const adCount = db.prepare('SELECT COUNT(*) as count FROM ads').get().count;
    const friendlinkCount = db.prepare('SELECT COUNT(*) as count FROM friendlinks').get().count;

    // 最近登录记录
    const recentLogins = db.prepare(`
      SELECT l.*, u.username 
      FROM login_logs l
      JOIN users u ON l.user_id = u.id
      ORDER BY l.login_time DESC
      LIMIT 10
    `).all();

    res.json({
      counts: {
        categories: categoryCount,
        cards: cardCount,
        ads: adCount,
        friendlinks: friendlinkCount
      },
      recentLogins
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取登录日志
export const getLoginLogs = (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const logs = db.prepare(`
      SELECT l.*, u.username 
      FROM login_logs l
      JOIN users u ON l.user_id = u.id
      ORDER BY l.login_time DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM login_logs').get().count;

    res.json({
      data: logs,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get login logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
