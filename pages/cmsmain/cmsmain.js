/* eslint-disable no-unused-vars */
const app = getApp()
var bdParse = require('../../bdparse/bdParse/bdParse.js')
var base64 = require('../../utils/base64')
var config = require('../../js/config')
let action = ''
let userInfo = null
Page({
    data: {
        id: "",
        title: "",
        writer: "",
        newDate: "",
        column: "",
        detailsTitle: "",
        recommendTitle: "",
        relatedTitle: "",
        itemRecommends: [],
        images: [],
        ellipsis: false, // 文字是否收起，默认收起
        isBindEllipsis: true,
        isInWeek: true,
        isParamOk: false,
        isShowSkeleton: false,
        showComment: true,
        commentParam: {},
        toolbarConfig: {},
        show: false,
        like: '喜欢',
        collect: '收藏',
        islike: false,
        iscollect: false,
        showList: false,
        addComment: {},
        recommendappid: '', //推荐广告id
        ads: ['7408125', '7408205', '7408208', '7408206']

    },
    /**
     * 收起/展开按钮点击事件
     */
    ellipsis: function () {
        // var value = !this.data.ellipsis;
        this.setData({
            ellipsis: false,
            isBindEllipsis: true
        })
    },
    onInit(res) {
        this.data.id = res.id;
        userInfo = swan.getStorageSync("userInfo");
        // console.log("id",this.data.id )
        this.showMyLoading();
        this.getCmsmainData();

    },
    onLoad(res) {
        // var index= parseInt(Math.random(this.data.ads)*(this.data.length))
        // this.data.recommendappid =ads[index]
    },

    onShow() {
        this.showMyFavoriteGuide();
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
    swiperChange(e) {
        console.log('swiperChange:', e);
    },
    showMyLoading: function () {
        swan.showLoading({
            title: '页面加载中...',
        });
    },
    onHide() {
        swan.hideLoading();
    },
    getCmsmainData: function () {
        var that = this;
        console.log("netData id:" + that.data.id);
        swan.request({
            url: config.apiList.baseUrl,
            data: {
                action: "detail",
                id: that.data.id,
                user_id: userInfo != null ? userInfo.id : ''
                // id: 169968,
            },
            success: function (res) {
                console.log("netData data", res.data);
                console.log("is_like", res.data.has_like)
                swan.hideLoading();
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

                    return;
                }
                var contentData = base64.base64_decode(res.data.content);
                console.log("contentData ", contentData, res.data.inWeek == 0 || false, res.data);


                // 当前时间戳
                var newstimeOut = res.data.newstime * 1000 + 1209600000 //新闻两周过期
                var currenttimes = Date.parse(new Date()); //当前时间戳
                // console.log("time  stamp", currenttimes);
                // console.log("newstimeNum", newstimeOut)
                if (newstimeOut > currenttimes) {
                    that.setData({
                        ellipsis: false,
                        isBindEllipsis: true,
                    })
                }
                var contentString = bdParse.bdParse('article', 'html', contentData, that, 5);

                var recommends = res.data.list
                // for (var index = 0; index < recommends.length; index++) {

                //     if (recommends[index].images && recommends[index].images.length < 2) {
                //         recommends[index].images[1] = recommends[index].images[0]
                //     }
                //     if (recommends[index].images && recommends[index].images.length < 3) {
                //         recommends[index].images[2] = recommends[index].images[0]
                //     }
                // }


                that.setData({
                    // content: contentString,
                    title: res.data.title,
                    images: res.data.images,
                    column: res.data.column,
                    writer: res.data.writer,
                    newDate: res.data.time.substring(0, 10),
                    itemRecommends: recommends,
                    itemRelated: res.data.list2,
                    recommendTitle: "更多推荐",
                    relatedTitle: "猜你喜欢",
                    isInWeek: res.data.inWeek == 0 || false,
                    isShowSkeleton: true,
                    islike: res.data.has_like == 1,
                    iscollect: res.data.has_collect == 1
                })
                swan.setPageInfo({
                    title: res.data.title,
                    keywords: res.data.keywords,
                    description: res.data.description,
                    comments: res.data.comments,
                    image: res.data.images,
                    success: function () {},
                    fail: function (err) {
                        console.log('setPageInfo fail', err);
                    }
                })

                // that.getOpenid()
                that.initComment();

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
            url: '/pages/cmsmain/cmsmain?id=' + id + '&title=' + title,
        });
    },
    //喜欢
    like(e) {
        let that = this

        if (this.isLogin('like')) {
            swan.request({
                url: config.apiList.baseUserUrl,
                data: {
                    action: 'do_like',
                    user_id: userInfo.id,
                    article_id: this.data.id
                },
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                dataType: 'json',
                success: res => {

                    let data = res.data
                    if (data && data.status == 1) { //点赞成功
                        that.setData({
                            islike: !that.data.islike
                        })
                    }
                    console.log('res', res)
                },
                fail: err => {
                    console.log('fail', err)
                }
            });

        }

    },


    //收藏
    collect() {
        if (this.isLogin('collect')) {
            console.log("userInfo", userInfo)
            swan.request({
                url: config.apiList.baseUserUrl,
                data: {
                    action: 'do_collect',
                    user_id: userInfo.id,
                    article_id: this.data.id
                },
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                dataType: 'json',
                success: res => {
                    let data = res.data
                    if (data && data.status == 1) { //收藏成功
                        this.setData({
                            iscollect: !this.data.iscollect
                        })
                    }
                    console.log('res', res)
                },
                fail: err => {
                    console.log('fail', err)
                }
            });

        }
    },
    //分享
    shareApp() {
        swan.openShare({
            success: res => {
                swan.showToast({
                    title: '分享成功',
                    icon: 'none'
                });
                console.log('openShare success', res);
            },
            fail: err => {
                console.log('openShare fail', err);
            }
        });

    },

    isLogin(type) {
        action = type
        if (userInfo) {
            this.setData({
                show: false,
            })
            return true
        }
        this.setData({
            show: true,
        })

        return false
    },
    listener(e) {
        console.log('listener', e)
        userInfo = e.detail.userInfo
        if (!userInfo) {
            return
        }

        this.getCmsmainData()

        if (action == 'like') {
            this.like()
        } else if (action == 'collect') {
            this.collect()
        }
    },
    close() {
        this.setData({
            show: false
        })
    },
    onReady() {
        requireDynamicLib('oneStopInteractionLib').listenEvent();
    },
    initComment() {
        var that = this;
        console.log("initComment", that.data.id, that.data.title, that.data.images)
        that.setData({
            commentParam: {
                snid: that.data.id,
                path: '/pages/cmsmain/cmsmain?id=' + that.data.id,
                title: that.data.title,
                images: that.data.images,
            },
            toolbarConfig: {
                share: {
                    title: that.data.title,
                },
                moduleList: ['comment', 'share'],
                placeholder: "回复评论"
            },
            // isParamOk: true,
            showComment: false
        });
    },

    addComment() {
        const showDetail = this.data.showDetail;

        if (!showDetail) {
            this.setData({
                showList: true,
                addComment: true
            }, () => {
                // 需要设为 false 的原因：因为调起发布监听 addComment 的变化，如果一直为 true，无法再次调起
                this.setData({
                    addComment: false
                });
            });

        } else {
            this.setData({
                showList: false,
            }, () => {

            });
        }
    },
    hideComment() {
        this.setData({
            showList: false
        })
    }

})