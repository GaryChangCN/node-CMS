# 模板说明
> 注释：
> 1. 以下内容为各模板的可编辑情况以及后端需返回的数据。
> 2. 每一项第一个名字对应 **zeplin** 的桌面设计图命名；在其后面的英文命名（index.html）对应页面的文件名；然后为可编辑的部分 **（不包括根据产品库显示的内容）**；最后为接口数据。
> 3. emoji 说明：
> 3.1 ⭕️ 页面可编辑 **（即可在后台页面版式中修改！）**
> 3.2 ❌ 页面不可编辑
> 3.3 🎱 页面根据产品库显示
> 3.4 ✔️ 接口已完成
> 3.5 ⛏ 接口编写中
> 3.6 🔆 模板完成



## 桌面-主页 index.html ⭕️ ✔️ 🔆
该页面除展示地图外，其他的都从后端返回。
可编辑部分：
1. 轮播
2. 三个展示（investors、centers、bowlers）

```js
{
    rotation:[ //首页轮播图PC端
        {
            link:"图片地址",
            alt:"图片alt值",
            altEn:"图片英文alt值",
            order:顺序,
            _id:"图片的_id"
        }
    ],
    rotationModile:[],//首页轮播图移动端，同上。
    investors:[ //首页 investors 信息
        {
            icon:{  //图标
                link:"图标地址",
                alt:"图标alt",
                altEn:"图标英文alt"
            },
            title:"标题",
            titleEn:"英文标题",
            content:"内容，里面可能有换行符\/n",
            contentEn:"中文内容",
            target:"跳转链接"
        }
    ],
    centers:[],//同上
    bowlers:[]//同上
}

```

## 桌面-产品菜单 nav.html ⭕️ ✔️
可编辑部分：
1. logo
2. 搜索框非激活态提示文字

**特殊extra说明**
* pinsetler 整套设备
* lane 球道板
* scroing 计分设备
* oiling 落油机

```js
{
    logo:{
        link:"",
        alt:"",
        altEn:"",
    },
    product:[ //产品信息，一级和二级
        {
            _id:"",// 一级的id
            name:"",
            englishName:"",
            children:[
                {
                    _id:"", //二级的id
                    name:"",
                    englishName:"",
                    extra:""//一般为空 但会有对应的特别项 参加上方加星号
                }
            ]
        }
    ],
    panelPicture:{  //下拉菜单的图片
        link:"",
        alt:"",
        altEn:""
    },
    placeholder:{ //搜索框的placeholder
        content:"",
        contentEn:""
    }
}
```

## 桌面-联系我们 contactus.html ⭕️ ✔️ 🔆
可编辑部分
1. 所有联系方式

```js
{
    contact:[  //联系方式数组 固定为三项 （三列）
        {
            title:"", // 每一项的标题
            titleEn:"",
            list:[  //每一列下的两个联系方式
                {
                    name:"",
                    englishName:"",
                    mobile:"",
                    email:""
                },
                                {
                    name:"",
                    englishName:"",
                    mobile:"",
                    email:""
                }
            ]
        }
    ]
}
```

## 桌面-整套设备频道页 equipment-list.html ⭕️ 🎱 ✔️
‼️ **仅整套设备对应此设计图，设备与系统下其他产品不对应该设计图** ‼️
可编辑内容
1. 即对预设的整套设备分组进行操作

```js
{
   pinsetler:{ //预设的整套设备分组
       _id:"",
       name:"",
       englishName:"",
       children:[{  //整套设备包含的商品
           {
               _id:"", //商品id
               name:"",
               englishName:"",
               description:"",
               englishDescription:"",
               media:[  //商品的图片集
                   _id:"",
                   alt:"",
                   altEn:"",
                   link:""
                }]
           }
       ]
   }
}
```

## 桌面-整套设备内页 equipment-detail.html ⭕️ 🎱 ✔️
‼️ **仅整套设备对应此设计图，设备与系统下其他产品不对应该设计图** ‼️
‼️ **每一种设备都要有一个可编辑的页面** ‼️
‼️ **BEST PRICE 清单需有商品 ID，又要可以添加项目** ‼️
**query传入\_id=整套设备商品的\_id**

```js
{
    data:{
        col:[   //整套设备页面上部的三列那个 这个是可编辑的有可能不等于三
            {
                link:"",
                alt:"",
                altEn:"",
                title:"",
                content:"",
                contentEn:""
            }
        ],
        ppt:[  //整套设备内页中部的PPT形式的展示
            {
                link:"",
                alt:"",
                altEn:"",
                title:"",
                content:"",
                contentEn:""
            }
        ],
        suggest:[  //底部的建议商品
            {
                _id:"",  //商品id
                number:"",  //一下是商品的简略信息 注意这里只有name和englishName
                name:"",
                englishName:""
            }
        ]
    }
}
```

## 桌面-工程 project.html ⭕️ ✔️ 🔆
可编辑内容：
1. 页面首图
2. 详细工程内容描述 + 案例简述 + 工程图片

```js
{
    projectBanner:{ //工程页面首图
        link:"",
        alt:"",
        altEn:""
    },
    projectList:[
        {
            icon: {
                link:"",
                alt: "",
                altEn: "",
                _id: ""  //图片的id
                },
                title: "",
                titleEn: "",
                content: "",
                contentEn: ""
        }
    ]
}

```

## 桌面-落油机/球道面板/计分和总台系统 equip-product.html ❌ 🎱 ✔️
‼️ **此设计图仅对应 设备与系统-落油机/球道面板/计分和总台系统的商品展示** ‼️

需要传入的query为?extra=xxx。 xxx含义如下
* pinsetler 整套设备 （可选的）
* lane 球道板
* scroing 计分设备
* oiling 落油机

```js
{
    extra:{ //extra值为上述中任意
        _id:"",
        name:"",
        englishName:"",
        extra:"",  //即传入值
        children:[  //整套设备包含的商品
            {
                _id:"", //商品id
                name:"",
                englishName:"",
                description:"",
                englishDescription:"",
                media:[{  //商品的图片集
                    _id:"",
                    alt:"",
                    altEn:"",
                    link:""
                }]
            }
        ]
    }
}
```

## 桌面-零件与养护/球俱部产品 part-product.html ❌ 🎱 ✔️
‼️ **此设计图仅对应 零件与养护/球道养护/球馆用品/球俱部用品** ‼️
‼️ **如为 1-2-商品的时候隐藏切换按钮** ‼️
‼️ **设计图的三个按钮为切换三级分类** ‼️

### 传入query值
second为二级分组的_id,
会返回此二级分组下的所有分组或者商品以及此分组所在的一级分组信息。

```js
{
    first:{
        _id:"",//当前二级目录的一级分组id
        name:"",
        englishName:"",
        type:""
    },
    second:{  //当前的二级分组
        _id:"",
        name:"",
        englishName:"",
        type:""
    },
    third:[
        {
            _id:"",
            name:"",
            type:"", //type 为 group或者product
            englishName:"", //为product显示
            description:"", //为product时候显示
            englishDescription:"", //为product时候显示
            media:[  //为product时候显示
                {
                    alt:"",
                    altEn:"",
                    link:"",
                    _id:""
                }
            ],
            children:[ //为group时候显示
                {
                    _id:"",
                    name:"",
                    type:"",
                    englishName:"",
                    description:"",
                    englishDescription:"",
                    media:[
                            {
                            alt:"",
                            altEn:"",
                            link:"",
                            _id:""
                        }
                    ]
                }
            ]
        }
    ]
}

```

## 桌面-球馆频道页 center.html ⭕️ ✔️ 🔆
可编辑部分
1. 首图
2. 球馆类型介绍及对应图片（设计图中的按钮为跳转到对应的球馆类型详细介绍页）
3. 可添加球馆类型

```js
{
    centerBanner:{ //球馆页面首图
        link:"",
        alt:"",
        altEn:""
    },
    channel:[  //球馆下面每个项目的数据
        {
            icon: {
                link:"",
                alt: "",
                altEn: "",
                _id: ""  //图片的id
                },
                title: "",
                titleEn: "",
                content: "",
                contentEn: "",
                index: //此值代表球馆”商品编号“ 跳转到球馆内页应该加上查询字符串？id=index值
            }
    ]
}
```

## 桌面-球馆内页 center-detail.html ⭕️ ✔️ 🔆
‼️ **每一种球馆都要有一个可编辑的页面** ‼️
‼️ **查询字符串为?id=xxx&language上面有描述** ‼️
按钮根据球馆类型添加
可编辑部分：
1. 球馆图片
2. 球馆案例轮播
3. 下载 pdf 的链接

```js

{
    indexThis:"",
    list:[
        {
                channel:{
                    icon: {
                        link:"",
                        alt: "",
                        altEn: "",
                        _id: ""  //图片的id
                    },
                    title: "",
                    titleEn: "",
                    content: "",
                    contentEn: "",
                    index: //此值代表球馆”商品编号“ 跳转到球馆内页应该加上查询字符串？id=index值
                },
                ppt:[
                    {
                        link:"",
                        alt:"",
                        altEn:"",
                        _id:""//图骗id
                    }
                ],
                rotation:[
                    {
                        link:"",
                        alt:"",
                        altEn:""
                    }
                ],
                link:""//下载文档连接
            }
        }
    ]
}

{
    ppt:[   //这里是球馆内页的上半部分图片
        {
            link:"",
            alt:"",
            altEn:"",
            _id:""   //图片的id
        }
    ],
    rotation:[  //球馆内页的轮播图
        {
            link:"",
            alt:"",
            altEn:""
        }
    ],
    link:""//下载连接
}

```


## 桌面-支持 support.html ⭕️ ✔️ 🔆
可编辑部分：
1. 头图
2. 中间对应的智库分类的简介


```js
{
    supportBanner:{ //页面首图
        link:"",
        alt:"",
        altEn:""
    },
   tech:[
        {
            icon:{
                link:"",
                alt:"",
                altEn:""
            },
            title:"",
            titleEn,
            content:"",
            contentEn:""
        }
   ]
}
```

## 桌面-技术智库频道 library.html ❌ ✔️ 🔆
左侧的菜单显示文章分类
右侧显示对应分类的文章标题


```js
{
    kind:[ //文章分类
        {
            name:"",
            englishName:"",
            _id:"",
            children:[ //此分类下所有文章的_id,以及title
                {
                    _id:"",
                    title:""
                }
            ]
        }
    ]
}
```

## 桌面-智库文章 内页article.html ❌ ✔️ 🔆
‼️ 特别说明：可在后台添加文章以及文章的 pdf 下载链接

```js
{
    title:"",
    _id:"",
    content:"",
    time:""  //时间 Date类型,
    link:""  //下载外链地址
}
```

## 桌面-我的询单 quote.html ❌ ✔️
需要返回页面的 title 和 chinese 以及发送询单接口

## 桌面-搜索 search.html ❌ ✔️
需要返回页面的 title 和 chinese 以及搜索接口

###搜索api
url:"/api/search?keywords"
使用url query方式，
返回值

```js
{
    productList:[
        {
            _id:"",
            name:"",
            englishName:"",
            description:"",
            englishDescription:"",
            number:"",
            media:[
                //这里是图片的id
            ]
        }
    ],
    articleList:[
        {
            _id:"",
            link:"",//下载按钮连接地址,
            time:"", //Date类型
            title:"",
            content:""
        }
    ]
}
```

## 桌面-底部 footer.html ❌ 🔆

