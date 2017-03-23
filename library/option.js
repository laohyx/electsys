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
            //console.log(key, val_checked, val_unchecked, val_default);
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
                if (val == null) {
                    val = val_default;
                    option.set(key, val);
                }
                if (val === val_checked) {
                    checkbox.prop('checked', true);
                }
                //console.log(val, val_checked, val_unchecked);

                checkbox.change(function () {
                    //console.log('changed');
					//console.log(key);
                    let val = checkbox.prop('checked') ? val_checked : val_unchecked;
					//console.log(val);
                    option.set(key, val)
                        .then(function () {
                            if (chrome.runtime.lastError) {
                                console.log(chrome.runtime.lastError);
                            }
                        });
						
					if (key === 'recongnize_captcha') {
						if (val) {
							$('#checkbox2-8').removeAttr('disabled');
						}else{
							if ($('#checkbox2-8').prop('checked')) $('#checkbox2-8').click();
							$('#checkbox2-8').attr('disabled','disabled');
							$('#usr').attr('disabled','disabled');
							$('#pwd').attr('disabled','disabled');
						}
					}else if (key === 'auto_login') {
						if (val) {
							$('#usr').removeAttr('disabled','disabled');
							$('#pwd').removeAttr('disabled','disabled');
						}else{
							$('#usr').attr('disabled','disabled');
							$('#pwd').attr('disabled','disabled');
						}
					}
					
                });
            });
        });
    }

	
    function initButton() {
        $('#reset-btn').click(function () {
            option.clear();
            initOptions();
        });
		$('#submit-btn').click(function () {
			if (!($('#checkbox2-7').prop('checked') && $('#checkbox2-8').prop('checked'))) {
				return false;
			}
			let usr = $('#usr').val();
			let pwd = $('#pwd').val();
			if ((usr==='')||(pwd==='')) {
				return false;
			}
			option.set('usr', usr)
				.then(function () {
					if (chrome.runtime.lastError) {
						console.log(chrome.runtime.lastError);
					}
				});
			option.set('pwd', pwd)
				.then(function () {
					if (chrome.runtime.lastError) {
						console.log(chrome.runtime.lastError);
					}
				});
		});
    }

    $(document).ready(function () {
        initVersion();
        initOptions();
        initButton();
    });
}(window, document, $));
