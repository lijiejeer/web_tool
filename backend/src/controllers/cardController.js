import db from '../config/database.js';
import { parseWebsiteInfo } from '../utils/urlParser.js';

// 获取所有卡片
export const getCards = (req, res) => {
  try {
    const { category_id } = req.query;

    let query = 'SELECT * FROM cards';
    let params = [];

    if (category_id) {
      query += ' WHERE category_id = ?';
      params.push(category_id);
    }

    query += ' ORDER BY sort_order, id';

    const cards = db.prepare(query).all(...params);

    res.json(cards);
  } catch (error) {
    console.error('Get cards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取单个卡片
export const getCard = (req, res) => {
  try {
    const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    console.error('Get card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 解析网站信息
export const parseWebsite = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const info = await parseWebsiteInfo(url);

    res.json(info);
  } catch (error) {
    console.error('Parse website error:', error);
    res.status(500).json({ error: 'Failed to parse website information' });
  }
};

// 创建卡片
export const createCard = async (req, res) => {
  try {
    const { category_id, title, url, logo, description, sort_order = 0, auto_parse = false } = req.body;

    if (!category_id || !url) {
      return res.status(400).json({ error: 'Category ID and URL are required' });
    }

    let cardTitle = title;
    let cardLogo = logo;
    let cardDescription = description;

    // 如果需要自动解析
    if (auto_parse && !title) {
      try {
        const info = await parseWebsiteInfo(url);
        cardTitle = cardTitle || info.title;
        cardLogo = cardLogo || info.logo;
        cardDescription = cardDescription || info.description;
      } catch (error) {
        console.error('Auto parse error:', error);
      }
    }

    if (!cardTitle) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = db.prepare(`
      INSERT INTO cards (category_id, title, url, logo, description, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(category_id, cardTitle, url, cardLogo || '', cardDescription || '', sort_order);

    const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(card);
  } catch (error) {
    console.error('Create card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新卡片
export const updateCard = (req, res) => {
  try {
    const { category_id, title, url, logo, description, sort_order } = req.body;
    const { id } = req.params;

    const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(id);

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    db.prepare(`
      UPDATE cards 
      SET category_id = ?, title = ?, url = ?, logo = ?, description = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      category_id !== undefined ? category_id : card.category_id,
      title !== undefined ? title : card.title,
      url !== undefined ? url : card.url,
      logo !== undefined ? logo : card.logo,
      description !== undefined ? description : card.description,
      sort_order !== undefined ? sort_order : card.sort_order,
      id
    );

    const updatedCard = db.prepare('SELECT * FROM cards WHERE id = ?').get(id);

    res.json(updatedCard);
  } catch (error) {
    console.error('Update card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 删除卡片
export const deleteCard = (req, res) => {
  try {
    const { id } = req.params;

    const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(id);

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    db.prepare('DELETE FROM cards WHERE id = ?').run(id);

    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Delete card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 搜索卡片
export const searchCards = (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const cards = db.prepare(`
      SELECT * FROM cards 
      WHERE title LIKE ? OR description LIKE ? OR url LIKE ?
      ORDER BY sort_order, id
    `).all(`%${q}%`, `%${q}%`, `%${q}%`);

    res.json(cards);
  } catch (error) {
    console.error('Search cards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
