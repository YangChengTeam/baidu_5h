const utils = require('../../../js/config')

let user_id = ''
let loadMore = false
Page({
    data: {
        page: 1,
        collectList: [
            // {
            //         "id": "203453",
            //         "title": "泳衣哪个牌子质量好又好看 最好泳衣品牌推荐",
            //         "titlepic": "http://pic.5h.com/d/file/20210526/1622010846785715.jpg!200_200"
            //     },
            //     {
            //         "id": "203451",
            //         "title": "泳衣怎么清洗好 泳衣清洗注意事项",
            //         "titlepic": "http://pic.5h.com/d/file/20210526/1622009955877215.jpg!200_200"
            //     },
            //     {
            //         "id": "203448",
            //         "title": "泳衣买大点好还是小点好 泳衣怎么选",
            //         "titlepic": "http://pic.5h.com/d/file/20210526/1622001963439521.jpg!200_200"
            //     },
            //     {
            //         "id": "203445",
            //         "title": "超详细！一文了解安娜柏林蜜精华家族",
            //         "titlepic": "http://pic.5h.com/d/file/20210526/1622000965320164.png!200_200"
            //     },
            //     {
            //         "id": "203444",
            //         "title": "泳衣分体和连体哪个好 泳衣买什么面料的好",
            //         "titlepic": "http://pic.5h.com/d/file/20210526/1622000981374291.jpg!200_200"
            //     }
        ],
        loading: "加载中..."
    },
    onInit: function () {
        // 监听页面初始化的生命周期函数
        // 监听页面初始化的生命周期函数
        let userInfo = swan.getStorageSync("userInfo");
        user_id = userInfo.id;

    },

    getCollectList() {
        if (this.data.page == 1) {
            swan.showLoading({
                // 提示的内容
                title: '数据加载中...',
                // 是否显示透明蒙层，防止触摸穿透。
            });
        }
        swan.request({
            // 开发者服务器接口地址
            url: utils.apiList.baseUserUrl,
            // 请求的参数
            data: {
                action: 'collect_list',
                user_id: user_id,
                page: this.data.page
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
            method: 'POST',
            // 收到开发者服务成功返回的回调函数。
            success: res => {
                swan.hideLoading();
                let data = res.data.data

                if (data == null) {
                    if (this.data.page == 1) {
                        this.data.loading = '没有数据'

                    } else {
                        this.data.loading = '没有更多了'
                    }
                }

                if (!res || !res.data || !data || data.list.length < 10) {
                    this.data.loading = '没有更多了'
                    loadMore = false
                } else {
                    this.data.loading = '加载中...'
                    this.data.page++;
                    loadMore = true
                };


                if (data && data.list) {
                    if (this.data.page == 1) {
                        this.data.collectList = []
                    }
                    this.setData({
                        collectList: this.data.collectList.concat(data.list),
                        loading: this.data.loading
                    })
                }
            },
            // 接口调用失败的回调函数。
            fail: err => {
                swan.hideLoading();
                console.log("err", err)
            },

        });
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
    },
    onReady: function () {
        // 监听页面初次渲染完成的生命周期函数
        let siteInfo = swan.getStorageSync('siteInfo');
        if (siteInfo)
            swan.setPageInfo({
                // 页面标题
                title: siteInfo.sites.title,
                // 页面关键字
                keywords: siteInfo.sites.sitekey,
                // 页面描述信息
                description: siteInfo.sites.siteintro,
                image: siteInfo.pics,
                // 接口调用失败的回调函数
                fail: err => {
                    console.log('setPageInfo fail', err);
                },
            });
    },
    onShow: function () {
        // 监听页面显示的生命周期函数
        this.data.page = 1
        this.data.loading = '加载中...'
        swan.pageScrollTo({
            scrollTop: 0,
        });
        // 监听页面显示的生命周期函数
        this.getCollectList()
    },
    onHide: function () {

        // 监听页面隐藏的生命周期函数
        console.log("collect onHide")
    },
    onUnload: function () {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function () {
        // 监听用户下拉动作
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
        if (loadMore)
            this.getCollectList()
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    },
    onError: function () {
        // 错误监听函数
    }
});