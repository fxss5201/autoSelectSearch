/**
 * [autoSelectSearch 实现下拉列表的搜索提示]
 * @options.element  {[object]}        [需要实现下拉列表的input标签，如果仅有一个可为".element"或者"#element"，如果为多个则为".element"]
 * @options.dataList  {[array]}        [下拉列表的总数据]
 * @options.key  {[string]}        [filter过滤依据]
 * @options.isNeedSpell  {[boolen]}        [是否需要拼音检索，true需要，flase不需要，默认是false]
 * @options.spellKey  {[string]}        [拼音全拼filter过滤依据，默认为"spell"]
 * @options.simpleSpellKey  {[string]}        [拼音简拼filter过滤依据，默认为"simpleSpell"]
 * @options.props  {[object]}        [渲染下拉列表的依据，默认为{ label: "attr",text: "name" }]
 * @options.isSetSelectionRange  {[boolen]}        [是否需要在input选中的时候，直接选中value值，默认为选中（true），如不想选中，可设置为false]
 * @options.isOptionChoiced  {[boolen]}        [是否需要设定旧的选项值，如果需要（true），则需要在input标签上面设置自定义属性data-optionChoiced]
 * @options.choicedType  {[string]}        [选中值的参数类型]
 * @options.optionChoicedClass  {[string]}        [selectSearchOption选中时的样式参数名称（isOptionChoiced必须为true），如果isOptionChoiced为false，则指定optionChoicedClass无效，默认为"js-option-choiced"]
 * @options.isOpenRemove  {[boolen]}        [是否开启去重处理，默认false不开启,true开启则必须设置去重处理的class类名，去重处理主要是按照props里面的text来去重]
 * @options.removeClass  {[string]}        [去重处理的class类名，默认值为"js-autoSelectSearch-removeClass"]
 * @options.isEnter  {[boolen]}        [是否开启在input中的回车事件，点击回车默认选中（和筛选条件一致的）第一个]
 * @options.isEnterCongruent  {[boolen]}        [开启在input中的回车事件，回车的时候内容是否要和列表中的内容匹配，true匹配，false匹不匹配都可以]
 * @options.optionClickFun   {[function]}   [为selectSearchOption上绑定函数]
 */
function autoSelectSearch(options) {
    var autoSelectSearchDefaults = {
        element: "",
        dataList: [],
        key: "",
        isNeedSpell: false,
        spellKey: "spell",
        simpleSpellKey: "simpleSpell",
        props: { label: "attr", text: "name" },
        isSetSelectionRange: true,
        isOptionChoiced: false,
        choicedType: "",
        optionChoicedClass: "js-option-choiced",
        isOpenRemove: false,
        removeClass: "js-autoSelectSearch-removeClass",
        isEnter: false,
        isEnterCongruent: false,
        optionClickFun: ""
    }
    $.extend(autoSelectSearchDefaults, options);

    // 页面中所有 autoSelectSearch 的各自旧值
    var autoSelectSearchOldValue = [];
    // 页面中所有 autoSelectSearch 的各自setTimeout
    var autoSelectSearchSetTimeout = [];

    // 简单的类型检测
    if (!autoSelectSearchDefaults.element) {
        console.log("请绑定 element ");
        return false;
    }
    if (typeof(autoSelectSearchDefaults.props) != "object") {
        console.log("请确定 props 是否是object类型");
        return false;
    }
    if (autoSelectSearchDefaults.key != autoSelectSearchDefaults.props.label &&
        autoSelectSearchDefaults.key != autoSelectSearchDefaults.props.text) {
        console.log("请确定 key 值是否正确");
        return false;
    }
    if (typeof(autoSelectSearchDefaults.isNeedSpell) != "boolean") {
        console.log("请确定 isNeedSpell 是否是boolean类型");
        return false;
    }
    if (typeof(autoSelectSearchDefaults.isOptionChoiced) != "boolean") {
        console.log("请确定 isOptionChoiced 是否是boolean类型");
        return false;
    }
    if (autoSelectSearchDefaults.isOptionChoiced == true && !autoSelectSearchDefaults.choicedType) {
        console.log("请输入 choicedType 参数");
        return false;
    } else if (autoSelectSearchDefaults.choicedType != autoSelectSearchDefaults.props.label &&
        autoSelectSearchDefaults.choicedType != autoSelectSearchDefaults.props.text) {
        console.log("请确定 choicedType 值是否正确");
        return false;
    }
    if (typeof(autoSelectSearchDefaults.isSetSelectionRange) != "boolean") {
        console.log("请确定 isSetSelectionRange 是否是boolean类型");
        return false;
    }
    if (typeof(autoSelectSearchDefaults.isOpenRemove) != "boolean") {
        console.log("请确定 isOpenRemove 是否是boolean类型");
        return false;
    }
    if (typeof(autoSelectSearchDefaults.isEnter) != "boolean") {
        console.log("请确定 isEnter 是否是boolean类型");
        return false;
    }
    if (typeof(autoSelectSearchDefaults.isEnterCongruent) != "boolean") {
        console.log("请确定 isEnterCongruent 是否是boolean类型");
        return false;
    }
    if (autoSelectSearchDefaults.dataList.length == 0) {
        console.log("请添加数据 dataList ");
        return false;
    }
    if (autoSelectSearchDefaults.isNeedSpell) {
        if (autoSelectSearchDefaults.key != autoSelectSearchDefaults.props.label &&
            autoSelectSearchDefaults.key != autoSelectSearchDefaults.props.text &&
            autoSelectSearchDefaults.key != autoSelectSearchDefaults.props.spell &&
            autoSelectSearchDefaults.key != autoSelectSearchDefaults.props.simpleSpell) {
            console.log("请确定 key 值是否正确");
            return false;
        }
        if (autoSelectSearchDefaults.spellKey != autoSelectSearchDefaults.props.label &&
            autoSelectSearchDefaults.spellKey != autoSelectSearchDefaults.props.text &&
            autoSelectSearchDefaults.spellKey != autoSelectSearchDefaults.props.spell &&
            autoSelectSearchDefaults.spellKey != autoSelectSearchDefaults.props.simpleSpell) {
            console.log("请确定 spellKey 值是否正确");
            return false;
        }
        if (autoSelectSearchDefaults.simpleSpellKey != autoSelectSearchDefaults.props.label &&
            autoSelectSearchDefaults.simpleSpellKey != autoSelectSearchDefaults.props.text &&
            autoSelectSearchDefaults.simpleSpellKey != autoSelectSearchDefaults.props.spell &&
            autoSelectSearchDefaults.simpleSpellKey != autoSelectSearchDefaults.props.simpleSpell) {
            console.log("请确定 simpleSpellKey 值是否正确");
            return false;
        }
    }

    $.each($(autoSelectSearchDefaults.element), function(i, n) {
        // 将绑定的 data-optionChoiced 传给value
        if (!$.trim($(n).val())) {
            if (autoSelectSearchDefaults.isOptionChoiced) {
                var optionChoicedText = $(n).attr("data-optionChoiced");
                var valueText;
                $.each(autoSelectSearchDefaults.dataList, function(j, k) {
                    if (k[autoSelectSearchDefaults.choicedType] && k[autoSelectSearchDefaults.choicedType] == optionChoicedText) {
                        valueText = k[autoSelectSearchDefaults.props.text];
                        return false;
                    }
                });
                $(n).val(valueText);
            }
        }

        $(n).on("focus", function() {
            var _this = $(this);
            var _thisValue = $.trim(_this.val());
            var _thisOptionBox = _this.parent().find(".js-autoSelectSearch-optionBox");
            autoSelectSearchOldValue[i] = _thisValue;

            // 如果开启去重处理，则要收集去重数据
            if (autoSelectSearchDefaults.isOpenRemove) {
                var removeTextArray = [];
                $.each($("." + autoSelectSearchDefaults.removeClass), function(i, n) {
                    removeTextArray.push($(n).text());
                });
                autoSelectSearchDefaults.removeTextArray = removeTextArray;
            }

            // 判断blur时的setTimeout还是否存在，如果存在，则需要clearTimeout
            if (autoSelectSearchSetTimeout[i]) {
                clearTimeout(autoSelectSearchSetTimeout[i]);
            }
            // 如果值不存在，则直接获取data-optionChoiced渲染下拉列表
            if (!_thisValue) {
                var _thisChoicedName;
                if (autoSelectSearchDefaults.isOptionChoiced) {
                    _thisChoicedName = _this.attr("data-optionChoiced");
                }
                addAutoSelectHtml(autoSelectSearchDefaults.dataList, _thisOptionBox, _thisChoicedName);
                _thisOptionBox.show();
                makeSurePosition(_this, _thisOptionBox);
            } else {
                // 如果值存在，则需要过滤一遍再渲染
                var _thisChoicedName;
                if (autoSelectSearchDefaults.isOptionChoiced) {
                    _thisChoicedName = _this.attr("data-optionChoiced");
                }

                function isIncludeValue(obj) {
                    if (autoSelectSearchDefaults.isNeedSpell) {
                        return (obj[autoSelectSearchDefaults.key] ? obj[autoSelectSearchDefaults.key].toLowerCase().indexOf(_thisValue.toLowerCase()) > -1 : false) ||
                            (obj[autoSelectSearchDefaults.simpleSpellKey] ? obj[autoSelectSearchDefaults.simpleSpellKey].toLowerCase().indexOf(_thisValue.toLowerCase()) > -1 : false) ||
                            (obj[autoSelectSearchDefaults.spellKey] ? obj[autoSelectSearchDefaults.spellKey].toLowerCase().indexOf(_thisValue.toLowerCase()) > -1 : false);
                    } else {
                        return (obj[autoSelectSearchDefaults.key] ? obj[autoSelectSearchDefaults.key].toLowerCase().indexOf(_thisValue.toLowerCase()) > -1 : false);
                    }
                }

                // 如果开启input获取焦点内部内容选中
                if (autoSelectSearchDefaults.isSetSelectionRange) {
                    _this[0].setSelectionRange(0, _thisValue.length);
                }

                var newUsers = autoSelectSearchDefaults.dataList.filter(isIncludeValue);
                addAutoSelectHtml(newUsers, _thisOptionBox, _thisChoicedName);
                if (newUsers.length > 0) {
                    _thisOptionBox.show();
                    makeSurePosition(_this, _thisOptionBox);
                } else {
                    _thisOptionBox.hide();
                }
            }
        }).on("blur", function() {
            var _this = $(this);
            var _thisValue = $.trim(_this.val());
            var _thisOptionBox = _this.parent().find(".js-autoSelectSearch-optionBox");
            // 由于input的blur事件总是优先于下拉列表的点击事件，所以需要setTimeout事件
            autoSelectSearchSetTimeout[i] = setTimeout(function() {
                _thisOptionBox.hide();
                if (!$.trim(_this.val()) && autoSelectSearchOldValue[i]) {
                    _this.val(autoSelectSearchOldValue[i]);
                }
            }, 150);
        }).on("input", function() {
            var _this = $(this);
            var _thisValue = $.trim(_this.val());
            var _thisOptionBox = _this.parent().find(".js-autoSelectSearch-optionBox");
            var _thisChoicedName;
            if (autoSelectSearchDefaults.isOptionChoiced) {
                _thisChoicedName = _this.attr("data-optionChoiced");
            }

            function isIncludeValue(obj) {
                if (autoSelectSearchDefaults.isNeedSpell) {
                    return (obj[autoSelectSearchDefaults.key] ? obj[autoSelectSearchDefaults.key].toLowerCase().indexOf(_thisValue.toLowerCase()) > -1 : false) ||
                        (obj[autoSelectSearchDefaults.simpleSpellKey] ? obj[autoSelectSearchDefaults.simpleSpellKey].toLowerCase().indexOf(_thisValue.toLowerCase()) > -1 : false) ||
                        (obj[autoSelectSearchDefaults.spellKey] ? obj[autoSelectSearchDefaults.spellKey].toLowerCase().indexOf(_thisValue.toLowerCase()) > -1 : false);
                } else {
                    return (obj[autoSelectSearchDefaults.key] ? obj[autoSelectSearchDefaults.key].toLowerCase().indexOf(_thisValue.toLowerCase()) > -1 : false);
                }
            }
            var newUsers = autoSelectSearchDefaults.dataList.filter(isIncludeValue);
            addAutoSelectHtml(newUsers, _thisOptionBox, _thisChoicedName);
            if (newUsers.length > 0) {
                _thisOptionBox.show();
                makeSurePosition(_this, _thisOptionBox);
            } else {
                _thisOptionBox.hide();
            }
        }).on("keydown", function(event) {
            if (autoSelectSearchDefaults.isEnter) {
                var _this = $(this);
                var _thisValue = $.trim(_this.val());
                var _thisOptionBox = _this.parent().find(".js-autoSelectSearch-optionBox");

                var keyCoade = event.which ? event.which : window.event.keyCode;
                if (keyCoade == 13) {
                    if (_thisOptionBox.children().length > 0) {
                        var _thisOptionFirst = _thisOptionBox.children().eq(0);
                        if (autoSelectSearchDefaults.isEnterCongruent) {
                            if (autoSelectSearchDefaults.isNeedSpell) {
                                if (_thisValue.toLowerCase() == _thisOptionFirst.attr("data-text").toLowerCase() ||
                                    _thisValue.toLowerCase() == _thisOptionFirst.attr("data-label").toLowerCase() ||
                                    _thisValue.toLowerCase() == _thisOptionFirst.attr("data-spell").toLowerCase() ||
                                    _thisValue.toLowerCase() == _thisOptionFirst.attr("data-simplespell").toLowerCase()) {
                                    autoSelectSearchOptionClick(_thisOptionFirst);
                                    _this.blur();
                                } else {
                                    return false;
                                }
                            } else {
                                if (_thisValue.toLowerCase() == _thisOptionFirst.attr("data-text").toLowerCase() ||
                                    _thisValue.toLowerCase() == _thisOptionFirst.attr("data-label").toLowerCase()) {
                                    autoSelectSearchOptionClick(_thisOptionFirst);
                                    _this.blur();
                                } else {
                                    return false;
                                }
                            }
                        } else {
                            autoSelectSearchOptionClick(_thisOptionFirst);
                            _this.blur();
                        }
                    }
                }
            }
        });
    });

    /**
     * 渲染下拉列表的函数
     * @param {*下拉列表的数据源} list 
     * @param {*下拉列表的容器} optionBox 
     * @param {*选中项} optionChoiced 
     */
    function addAutoSelectHtml(list, optionBox, optionChoiced) {
        var newHtml = "";
        $.each(list, function(i, n) {
            var dataAttr = "";
            // 将props内全部设置为自定义属性
            for (var propsItem in autoSelectSearchDefaults.props) {
                dataAttr = dataAttr + 'data-' + propsItem + '="' + n[autoSelectSearchDefaults.props[propsItem]] + '" ';
            }

            // 是否开启去重处理，如果开启则需要将之前收集的去重数据从下拉列表的数据源中一一排除
            if (autoSelectSearchDefaults.isOpenRemove) {
                var isIncluedRemoveArray = false;
                $.each(autoSelectSearchDefaults.removeTextArray, function(j, k) {
                    if (n[autoSelectSearchDefaults.props.text] == k) {
                        isIncluedRemoveArray = true;
                    }
                });
                if (!isIncluedRemoveArray) {
                    if (optionChoiced && optionChoiced == n[autoSelectSearchDefaults.choicedType]) {
                        newHtml += "<li class='js-autoSelectSearch-option autoSelectSearch-optionChoiced' " + dataAttr + ">" + n[autoSelectSearchDefaults.props.text] + "</li>";
                    } else {
                        newHtml += "<li class='js-autoSelectSearch-option' " + dataAttr + ">" + n[autoSelectSearchDefaults.props.text] + "</li>";
                    }
                }
            } else {
                if (optionChoiced && optionChoiced == n[autoSelectSearchDefaults.choicedType]) {
                    newHtml += "<li class='js-autoSelectSearch-option autoSelectSearch-optionChoiced' " + dataAttr + ">" + n[autoSelectSearchDefaults.props.text] + "</li>";
                } else {
                    newHtml += "<li class='js-autoSelectSearch-option' " + dataAttr + ">" + n[autoSelectSearchDefaults.props.text] + "</li>";
                }
            }
        });
        $(optionBox).html(newHtml);
    }

    /**
     * triggerElement: 要重新渲染的input
     * optionChoiced: 选中值
     */
    window.autoSelectSearch.render = function(triggerElement, optionChoiced) {
        if (!triggerElement || !optionChoiced) {
            console.log("请确定render时的参数是否完整");
            return false;
        }
        if (!autoSelectSearchDefaults.isOptionChoiced) {
            console.log("必须设定isOptionChoiced为true");
            return false;
        }

        triggerElement.attr("data-optionChoiced", optionChoiced);
        $.each(autoSelectSearchDefaults.dataList, function(i, n) {
            if (n[autoSelectSearchDefaults.choicedType] == optionChoiced) {
                triggerElement.val(n[autoSelectSearchDefaults.props.text]);
            }
        });
    };

    /**
     * 确定下拉列表的位置
     * @param {*input对象} element 
     * @param {*下拉列表的父容器对象} optionBox 
     */
    function makeSurePosition(element, optionBox) {
        var style = window.getComputedStyle(element[0]);
        var elementHeight = parseInt(style.getPropertyValue('height')) + 2;
        var height = $(window).height();
        var offsetTop = element.offset().top;
        var scrollTop = $(window).scrollTop();
        var offsetBottom = height - offsetTop - elementHeight;
        var selectHeight = optionBox.height();
        var surplusHeight = offsetTop - selectHeight;
        if (offsetTop > selectHeight && offsetBottom < selectHeight) {
            optionBox.css({
                top: "inherit",
                bottom: elementHeight + "px"
            });
            if (surplusHeight < scrollTop) {
                $(window).scrollTop(surplusHeight);
            }
        } else {
            optionBox.css({
                top: elementHeight + "px",
                bottom: "inherit"
            });
        }
    }

    // 下拉列表的点击事件
    $.each($(autoSelectSearchDefaults.element).next(".js-autoSelectSearch-optionBox"), function(i, n) {
        $(n).on("click", ".js-autoSelectSearch-option", function() {
            var _this = $(this);
            autoSelectSearchOptionClick(_this);
        });
    });

    /**
     * 下拉列表的点击事件
     * @param {*下拉列表的当前点击项} _this 
     */
    function autoSelectSearchOptionClick(_this) {
        var _thisText = _this.text();
        var callAttr = {};
        // 将所有自定义属性获取出来
        for (var propsItem in autoSelectSearchDefaults.props) {
            callAttr[propsItem] = _this.attr("data-" + propsItem);
        }
        var _thisInput = _this.parentsUntil(".js-autoSelectSearch-box").parent().find(".js-autoSelectSearch-input");
        _thisInput.val(_thisText);
        if (autoSelectSearchDefaults.isOptionChoiced) {
            for (var propsItem in autoSelectSearchDefaults.props) {
                if (autoSelectSearchDefaults.choicedType == autoSelectSearchDefaults.props[propsItem]) {
                    _thisInput.attr("data-optionChoiced", callAttr[propsItem]);
                }
            }
        }

        // 返回的数据里都是jQuery对象
        // target：当前点击的下拉列表项
        // targetText：当前点击的下拉列表项
        // targetAttr: 自定义属性的列表
        // targetInput：当前操作的input
        // targetOptionBox：下拉列表的容器对象
        // targetAllBox：此下拉列表（带输入框）的容器对象
        var callData = {
            target: _this,
            targetText: _thisText,
            targetAttr: callAttr,
            targetInput: _thisInput,
            targetOptionBox: _this.parent(),
            targetAllBox: _this.parentsUntil(".js-autoSelectSearch-box").parent()
        }
        autoSelectSearchDefaults.optionClickFun(callData);
    }
}
