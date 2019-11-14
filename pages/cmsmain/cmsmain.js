const app = getApp()
var bdParse = require('../../bdparse/bdParse/bdParse.js')
var base64 = require('../../utils/base64')
var config = require('../../js/config')

Page({
    data: {
        id: "",
        title: "",
        writer: "",
        column: "",
        recommendTitle: "",
        relatedTitle: "",
        itemRecommends: [

        ],
        ellipsis: true, // 文字是否收起，默认收起
        isBindEllipsis: false,
        isInWeek: true,
    },
    /**
   * 收起/展开按钮点击事件
   */
    ellipsis: function () {
        var value = !this.data.ellipsis;
        this.setData({
            ellipsis: value,
            isBindEllipsis: true
        })
    },
    onLoad(res) {
        this.data.id = res.id;
        // this.data.title = res.title;
        var titleData = res.title;
        if (titleData == null || undefined==titleData) {
            titleData = "加载中..."
        }
        this.setData({
            title: titleData,
        })
        this.showMyLoading();
        this.getCmsmainData();

        // 当前时间戳
        // var timestamp = Date.parse(new Date());
        // console.log("timestamp", timestamp);

    },
    onReady() {
    },
    onShow() {
    },
    swiperChange(e) {
        console.log('swiperChange:', e);
    },
    showMyLoading: function () {
        swan.showLoading({
            title: '页面加载中...',
            mask: true,
            success: function () {
                // console.log('showLoading success');
            },
            fail: function (err) {
                console.log('showLoading fail', err);
            }
        });
    },
    onHide() {
        swan.hideLoading();
    },

    getCmsmainData: function () {
        var that = this;
        console.log("id:" + that.data.id);
        swan.request({
            url: config.apiList.baseUrl,
            data: {
                action: "detail",
                id: that.data.id,
                // id: 159720,
            },
            success: function (res) {
                console.log("data", res.data);
                if (res.data == null || res.data.content == null) {
                    console.log("没有数据，返回上级页面");

                    swan.showModal({
                        title: '抱歉，页面已过期',
                        content: '该页面不存在或已被删除',
                        showCancel: false,
                        confirmText: '返回首页',
                        success: function (res) {
                            console.log("navigateBack-5555---");
                            swan.reLaunch({
                                url: '/pages/home/home',
                            });
                        },
                    });
                    swan.hideLoading();
                    return;
                }
                var contentData = base64.base64_decode(res.data.content);
                // console.log(contentData);
                console.log("res.data.inWeek ", res.data.inWeek);
                that.setData({
                    content: bdParse.bdParse('article', 'html', contentData, that, 5),
                    title: res.data.title,
                    column: res.data.column,
                    writer: res.data.writer,
                    itemRecommends: res.data.list,
                    recommendTitle: "更多推荐",
                    relatedTitle: "猜你喜欢",
                    isInWeek: res.data.inWeek == 0,
                })
                swan.setPageInfo({
                    // title: 'pages/cmsmain/cmsmain',
                    title: res.data.title,
                    keywords: res.data.keywords,
                    description: res.data.description,
                    comments: res.data.comments,
                    image: res.data.images,
                    success: function () {
                        // console.log('setPageInfo success');
                    },
                    fail: function (err) {
                        console.log('setPageInfo fail', err);
                    }
                })
                swan.hideLoading();
            },
            fail: function (err) {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },
    gotomain(res) {
        console.log(res)

        var id = res.currentTarget.dataset.item.id;
        var title = res.currentTarget.dataset.item.title;
        swan.navigateTo({
            // url: '/pages/cmsmain/cmsmain?id=' + id,
            url: '/pages/cmsmain/cmsmain?id=' + id + '&title=' + title,
        });
    },
})
