好的，我来写一个操作指南文档：

# Dify 项目分支管理指南

## 初始设置

1. Fork 原始仓库
   - 访问 https://github.com/langgenius/dify
   - 点击右上角的 "Fork" 按钮
   - 等待 fork 完成

2. 克隆你的 fork 仓库
```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/dify.git
cd dify

# 设置远程仓库
git remote set-url origin https://github.com/YOUR_USERNAME/dify.git
git remote add upstream https://github.com/langgenius/dify.git

# 验证远程仓库设置
git remote -v
```

3. 创建开发分支
```bash
git checkout -b bisicloud
```

## 日常开发流程

1. 在开发分支上进行修改
```bash
# 添加修改
git add .

# 提交修改
git commit -m "你的提交信息"

# 推送到你的 fork 仓库
git push origin bisicloud
```

2. 同步原始仓库更新
```bash
# 获取原始仓库的更新
git fetch upstream

# 切换到 main 分支
git checkout main

# 合并原始仓库的更新
git merge upstream/main

# 推送更新到你的 fork 仓库
git push origin main

# 切回开发分支
git checkout bisicloud

# 将更新合并到开发分支
git merge main
```

## 处理冲突

如果在合并时遇到冲突：

1. 查看冲突文件
```bash
git status
```

2. 手动解决冲突
   - 打开冲突文件
   - 寻找 `<<<<<<<`, `=======`, `>>>>>>>` 标记
   - 选择要保留的代码
   - 删除冲突标记

3. 提交解决的冲突
```bash
git add .
git commit -m "解决合并冲突"
```

## 备份修改（如需要）

1. 导出当前修改为补丁
```bash
# 导出最近一次提交
git format-patch -1 HEAD

# 导出最近多次提交（比如3次）
git format-patch -3 HEAD
```

2. 应用补丁
```bash
git am *.patch
```

## 注意事项

1. 在进行重要修改前，建议先同步原始仓库的更新
2. 定期同步原始仓库的更新，避免出现大量冲突
3. 提交信息要清晰明了，便于后续维护
4. 如果不确定操作是否正确，可以先创建分支备份

## 常用命令参考

```bash
# 查看当前状态
git status

# 查看分支列表
git branch

# 切换分支
git checkout <branch-name>

# 创建并切换分支
git checkout -b <branch-name>

# 查看提交历史
git log --oneline

# 取消本地修改
git checkout -- <file-name>

# 取消提交（保留修改）
git reset --soft HEAD^
```

需要我补充或详细解释某部分内容吗？
