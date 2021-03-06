/** 
 * FXSS-autoSelectSearch是一款jquery插件，支持中文/全拼/简拼等多种搜索方式的搜索插件，还支持清空搜索列表、强制指定某个搜索框选择某项option。
 * time：2018-07-15
 * by 樊小书生: http: //www.fxss5201.cn/
 * github: https://github.com/fxss5201/autoSelectSearch
 */

;
(function($) {
    $.fn.autoSelectSearchDefaults = {
        dataList: [],
        key: "",
        focusIn: "",
        focusOut: "",
        isNeedCaret: true,
        isNeedSpell: false,
        spellKey: "spell",
        simpleSpellKey: "simpleSpell",
        props: { label: "attr", text: "name" },
        isSetSelectionRange: true,
        isOptionChoiced: true,
        choiced: "",
        choicedType: "",
        optionChoicedClass: "js-option-choiced",
        isOpenRemove: false,
        removeBoxClass: "",
        removeClass: "js-autoSelectSearch-remove",
        isEnter: false,
        isEnterCongruent: false,
        optionClickFun: function(obj) {},
        addAutoSelectHtml: function(list, optionBox, optionChoiced, isValue = false) {
            /**
             * 渲染下拉列表的函数
             * @param {object} list 下拉列表的数据源
             * @param {object} optionBox 下拉列表的容器
             * @param {string} optionChoiced 选中项
             * @param {boolean} isValue input是否有值
             */
            var _this = this;
            var newHtml = "";
            var newList = [];

            // 如果开启去重处理，则要收集去重数据
            if (_this.isOpenRemove) {
                var removeTextArray = [];
                if (_this.removeBoxClass) {
                    $.each($(_this.removeBoxClass).find("." + _this.removeClass), function(i, n) {
                        removeTextArray.push($(n).text());
                    });
                } else {
                    $.each($("." + _this.removeClass), function(i, n) {
                        removeTextArray.push($(n).text());
                    });
                }

                _this.removeTextArray = removeTextArray;
            }

            // 是否开启去重处理，如果开启则需要将之前收集的去重数据从下拉列表的数据源中一一排除
            if (_this.isOpenRemove) {
                $.each(list, function(i, n) {
                    var flag = false;
                    $.each(_this.removeTextArray, function(j, k) {
                        if (n[_this.props.text] == k) {
                            flag = true;
                            return false;
                        }
                    });
                    if (!flag) {
                        newList.push(n);
                    }
                });
            } else {
                newList = list;
            }

            
            $.each(newList, function(i, n) {
                var dataAttr = "";
                // 将props内全部设置为自定义属性
                for (var propsItem in _this.props) {
                    dataAttr = dataAttr + 'data-' + propsItem + '="' + n[_this.props[propsItem]] + '" ';
                }

                if(isValue){
                    if (optionChoiced && optionChoiced == n[_this.props.text]) {
                        newHtml += "<li class='js-autoSelectSearch-option autoSelectSearch-optionChoiced " + _this.optionChoicedClass + "' " + dataAttr + ">" + n[_this.props.text] + "</li>";
                    } else {
                        newHtml += "<li class='js-autoSelectSearch-option' " + dataAttr + ">" + n[_this.props.text] + "</li>";
                    }
                }else{
                    if (optionChoiced && optionChoiced == n[_this.choicedType]) {
                        newHtml += "<li class='js-autoSelectSearch-option autoSelectSearch-optionChoiced " + _this.optionChoicedClass + "' " + dataAttr + ">" + n[_this.props.text] + "</li>";
                    } else {
                        newHtml += "<li class='js-autoSelectSearch-option' " + dataAttr + ">" + n[_this.props.text] + "</li>";
                    }
                }
            });
            $(optionBox).html(newHtml);
            if (optionBox.children().length > 0) {
                optionBox.scrollTop(0);
                optionBox.show();
            } else {
                optionBox.hide();
            }
        },
        optionScroll: function(optionBox) {
            /**
             * 将下拉列表滚动到选中项
             * @param {*下拉列表的容器} optionBox 
             */
            var _this = this;
            optionBox.find(".autoSelectSearch-optionChoiced").length && optionBox.find(".autoSelectSearch-optionChoiced")[0].scrollIntoView();
        },
        makeSurePosition: function(element, optionBox) {
            /**
             * 确定下拉列表的位置
             * @param {*input对象} element 
             * @param {*下拉列表的父容器对象} optionBox 
             */
            var _this = this;
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
        },
        autoSelectSearchOptionClick: function(element) {
            /**
             * 下拉列表的点击事件
             * @param {*下拉列表的当前点击项} element 
             */
            var _this = this;
            var elementText = element.text();
            var callAttr = {};
            var targetOptionBox = element.parent(".js-autoSelectSearch-optionBox");
            var targetAllBox = element.parentsUntil(".js-autoSelectSearch-box").parent(".js-autoSelectSearch-box");

            // 将所有自定义属性获取出来
            for (var propsItem in _this.props) {
                callAttr[propsItem] = element.attr("data-" + propsItem);
            }
            var elementInput = targetAllBox.find(".js-autoSelectSearch-input");
            elementInput.val(elementText);
            if (_this.isOptionChoiced) {
                for (var propsItem in _this.props) {
                    if (_this.choicedType == _this.props[propsItem]) {
                        _this.choiced = callAttr[propsItem];
                        elementInput.attr("data-optionChoiced", callAttr[propsItem]);
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
                target: element,
                targetText: elementText,
                targetAttr: callAttr,
                targetInput: elementInput,
                targetOptionBox: targetOptionBox,
                targetAllBox: targetAllBox
            };
            _this.optionClickFun(callData);
        }
    };

    $.fn.autoSelectSearchOptions = {};
    $.fn.autoSelectSearch = function(options) {

        var options = $.extend({}, $.fn.autoSelectSearchDefaults, options);
        $.fn.autoSelectSearchOptions = options;

        // 简单的类型检测
        if (typeof(options.props) != "object") {
            console.log("请确定 props 是否是object类型");
            return false;
        }
        if (options.key != options.props.label &&
            options.key != options.props.text) {
            console.log("请确定 key 值是否正确");
            return false;
        }
        if (typeof(options.isNeedCaret) != "boolean") {
            console.log("请确定 isNeedCaret 是否是boolean类型");
            return false;
        }
        if (typeof(options.isNeedSpell) != "boolean") {
            console.log("请确定 isNeedSpell 是否是boolean类型");
            return false;
        }
        if (typeof(options.isOptionChoiced) != "boolean") {
            console.log("请确定 isOptionChoiced 是否是boolean类型");
            return false;
        }
        if (options.isOptionChoiced && !options.choicedType) {
            console.log("请输入 choicedType 参数");
            return false;
        } else if (options.choicedType != options.props.label &&
            options.choicedType != options.props.text&& 
            options.choicedType != options.props.spell &&
            options.choicedType != options.props.simpleSpell) {
            console.log("请确定 choicedType 值是否正确");
            return false;
        }
        if (typeof(options.isSetSelectionRange) != "boolean") {
            console.log("请确定 isSetSelectionRange 是否是boolean类型");
            return false;
        }
        if (typeof(options.isOpenRemove) != "boolean") {
            console.log("请确定 isOpenRemove 是否是boolean类型");
            return false;
        }
        if (typeof(options.isEnter) != "boolean") {
            console.log("请确定 isEnter 是否是boolean类型");
            return false;
        }
        if (typeof(options.isEnterCongruent) != "boolean") {
            console.log("请确定 isEnterCongruent 是否是boolean类型");
            return false;
        }
        if (options.isNeedSpell) {
            if (options.key != options.props.label &&
                options.key != options.props.text &&
                options.key != options.props.spell &&
                options.key != options.props.simpleSpell) {
                console.log("请确定 key 值是否正确");
                return false;
            }
            if (options.spellKey != options.props.label &&
                options.spellKey != options.props.text &&
                options.spellKey != options.props.spell &&
                options.spellKey != options.props.simpleSpell) {
                console.log("请确定 spellKey 值是否正确");
                return false;
            }
            if (options.simpleSpellKey != options.props.label &&
                options.simpleSpellKey != options.props.text &&
                options.simpleSpellKey != options.props.spell &&
                options.simpleSpellKey != options.props.simpleSpell) {
                console.log("请确定 simpleSpellKey 值是否正确");
                return false;
            }
        }

        this.each(function(index, inputElement) {
            var optionBox = $(inputElement).parent(".js-autoSelectSearch-box").find(".js-autoSelectSearch-optionBox");
            var optionCaret = $(inputElement).siblings(".js-autoSelectSearch-caret");

            /** 如果value值为空
             * 判断是否需要设置选中项
             * 根据choicedType判断选中项的值的对应项
             * 将对应项的值赋值到input
             */
            if (!$.trim($(inputElement).val())) {
                if (options.isOptionChoiced) {
                    var optionChoicedName = $(inputElement).attr("data-optionchoiced");
                    var valueText;
                    $.each(options.dataList, function(j, k) {
                        if (k[options.choicedType] && k[options.choicedType] == optionChoicedName) {
                            valueText = k[options.props.text];
                            return false;
                        }
                    });
                    $(inputElement).val(valueText);
                }
            }else{
                /** 如果value值存在，则设置的data-optionchoiced无效，且会被更新
                 * 根据choicedType判断将value值的text值转换为相应的choicedType值
                 * 将choicedType值设置到自定义属性data-optionchoiced
                 */
                var optionchoiced;
                var inputValue = $.trim($(inputElement).val());
                $.each(options.dataList, function(i, n) {
                    var item;
                    if(n[options.props.text] == inputValue){
                        item = n;
                    }else{
                        return true;
                    }
                    $.each(options.dataList, function(j, k) {
                        if (k[options.choicedType] && k[options.choicedType] == item[options.choicedType]) {
                            optionchoiced = k[options.choicedType];
                            return false;
                        }
                    });
                });
                $(inputElement).attr("data-optionchoiced", optionchoiced);
            }

            if (options.isNeedCaret) {
                optionCaret.show().on("click", function() {
                    $(inputElement).focus();
                    return false;
                });
            }

            $(inputElement).on("focus", function() {
                var _this = $(this);
                var _thisValue = $.trim(_this.val());
                var _thisOptionBox = _this.parent(".js-autoSelectSearch-box").find(".js-autoSelectSearch-optionBox");
                options.autoSelectSearchOldValue = _thisValue;
                options.optionBox = _thisOptionBox;
                _this.removeClass(options.focusOut).addClass(options.focusIn);

                // 如果值不存在，则直接获取data-optionchoiced渲染下拉列表
                if (!_thisValue) {
                    options.isOptionChoiced && (options.choicedName = _this.attr("data-optionchoiced"));
                    options.addAutoSelectHtml(options.dataList, _thisOptionBox, options.choicedName);
                    options.optionScroll(_thisOptionBox);
                    options.makeSurePosition(_this, _thisOptionBox);
                } else {
                    var isValue = true;
                    options.isOptionChoiced && (options.choicedName = _this.attr("data-optionchoiced"));

                    // 选中值以value为主
                    options.choicedName = options.choicedName == _thisValue ? _thisValue : _thisValue;

                    // 如果开启input获取焦点内部内容选中
                    options.isSetSelectionRange && _this[0].setSelectionRange(0, _thisValue.length);

                    options.addAutoSelectHtml(options.dataList, _thisOptionBox, options.choicedName, isValue);
                    options.optionScroll(_thisOptionBox);
                    options.makeSurePosition(_this, _thisOptionBox);
                }
            }).on("input", function() {
                var _this = $(this);
                var _thisValue = $.trim(_this.val());
                var _thisOptionBox = _this.parent(".js-autoSelectSearch-box").find(".js-autoSelectSearch-optionBox");
                options.isOptionChoiced && (options.choicedName = _this.attr("data-optionchoiced"));

                function isIncludeValue(obj) {
                    if (options.isNeedSpell) {
                        return (obj[options.key] ? obj[options.key].toLowerCase().indexOf(_thisValue.toLowerCase()) > -1 : false) ||
                            (obj[options.simpleSpellKey] ? obj[options.simpleSpellKey].toLowerCase().indexOf(_thisValue.toLowerCase()) > -1 : false) ||
                            (obj[options.spellKey] ? obj[options.spellKey].toLowerCase().indexOf(_thisValue.toLowerCase()) > -1 : false);
                    } else {
                        return (obj[options.key] ? obj[options.key].toLowerCase().indexOf(_thisValue.toLowerCase()) > -1 : false);
                    }
                }
                var newUsers = options.dataList.filter(isIncludeValue);
                if (newUsers.length > 0) {
                    options.addAutoSelectHtml(newUsers, _thisOptionBox, options.choicedName);
                    options.makeSurePosition(_this, _thisOptionBox);
                } else {
                    _thisOptionBox.hide();
                }
                _this.removeClass(options.focusOut).addClass(options.focusIn);
            }).on("keydown", function(event) {
                if (options.isEnter) {
                    var _this = $(this);
                    var _thisValue = $.trim(_this.val());
                    var _thisOptionBox = _this.parent(".js-autoSelectSearch-box").find(".js-autoSelectSearch-optionBox");

                    var keyCoade = event.which ? event.which : event.keyCode;
                    if (keyCoade == 13) {
                        if (_thisOptionBox.children().length > 0) {
                            var _thisOptionFirst = _thisOptionBox.children().eq(0);
                            if (options.isEnterCongruent) {
                                if (options.isNeedSpell) {
                                    if (_thisValue.toLowerCase() == _thisOptionFirst.attr("data-text").toLowerCase() ||
                                        _thisValue.toLowerCase() == _thisOptionFirst.attr("data-label").toLowerCase() ||
                                        _thisValue.toLowerCase() == _thisOptionFirst.attr("data-spell").toLowerCase() ||
                                        _thisValue.toLowerCase() == _thisOptionFirst.attr("data-simplespell").toLowerCase()) {
                                        options.autoSelectSearchOptionClick(_thisOptionFirst);
                                        _thisOptionBox.hide();
                                        _this.removeClass(options.focusIn).addClass(options.focusOut);
                                    } else {
                                        return false;
                                    }
                                } else {
                                    if (_thisValue.toLowerCase() == _thisOptionFirst.attr("data-text").toLowerCase() ||
                                        _thisValue.toLowerCase() == _thisOptionFirst.attr("data-label").toLowerCase()) {
                                        options.autoSelectSearchOptionClick(_thisOptionFirst);
                                        _thisOptionBox.hide();
                                        _this.removeClass(options.focusIn).addClass(options.focusOut);
                                    } else {
                                        return false;
                                    }
                                }
                            } else {
                                options.autoSelectSearchOptionClick(_thisOptionFirst);
                                _thisOptionBox.hide();
                                _this.removeClass(options.focusIn).addClass(options.focusOut);
                            }
                        }
                    }
                }
            }).on("blur", function(){
                var _this = $(this);
                var _thisOptionBox = _this.parent(".js-autoSelectSearch-box").find(".js-autoSelectSearch-optionBox");
                setTimeout(function(){
                    _thisOptionBox.hide();
                    _this.removeClass(options.focusIn).addClass(options.focusOut);
                }, 300);
            });

            $(optionBox).off("click.autoSelectSearch").on("click.autoSelectSearch", ".js-autoSelectSearch-option", function() {
                var _this = $(this);
                optionBox.hide();
                $(inputElement).removeClass(options.focusIn).addClass(options.focusOut);
                options.autoSelectSearchOptionClick(_this);
            });

            $(window).off("click.autoSelectSearch").on("click.autoSelectSearch", function(event) {
                var objTarget = event.target;
                $(".js-autoSelectSearch-input").not($(objTarget)).removeClass(options.focusIn).addClass(options.focusOut).parent(".js-autoSelectSearch-box").find(".js-autoSelectSearch-optionBox").hide();
                $.each($(".js-autoSelectSearch-input"), function(i, n) {
                    var optionchoiced = $(n).attr("data-optionchoiced");
                    if (optionchoiced){
                        var choicedItem = options.dataList.filter(function (item) {
                            return item[options.choicedType] == optionchoiced;
                        });
                        if (choicedItem.length && !$(n).val()) {
                            $(n).val(choicedItem[0][options.props.text]);
                        }
                    }
                });
            });

        });

        return this;
    };
    $.fn.optionBoxEmpty = function(offEvent = false) {
        /**
         * 清空下拉列表
         * @param {boolean} offEvent offEvent默认值是false，仅做置空处理，true也会将绑定的事件都清除
         */
        this.each(function(index, inputElement) {
            $(inputElement).parent(".js-autoSelectSearch-box").find(".js-autoSelectSearch-optionBox").empty();
            offEvent && $(inputElement).off();
        });
        return this;
    };
    $.fn.changeSelected = function(options) {
        /**
         * 在外部修改选中项
         * @param {string} choiced 指定选中项的值，请确保如果指定了choicedType值，在指定值得时候请指定相应的内容
         */
        var options = $.extend({}, $.fn.autoSelectSearchOptions, options);
        this.each(function(index, inputElement) {
            $(inputElement).attr("data-optionchoiced", options.choiced);
            var choicedItem = options.dataList.filter(function(item){
                return item[options.choicedType] == options.choiced;
            });
            $(inputElement).val(choicedItem[0][options.props.text]);
        });
        return this;
    };
})(jQuery);