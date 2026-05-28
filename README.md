# Press Gallery — 新闻精选集

VOGUE 杂志风格的新闻链接合集网站，纯静态，部署于 GitHub Pages。

## 本地预览

由于浏览器安全策略限制，直接打开 `index.html` 无法加载 JSON 数据。使用任意 HTTP 服务器即可预览：

```bash
# 方式一：Node.js（推荐）
npx serve -p 3000 -s .

# 方式二：Python
python3 -m http.server 3000
```

然后访问 `http://localhost:3000`。

## 部署到 GitHub Pages

1. 在 GitHub 上创建一个新仓库（例如 `press-gallery`）
2. 推送本地代码：

```bash
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git branch -M main
git push -u origin main
```

3. 进入仓库 Settings > Pages
4. "Build and deployment" → Source: "Deploy from a branch"
5. Branch: `main`，Folder: `/ (root)`，点击 Save
6. 等待 1-2 分钟，访问 `https://<你的用户名>.github.io/<仓库名>/`

## 管理文章

编辑 `data/articles.json`，按以下格式添加或删除文章：

```json
{
  "id": 21,
  "title": "文章标题",
  "summary": "一句话摘要，20-40字左右。",
  "date": "2026-05-28",
  "url": "https://原新闻链接.com/article",
  "category": "分类名",
  "image": "https://example.com/图片链接.jpg"
}
```

**注意：**
- `id` 保持唯一，建议递增
- `image` 可选，不填则显示灰色占位图
- JSON 格式严格：最后一项后面不能有逗号，所有字符串用双引号
- 修改后提交并推送，GitHub Pages 会自动更新

## 技术栈

HTML + CSS + 原生 JavaScript，零依赖，无构建步骤。
