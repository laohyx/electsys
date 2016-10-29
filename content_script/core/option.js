/**
 * Electsys++ Project
 * ----------------------------
 * 设置模块
 */

(function (window) {
    'use strict';

    let option = {};

    /**
     * 获取设置值
     * @param String key 
     * @param Object default_val
     */
    option.get = function (key, default_val) {
        //console.log('get', key, default_val);
        let val = localStorage.getItem(key);
        if (typeof val == 'string') {
            try {
                val = JSON.parse(val);
            } catch (e) {
                console.log('Deserialize option failed');
            }
        }

        default_val = default_val || null;
        //console.log(val);
        
        return (val === null) ? default_val : val;
    };

    /**
     * 获取设置的布尔值
     * @param String key
     * @return Boolean
     */
    option.getBool = function (key) {
        //console.log('getBool', key);
        let val = option.get(key, false);
        return Boolean(val);
    };

    /**
     * 设置指定项
     * @param String key
     * @param Object value
     */
    option.set = function (key, value) {
        //console.log('set', key, value);
        localStorage.setItem(key, JSON.stringify(value));
    };

    /**
     * 判断指定项是否存在
     * @param String key
     * @return Boolean
     */
    option.has = function (key) {
        //console.log('has', key);
        return this.get(key, null) !== null;
    };

    window.option = option;
}(window));
