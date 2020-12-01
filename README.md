# 中级软件实作作业。

前端：public、views

后端：app.js、router、db、test



### 命名规则

---

[驼峰式命名法](https://baike.baidu.com/item/%E9%AA%86%E9%A9%BC%E5%91%BD%E5%90%8D%E6%B3%95/7794053?fr=aladdin)。



### 运行

---

`node app.js`



### 模块

---

**用户模块**

* 注册
* 登录

**订单模块**

* 查询订单
* 删除订单
* 确认收货，订单状态：未完成 => 已完成

**购物车模块** `cart`

* 加入图书 `addBook`
* 删除图书 `deleteBook`
* 图书数量加1 `addOneBook`
* 图书数量减1 `minusOneBook`
* 修改图书数量 `modifyBookNum`
* 计算被选中的图书的价格 `calcTotalPrice`
* 结算（清空购物车、创建订单）`checkout`
* 返回用户的购物车 `getUserCart`

**图书模块** `book`

* 返回所有图书 `findAll`
* 关键字搜索 `searchByKey`
* 标签搜索 `searchByTag`



### 其他

---

上传时，记得忽略 IDE 配置文件。

