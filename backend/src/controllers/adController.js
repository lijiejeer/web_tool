import db from '../config/database.js';

// 获取所有广告
export const getAds = (req, res) => {
  try {
    const { position, is_active } = req.query;

    let query = 'SELECT * FROM ads WHERE 1=1';
    let params = [];

    if (position) {
      query += ' AND position = ?';
      params.push(position);
    }

    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(is_active);
    }

    query += ' ORDER BY sort_order, id';

    const ads = db.prepare(query).all(...params);

    res.json(ads);
  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取单个广告
export const getAd = (req, res) => {
  try {
    const ad = db.prepare('SELECT * FROM ads WHERE id = ?').get(req.params.id);

    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    res.json(ad);
  } catch (error) {
    console.error('Get ad error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 创建广告
export const createAd = (req, res) => {
  try {
    const { title, position, image_url, link_url, sort_order = 0, is_active = 1 } = req.body;

    if (!title || !position || !image_url) {
      return res.status(400).json({ error: 'Title, position, and image URL are required' });
    }

    const result = db.prepare(`
      INSERT INTO ads (title, position, image_url, link_url, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, position, image_url, link_url || '', sort_order, is_active);

    const ad = db.prepare('SELECT * FROM ads WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(ad);
  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新广告
export const updateAd = (req, res) => {
  try {
    const { title, position, image_url, link_url, sort_order, is_active } = req.body;
    const { id } = req.params;

    const ad = db.prepare('SELECT * FROM ads WHERE id = ?').get(id);

    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    db.prepare(`
      UPDATE ads 
      SET title = ?, position = ?, image_url = ?, link_url = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title !== undefined ? title : ad.title,
      position !== undefined ? position : ad.position,
      image_url !== undefined ? image_url : ad.image_url,
      link_url !== undefined ? link_url : ad.link_url,
      sort_order !== undefined ? sort_order : ad.sort_order,
      is_active !== undefined ? is_active : ad.is_active,
      id
    );

    const updatedAd = db.prepare('SELECT * FROM ads WHERE id = ?').get(id);

    res.json(updatedAd);
  } catch (error) {
    console.error('Update ad error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 删除广告
export const deleteAd = (req, res) => {
  try {
    const { id } = req.params;

    const ad = db.prepare('SELECT * FROM ads WHERE id = ?').get(id);

    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    db.prepare('DELETE FROM ads WHERE id = ?').run(id);

    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error('Delete ad error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
