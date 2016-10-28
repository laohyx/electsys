/**
 * Electsys++ Project
 * ----------------------------
 * 成绩查询优化模块
 */

/**
 * 样式表
 */
const score_css = `
<style>
    #electsys-score-tip {
        padding-top: 12px;
        padding-left: 10px;
        padding-bottom: 8px;
        font-size: 12px;
    }
    #electsys-score-tip > a {
        color: #337ab7;
        text-decoration: none;
    }
    #electsys-score-tip > a:hover,
    #electsys-score-tip > a:focus {
        color: #23527c;
        text-decoration: underline;
    }

    .electsys-course:hover {
        background-color: #cfc;
    }
    .electsys-course.selected {
        background-color: #fc9;
    }
    .electsys-course.selected:hover {
        background-color: #ffe5ca;
    }

    .electsys-course.passed > td:nth-child(4) {
        font-weight: 700;
        color: blue;
    }
    .electsys-course.failed > td:nth-child(4) {
        font-weight: 700;
        color: red;
    }
</style>
`;

function optimize_score_query() {
    if(!inUrl("/edu/StudentScore/B_StudentScoreQuery.aspx"))
        return;
    
    // 更新下拉框学期
    score_update_semester();

    // 没有成绩时返回
    if (!score_has_result_table())
        return;
    
    // 插入样式表
    score_insert_css();

    // 解析数据
    let course_list = score_scan_gpa();

    // 启用筛选
    score_enable_select(course_list);
}

function score_update_semester() {
    if (jQuery("#ddlXN").val() == "2010-2011" && jQuery("#ddlXQ").val() == "1" && !score_has_result_table()) {
        jQuery("#ddlXQ").find("[selected=selected]").prop("selected", false);
        jQuery("#ddlXN").find("[selected=selected]").prop("selected", false);

        jQuery("#ddlXN").find("option[value=" + opscore_year + "]").prop("selected", true);
        jQuery("#ddlXQ").find("option[value=" + opscore_semester + "]").prop("selected", true);
    }
}

function score_has_result_table() {
    return jQuery("span#lblTitle").text().length > 1;
}

/**
 * 添加 CSS
 */
function score_insert_css() {
    jQuery('body').append(score_css);
}

/**
 * 读取课程数据
 * @return array 课程数组
 */
function score_scan_gpa() {
    let table = score_get_table();
    if (!table) {
        return [];
    }

    let course_list = [];
    let course_index = 0;

    // 遍历所有行
    table.find('tr')
        .css("height", "25px")
        .each(function () {
            let row = jQuery(this);
            let row_info = score_parse_row(row);

            // 表头
            if (row_info.is_head) {
                row.attr('data-electsys-id', 0);
                return true;
            }

            // 成绩行
            if (row_info.credit > 0) {
                ++course_index;
                course_list[course_index] = row_info;
                row.attr('data-electsys-id', course_index);
                row.addClass((row_info.percent_score < 60 ? 'failed' : 'passed'));
                return true;
            }
        });

    return course_list;
}

/**
 * 获取课程所在的表格
 */
function score_get_table() {
    let table = jQuery('table#dgScore');
    return table.length > 0 ? table : null;
}

/**
 * 解析一行课程数据
 * @return object 课程数据
 */
function score_parse_row(row) {
    // 初始化
    let row_info = {
        is_head: false,
        is_selected: false,
        is_final: false,
        course_id: '',
        score: 0,
        full_score: 100,
        percent_score: 0,
        credit: 0,
        gpa: 0
    };

    let columns = row.children('td');

    // 判断是否为表头
    if (columns.length == 0 || row.hasClass('tdtit')) {
        row_info.is_head = true;
        return row_info;
    }

    // 解析数据
    row_info.course_id  = columns.eq(0).text().trim();
    row_info.credit     = columns.eq(2).text() - 0;
    row_info.score      = columns.eq(3).text();
    row_info.full_score = columns.eq(5).text().replace(/分/, '') - 0;
    row_info.is_final 	= columns.eq(6).text().trim() == '是';

    // 无效数据不列入计算
    if (isNaN(row_info.full_score)) {
        row_info.score = 0;
        row_info.full_score = 100;
        row_info.credit = 0;
    }

    // 修正等第制成绩（包括 P 项）
    if (isNaN(row_info.score)) {
        row_info.score = score_fix(row_info.score, true) * row_info.full_score / 100;

        // 无效数据不列入计算
        if (isNaN(row_info.score - 0)) {
            row_info.score = 0;
            row_info.credit = 0;
        }
    }

    // 计算百分制成绩和 GPA
    row_info.percent_score 	= row_info.score * 100 / row_info.full_score;
    row_info.gpa        	= score2gpa(row_info.percent_score);

    return row_info;
}

/**
 * 启用筛选功能
 * @param course_list 课程数组
 */
function score_enable_select(course_list) {
    let table = score_get_table();
    if (!table) {
        return;
    }

    // 插入结果栏
    let tipTemplate = `
        <div id="electsys-score-tip">
            选中课程平均成绩：<span id="electsys-score">0.00</span>分&nbsp;&nbsp;
            选中课程GPA：<span id="electsys-gpa">0.00</span>
            <a id="electsys-select-all" style="margin-left: 2em;" href="#">全选</a>
        </div>
    `;
    table.before(tipTemplate);

    // 遍历所有行
    table.find('tr[data-electsys-id!=0]')
        .addClass('electsys-course')    // 添加自定义样式类
        .click(function () {
            let row = jQuery(this);
            score_select_one(course_list, row);
        });

    // 处理全选按钮
    jQuery('#electsys-select-all').click(function () {
        let select_value = jQuery(this).text() == '全选';
        score_select_all(course_list, select_value);
        return false;
    });
}

/**
 * 选中单行课程
 * @param course_list 课程列表
 * @param row 当前行
 */
function score_select_one(course_list, row) {
    let row_id = row.attr('data-electsys-id') - 0;
    if (row_id <= 0) {
        return;
    }

    // 更新状态
    let is_selected = !(course_list[row_id].is_selected);
    course_list[row_id].is_selected = is_selected;
    score_update_color(row, is_selected);

    // 更新分数
    score_update_score(course_list);
}

/**
 * 选中所有课程
 * @param course_list 课程列表
 * @param select_value 全选 (true) 还是全不选 (false)
 */
function score_select_all(course_list, select_value) {
    let table = score_get_table();
    if (!table) {
        return;
    }

    table.find('tr[data-electsys-id!=0]')
        .each(function () {
            let row = jQuery(this);
            let row_id = row.attr('data-electsys-id') - 0;

            course_list[row_id].is_selected = select_value;
            score_update_color(row, select_value);
        });
    
    score_update_score(course_list);
}

/**
 * 更新当前行颜色
 * @param row 当前行
 * @param is_selected 当前行是否选中
 */
function score_update_color(row, is_selected) {
    let row_id = row.attr('data-electsys-id') - 0;
    if (row_id <= 0) {
        return;
    }

    row.removeClass('selected');
    if (is_selected) {
        row.addClass('selected');
    }
}

/**
 * 更新分数
 * @param course_list 课程列表
 */
function score_update_score(course_list) {
    let total_credit = 0;
    let total_gpa = 0;
    let total_score = 0;
    let selected_count = 0;

    course_list.forEach(function (course) {
        if (course.is_selected && course.is_final) {
            ++selected_count;
            total_credit += course.credit;
            total_gpa += course.gpa * course.credit;
            total_score += course.percent_score * course.credit;
        }
    });

    // 避免被零除
    total_credit = Math.max(0.5, total_credit);

    // 计算结果并显示
    let average_gpa = total_gpa / total_credit;
    let average_score = total_score / total_credit;

    jQuery('#electsys-gpa').text(average_gpa.toFixed(2));
    jQuery('#electsys-score').text(average_score.toFixed(2));

    // 更新按钮文字
    jQuery('#electsys-select-all').text(selected_count > 0 ? '全不选' : '全选');
}

/**
 * 首页插入成绩
 */
function optimize_index_score_query() {
    if (!inUrl("newsBoard/newsInside.aspx"))
        return 0;

    let l = jQuery("#Form1").children().length;
    jQuery("#Form1")
        .children().slice(l - 1, l)
        .append(`
            <tr>
                <td class='tit' id='fold_index_score' style='cursor:pointer;'>
                    <img height='18' src='../imgs/arrowdown.gif' width='18'>本学期成绩
                    <span style='font-size: 0.8em; float: right; letter-spacing: 0;'>折叠/展开</span>
                </td>
            </tr>
            <tr class='laohyx_tr'><td>
            <div id='index_score_div' style='padding-top: 2px;'>
                <p><span style='cursor: pointer;'>点击此处查询</span></p>
            </div>
        </td></tr>
        `);
    
    jQuery('#fold_index_score').click(function () {
        localStorage['fold_index_socre'] = jQuery("#index_score_div").css("display") == "none" ? 0 : 1;
        //console.log(localStorage['fold_index_socre']);
        //console.log(jQuery("#index_score_div").height());
        jQuery("#index_score_div").slideToggle();
    });

    if (localStorage['fold_index_socre'] != undefined &&
        localStorage['fold_index_socre'] == 1) {
        jQuery("#index_score_div").slideToggle(0);
        index_show_score_register_click();
    } else {
        jQuery("#index_score_div > p").text('正在查询成绩……');
        index_show_score_query();
    }
}

function index_show_score_register_click() {
    jQuery('#index_score_div span').click(function (e) {
        jQuery(this).parent().text('正在查询成绩……');
        index_show_score_query();

        e.preventDefault();
    });
}

function index_show_score_query() {
    // 查询所有成绩后筛选，避免和用户手动查询冲突
    jQuery.get(base_url + '/edu/StudentScore/B_StudentScoreQuery.aspx')
        // 使用 Promise 避免回调地狱
        .then(function (html) {
            html = jQuery(html);
            //console.log(html);
            let vs = html.find('#__VIEWSTATE').val();
            let vg = html.find('#__VIEWSTATEGENERATOR').val();
            let ev = html.find('#__EVENTVALIDATION').val();

            return jQuery.post(
                base_url + '/edu/StudentScore/B_StudentScoreQuery.aspx',
                {
                    '__EVENTVALIDATION': ev,
                    '__VIEWSTATE': vs,
                    '__VIEWSTATEGENERATOR': vg,
                    'ddlXN': '2014-2015',//opscore_year,
                    'ddlXQ': opscore_semester,
                    'txtKCDM': '',
                    'btnSearchDetail': '查询明细成绩单'
                }
            );
        })
        .then(function (html) {
            html = jQuery(html);
            let score_table = html.find('#dgScore');
            if (score_table.length == 0) {
                throw new Error('Incorrect page loaed');
            }

            // 删除非最终成绩行
            score_table.find('tr')
                .filter(function (index) {
                    // 删除无用列
                    jQuery(this).children('td').eq(-1).remove();

                    // 表头
                    if (index == 0)
                        return false;

                    let not_final = jQuery(this).children('td').eq(-1).text().trim() != '是';
                    return not_final;
                })
                .remove();
            
            // 补偿样式
            score_table.find('tbody > tr:nth-child(odd)')
                .removeClass('tdcolour2')
                .addClass('tdcolour1');
            score_table.find('tbody > tr:nth-child(even)')
                .removeClass('tdcolour1')
                .addClass('tdcolour2');

            // 插入表格到页面中
            jQuery('#index_score_div')
                .empty()
                .append(score_table);
        })
        .catch(function () {
            jQuery('#index_score_div')
                .empty()
                .append('<p>加载失败，请稍后<span style="cursor: pointer; color: #2a6496;">重试</span>~</p>');
            
            index_show_score_register_click();
        });
}
