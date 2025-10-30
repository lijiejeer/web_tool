import db from '../config/database.js';

/**
 * 填充示例数据
 * 用于开发测试，生产环境请勿使用
 */
export function seedExampleData() {
  try {
    // 检查是否已有数据
    const categoriesCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
    if (categoriesCount > 0) {
      console.log('Database already contains data, skipping seed');
      return;
    }

    console.log('Seeding example data...');

    // 创建主栏目
    const mainCategories = [
      { name: '常用工具', icon: 'el-icon-star', parent_id: 0, sort_order: 1 },
      { name: '开发工具', icon: 'el-icon-monitor', parent_id: 0, sort_order: 2 },
      { name: '设计工具', icon: 'el-icon-picture', parent_id: 0, sort_order: 3 }
    ];

    const categoryIds = {};
    mainCategories.forEach((cat) => {
      const result = db.prepare(`
        INSERT INTO categories (name, icon, parent_id, sort_order)
        VALUES (?, ?, ?, ?)
      `).run(cat.name, cat.icon, cat.parent_id, cat.sort_order);
      categoryIds[cat.name] = result.lastInsertRowid;
    });

    // 创建子栏目
    const subCategories = [
      { name: '搜索引擎', icon: '', parent_id: categoryIds['常用工具'], sort_order: 1 },
      { name: '在线工具', icon: '', parent_id: categoryIds['常用工具'], sort_order: 2 },
      { name: '代码仓库', icon: '', parent_id: categoryIds['开发工具'], sort_order: 1 },
      { name: 'API工具', icon: '', parent_id: categoryIds['开发工具'], sort_order: 2 },
      { name: '在线设计', icon: '', parent_id: categoryIds['设计工具'], sort_order: 1 },
      { name: '图片处理', icon: '', parent_id: categoryIds['设计工具'], sort_order: 2 }
    ];

    subCategories.forEach((cat) => {
      const result = db.prepare(`
        INSERT INTO categories (name, icon, parent_id, sort_order)
        VALUES (?, ?, ?, ?)
      `).run(cat.name, cat.icon, cat.parent_id, cat.sort_order);
      categoryIds[cat.name] = result.lastInsertRowid;
    });

    // 创建示例卡片
    const cards = [
      {
        category_id: categoryIds['搜索引擎'],
        title: 'Google',
        url: 'https://www.google.com',
        logo: 'https://www.google.com/favicon.ico',
        description: '全球最大的搜索引擎',
        sort_order: 1
      },
      {
        category_id: categoryIds['搜索引擎'],
        title: '百度',
        url: 'https://www.baidu.com',
        logo: 'https://www.baidu.com/favicon.ico',
        description: '全球最大的中文搜索引擎',
        sort_order: 2
      },
      {
        category_id: categoryIds['代码仓库'],
        title: 'GitHub',
        url: 'https://github.com',
        logo: 'https://github.githubassets.com/favicons/favicon.svg',
        description: '全球最大的代码托管平台',
        sort_order: 1
      },
      {
        category_id: categoryIds['代码仓库'],
        title: 'GitLab',
        url: 'https://gitlab.com',
        logo: 'https://gitlab.com/favicon.ico',
        description: '开源的DevOps平台',
        sort_order: 2
      }
    ];

    cards.forEach((card) => {
      db.prepare(`
        INSERT INTO cards (category_id, title, url, logo, description, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        card.category_id,
        card.title,
        card.url,
        card.logo,
        card.description,
        card.sort_order
      );
    });

    // 创建示例友情链接
    const friendlinks = [
      {
        name: 'Vue.js',
        url: 'https://vuejs.org',
        logo: 'https://vuejs.org/logo.svg',
        description: '渐进式JavaScript框架',
        sort_order: 1,
        is_active: 1
      },
      {
        name: 'Node.js',
        url: 'https://nodejs.org',
        logo: 'https://nodejs.org/static/images/favicons/favicon.ico',
        description: 'JavaScript运行时',
        sort_order: 2,
        is_active: 1
      }
    ];

    friendlinks.forEach((link) => {
      db.prepare(`
        INSERT INTO friendlinks (name, url, logo, description, sort_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(link.name, link.url, link.logo, link.description, link.sort_order, link.is_active);
    });

    console.log('Example data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}
