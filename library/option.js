/**
 * Electsys++ Project
 * ----------------------------
 * 设置页面
 */

(function (window, document, $) {
    'use strict';

    let option = window.option;

    function initVersion() {
        $.getJSON(chrome.extension.getURL('manifest.json'))
            .then(function (data) {
                $('#ext-version').text(data['version']);
            });
    }

    function initOptions() {        
        $('input[type=checkbox]').each(function () {
            let checkbox = $(this);
            let key = checkbox.data('key');
            let val_checked = checkbox.data('checked');
            let val_unchecked = checkbox.data('unchecked');
            let val_default = checkbox.data('default');
            let val_enabled = checkbox.data('enabled-key') || '';
            console.log(key, val_checked, val_unchecked, val_default, val_enabled);
            if (!key ||
                val_checked === undefined ||
                val_unchecked === undefined ||
                val_default === undefined) {
                return true;
            }
            try {
                val_checked = JSON.parse(val_checked);
                val_unchecked = JSON.parse(val_unchecked);
                val_default = JSON.parse(val_default);
            } catch (e) { }

            option.getAsync(key).then(function (val) {
                //console.log(key,val);
                if (val == null) {
                    val = val_default;
                    option.set(key, val);
                }

                checkbox.prop('checked', (val === val_checked));

                checkbox.change(function () {
                    let val = checkbox.prop('checked') ? val_checked : val_unchecked;

                    $(`*[data-enabled-key=${key}]`).trigger('change-enable', [val]);

                    option.set(key, val)
                        .then(function () {
                            if (chrome.runtime.lastError) {
                                console.log(chrome.runtime.lastError);
                            }
                        });
                });
            });

            if (val_enabled != '') {
                checkbox.on('change-enable', function (event, val) {
                    checkbox.prop('disabled', !(val));

                    $(`*[data-enabled-key=${key}]`).trigger('change-enable',
                        [val && checkbox.prop('checked') ? val_checked : val_unchecked]);
                });

                checkbox.prop('disabled', $(`input[data-key=${val_enabled}]`).prop('disabled') ||
                                            !option.getBool(val_enabled,
                                                $(`input[data-key=${val_enabled}]`).data('data-checked')));
            }
        });
    }

    function initInput() {
        $('input[type=text],input[type=password]').each(function () {
            let input = $(this);
            let key = input.data('key');
            let val_default = input.data('default');
            let val_enabled = input.data('enabled-key') || '';
            console.log(key, val_default, val_enabled);
            if (!key ||
                val_default === undefined) {
                return true;
            }
            try {
                val_default = JSON.parse(val_default);
            } catch (e) { }

            option.getAsync(key).then(function (val) {
                console.log(key, val);
                if (val == null) {
                    val = val_default;
                    option.set(key, val);
                }
                input.val(val || '');

                input.on('save', function () {
                    option.set(key, input.val() || '')
                        .then(function () {
                            if (chrome.runtime.lastError) {
                                console.log(chrome.runtime.lastError);
                            }
                        });
                });
            });

            if (val_enabled != '') {
                input.on('change-enable', function (event, val) {
                    input.prop('disabled', !(val));
                });

                input.prop('disabled', $(`input[data-key=${val_enabled}]`).prop('disabled') ||
                                            !option.getBool(val_enabled,
                                                $(`input[data-key=${val_enabled}]`).data('data-checked')));
            }
        });
    }
    
    function initButton() {
        $('#reset-btn').click(function () {
            option.clear();
            initOptions();
            initInput();
        });

        $('button').each(function () {
            let button = $(this);
            let val_enabled = button.data('enabled-key') || '';
            let save_keys = button.data('save-keys');
            let success_msg = button.data('success-msg');

            if (val_enabled != '') {
                button.on('change-enable', function (event, val) {
                    console.log(val);
                    button.prop('disabled', !(val));
                });

                button.prop('disabled', $(`input[data-key=${val_enabled}]`).prop('disabled') ||
                                            !option.getBool(val_enabled,
                                                $(`input[data-key=${val_enabled}]`).data('data-checked')));
            }

            if (save_keys === undefined ||
                success_msg === undefined) {
                return true;
            }

            try {
                save_keys = save_keys.split(',');
                success_msg = $(success_msg);
            } catch (e) {}

            success_msg.removeClass('in');

            button.click(function () {
                success_msg.addClass('in');

                setTimeout(function () {
                    success_msg.removeClass('in');
                }, 2000);

                save_keys.forEach(function (key) {
                    $(`input[data-key=${key}]`).trigger('save');
                });
            });
        });
    }

    $(document).ready(function () {
        initVersion();

        option.init()
            .then(function () {
                initOptions();
                initInput();
                initButton();
            });
    });
}(window, document, $));
