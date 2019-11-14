
const app = getApp()
var config = require('../../js/config')
var base64 = require('../../utils/base64')

const TOP_DISTANCE = 630;
var titlepics = []; //setPageInfo 图片容器

Page({
    data: {
        navData: [
            {
                path: "/pages/list/list",
                name: "推荐"
            },
            {
                path: "/pages/list/list",
                name: "护肤",
            },
            {
                path: "/pages/list/list",
                name: "彩妆",
            },
            // {
            //     path: "/pages/list/list",
            //     name: "整形",
            // },
            // {
            //     path: "/pages/list/list",
            //     name: "美体",
            // }, 
                {
                path: "/pages/list/list",
                name: "恋爱",
            }, 
            {
                path: "/pages/list/list",
                name: "婚姻",
            }, 
            {
                path: "/pages/list/list",
                name: "服饰",
            }, {
                path: "/pages/list/list",
                name: "发型",
            },
        ],
        pageName: '推荐',
        itemBanners: [
        ],
        itemNews: [
        ],
        itemNewsMore: [
            {
                title: '小龙虾可以和啤酒一起吃吗 小龙虾的吃法7',
                titlepic: "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2810627290,1080409091&fm=58&s=8197C732C535FA313E526557030030BB&bpow=121&bpoh=75"
            },
            {
                title: '小龙虾可以和啤酒一起吃吗8',
                titlepic: "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2810627290,1080409091&fm=58&s=8197C732C535FA313E526557030030BB&bpow=121&bpoh=75"
            }
        ],

        itemData: {
            title: '小龙虾可以和啤酒一起吃吗 小龙虾的吃法7',
            titlepic: "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2810627290,1080409091&fm=58&s=8197C732C535FA313E526557030030BB&bpow=121&bpoh=75"
        },
        pageNum: 1,
        current: 0,
        switchIndicateStatus: true,
        switchAutoPlayStatus: false,
        switchDuration: 500,
        autoPlayInterval: 2000,
        showBackTop: false,
        loading: "加载中...",
        isOneLoading: true,
    },
    onLoad() { // 监听页面加载的生命周期函数
        console.log("home onLoad");
        this.showMyLoading();
        this.getHomeData();
    },
    onReady() {
    },
    onShow() {
    },
    showMyLoading: function () {
        console.log("showMyLoading");
        console.log("showMyLoading isOneLoading", this.data.isOneLoading);
        if (this.data.isOneLoading) {
            swan.showLoading({
                title: '页面加载中...',
                mask: true,
                success: function () {
                    this.data.isOneLoading = false;
                },
                fail: function (err) {
                    console.log('showLoading fail', err);
                }
            });
        }
    },
    swiperChange(e) {

    },
    gotoclass(res) {
        console.log("gotoclass : " + res)
        var path = res.currentTarget.dataset.nav.path;
        var name = res.currentTarget.dataset.nav.name;
        swan.redirectTo({
            url: '/pages/list/list?path=' + path + '&name=' + name,
            success: function () {
                console.log('redirectTo success');
            },
            fail: function (err) {
                console.log('redirectTo fail', err);
            }
        });
    },
    gotomain(res) {
        console.log("gotomain", res)
        if (res == null || "" == res) {
            return
        }
        var id = res.currentTarget.dataset.item.id;
        var title = res.currentTarget.dataset.item.title;
        console.log("gotomain cmsmain id : " + id)
        swan.navigateTo({
            url: '/pages/cmsmain/cmsmain?id=' + id + '&title=' + title,
        });
    },
    loadMore: function () {

        this.data.pageNum++;
        this.getHomeData();
    },
    getHomeData: function () {
        var that = this;
        swan.request({
            url: config.apiList.baseUrl,
            method: 'GET',
            dataType: 'json',
            data: {
                action: "index",
                page: that.data.pageNum
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                swan.hideLoading();
                console.log(res.data);

                if (res.data == null) {
                    if (that.data.pageNum == 1) {
                        // that.setData({
                        //     loading: "没有数据",
                        // })
                        that.setData('loading', "没有数据");
                    } else {
                        // that.setData({
                        //     loading: "没有更多了",
                        // })
                        that.setData('loading', "没有更多了");
                    }
                }

                that.data.itemNews = that.data.itemNews.concat(res.data.news);
                that.setData({
                    itemNews: that.data.itemNews,
                    itemBanners: res.data.banner,
                })

                if (titlepics.length == 0) {
                    for (itemNew of res.data.news) {
                        const titlepic = itemNew.titlepic;
                        titlepics.push(titlepic)
                    }
                    that.setPageInfoData(titlepics, res.data.site)
                }



                if (res.data.news == null || res.data.news.length < 6) {
                    that.setData({
                        loading: "没有更多了",
                    })
                };
            },
            fail: function (err) {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },
    setPageInfoData(titlepics, sites) {
        swan.setPageInfo({
            title: sites.title,
            image: titlepics,
            keywords: sites.sitekey,
            description: sites.siteintro,
            success: function () {
                // console.log('setPageInfo success sites.title: ' + sites.title);
            },
            fail: function (err) {
                console.log('setPageInfo fail', err);
            }
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.loadMore();
    },
    /**
     * 回到顶部
     */
    onBackTop() {
        swan.pageScrollTo({
            scrollTop: 0,
            // duration: 0
        })
    },
    /**
     * 页面滑动监听,回到顶部按钮显示隐藏
     */
    onPageScroll: function (options) {
        const scrollTop = options.scrollTop;
        const flag = scrollTop >= TOP_DISTANCE;
        if (flag != this.data.showBackTop) {
            this.setData({
                showBackTop: flag
            })
        }
    }

})