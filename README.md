# valine-to-disqus

Migrate comments from valine to disqus.

将 Valine 评论数据转换为 Disqus 可导入的格式。

## Usage

### 前情提要

数据准备参见：[如何从 Valine 迁移至 Disqus](https://www.yunyoujun.cn/posts/migrate-from-valine-to-disqus/)

覆盖 `data/valine-comment.json` 文件，或者修改 `src/config.js` 中的 `path` 配置项。

转换后的内容位于 `converted` 文件夹。

### 安装

```sh
yarn
# npm install
```

因为用到了一个 dayjs 的库用来处理时间格式。

> 虽然也用了 md5，用来拼接 URL 获取 Gravatar 头像链接。
> 但头像只能配置过 [SSO](https://help.disqus.com/en/articles/1717160-integrating-single-sign-on) 才能使用。

### 转换格式

```sh
yarn convert
# npm run convert
```

> [Custom XML Import Format | Disqus](https://help.disqus.com/en/articles/1717222-custom-xml-import-format)

[Disqus 导入地址](https://import.disqus.com/)

## 配置

| 名称         | 描述                                                                                       | 默认（示例）                 |
| ------------ | ------------------------------------------------------------------------------------------ | ---------------------------- |
| site         | 站点 URL                                                                                   | `https://www.yunyoujun.cn`   |
| path.comment | Valine Comment 数据路径                                                                    | `./data/valine-comment.json` |
| path.counter | Valine Counter 数据路径                                                                    | `./data/valine-counter.json` |
| sso          | 是否有配置过 [SSO](https://help.disqus.com/en/articles/1717160-integrating-single-sign-on) | false                        |

## 项目结构

| 名称      | 说明                                         |
| --------- | -------------------------------------------- |
| data      | 放的是评论和计数器数据（我随便放了几个示例） |
| converted | 被转换后的数据                               |
