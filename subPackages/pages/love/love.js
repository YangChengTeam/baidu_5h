const config = require('../../../js/config')
let pageNum = 1 //分页
let user_id = ''

Page({
    data: {

        loveLists: [
            // {
            //     "id": "203455",
            //     "title": "泳衣会越穿越大吗 泳衣松了怎么办",
            //     "titlepic": "http://pic.5h.com/d/file/20210526/1622011981880910.jpg!200_200"
            // },
            // {
            //     "id": "203453",
            //     "title": "泳衣哪个牌子质量好又好看 最好泳衣品牌推荐",
            //     "titlepic": "http://pic.5h.com/d/file/20210526/1622010846785715.jpg!200_200"
            // },
            // {
            //     "id": "203451",
            //     "title": "泳衣怎么清洗好 泳衣清洗注意事项",
            //     "titlepic": "http://pic.5h.com/d/file/20210526/1622009955877215.jpg!200_200"
            // },
            // {
            //     "id": "203448",
            //     "title": "泳衣买大点好还是小点好 泳衣怎么选",
            //     "titlepic": "http://pic.5h.com/d/file/20210526/1622001963439521.jpg!200_200"
            // },
            // {
            //     "id": "203445",
            //     "title": "超详细！一文了解安娜柏林蜜精华家族",
            //     "titlepic": "http://pic.5h.com/d/file/20210526/1622000965320164.png!200_200"
            // },
            // {
            //     "id": "203444",
            //     "title": "泳衣分体和连体哪个好 泳衣买什么面料的好",
            //     "titlepic": "http://pic.5h.com/d/file/20210526/1622000981374291.jpg!200_200"
            // }
        ],
        loading: "加载中...",
    },
    onInit: function () {
        // 监听页面初始化的生命周期函数
        let userInfo = swan.getStorageSync("userInfo");
        user_id = userInfo.id;
    },



    getLoveList() {
        if (pageNum == 1) {
            swan.showLoading({
                // 提示的内容
                title: '数据加载中...',
            });
        }
        swan.request({
            url: config.apiList.baseUserUrl,
            data: {
                action: 'like_list',
                user_id: user_id,
                page: pageNum
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
            method: 'POST',
            success: res => {
                swan.hideLoading();
                let data = res.data.data

                if (data == null) {
                    if (pageNum == 1) {
                        this.data.loading = '没有数据'

                    } else {
                        this.data.loading = '没有更多了'
                    }
                }

                if (!res || !res.data || !data || data.list.length < 10) {
                    this.data.loading = '没有更多了'
                };

                if (data && data.list) {
                    if (pageNum == 1) {
                        this.data.loveLists = []
                    }
                    this.setData({
                        loveLists: this.data.loveLists.concat(data.list),
                        loading: this.data.loading
                    })
                }
                console.log('res', res.data.data);

            },
            fail: err => {
                console.log('err', err);
                swan.hideLoading();
            }
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
        pageNum = 1
        this.data.loading='加载中...'
        swan.pageScrollTo({
            scrollTop: 0,
        });
        this.getLoveList()
        // console.log("page  onShow", pageNum)
    },
    onHide: function () {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function () {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function () {
        // 监听用户下拉动作
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
        pageNum++
        this.getLoveList()
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    },
    onError: function () {
        // 错误监听函数
    }
});