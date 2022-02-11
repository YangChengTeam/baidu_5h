/* eslint-disable no-unused-vars */
const app = getApp()
var config = require('../../js/config')
var base64 = require('../../utils/base64')

const TOP_DISTANCE = 630;
var titlepics = []; //setPageInfo 图片容器

Page({
    data: {
        pageName: '推荐',
        itemBanners: [],
        itemNews: [],
        itemNewsMore: [],
        itemData: {},
        pageNum: 1,
        current: 0,
        switchIndicateStatus: true,
        switchAutoPlayStatus: false,
        switchDuration: 500,
        autoPlayInterval: 2000,
        showBackTop: false,
        loading: "加载中...",
        isOneLoading: true,
        adShow:false,
        navData: [{
                path: "/pages/home/home",
                name: "推荐",
                pageNumber: 0
            },
            {
                path: "/subPackages/pages/list/list",
                name: "护肤",
                pageNumber: 17
            },
            {
                path: "/subPackages/pages/list/list",
                name: "彩妆",
                pageNumber: 18
            },
            {
                path: "/subPackages/pages/list/list",
                name: "恋爱",
                pageNumber: 142
            },
            {
                path: "/subPackages/pages/list/list",
                name: "婚姻",
                pageNumber: 143
            },
            {
                path: "/subPackages/pages/list/list",
                name: "服饰",
                pageNumber: 32
            }, {
                path: "/subPackages/pages/list/list",
                name: "发型",
                pageNumber: 129
            },
        ],
    },
    onInit() {
        console.log("00671", "onInit")
        this.showMyLoading();
        this.getHomeData();

    },
    onLoad() { // 监听页面加载的生命周期函数
        console.log("00671", "onLoad")

    },
    onReady() {
        this.showMyFavoriteGuide();
    },
    onShow() {},
    showMyLoading: function () {
        // console.log("showMyLoading isOneLoading", this.data.isOneLoading);
        if (this.data.isOneLoading) {
            swan.showLoading({
                title: '页面加载中...',
                mask: true,
                success: function () {},
                fail: function (err) {
                    console.log('showLoading fail', err);
                }
            });
        }
    },
    swiperChange(e) {

    },
    gotomain(res) {
        console.log("gotomain", res)
        if (res == null || "" == res) {
            return
        }
        var id = res.currentTarget.dataset.item.id;
        var title = res.currentTarget.dataset.item.title;
        // console.log("gotomain cmsmain id : " + id)
        swan.navigateTo({
            url: '/pages/cmsmain/cmsmain?id=' + id + '&title=' + title,
        });
    },
    loadMore: function () {
        this.data.pageNum++;
        this.getHomeData();
    },
    showMyFavoriteGuide: function () {
        swan.showFavoriteGuide({
            type: 'tip',
            content: '一键关注小程序',
            success: res => {
                console.log('关注成功：', res);
            },
            fail: err => {
                console.log('关注失败：', err);
            }
        })
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
                console.log("http 请求", config.apiList.baseUrl + " action:index page:" + that.data.pageNum);
                console.log("http 响应", res.data);
                if (res.data == null) {
                    if (that.data.pageNum == 1) {
                        that.data.loading = "没有数据"
                        // that.setData('loading', "没有数据");
                    } else {
                        that.data.loading = "没有更多了"
                        // that.setData('loading', "没有更多了");
                    }
                }

                if (res.data != null && (res.data.news == null || res.data.news.length < 6)) {
                    that.data.loading = "没有更多了"
                    // that.setData({
                    //     loading: "没有更多了",
                    // })
                };


                that.data.itemNews = that.data.itemNews.concat(res.data.news);

                // console.log('length', that.data.itemNews.length)

                that.setData({
                    itemNews: that.data.itemNews,

                    itemBanners: res.data.banner,
                    loading: that.data.loading
                })
                // that.setData(`that.data.itemNews[${that.data.pageNum}]`, res.data.news);

                if (res.data.news && titlepics.length == 0) {
                    for (var itemNew of res.data.news) {
                        const titlepic = itemNew.titlepic;
                        titlepics.push(titlepic)
                    }
                    that.setPageInfoData(titlepics, res.data.site)
                }


            },

            fail: function (err) {
                swan.hideLoading();
                console.log('错误信息：' + err);
            }
        });
    },
    setPageInfoData(titlepics, sites) {
        // console.log("setPageInfoData sites", sites, titlepics)
        let siteInfo = {
            pics: titlepics,
            sites: sites
        }
        swan.setStorageSync("siteInfo", siteInfo);

        swan.setPageInfo({
            title: sites.title,
            image: titlepics,
            keywords: sites.sitekey,
            description: sites.siteintro,
            success: function () {},
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
            // this.setData({
            //     showBackTop: flag
            // })
        }
    },
    //跳转频道页面
    gotoclass(res) {
        console.log("gotoclass 2 :--- ", res)
        var path = res.currentTarget.dataset.nav.path;
        var name = res.currentTarget.dataset.nav.name;
        var pageNumber = res.currentTarget.dataset.nav.pageNumber;
        console.log("gotoclass url: ", path + '?path=' + path + '&pageName=' + name + '&pageNumber=' + pageNumber)
        // swan.redirectTo({
        swan.navigateTo({
            url: path + '?path=' + path + '&pageName=' + name + '&pageNumber=' + pageNumber,
            success: function () {
                console.log('redirectTo success');
            },
            fail: function (err) {
                console.log('redirectTo fail', err);
            }
        });
    },
    //跳转搜索,如果是搜索页面，则不跳转
    gotosearch(_res) {
        console.log("nav pageName ", this.data.pageName)
        if (this.data.pageName != '搜索') {
            swan.navigateTo({
                url: '/subPackages/pages/search/search'
                // url: '/swan-sitemap/index/index?currentPage=1',
            });
        }
    },
    //直接搜索,如果是搜索页面，直接搜索
    search(res) {
        this.data.keyword = res.detail.value; //获取搜索关键词
        if (this.data.pageName == '搜索') {
            //这里走搜索接口
            this.getSearchDatas(res.detail.value);
        }
    },
    getSearchDatas: function (searchValue) {
        var that = this;
        console.log(`url=${config.apiList.baseUrl} action=${"search"} keyword=${that.data.keyword} page=${that.data.pageNum}`)
        swan.request({
            url: config.apiList.baseUrl,
            method: 'GET',
            dataType: 'json',
            data: {
                action: "search",
                keyword: searchValue,
                page: 1
            },
            success: function (res) {
                console.log(res.data)
                var searchList = [];
                if (res.data != null && res.data.list != null) {
                    searchList = res.data.list;
                }
                that.sendSearchData(searchValue, searchList);
            },
            fail: function (err) {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
                that.sendSearchData(searchValue);
            }
        });
    },
    //搜索数据，用于给父级
    sendSearchData: function (searchValue, searchList) {
        if (searchList == null) {
            searchList = []
        }
        var searchData = {
            searchValue: searchValue,
            label: "",
            list: searchList,
        };
        this.triggerEvent('sendParentSearch', searchData);
    }

})