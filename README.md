
# 简介 #

fxss-autoSelectSearch是一款jquery插件，支持中文/全拼/简拼等多种搜索方式的搜索插件，还支持清空搜索列表、强制指定某个搜索框选择某项option。

* 先来体验一把吧，[demo](http://www.fxss5201.cn/2018/07/17/example-%E6%94%AF%E6%8C%81%E4%B8%AD%E6%96%87-%E5%85%A8%E6%8B%BC-%E7%AE%80%E6%8B%BC%E4%BB%A5%E5%8F%8A%E8%87%AA%E5%AE%9A%E4%B9%89%E7%AD%9B%E9%80%89%E7%9A%84%E4%B8%8B%E6%8B%89%E5%88%97%E8%A1%A8/)
* githubd地址：[https://github.com/fxss5201/autoSelectSearch](https://github.com/fxss5201/autoSelectSearch)，如果感觉还不错就给个star

# 使用 #

首先必须引入jQuery文件、fxss-autoSelectSearch.js核心文件 以及 fxss-autoSelectSearch.css样式文件。

```html
<link rel="stylesheet" href="http://www.fxss5201.cn/project/plugin/autoSelectSearch/fxss-autoSelectSearch.css">
<script src="http://www.fxss5201.cn/project/js/jquery-1.11.3.js"></script>
<script src="http://www.fxss5201.cn/project/plugin/autoSelectSearch/fxss-autoSelectSearch.min.js"></script>
```

在html中需要有如下格式：

```html
<div class="autoSelectSearch-box js-autoSelectSearch-box">
    <input class="autoSelectSearch-input js-autoSelectSearch-input" type="text" id="test1" autocomplete="off">
    <ul class="autoSelectSearch-optionBox js-autoSelectSearch-optionBox"></ul>
    <i class="autoSelectSearch-caret js-autoSelectSearch-caret"></i>
</div>
```

* 外层的div是包裹整个插件的DOM
* input框就是输入搜索的地方，input设置autocomplete为off，自定义属性data-optionChoiced可以设置当前选中项，当然你也可以直接为其设置value来表示选中项并且当value设置的时候，data-optionChoiced设置无效且会被更新，
* ul则是符合条件的下拉列表
* i标签是右边的表示下拉的图标（可以设置isNeedCaret是否需要显示）。

如果你觉得样式不合你的口味，可以直接修改fxss-autoSelectSearch.css的样式文件。

在js文件中可以按照如下写法：

```javascript
$("#test1").autoSelectSearch({
    dataList: data,
    isNeedCaret: true,
    key: "userName",
    isNeedSpell: true,
    props: {
        label: "Cellphone",
        text: "userName",
        spell: "spell",
        simpleSpell: "simpleSpell"
    },
    choicedType: "Cellphone",
    optionClickFun: function (obj) {
        console.log(obj)
    }
});
```

上面是整个插件的引用，点击下拉列表中的选项之后回调optionClickFun函数会以参数将当前选中项的数据传出。

清空搜索列表用法如下：

```javascript
$("#test1").optionBoxEmpty();
```

强制指定某个搜索框选择某项option:

```javascript
$("#test1").changeSelected({
    choiced: "11122223333"
});
```

## autoSelectSearch参数说明 ##

| 参数 | 类型 | 默认值 | 描述 |
| --------- | --------- | --------- | --------- |
|dataList|array|[]空数组|下拉列表的总数据|
|key|string|null|filter过滤依据，为props中的一个属性值|
|focusIn|string|null|input框获取焦点的时候添加的class类名|
|focusOut|string|null|input框失去焦点的时候添加的class类名|
|isNeedCaret|boolen|false|是否需要下拉图标|
|isNeedSpell|boolen|false|是否需要拼音检索，true需要，flase不需要，如果开启拼音搜索则需要在dataList中指定拼音|
|spellKey|string|"spell"|拼音全拼filter过滤依据，请在props中以spell为key指定值，默认值为spell|
|simpleSpellKey|string|"simpleSpell"|拼音简拼filter过滤依据，请在props中以simpleSpellKey为key指定值，默认值为simpleSpellKey|
|props|object|{ label: "attr",text: "name" }|渲染下拉列表的依据，最多可以指定四个key值，label、text、spell、simpleSpell，所有指定的值都会以自定义属性渲染到相应的option即li上面，option的内容是以text渲染的|
|isSetSelectionRange|boolen|true|是否需要在input选中的时候，直接选中value值，默认为选中（true），如不想选中，可设置为false|
|isOptionChoiced|boolen|true|是否需要设定旧的选项值，如果需要（true），则需要设置data-optionchoiced自定义属性，将会把选中值设置到此自定义属性，并且当将input删除为空的时候，input失去焦点的时候，也会将此自定义属性的值设置为value|
|choicedType|string|null|选中值的参数类型|
|optionChoicedClass|string|"js-option-choiced"|selectSearchOption选中时的样式类名，默认为"js-option-choiced"|
|isOpenRemove|boolen|false|是否开启去重处理，默认false不开启,true开启则必须设置去重处理的class类名，去重处理主要是按照props里面的text来去重|
|removeBoxClass|string||去重处理的容器的class类名（如".class"）或id名（如"#id"），默认值为空|
|removeClass|string|"js-autoSelectSearch-remove"|去重处理的class类名，默认值为"js-autoSelectSearch-remove"|
|isEnter|boolen|false|是否开启在input中的回车事件，点击回车默认选中第一个|
|isEnterCongruent|boolen|false|开启在input中的回车事件，回车的时候内容是否要和列表中的内容匹配（此处指的匹配仅仅是将第一个option的值与dataList相对label、text、spell、simpleSpell对应的值的值进行比较），true匹配，false匹不匹配都可以|
|optionClickFun|function|null|为selectSearchOption上绑定函数|

## optionBoxEmpty参数说明 ##

| 参数 | 类型 | 默认值 | 描述 |
| --------- | --------- | --------- | --------- |
|offEvent|boolean|false|是否要清除input绑定的事件，清除之后提示搜索功能将不再支持，默认值是false，仅做置空处理|

## changeSelected参数说明 ##

| 参数 | 类型 | 默认值 | 描述 |
| --------- | --------- | --------- | --------- |
|choiced|string|null|指定选中项的值，请以对象的形式指定{ choiced: "" }，请确保如果指定了choicedType值，在指定值得时候请指定相应的内容|

如果使用中有什么问题，可以联系我，或者有什么建议都可以提出。
