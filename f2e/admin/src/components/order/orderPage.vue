<template>
  <div id="orderPage">
    <div class="controllBar">
      <p v-bind:style="{visibility:controlShow?'visible':'hidden'}">{{_id}}</p>
      <div>
      <el-button class="control" v-show="controlShow" v-bind:icon="load" @click.native="pdf" size="mini"></el-button>    
      <el-button class="control" v-show="controlShow" icon="d-caret" @click.native="toggleLanguage" size="mini"></el-button>
      <el-button class="control" v-show="controlShow" icon="check" @click.native="controlShow=false" size="mini"></el-button>
      <el-button class="control" v-show="!controlShow" icon="edit" @click.native="controlShow=true" size="mini"></el-button>
      </div>
    </div>
    <div class="head">
      <el-button class="control" v-show="controlShow" @click.native="open('head')" icon="edit" size="mini"></el-button>
      {{setContent.info.head[0]}}</br>{{setContent.info.head[1]}}</br>{{setContent.info.head[2]}}
    </div>
    <div class="top">
      <div class="title">
        <el-button class="control" v-show="controlShow" @click.native="open('title')" icon="edit" size="mini"></el-button>
        {{setContent.info.title}}
      </div>
      <div class="extra">
        <div class="number">
          <span class="f">
              <span v-show="!toggleEnglish">编号：</span>
              <span v-show="toggleEnglish">No.:</span>
              <el-button class="control" v-show="controlShow" @click.native="open('number')" icon="edit" size="mini"></el-button>
          </span>
          <span class="s">{{setContent.info.number}}</span>
        </div>
        <div class="saleManager">
          <span class="f">
              <span v-show="!toggleEnglish">销售经理：</span>
              <span v-show="toggleEnglish">Sales Manager:</span>
              <el-button class="control" v-show="controlShow" @click.native="open('saleManager')" icon="edit" size="mini"></el-button>
              </span>
          <span class="s">{{setContent.info.saleManager}}</span>
        </div>
        <div class="time">
          <span class="f" v-show="!toggleEnglish">日期：</span>
          <span class="f" v-show="toggleEnglish">Date:</span>
          <span class="s">{{setContent.info.time}}</span>
        </div>
        <div class="money">
          <span class="f">
              <span v-show="!toggleEnglish">币种：</span>
              <span v-show="toggleEnglish">Currency:</span>
              <el-button class="control" v-show="controlShow" @click.native="open('money')" icon="edit" size="mini"></el-button>
              </span>
          <span class="s">{{setContent.info.money}}</span>
        </div>
      </div>
      <div class="info">
        <div class="customerCompany">
          <span class="f">
                          <span v-show="!toggleEnglish">公司全称：</span>
                          <span v-show="toggleEnglish">Client</span>
                          <el-button class="control" @click.native="open('customerCompany')" v-show="controlShow" icon="edit" size="mini"></el-button>
                      </span>
          <span class="s">
                          {{setContent.info.customerCompany}}
                      </span>
        </div>
        <div class="customerName">
          <span class="f">
                          <span v-show="!toggleEnglish">客户：</span>
                          <span v-show="toggleEnglish">Attn</span>
                          <el-button class="control" @click.native="open('customerName')"  v-show="controlShow" icon="edit" size="mini"></el-button>
                      </span>
          <span class="s">
                          {{setContent.info.customerName}}
                      </span>
        </div>
        <div class="customerContact">
          <span class="f">
                          <span v-show="!toggleEnglish">联系方式：</span>
                          <span v-show="toggleEnglish">Contact:</span>
                          <el-button class="control" @click.native="open('customerContact')"  v-show="controlShow" icon="edit" size="mini"></el-button>
                      </span>
          <span class="s">
                          {{setContent.info.customerContact}}
                      </span>
        </div>
      </div>
    </div>
    <div class="middle">
      <div class="table">
        <el-table :data="setContent.info.customerProduct" style="width: 100%" border>
          <el-table-column prop="index2" v-bind:label="toggleEnglish?'No.':'序号'" align="center" width="50">
          </el-table-column>
          <el-table-column inline-template v-bind:label="toggleEnglish?'Product Name':'产品名'" align="center">
              <div>
              <el-button class="control" type="danger" v-show="controlShow" @click.native="open('delete',row)" icon="delete" size="mini"></el-button>
              <span>{{row.name}}</span>
            </div>
          </el-table-column>
          <el-table-column prop="number" v-bind:label="toggleEnglish?'Product No.':'产品编号'" align="center" width="90">
          </el-table-column>
          <el-table-column inline-template v-bind:label="toggleEnglish?'Product Picture':'产品图'" align="center" width="150">
            <img v-bind:src="row.media" :alt="row.media">
          </el-table-column>
          <el-table-column inline-template v-bind:label="toggleEnglish?'Unit Price':'单价'" align="center" width="100">
            <div>
              <span>{{setContent.info.money+' '+row.price}}</span>
              <el-button class="control" v-show="controlShow" @click.native="open('price',row)" icon="edit" size="mini"></el-button>
            </div>
          </el-table-column>
          <el-table-column inline-template v-bind:label="toggleEnglish?'Quantity':'数量'" align="center" width="70">
            <div>
              <span>{{row.count}}</span>
              <el-button class="control" v-show="controlShow" @click.native="open('count',row)" icon="edit" size="mini"></el-button>
            </div>
          </el-table-column>
          <el-table-column inline-template v-bind:label="toggleEnglish?'Subtotal':'小计'" align="center" width="100">
              <span>{{setContent.info.money+' '+row.singleSum}}</span>
          </el-table-column>
        </el-table>
      </div>
      <div class="add">
          <el-button icon="plus" v-show="controlShow" @click.native="dialogAddShow=true"></el-button>
      </div>
      <div class="calu">
        <div>
          <div class="f w" v-show="!toggleEnglish">合计：{{setContent.info.money}}&nbsp;</div>
          <div class="f w" v-show="toggleEnglish">Total(excl tax):{{setContent.info.money}}&nbsp;</div>
          <div class="s">{{setContent.info.sum}}</div>
        </div>
        <div>
          <div class="f w" v-show="!toggleEnglish">税额：{{setContent.info.money}}&nbsp;</div>
          <div class="f w" v-show="toggleEnglish">Tax:{{setContent.info.money}}&nbsp;</div>
          <div class="s">
            <el-button class="control" @click.native="open('tax')" v-show="controlShow" icon="edit" size="mini"></el-button>{{setContent.info.tax}}</div>
        </div>
        <div>
          <div class="f w" v-show="!toggleEnglish">折扣：{{setContent.info.money}}&nbsp;</div>
          <div class="f w" v-show="toggleEnglish">Discount:{{setContent.info.money}}&nbsp;</div>
          <div class="s">
            <el-button class="control" @click.native="open('discount')" v-show="controlShow" icon="edit" size="mini"></el-button>{{setContent.info.discount}}</div>
        </div>
        <div>
          <div class="f w" v-show="!toggleEnglish">含税总价：{{setContent.info.money}}&nbsp;</div>
          <div class="f w" v-show="toggleEnglish">Total(incl tax):{{setContent.info.money}}&nbsp;</div>
          <div class="s">{{setContent.info.bigSum}}</div>
        </div>
      </div>
      <div class="board">
        <div>
          <span class="f" v-show="!toggleEnglish">客户备注：</span>
          <span class="f" v-show="toggleEnglish">Client's note：</span>
          <div class="s auto-height">
            <el-button class="control" @click.native="open('customerBoard')" v-show="controlShow" icon="edit" size="mini"></el-button>{{setContent.info.customerBoard}}</div>
        </div>
        <div>
          <span class="f" v-show="!toggleEnglish">管理员备注：</span>
          <span class="f" v-show="toggleEnglish">Sales manager's note：</span>
          <div class="s auto-height">
            <el-button class="control" @click.native="open('adminBoard')" v-show="controlShow" icon="edit" size="mini"></el-button>{{setContent.info.adminBoard}}</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="confirm">Confirmation</div>
      <div class="b">
        <div class="left">
          <div>Seller:</div>
          <div>Company chop:</div>
          <div>Date:</div>
        </div>
        <div class="right">
          <div>Buyer:</div>
          <div>Company chop:</div>
          <div>Date:</div>
        </div>
      </div>
    </div>
    <!--添加的dialog-->
    <el-dialog title="选择商品" v-model="dialogAddShow">
        <ProductListComponent></ProductListComponent>
    </el-dialog>
    <!--修改的dialog-->
    <el-dialog title="修改" v-model="dialogShow" size="small">
      <!--input  表单-->
      <el-form :model="inputModel" :rules="inputRule" ref="inputRef" v-show="change.inputShow">
        <el-form-item label="旧值" prop="old">
          <el-input v-model="inputModel.old" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="新值" prop="new">
          <el-input v-model="inputModel.new"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="preUpdate">修改</el-button>
          <el-button @click.native.prevent="dialogShow=false">取消</el-button>
        </el-form-item>
      </el-form>
      <!--select 表单-->
      <el-form :model="selectModel" :rules="selectRule" ref="selectRef" v-show="change.selectShow">
        <el-form-item label="旧值" prop="old">
          <el-input v-model="selectModel.old" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="选择" prop="new">
          <el-select v-model="selectModel.new">
            <el-option v-for="item in options" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="preUpdate">修改</el-button>
          <el-button @click.native.prevent="dialogShow=false">取消</el-button>
        </el-form-item>
      </el-form>
      <!--number 表单-->
      <el-form :model="numberModel" :rules="numberRule" ref="numberRef" v-show="change.numberShow">
        <el-form-item label="旧值" prop="old">
          <el-input v-model="numberModel.old" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="新值" prop="new">
          <el-input v-model="numberModel.new"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="preUpdate">修改</el-button>
          <el-button @click.native.prevent="dialogShow=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
    import {
        mapActions
    } from 'vuex';
    import CONFIG from '../../config';
    import ProductListComponent from '../product/ProductListComponent';
    export default {
        name: "orderPage",
        data() {
            return {
                load: "document",
                toggleEnglish: false,
                dialogAddShow: false,
                controlShow: false,
                dialogShow: false,
                options: [],
                change: {
                    type: null,
                    ref: null,
                    index: null,
                    inputShow: false,
                    selectShow: false,
                    numberSHow: false
                },
                inputRule: {
                    new: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }]
                },
                numberRule: {
                    new: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }, {
                        validator: function(rule, value, callback) {
                            if (value != null && value != "" && !isNaN(value)) {
                                callback();
                            } else {
                                callback(new Error('请输入数字值'));
                            }
                        }
                    }]
                },
                selectRule: {
                    new: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blue'
                    }]
                },
                inputModel: {
                    old: null,
                    new: null
                },
                numberModel: {
                    old: null,
                    new: null
                },
                selectModel: {
                    old: null,
                    new: null
                },
                setContent: {
                    info: {
                        head: [],
                        title: null,
                        saleManager: null,
                        time: null,
                        money: null,
                        customerCompany: null,
                        customerName: null,
                        customerContact: null,
                        customerBoard: null,
                        adminBoard: null,
                        littleSum: null,
                        tax: null,
                        discount: null,
                        sum: null,
                        customerProduct: []
                    }
                }
            }
        },
        components: {
            ProductListComponent
        },
        props: ['id'],
        computed: {
            _id: function() {
                if (this.id) {
                    this.get();
                }
                return this.id;
            }
        },
        methods: {
            pdf() {
                var _this = this;
                var tmp = {
                    title: _this.setContent.info.title,
                    head: _this.setContent.info.head,
                    number: _this.toggleEnglish ? 'No.:' : '编号：',
                    numberValue: _this.setContent.info.number,
                    saleManager: _this.toggleEnglish ? 'Sales Manager:' : '销售经理：',
                    saleManagerValue: _this.setContent.info.saleManager,
                    date: _this.toggleEnglish ? 'Date:' : '日期：',
                    dateValue: _this.setContent.info.time,
                    money: _this.toggleEnglish ? 'Currency:' : '币种：',
                    moneyValue: _this.setContent.info.money,
                    company: _this.toggleEnglish ? 'Client:' : '公司全称：',
                    companyValue: _this.setContent.info.customerCompany,
                    customer: _this.toggleEnglish ? 'Attn:' : '客户：',
                    customerValue: _this.setContent.info.customerName,
                    contact: _this.toggleEnglish ? 'Contact:' : '联系方式：',
                    contactValue: _this.setContent.info.customerContact,
                    index: _this.toggleEnglish ? 'No.' : '序号',
                    productName: _this.toggleEnglish ? 'Product Name' : '产品名',
                    productNumber: _this.toggleEnglish ? 'Product No.' : '产品编号',
                    productPicture: _this.toggleEnglish ? 'Product Picture' : '产品图',
                    productPrice: _this.toggleEnglish ? 'Unit Price' : '单价',
                    productCount: _this.toggleEnglish ? 'Quantity' : '数量',
                    productSingleSum: _this.toggleEnglish ? 'Subtotal' : '小计',
                    tableList: _this.setContent.info.customerProduct,
                    sum: _this.toggleEnglish ? 'Total(excl tax):' : '合计：',
                    sumValue: _this.setContent.info.sum,
                    tax: _this.toggleEnglish ? 'Tax:' : '税额：',
                    taxValue: _this.setContent.info.tax,
                    discount: _this.toggleEnglish ? 'Discount:' : '折扣：',
                    discountValue: _this.setContent.info.discount,
                    bigSum: _this.toggleEnglish ? 'Total(incl tax):' : '含税总价：',
                    bigSumValue: _this.setContent.info.bigSum,
                    board: _this.toggleEnglish ? "Client's note:" : '客户备注：',
                    boardValue: _this.setContent.info.customerBoard,
                    adminBoard: _this.toggleEnglish ? "Sales manager's note:" : '管理员备注：',
                    adminBoardValue: _this.setContent.info.adminBoard
                }
                _this.load = "loading";
                _this.axios.post(CONFIG.API + 'pdf', tmp).then(function(value) {
                    _this.processBarBegin();
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.processBarEnd();
                        window.open(CONFIG.API + 'media/pdf/' + json.name);
                        _this.load = "document";
                    } else {
                        throw '更新失败';
                    }
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                });
            },
            selectProduct(obj) {
                var _this = this;
                _this.dialogAddShow = false;
                var tmp = {
                    price: 0,
                    count: 0,
                    singleSum: 0,
                    number: obj.number,
                    productId: obj._id
                }
                _this.setContent.info.customerProduct.push(tmp);
                var sum = new Number();
                var t = _this.setContent.info.customerProduct.map(function(e) {
                    sum = sum + parseFloat(e.singleSum);
                    return {
                        price: e.price,
                        singleSum: e.singleSum,
                        count: e.count,
                        productId: e.productId
                    }
                });
                _this.update('add', {
                    customerProduct: t,
                    sum: sum
                });
            },
            openConfirm() {
                var _this = this;
                this.$confirm('此操作将永久删除此项, 是否继续?', '提示', {
                    type: 'warning'
                }).then(function() {
                    _this.preUpdate('delete');
                });
            },
            open(type, row) {
                var _this = this;
                this.change.type = type;
                this.change.ref = null;
                this.inputModel.new = null;
                this.numberModel.new = null;
                this.change.inputShow = false;
                this.change.selectShow = false;
                this.change.numberShow = false
                switch (type) {
                    case 'money':
                        _this.options = [{
                            value: 'USD',
                            label: 'USD'
                        }, {
                            value: 'RMB',
                            label: 'RMB'
                        }, {
                            value: 'RM',
                            label: 'RM'
                        }, {
                            value: 'HKD',
                            label: 'HKD'
                        }];
                        _this.selectModel.old = _this.setContent.info[type];
                        _this.change.ref = "selectRef";
                        _this.change.selectShow = true;
                        _this.dialogShow = true;
                        break;
                    case 'head':
                        _this.processBarBegin();
                        _this.axios.get(CONFIG.API + 'head').then(function(value) {
                            var json = value.data;
                            if (!json.err && json.state) {
                                _this.options = json.list.map(function(e) {
                                    var value = e.name + "#*#" + e.address + "#*#" + e.contact;
                                    var label = "名称：" + e.name + " 地址：" + e.address + " 联系方式：" + e.contact;
                                    return {
                                        value: value,
                                        label: label
                                    };
                                });
                                _this.change.ref = "selectRef";
                                _this.processBarEnd();
                                _this.change.selectShow = true;
                                _this.dialogShow = true;
                            } else {
                                throw '获取数据失败';
                            }
                        }).catch(function(err) {
                            _this.$notify.error({
                                title: '失败',
                                message: err
                            });
                        });
                        break;
                    case 'delete':
                        var index = row.index;
                        _this.change.index = index;
                        _this.openConfirm();
                        break;
                    case 'tax':
                    case 'discount':
                    case 'number':
                        _this.numberModel.old = _this.setContent.info[type];
                        _this.change.ref = "numberRef";
                        _this.change.numberShow = true;
                        _this.dialogShow = true;
                        break;
                    case 'saleManager':
                    case 'customerCompany':
                    case 'customerName':
                    case 'customerContact':
                    case 'customerBoard':
                    case 'adminBoard':
                    case 'title':
                        _this.inputModel.old = _this.setContent.info[type];
                        _this.change.ref = "inputRef";
                        _this.change.inputShow = true;
                        _this.dialogShow = true;
                        break;
                    case 'price':
                    case 'count':
                        var index = row.index;
                        _this.change.index = index;
                        _this.numberModel.old = _this.setContent.info.customerProduct[index][type];
                        _this.change.ref = "numberRef";
                        _this.change.numberShow = true;
                        _this.dialogShow = true;
                        break;
                    default:
                        _this.$notify.error({
                            title: '失败',
                            message: '更新表单失败'
                        });
                        break;
                }
            },
            preUpdate() {
                var _this = this;
                var type = _this.change.type;
                switch (type) {
                    case 'money':
                    case 'head':
                        _this.change.new = _this.selectModel.new;
                        var t = {};
                        t[type] = _this.change.new;
                        _this.update('selectRef', t);
                        break;
                    case 'saleManager':
                    case 'customerCompany':
                    case 'customerName':
                    case 'customerContact':
                    case 'customerBoard':
                    case 'adminBoard':
                    case 'title':
                        var t = {};
                        t[type] = _this.inputModel.new;
                        _this.update('inputRef', t);
                        break;
                    case 'tax':
                    case 'discount':
                    case 'number':
                        var t = {};
                        t[type] = _this.numberModel.new;
                        _this.update('numberRef', t)
                        break;
                    case 'delete':
                        var index = _this.change.index;
                        _this.setContent.info.customerProduct.splice(index, 1);
                        var sum = new Number();
                        var t = _this.setContent.info.customerProduct.map(function(e) {
                            sum = sum + parseFloat(e.singleSum);
                            return {
                                price: e.price,
                                singleSum: e.singleSum,
                                count: e.count,
                                productId: e.productId
                            }
                        });
                        _this.update('delete', {
                            customerProduct: t,
                            sum: sum
                        });
                        break;
                    case 'price':
                    case 'count':
                        var index = _this.change.index;
                        _this.setContent.info.customerProduct[index][type] = _this.numberModel.new;
                        var count = parseInt(_this.setContent.info.customerProduct[index].count);
                        var price = parseFloat(_this.setContent.info.customerProduct[index].price);
                        _this.setContent.info.customerProduct[index].singleSum = (count * price).toFixed(2);
                        var sum = new Number();
                        var t = _this.setContent.info.customerProduct.map(function(e) {
                            sum = sum + parseFloat(e.singleSum);
                            return {
                                price: e.price,
                                singleSum: e.singleSum,
                                count: e.count,
                                productId: e.productId
                            }
                        });
                        _this.update('numberRef', {
                            customerProduct: t,
                            sum: sum
                        });
                        break;
                    default:
                        _this.$notify.error({
                            title: '失败',
                            message: '更新表单失败'
                        });
                        break;
                }
            },
            update(ref, change) {
                var _this = this;
                if (ref == 'delete' || ref == 'add') {
                    _this.dataChange(change);
                } else {
                    this.$refs[ref].validate(function(v) {
                        if (v) {
                            _this.dataChange(change);
                        } else {
                            return false;
                        }
                    });
                }
            },
            dataChange(change) {
                var _this = this;
                change.time = new Date();
                var d = new FormData();
                d.append('_id', _this._id);
                d.append('change', JSON.stringify(change));
                _this.processBarBegin();
                _this.axios.put(CONFIG.API + 'order', d).then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.get();
                        _this.dialogShow = false;
                        _this.processBarEnd();
                        _this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                    } else {
                        throw '更新';
                    }
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                    _this.processBarEnd();
                });
            },
            toggleLanguage() {
                if (this.toggleEnglish) {
                    this.toggleEnglish = false;
                } else {
                    this.toggleEnglish = true;
                }
                this.get();
            },
            convertDate(date) {
                return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
            },
            get() {
                var orderId = this.id;
                var _this = this;
                this.processBarBegin();
                this.axios.get(CONFIG.API + 'order/id/' + orderId).then(function(value) {
                    var json = value.data;
                    var sum = parseFloat(json.list.sum);
                    var tax = parseFloat(json.list.tax);
                    var time = new Date(json.list.time);
                    var customerTime = new Date(json.list.customerTime);
                    var discount = parseFloat(json.list.discount);
                    json.list.bigSum = (sum + tax - discount).toFixed(2);
                    json.list.time = _this.convertDate(time);
                    json.list.customerTime = _this.convertDate(customerTime);
                    var tmpArr = json.list.head.split("#*#");
                    json.list.head = tmpArr;
                    _this.setContent.info = json.list;
                    return json.list.customerProduct;
                }).then(function(value) {
                    var a = [];
                    value.forEach(function(e, index) {
                        a.push(_this.axios.get(CONFIG.API + 'product/id2/' + e.productId).then(function(val) {
                            var value = val.data.list;
                            _this.setContent.info.customerProduct[index].index = index;
                            _this.setContent.info.customerProduct[index].index2 = index + 1;
                            _this.setContent.info.customerProduct[index].name = _this.toggleEnglish ? value.englishName : value.name;
                            _this.setContent.info.customerProduct[index].number = value.number;
                            return value.media[0];
                        }));
                    });
                    return Promise.all(a);
                }).then(function(value) {
                    var t = [];
                    value.forEach(function(e, index) {
                        if(e){
                            t.push(_this.axios.get(CONFIG.API + 'media/id/' + e).then(function(value) {
                                var json = value.data.media;
                                _this.setContent.info.customerProduct[index].mediaType = json.type;
                                _this.setContent.info.customerProduct[index].media = CONFIG.PIC + json.link;
                            }));
                        }else{
                            var p=new Promise(function(reslove,reject){
                                if(true){
                                    var t= function(){
                                        _this.setContent.info.customerProduct[index].mediaType = "picture";
                                        _this.setContent.info.customerProduct[index].media = "http://ohnpdrepj.bkt.clouddn.com/%E9%BB%98%E8%AE%A4%E4%BA%A7%E5%93%81.png";
                                    }
                                    reslove(t());
                                }
                            })
                            t.push(p)
                        }
                    });
                    return Promise.all(t);
                }).then(function() {
                    if (_this.controlShow) {
                        _this.controlShow = false;
                        _this.controlShow = true;
                    } else {
                        _this.controlShow = true;
                        _this.controlShow = false;
                    }
                    _this.processBarEnd();
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                    _this.processBarEnd();
                })
            },
            ...mapActions(['processBarBegin', 'processBarEnd'])
        }
    }
</script>
<style scoped>

</style>