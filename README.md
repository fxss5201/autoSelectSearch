# 支持中文-全拼-简拼以及自定义筛选的下拉列表
支持中文/全拼/简拼以及自定义筛选的下拉列表

- autoSelectSearch.js 为核心文件，里面有每个参数的设置说明
- autoSelectSearch.css 为下拉列表的样式说明 
- index.html 为一个简单实用的例子

### 使用说明
首先必须引入jQuery文件、autoSelectSearch.js核心文件 以及 autoSelectSearch.css样式文件

在html中需要有如下格式：
```
<div class="autoSelectSearch-box js-autoSelectSearch-box">
     <input class="input js-autoSelectSearch-input" type="text" data-optionChoiced="18039678963">
     <ul class="autoSelectSearch-optionBox js-autoSelectSearch-optionBox"></ul>
</div>
```
外层的div是包裹整个插件的DOM，input就是输入搜索的地方，ul则是符合条件的下拉列表

在js文件中可以按照如下写法：
```
autoSelectSearch({
    element: ".js-autoSelectSearch-input",
    dataList: data,
    key: "FoowwUserName",
    isNeedSpell: true,
    props: {
        label: "Cellphone",
        text: "FoowwUserName",
        spell: "spell",
        simpleSpell: "simpleSpell"
    },
    isOptionChoiced: true,
    choicedType: "Cellphone",
    isOpenRemove: false,
    isEnter: true,
    optionClickFun: function (obj) {
        console.log(obj)
        console.log(obj.targetInput.attr("class"))
    }         
});
```
上面是整个插件的引用，点击下拉列表中的选项之后回调optionClickFun函数会以参数将当前选中项的数据传出。

另外还有一个render渲染参数，用法如下：
```
$("#clickRender").on("click", function () {
    autoSelectSearch.render($(".js-autoSelectSearch-input").eq(0), "11122223333");
});
```

### 参数说明

- element  {[object]}        [需要实现下拉列表的input标签，如果仅有一个可为".element"或者"#element"，如果为多个则为".element"]
- dataList  {[array]}        [下拉列表的总数据]
- key  {[string]}        [filter过滤依据]
- isNeedSpell  {[boolen]}        [是否需要拼音检索，true需要，flase不需要，默认是false]
- spellKey  {[string]}        [拼音全拼filter过滤依据，默认为"spell"]
- simpleSpellKey  {[string]}        [拼音简拼filter过滤依据，默认为"simpleSpell"]
- props  {[object]}        [渲染下拉列表的依据，默认为{ label: "attr",text: "name" }]
- isSetSelectionRange  {[boolen]}        [是否需要在input选中的时候，直接选中value值，默认为选中（true），如不想选中，可设置为false]
- isOptionChoiced  {[boolen]}        [是否需要设定旧的选项值，如果需要（true），则需要在input标签上面设置自定义属性data-optionChoiced]
- choicedType  {[string]}        [选中值的参数类型]
- optionChoicedClass  {[string]}        [selectSearchOption选中时的样式参数名称（isOptionChoiced必须为true），如果isOptionChoiced为false，则指定optionChoicedClass无效，默认为"js-option-choiced"]
- isOpenRemove  {[boolen]}        [是否开启去重处理，默认false不开启,true开启则必须设置去重处理的class类名，去重处理主要是按照props里面的text来去重]
- removeClass  {[string]}        [去重处理的class类名，默认值为"js-autoSelectSearch-removeClass"]
- isEnter  {[boolen]}        [是否开启在input中的回车事件，点击回车默认选中（和筛选条件一致的）第一个]
- isEnterCongruent  {[boolen]}        [开启在input中的回车事件，回车的时候内容是否要和列表中的内容匹配，true匹配，false匹不匹配都可以]
- optionClickFun   {[function]}   [为selectSearchOption上绑定函数]
