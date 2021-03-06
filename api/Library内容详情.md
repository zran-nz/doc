![image](https://user-images.githubusercontent.com/1272280/174488191-ac15df12-cb57-4e10-8b70-21fbab975ad1.png)

### 获取内容详情接口

> 接口地址: https://dev.classcipe.com/classcipe/doc.html#/default/2.0-api/contentPreviewUsingGET
- 请求方式: GET
- 开发状态: 完成文档

> 接口返回数据
- 标题
- 描述
- Task Type
- 发布时间
- 封面图片
- 封面视频
- 所属大纲国家
- 所属学科
- 适用年龄
- 课件的标签
- PPT总页数
- PPT列表 (收费课件保护，可以免费看PPT前 20%，最少1页，最多3页)
  - id
  - PPT图片快照
- 大纲（课件大纲）
- 是否购买
  - 已购买的，不限制PPT快照数量
- 收藏数量
- 是否收藏
  - 登录的用户要判断是否收藏
- 作者信息
  - 昵称、头像、粉丝数量
  - 是否关注
    - 登录的用户需要判断是否已经关注
- 销量
- 原价
- 优惠价
- copy from (如果是拷贝的课件，需要显示，前端显示内容："作者名称/课件标题")
  - 原作者名称
  - 原课件标题
  - 点击链接：来源的课件链接
- 是否自学习课件
- 是否已经评价
- 子课件列表
  - 子课件 id, 标题, 价格, 封面

### 课件PPT列表接口
> 接口地址: 
- 请求方式: GET 课堂端提供
- 开发状态: 文档中


- PPT列表 (收费课件保护，可以免费看PPT前 20%，最少1页，最多3页)
  - PPT图片快照
  - PPT大纲
  - Bloom，KnowledgeDimensions 维度
  - PPT的标签（每个PPT对应的标签，切换PPT的时候需要显示对应的）
  - 指令动词、知识点标签
  - PPT的material（每个PPT对应的material，切换PPT的时候需要显示对应的）


### 内容评论列表接口
> 接口地址: https://dev.classcipe.com/classcipe/doc.html#/default/%E8%80%81%E5%B8%88%E5%AF%B9%E5%95%86%E5%93%81%E8%AF%84%E4%BB%B7%E4%BF%A1%E6%81%AF/queryPageListUsingGET_26
- 请求方式: POST
- 开发状态: 文档中

- 评论列表（Reviews）
  - 评论人 昵称，头像
  - 评论内容
  - 评论分数
  - 评论时间

### 课件购买接口

接口地址：https://dev.classcipe.com/classcipe/doc.html#/default/2.0-api/byeUsingPOST

> 购买后结算逻辑
1. 老师产出的自学习课件，前五次免费看，之后4，6分成，
2. 系统重组PPT，按ppt比例 再 4、6分成
3. Tip 付费视频 单独按 4、6分成
