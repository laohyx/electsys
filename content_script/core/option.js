/**
 * Electsys++ Project
 * ----------------------------
 * 设置模块
 */

// Support both Chrome & other browsers
if (!browser && chrome) {
    var browser = chrome;
}

(function (window, browser) {
    'use strict';

    let option = {};
    let cachedOptions = Object.create(null);

    /**
     * 初始化缓存
     * @return Promise
     */
    option.init = function () {
        return new Promise(resolve => browser.storage.sync.get(resolve))
            .then(data => {
                cachedOptions = data;
            });
    };

    /**
     * 从缓存获取设置值
     * @param String key 
     * @param Object default_val
     * @return Object
     */
    option.get = function (key, default_val) {
        let val = cachedOptions[key];
        default_val = default_val || null;

        if (val == null) {
            val = default_val;
        }

        // 获取最新的值供下次使用
        option.getAsync(key);
        return val;
    };

    /**
     * 异步获取设置值
     * @param String key 
     * @param Object default_val
     * @return Promise<Object>
     */
    option.getAsync = function (key, default_val) {
        //console.log('get', key, default_val);
        return new Promise(resolve => browser.storage.sync.get(key, resolve))
            .then(data => {
                let val = data[key];
                cachedOptions[key] = val;

                default_val = default_val || null;
                
                return (val == null) ? default_val : val;
            })
            .catch(() => default_val);
    };

    /**
     * 获取设置的布尔值
     * @param String key
     * @param Boolean default_val
     * @return Promise<Boolean>
     */
    option.getBool = function (key, default_val) {
        //console.log(option.get(key, default_val || false));
        return Boolean(option.get(key, default_val || false));
    };

    /**
     * 设置指定项
     * @param String key
     * @param Object value
     * @return Promise
     */
    option.set = function (key, value) {
        //console.log('set', key, value);
        cachedOptions[key] = value;
        return new Promise(resolve => {
            let obj = {};
            obj[key] = value;
            browser.storage.sync.set(obj, resolve);
        });
    };

    /**
     * 判断指定项是否存在
     * @param String key
     * @return Promise<Boolean>
     */
    option.has = function (key) {
        //console.log('has', key);
        return this.get(key, null) != null;
    };

    /**
     * 清空设置
     */
    option.clear = function () {
        cachedOptions = Object.create(null);
        return new Promise(resolve => {
            browser.storage.sync.clear(resolve);
        });
    };

    window.option = option;
}(window, (browser || chrome)));
