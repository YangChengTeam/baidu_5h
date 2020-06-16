const app = getApp()
var config = require('../../js/config')
var base64 = require('../../utils/base64')

const TOP_DISTANCE = 630;
var titlepics = []; //setPageInfo 图片容器

Page({
    data: {
        pageName: "",
        pageNumber: "", //导航
        keyword: '',
        pageNum: 1,  //分页
        itemLists: [],
        showBackTop: false,
        loading: "加载中...",
    },
    onInit(res) {
        this.setData({
            pageName: res.pageName,
            pageNumber: res.pageNumber,
            keyword: res.keyword,
        }),
            this.getListDatas();
    },
    onLoad(res) {

    },
    onShow() {
    },
    gotomain(res) {
        console.log("gotomain --- ", res)
        var id = res.currentTarget.dataset.item.id;
        var title = res.currentTarget.dataset.item.title;
        swan.navigateTo({
            url: '/pages/cmsmain/cmsmain?id=' + id + '&title=' + title,
        });
    },
    loadMore: function () { //加载更多
        this.data.pageNum++;
        if (this.data.keyword != "" && this.data.keyword != "undefined" && this.data.keyword != null) {
            this.getSearchDatas();
        } else {
            this.getNavDatas();
        }
    },
    getListDatas: function () {  //初始化数据
        var that = this;
        if (that.data.keyword != "" && that.data.keyword != "undefined" && that.data.keyword != null) {
            that.getSearchDatas();
        } else {
            that.getNavDatas();
        }
    },
    getSearchDatas: function () {
        var that = this;
        console.log("http", `url=${config.apiList.baseUrl} action=${"search"} keyword=${that.data.keyword} page=${that.data.pageNum}`)
        swan.request({
            url: config.apiList.baseUrl,
            method: 'GET',
            dataType: 'json',
            data: {
                action: "search",
                keyword: that.data.keyword,
                page: that.data.pageNum
            },
            success: function (res) {
                console.log("http", "getSearchDatas", res.data);
                if (res.data == null) {
                    if (that.data.pageNum == 1) {
                        that.setData({
                            loading: "没有数据",
                        })
                    } else {
                        that.setData({
                            loading: "没有更多了",
                        })
                    }
                }
                if (res && res.data && res.data.list) {
                    that.data.itemLists = that.data.itemLists.concat(res.data.list);
                    that.setData({
                        itemLists: that.data.itemLists,
                    })
                    for (var itemNew of res.data.list) {
                        const titlepic = itemNew.titlepic;
                        titlepics.push(titlepic)
                    }
                    that.setPageInfoData(titlepics, res.data.site)
                }
                if (!res || !res.data || !res.data.list || res.data.list.length < 10) {
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
    getNavDatas: function () {
        var that = this;
        console.log("http getNavDatas ", `url=${config.apiList.baseUrl} action=${"cate"} cate_id=${that.data.pageNumber} page=${that.data.pageNum}`)
        swan.request({
            url: config.apiList.baseUrl,
            method: 'GET',
            dataType: 'json',
            data: {
                action: "cate",
                cate_id: that.data.pageNumber,
                page: that.data.pageNum
            },
            success: function (res) {
                console.log("http", "getNavDatas", res.data);
                console.log("00671", "length " + that.data.itemLists.length)
                // itemLists.push(res.data)
                // res.data=res.data.concat(res.data)
                //   console.log("http", "getNavDatas", res.data.size);

                if (res.data == null) {
                    if (that.data.pageNum == 1) {
                        that.setData({
                            loading: "没有数据",
                        })
                    } else {
                        that.setData({
                            loading: "没有更多了",
                        })
                    }
                }
                if (res.data != null && res.data != undefined && res.data.list != null && res.data.list != undefined) {
                    that.data.itemLists = that.data.itemLists.concat(res.data.list);
                    that.setData({
                        itemLists: that.data.itemLists,
                    })
                }

                // if (titlepics.length == 0 11) {
                for (var itemNew of res.data.list) {
                    const titlepic = itemNew.titlepic;
                    titlepics.push(titlepic)
                }
                console.log(456, titlepics)
                that.setPageInfoData(titlepics, res.data.site)
                // }

                // config.log("res.data.list.length",res.data.list.length)
                // if (res.data.list == null || res.data.list.length < 10) {
                //     that.setData({
                //         loading: "没有更多了",
                //     })
                // };
            },
            fail: function (err) {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },
    setPageInfoData(titlepics, sites) {
        var title = this.data.keyword;
        var keywords = this.data.keyword;
        var description = this.data.keyword;
        if (sites != null && sites != undefined) {
            title = sites.title;
            keywords = sites.sitekey;
            description = sites.siteintro;
        }
        swan.setPageInfo({
            image: titlepics,
            title: title,
            keywords: keywords,
            description: description,
            success: function () {
                console.log('setPageInfo success sites.title: ' + sites.title + " keywords :" + sites.sitekey || this.data.keyword);
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
    },
    //接收nav.js传过来的值,之后进行逻辑处理
    receiveData(res) {
        var that = this;
        console.log(123, res)
        that.setData({
            loading: "加载中...",
            pageNum: 1,
            keyword: res.detail.searchValue,
        })
        // res.detail.list

        if (res.detail == null) {
            that.setData({
                itemLists: [],
                loading: "没有数据",
            })
            return;
        }
        that.data.itemLists = res.detail.list;
        that.setData({
            itemLists: that.data.itemLists,
        })

        if (res.detail.list == null || res.detail.list.length < 10) {
            that.setData({
                loading: "没有更多了",
            })
        };
    },
})
