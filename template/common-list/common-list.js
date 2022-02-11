Component({
    properties: {
        itemLists: { // 属性名
            type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: [], // 属性初始值（必填）
            observer: function (newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
            }
        },
        apid: {
            type: String,
            value: ''
        },
        hide: {
            type: Boolean,
            value: true
        },
        show: {
            type: Boolean,
            value: true
        }
    },

    data: {}, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},

    detached: function () {},

    methods: {

        gotomain(res) {
            console.log("e", res)
            var id = res.currentTarget.dataset.item.id;
            var title = res.currentTarget.dataset.item.title;
            swan.navigateTo({
                url: '/pages/cmsmain/cmsmain?id=' + id + '&title=' + title,
            });
        }
    }
});