import axios from 'axios';
import * as cheerio from 'cheerio';

export async function parseWebsiteInfo(url) {
  try {
    // 确保URL格式正确
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // 获取网站标题
    let title = $('title').text().trim();
    if (!title) {
      title = $('meta[property="og:title"]').attr('content') || '';
    }

    // 获取网站描述
    let description = $('meta[name="description"]').attr('content') || '';
    if (!description) {
      description = $('meta[property="og:description"]').attr('content') || '';
    }

    // 获取网站Logo
    let logo = '';
    
    // 尝试多种方式获取Logo
    const iconSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'meta[property="og:image"]',
      'link[rel="apple-touch-icon-precomposed"]'
    ];

    for (const selector of iconSelectors) {
      const element = $(selector).first();
      if (element.length) {
        const href = element.attr('href') || element.attr('content');
        if (href) {
          // 处理相对路径
          if (href.startsWith('//')) {
            logo = 'https:' + href;
          } else if (href.startsWith('/')) {
            const urlObj = new URL(url);
            logo = urlObj.origin + href;
          } else if (!href.startsWith('http')) {
            const urlObj = new URL(url);
            logo = urlObj.origin + '/' + href;
          } else {
            logo = href;
          }
          break;
        }
      }
    }

    // 如果没找到Logo，使用默认favicon路径
    if (!logo) {
      const urlObj = new URL(url);
      logo = urlObj.origin + '/favicon.ico';
    }

    return {
      title: title || 'Unknown',
      description: description || '',
      logo: logo
    };
  } catch (error) {
    console.error('Error parsing website:', error.message);
    // 返回基本信息
    const urlObj = new URL(url);
    return {
      title: urlObj.hostname,
      description: '',
      logo: urlObj.origin + '/favicon.ico'
    };
  }
}
