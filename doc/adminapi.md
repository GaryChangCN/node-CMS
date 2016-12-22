## 管理系统后台API接口说明
---
## host
host 是localhost:3000 上线时候会用nginx代理在admin.xxxx.com

## 页面

| 接口地址      |    类型      |   接受数据 | 返回数据           |          说明        |
| :----------: | :---------: | :----: | :-----: | :------------------: |
| /     |     GET     |        null       |  主页面 |           获取登录页面 |
| /api/verify          |       GET     |        null  | base64 |  获取验证码  |
|/api/login |     POST    |  {username:用户名,password:密码,verify:验证码} | {err:verify/auth/false,limit:[]}  | 错误信息or登陆成功,limit为权限数组  |
|/api/group | POST | {name:分组名,englishName:分组英文名选填,stage:first/second/third/product,parent:选填,product:stage为product时候填写} | {err:错误信息/false,state:true/false} | 添加分组>>返回值state代表验证是否通过，不通过应当跳转到登陆,stage为几级分组值可为first、second、third，当值不为first时候应该填写parent的\_id。</br> >>>添加商品到分组 stage为product，并填写product为商品的\_id,以及parent为分组的\_id </br> >>>从分组下架商品 stage为shelve，并填写product为商品的\_id,以及parent为分组的\_id|
|/api/group/:\_id  |GET| url params 里\_id为要查看此分组的\_id，若要获取以及分组列表，\_id为'first'即可 , |{err:错误信息,state:true/false,list:[{_id:分组 _id,name/english:中文或英文名,type:类型,order:顺序}]}|获取分组 |
|/api/group|DELETE| {\_id:要删除的目录的\_id,stage:first/second/third,parent:选填}|{err:错误信息/false,state:true/false}|删除分组>>stage parent 值同上|
|/api/group|UPDATE|{\_id:要修改的目录的\_id,change：{}}|{err:错误信息/false,state:true/false}|url传入是修改的分组 _id，change是要更新的值支持name\englishName\order，注意change对象一定是json写法即属性用引号包裹！！|
|/api/media|POST|form-data {file:文件(type为video不填),name:中文名,englishName:英文名,type:picture/video,link:video地址(type为picture不填)}|{err:错误信息/false,state:true/false}|当type为picture时候,需要返回的file值以及info值,info值始终为一个数组数组每项为这种形式{name:"",englishName}，当file为多个文件的时候info数组的顺序应当和file文件顺序相同，并且info需要用JSON.stringify后，当type为video时候需要返回link:外链地址,name,englishName|
|/api/media|DELETE|{\_id:"要删除的图片id"} |{err:错误信息/false,state:true/false}|这里会删除此图片，若有项目引用了此图片一样会失效，建议做个全局的图片error替换|
|/api/media|UPDATE|{\_id:"要修改的图片id",change:{englishName:"",name:""}} |{err:错误信息/false,state:true/false}|change是一个JSON.stringify后的字符串，仅能修改name,和englishName|
|/api/media/count/:kind|GET| params:{kind:picture/video}|{err:错误信息/false,state:true/false,sum:总个数}|查询资料库某种类型资料总数传入params的kind为picture或video，返回的是总个数，前端决定如何分页|
|/api/media/id/:_id| GET|parmas{\_id:\_id}|{err:错误信息/false,state:true/false,media:此媒体详细信息}|根据\_id获取具体媒体的信息|
|/api/media/get/:kind/:limit/:skip|GET|params:{kind:picture/video,limit:限制个数,skip:从哪里开始}|{err:错误信息/false,state:true/false,list:[媒体信息数组]}|默认返回是按着上传时间倒叙返回limit是限制返回的数据个数，skip是从哪里开始返回。例如limit(10);skip(0)是第1~10文档 limit(10);skip(10)是11~20文档|
|/api/media/search/:keywords|GET|params:{keywords:关键字}|{err:错误信息/false,state:true/false,list:[媒体信息数组]}|默认返回是按着上传时间倒叙,不分页，在中文名和英文名中查找|
|/api/user|GET|null|{err:错误信息/false,state:true/false,list:[{\_id:\_id,username:username,limit:[],superUser}]}|返回的用户信息数组项中无密码前端应用*号表示，其中superUser无法被删除，应当特殊标识，而且superUser只有唯一个为初始化超级管理员时候生成，limit为权限设定，详细见权限说明.md|
|/api/user|POST|{username:username,password:password,limit:[]}|{err:"出现错误/username",state:true/false,\_id:刚添加的商品的\_id}|添加管理员，limit为数组，每一项对应着相应模块权限且每一项必须为数字类型！！！！，返回值为err:username代表已存在此用户名。|
|/api/user|DELETE|{\_id:\_id}|{err:"错误/cannot delete superUser",state:true/false}|删除管理员  删除超级管理员时会提示不能删除，前端应当不设置删除超级管理员按钮|
|/api/user|PUT|{\_id:\_id,change:{username:用户名,password:密码,limit:[权限数组]}}|{err:"出现错误/username",state:true/false}|更新管理员信息，change为更新数组，需要JSON.stringify()|
|/api/product|POST|{brand:品牌,name:商品名,englishName:englishname,description:中文介绍,englishDescription:english desciption,media:[],parent:[],order:50,number:商品编号}|{err:"出现错误/商品编号重复",state:true/false}|上架商品 media是一个数组数组元素为媒体（图片/视频）的\_id，parent为要上架到的分组的\_id,为字符串|
|/api/product/count|GET|null|{err:出现错误/false,state:true/false,sum:总数}|用于前端判断分页|
|/api/product/get/:limit/:skip|GET|params:{kind:picture/video,limit:限制个数,skip:从哪里开始}|{err:错误信息/false,state:true/false,list:[商品信息数组]}|默认返回是按着上传时间倒叙返回limit是限制返回的数据个数，skip是从哪里开始返回。例如limit(10);skip(0)是第1~10文档 limit(10);skip(10)是11~20文档|
|/api/product/search/:keywords|GET|params:{keywords:关键字}|{err:错误信息/false,state:true/false,list:[商品信息数组]}|默认返回是按着上传时间倒叙,不分页,默认在品牌和中文名和英文名中查找关键字|
|/api/product/id/:\_id|GET|params:{\_id:\_id}|{err:错误信息/false,state:true/false,list:{商品信息对象}}|按\_id返回商品信息|
|/api/product/id2/:\_id|GET|params:{\_id:\_id}|{err:错误信息/false,state:true/false,list:{商品信息对象}}|按\_id返回商品信息---简化版，只返回名字和编号以及图片id|
|/api/product/where/:\_id|GET|params:{\_id:\_id}|{err:错误信息/false,state:true/false,list:[分组列表对象数组]|按\_id查询商品存在于哪些分组中|
|/api/product|UPDATE|{\_id:\_id,change:{}}|{err:错误信息/false,state:true/false}|更新商品,change唯一个要更新对象 例如要更新name和parent,change应该为{"name":"newname","parent":[id1,id2]}  注意change对象一定是json写法即属性用引号包裹！！另外，修改图片数组时候应当传入一个完整数组，修改图片顺序亦然</br>>>>上架下架/显示隐藏商品，即是更新show字段为true或false，默认为false（不显示/下架）|
|/api/product|DELETE|{\_id:\_id}|{err:错误信息/false,state:true/false}|删除商品|
|/api/order|POST|{customerName:顾客名字,customerContact:联系方式,customerBoard:客户备注,customerProduct:[],money:USD/RMB/RM/HKD}|{err:错误/false}|创建订单，无需权限验证，其中customerProduct为数组，数组每项为json格式的对象（属性带引号）例如{"\_id":商品的\_id,"count":客户选择改商品数量}|
|/api/order/count/:type|GET|type为unhandled/processed/failed/sale/recycle/delivery|{err:"错误"/false,state:true/false,count:此类型个数}|获取相迎类型订单个数  做分页使用 type为订单类型，分别对应未处理询价、已处理询价、未成功交易、销售发票、回收站、发货清单|
|/api/order/get/:type/:limit/:skip|GET|type:同上,limit:limit:限制个数,skip:从哪里开始|{err:错误信息/false,state:true/false,list:[订单信息数组]}|分页获取订单 默认返回为客户下订单时间倒序的对象，分页根据skip和limit，对象内容为{"\_id": "订单的\_id","customerContact": "客户联系方式","money": "客户选择的币种","customerProduct": [{\_id:商品\_id,count:此商品够买个数,price:单价默认为0由管理员设置,product:{商品信息数组},singleSum:小计，默认为0由管理员设置单价后生成}],"customerTime": "客户下单时候的时间对象","customerBoard": "客户备注","customerName": "顾客姓名","sum": 含税总价格,"time": "管理员上次修改订单时间对象","discount": 折扣, "tax": 税额,"star": false（是否为星标）,"adminBoard": "管理员备注","saleManager": "销售经理名字","where": "delivery/unhandled/.....",title:"表单名",customerCompany:"客户公司名客服填写"}|
|/api/order/search/:type/:keywords|GET|params:{keywords:关键字,type:'unhandled/processed...等'}|{err:错误信息/false,state:true/false,list:[订单信息数组]}|按类型搜索表单，keywords关键字只能在客户联系方式和客户姓名中检索以及公司名|
|/api/order/id/:\_id|GET|\_id 表单id |{err:错误信息/false,state:true/false,list:{订单信息对象}|根据id获取表单信息|
|/api/order|DELETE|{\_id:订单id}|{err:错误信息/false,state:true/false}|删除回收站中订单 删除非回收站中订单会提示错误|
|/api/head|POST|{name:抬头公司名,address:抬头公司地址,contact:抬头公司联系方式}|{err:错误信息/false,state:true/false}|新建抬头|
|/api/head|GET|null|{err:错误信息/false,state:true/false,list:[抬头数组]}|获取抬头|
|/api/head|DELETE|{\_id:\_id}|{err:错误信息/false,state:true/false}|删除抬头|
|/api/head|UPDATE|{\_id:\_id,change:同上}|{err:错误信息/false,state:true/false}|更新抬头|
|/api/media/pic/图片名|GET|null|图片|express静态资源|
|/api/getsuggest|GET|null|{suggestList:[{_id:"",suggest1:[],suggest2:[],suggest3:[]]}|验证推荐是否更新|