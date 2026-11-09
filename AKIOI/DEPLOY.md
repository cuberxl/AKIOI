# 部署到 GitHub Pages

本地仓库已经初始化并提交完成（分支 `main`，1 个提交），只差最后的上传。

## 方式 A：把令牌交给助手（最省事）

在对话里发一个 GitHub Token，助手会完成：建仓库 → 推送 → 打开 Pages → 把网址回给你。

拿令牌的步骤：

1. 登录 GitHub，打开 <https://github.com/settings/tokens>
2. **Generate new token** → **Generate new token (classic)**
3. Note 随便填（如 `AKIOI 部署`），Expiration 选 **7 days**
4. **Select scopes** 只勾 **`repo`**
5. 拉到页面底部点 **Generate token**，复制 `ghp_` 开头的那串

> 这串字符只显示一次。用完后到同一页面 **Delete** 掉即可。

## 方式 B：自己动手，四步

### 1. 在网页上新建空仓库

打开 <https://github.com/new>：

- Repository name：`AKIOI`
- 选 **Public**
- **不要**勾 Add a README / .gitignore / license（保持空仓库）

点 **Create repository**。假设你的用户名是 `yourname`，仓库地址就是
`https://github.com/yourname/AKIOI.git`。

### 2. 在这个文件夹里推送

在 `AKIOI` 文件夹空白处按住 Shift 右键 → **在此处打开 PowerShell 窗口**，然后执行：

```powershell
git remote add origin https://github.com/yourname/AKIOI.git
git push -u origin main
```

- 第一次推送会弹窗要求登录：选 **Sign in with your browser** 最简单；
- 如果它要密码，把 `ghp_` 开头的 token 粘进去当密码用。

> 如果提示 `git: 命令未找到`，说明这台机器没装 Git，去 <https://git-scm.com/download/win> 装一个即可。

### 3. 打开 Pages

仓库页 → **Settings** → 左侧 **Pages**：

- Source 选 **Deploy from a branch**
- Branch 选 **main**，目录选 **/ (root)**
- 点 **Save**

### 4. 访问

等 1～2 分钟，打开：

```
https://yourname.github.io/AKIOI/
```

## 之后怎么改题单

1. 编辑 `tools/source.json`：结构是「章 → 节 → 主题 → 题号」，可以增删章、节、主题，或往主题里加题号（只写题号，标题和难度会自动抓取）。
2. 重新抓取题目信息（需要能访问洛谷）：

   ```powershell
   powershell -ExecutionPolicy Bypass -File tools/fetch-metadata.ps1
   ```

3. 重新生成站点数据与 README：

   ```powershell
   node tools/build.mjs
   ```

4. 提交并推送：

   ```powershell
   git add -A
   git commit -m "chore: 更新题单"
   git push
   ```

## 常见问题

**`git push` 报 403 / authentication failed**
令牌没权限或已过期。重新生成一个勾了 `repo` 的 token，在弹窗里当密码用。

**Pages 打开是 404**
检查 Settings → Pages 里分支是否 `main`、目录是否 `/ (root)`；首次部署需要等一两分钟，可以在 Actions 标签页看构建进度。

**页面能打开但没有题目**
浏览器控制台如果报 `data/problems.js` 加载失败，说明该文件没推上去，`git status` 检查一下它是否被提交。

**换成自己的用户名**
`README.md` 里的在线地址和 `docs/preview.png` 都是生成物；换用户名后把 README 里的
`cuberxl.github.io/AKIOI` 改成你的地址即可，其余无需改动。
