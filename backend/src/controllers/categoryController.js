import db from '../config/database.js';

// 获取所有栏目（包含层级关系）
export const getCategories = (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT * FROM categories ORDER BY parent_id, sort_order
    `).all();

    // 组织成树形结构
    const categoryTree = [];
    const categoryMap = {};

    // 第一遍遍历，创建映射
    categories.forEach(cat => {
      categoryMap[cat.id] = { ...cat, children: [] };
    });

    // 第二遍遍历，建立父子关系
    categories.forEach(cat => {
      if (cat.parent_id === 0) {
        categoryTree.push(categoryMap[cat.id]);
      } else if (categoryMap[cat.parent_id]) {
        categoryMap[cat.parent_id].children.push(categoryMap[cat.id]);
      }
    });

    res.json(categoryTree);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取单个栏目
export const getCategory = (req, res) => {
  try {
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 创建栏目
export const createCategory = (req, res) => {
  try {
    const { name, icon, parent_id = 0, sort_order = 0 } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = db.prepare(`
      INSERT INTO categories (name, icon, parent_id, sort_order)
      VALUES (?, ?, ?, ?)
    `).run(name, icon || '', parent_id, sort_order);

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新栏目
export const updateCategory = (req, res) => {
  try {
    const { name, icon, parent_id, sort_order } = req.body;
    const { id } = req.params;

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    db.prepare(`
      UPDATE categories 
      SET name = ?, icon = ?, parent_id = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name !== undefined ? name : category.name,
      icon !== undefined ? icon : category.icon,
      parent_id !== undefined ? parent_id : category.parent_id,
      sort_order !== undefined ? sort_order : category.sort_order,
      id
    );

    const updatedCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    res.json(updatedCategory);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 删除栏目
export const deleteCategory = (req, res) => {
  try {
    const { id } = req.params;

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // 检查是否有子栏目
    const hasChildren = db.prepare('SELECT COUNT(*) as count FROM categories WHERE parent_id = ?').get(id);
    
    if (hasChildren.count > 0) {
      return res.status(400).json({ error: 'Cannot delete category with subcategories' });
    }

    // 检查是否有关联的卡片
    const hasCards = db.prepare('SELECT COUNT(*) as count FROM cards WHERE category_id = ?').get(id);
    
    if (hasCards.count > 0) {
      return res.status(400).json({ error: 'Cannot delete category with cards' });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
