# 使用说明

1. 克隆代码
    ``` bash
    cd "your path" # cd到你要放的目录
    git clone https://github.com/anxunsi/TIC-Library.git # 使用cygwin或者git bash
    ```
	
	**如果小程序运行正常，请忽略下面几点**
2. 用微信开发助手打开项目
3. 点击云开发

   ![cloud dev](cloud-dev.JPG)

   如果没有申请云开发，申请
4. 创建一个环境，复制一下环境ID
   
   ![create env](create-env.JPG)
5. 修改app.js里的env为自己的环境ID
   
   ![change env1](change-env.JPG)

   ![change env2](env-changed.JPG)
6. 在云开发里创建四个叫"publish", "sell", "buy", "userInfo"的collection

   publish的权限设置那里要设为所有人可读

   ![create collection](create-collection.png)
   

**注意**如果控制台提示"wx-server-sdk"找不到，请cd到cloudfunctions，分别cd到login和update文件夹下，查看有无"node_modules"文件夹，如果有直接跳下一步上传，否则输入```npm uninstall --save wx-server-sdk@latest```(需要安装node.js和npm，请自行百度)，然后在开发者工具两个文件夹右键-"上传所有文件"。

# 开发指引

## 开发计划

### 分工

- 首页、书籍详情、搜索、发布、发布详情    陈梓健、赵钰腾
- 用户中心、我买到的、我的发布、我卖出的、关于    古陶睿
- UI整体设计    周韬

## 数据库对象

在**云开发控制台**中可以管理数据库。数据库顾名思义就是存一条条数据的。在小程序中，一个**集合**就是一个数据库。集合中的记录就是存储的数据。

    每条记录都有一个 _id 字段用以唯一标志一条记录、一个 _openid 字段用以标志记录的创建者，即小程序的用户。需要特别注意的是，在管理端（控制台和云函数）中创建的不会有 _openid 字段，因为这是属于管理员创建的记录。开发者可以自定义 _id，但不可自定义和修改 _openid 。_openid 是在文档创建时由系统根据小程序用户默认创建的，开发者可使用其来标识和定位文档。

本小程序集合描述如下（不包括_id和_openid）：

### userinfo

存储用户信息

|address|birthday|gender|introduce|phone|
|--|--|--|--|--|
|地址|生日|性别|简介|电话|

### publish

存储发布书籍的信息

|bookInfo|bookNumber|bookSale|date|imageID|saler|
|--|--|--|--|--|--|
|bookInfo对象（见下）|书籍数量|卖出数量|发布日期|卖家上传图片链接|卖家昵称|

```js
// 从豆瓣图书api获取的书籍信息
bookInfo = {
    alt: 图书链接,
    alt_title: 链接名, // 同原作名
    author: 作者, // 数组，可能有多个作者
    author_intro: 作者简介,
    binding: 装帧,
    catalog: 目录,
    id: 图书在豆瓣的id,
    image: 显示的图片, // 中等大小
    images: {
        // 图书不同压缩质量的图片链接
        large: 大图,
        medium: 中等大小图片,
        small: 小图
    },
    isbn10: ISBN-10格式,
    isbn13: ISBN-13格式,
    origin_title: 原作名,
    pages: 页数,
    price: 价格,
    pubdate:出版时间,
    publisher: 出版社,
    rating: {
        average: 平均分,
        max: 最高分,
        min: 最低分,
        numRaters: 评分人数
    },
    subtitle: 副标题,
    summary: 内容简介,
    tags: 标签, // 数组
    title: 书名,
    translator: 翻译, // 数组
    url: 访问api的url
}
```

### sell

存储卖出信息

|image|saleDate|saleNumber|salePrice|saler|title|
|--|--|--|--|--|--|
|封面图片|出售日期|出售数量|价格|卖家昵称|书名|

### buy

存储买入信息

|image|buyDate|buyNumber|buyPrice|saler|title|
|--|--|--|--|--|--|
|封面图片|买入日期|买入数量|价格|买家昵称|书名|

-----

### 修改方案

- 删除sell和buy
- userInfo修改为：

    |~~address~~|~~birthday~~|~~gender~~|~~introduce~~|phone|***name***|***wechat***|
    |--|--|--|--|--|--|--|
    |~~地址~~|~~生日~~|~~性别~~|~~简介~~|电话|***名称***|***微信***|

- publish修改为：

    |bookInfo|bookNumber|~~bookSale~~ ***bookAvailable***|date|imageID|~~saler~~|
    |--|--|--|--|--|--|
    |bookInfo对象|书籍数量|***可借数量***|发布日期|附加图片链接|~~卖家昵称~~|

- 增加lend中间表记录借阅信息：

    |publish_id|borrower_id|lendDate|expireDate|returned|
    |--|--|--|--|--|
    |书籍id|借阅者id|借阅日期|借阅到期日期|是否已还|

## 借还书流程

1. 点击进入书籍详情页
2. 点击“立即借阅”：
    - 增加一条lend数据
    - 该publish数据的bookAvailable--
3. 在书籍详情页点击“立即还书”：
    - 将该lend数据的returned改为true
