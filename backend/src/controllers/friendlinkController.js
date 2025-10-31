import db from '../config/database.js';

// 获取所有友情链接
export const getFriendlinks = (req, res) => {
  try {
    const { is_active } = req.query;

    let query = 'SELECT * FROM friendlinks WHERE 1=1';
    let params = [];

    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(is_active);
    }

    query += ' ORDER BY sort_order, id';

    const friendlinks = db.prepare(query).all(...params);

    res.json(friendlinks);
  } catch (error) {
    console.error('Get friendlinks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取单个友情链接
export const getFriendlink = (req, res) => {
  try {
    const friendlink = db.prepare('SELECT * FROM friendlinks WHERE id = ?').get(req.params.id);

    if (!friendlink) {
      return res.status(404).json({ error: 'Friendlink not found' });
    }

    res.json(friendlink);
  } catch (error) {
    console.error('Get friendlink error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 创建友情链接
export const createFriendlink = (req, res) => {
  try {
    const { name, url, logo, description, sort_order = 0, is_active = 1 } = req.body;

    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL are required' });
    }

    const result = db.prepare(`
      INSERT INTO friendlinks (name, url, logo, description, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, url, logo || '', description || '', sort_order, is_active);

    const friendlink = db.prepare('SELECT * FROM friendlinks WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(friendlink);
  } catch (error) {
    console.error('Create friendlink error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新友情链接
export const updateFriendlink = (req, res) => {
  try {
    const { name, url, logo, description, sort_order, is_active } = req.body;
    const { id } = req.params;

    const friendlink = db.prepare('SELECT * FROM friendlinks WHERE id = ?').get(id);

    if (!friendlink) {
      return res.status(404).json({ error: 'Friendlink not found' });
    }

    db.prepare(`
      UPDATE friendlinks 
      SET name = ?, url = ?, logo = ?, description = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name !== undefined ? name : friendlink.name,
      url !== undefined ? url : friendlink.url,
      logo !== undefined ? logo : friendlink.logo,
      description !== undefined ? description : friendlink.description,
      sort_order !== undefined ? sort_order : friendlink.sort_order,
      is_active !== undefined ? is_active : friendlink.is_active,
      id
    );

    const updatedFriendlink = db.prepare('SELECT * FROM friendlinks WHERE id = ?').get(id);

    res.json(updatedFriendlink);
  } catch (error) {
    console.error('Update friendlink error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 删除友情链接
export const deleteFriendlink = (req, res) => {
  try {
    const { id } = req.params;

    const friendlink = db.prepare('SELECT * FROM friendlinks WHERE id = ?').get(id);

    if (!friendlink) {
      return res.status(404).json({ error: 'Friendlink not found' });
    }

    db.prepare('DELETE FROM friendlinks WHERE id = ?').run(id);

    res.json({ message: 'Friendlink deleted successfully' });
  } catch (error) {
    console.error('Delete friendlink error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
