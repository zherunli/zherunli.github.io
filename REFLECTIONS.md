# 随笔内容维护

所有随笔都保存在 `js/reflections-data.js` 的 `window.REFLECTIONS` 数组中。

新增文章时，复制下面这个对象并放进数组。页面会自动生成栏目和标签筛选，并按日期从新到旧排列。

```js
{
  id: "unique-english-id",
  title: "随笔标题",
  date: "2026-06-15",
  category: "技术札记",
  tags: ["工程实践", "复盘"],
  sample: false,
  paragraphs: [
    "第一段正文。",
    "第二段正文。"
  ]
}
```

注意事项：

- `id` 必须唯一，建议使用小写英文和连字符。
- `category` 相同的文章会自动归入同一个栏目。
- `tags` 可以填写任意数量，重复标签会自动合并为一个筛选项。
- 正式发布自己的内容时，请设置 `sample: false`，页面将不再显示“示例”标记。
- 删除现有三个示例对象不会影响页面功能。
