/**
 * Electsys++ Project
 * ----------------------------
 * 核心课程成绩优化模块
 */

/**
 * 样式表
 */
const core_course_css = `
<style>
    #electsys-gpa-tip {
        padding-top: 12px;
        padding-bottom: 8px;
        font-size: 12px;
    }
    #electsys-gpa-tip > a {
        color: #337ab7;
        text-decoration: none;
    }
    #electsys-gpa-tip > a:hover,
    #electsys-gpa-tip > a:focus {
        color: #23527c;
        text-decoration: underline;
    }

    .electsys-course:nth-of-type(even) {
        background-color: #ccc;
    }
    .electsys-course:hover {
        background-color: #9eaebb;
    }

    .electsys-course.selected {
        background-color: #98c3e6;
    }
    .electsys-course.selected:hover {
        background-color: #82add0;
    }
</style>
`;

/**
 * 核心课程优化入口
 */
function optimize_core_course() {
    if (!inUrl('/edu/student/CoreCourses.aspx') ||
        !option.getBool('optimize_core_course', true)) {
        return;
    }

    // 插入样式表
    core_course_insert_css();

    // 添加 GPA 列
    let course_list = core_course_append_gpa();

    // 启用筛选
    core_course_enable_select(course_list);
}

/**
 * 添加核心课程 CSS
 */
function core_course_insert_css() {
    jQuery('body').append(core_course_css);
}

/**
 * 添加核心课程的 GPA 显示
 * @return array 核心课程数组
 */
function core_course_append_gpa() {
    let table = core_course_get_table();
    if (!table) {
        return [];
    }

    let course_list = [];

    // 遍历所有行
    table.find('tr').each(function () {
        let row = jQuery(this);
        let row_info = core_course_parse_row(row);

        // 表头
        if (row_info.is_head) {
            row.append('<td>绩点</td>');
            row.attr('data-electsys-id', row_info.id);
            return true;
        }

        // 成绩行
        if (row_info.id > 0) {
            course_list[row_info.id] = row_info;
            row.append('<td>' + row_info.gpa.toFixed(1) + '</td>');
            row.attr('data-electsys-id', row_info.id);
            return true;
        }
    });

    return course_list;
}

/**
 * 获取核心课程所在的表格
 */
function core_course_get_table() {
    let table = jQuery('table#dgSet');
    return table.length > 0 ? table : null;
}

/**
 * 解析一行课程数据
 * @return object 课程数据
 */
function core_course_parse_row(row) {
    // 初始化
    let row_info = {
        is_head: false,
        is_selected: false,
        id: 0,
        course_id: '',
        score: 0,
        credit: 0,
        gpa: 0
    };

    let columns = row.children('td');

    // 判断是否为表头
    if (columns.length == 0 || !columns.first().text().match(/\d+/)) {
        row_info.is_head = true;
        return row_info;
    }

    // 解析数据
    row_info.id         = columns.eq(0).text() - 0;
    row_info.course_id  = columns.eq(-3).text().trim();
    row_info.score      = score_fix(columns.eq(-2).text().trim());  // 使用 score_fix 转换等第成绩
    row_info.credit     = columns.eq(-1).text() - 0;

    // P 和 F 等其他等第不列入计算
    if (isNaN(row_info.score - 0)) {
        row_info.credit = 0;
    }

    // 计算 GPA
    row_info.gpa        = score2gpa(row_info.score);

    return row_info;
}

/**
 * 启用筛选功能
 * @param course_list 课程数组
 */
function core_course_enable_select(course_list) {
    let table = core_course_get_table();
    if (!table) {
        return;
    }

    // 插入结果栏
    let tipTemplate = `
        <div id="electsys-gpa-tip">
            选中课程GPA：<span id="electsys-gpa">0.00</span>
            选中课程学积分：<span id="electsys-score">0.00</span>分
            <a id="electsys-select-all" style="margin-left: 2em;" href="#">全选</a>
        </div>
    `;
    table.before(tipTemplate);

    // 遍历所有行
    table.find('tr[data-electsys-id!=0]')
        .css('background-color', '')    // 移除默认背景颜色
        .addClass('electsys-course')    // 添加自定义样式类
        .click(function () {
            let row = jQuery(this);
            core_course_select_one(course_list, row);
        });

    // 处理全选按钮
    jQuery('#electsys-select-all').click(function () {
        let select_value = jQuery(this).text() == '全选';
        core_course_select_all(course_list, select_value);
        return false;
    });
}

/**
 * 选中单行课程
 * @param course_list 课程列表
 * @param row 当前行
 */
function core_course_select_one(course_list, row) {
    let row_id = row.attr('data-electsys-id') - 0;
    if (row_id <= 0) {
        return;
    }

    // 更新状态
    let is_selected = !(course_list[row_id].is_selected);
    course_list[row_id].is_selected = is_selected;
    core_course_update_color(row, is_selected);

    // 更新分数
    core_course_update_score(course_list);
}

/**
 * 选中所有课程
 * @param course_list 课程列表
 * @param select_value 全选 (true) 还是全不选 (false)
 */
function core_course_select_all(course_list, select_value) {
    let table = core_course_get_table();
    if (!table) {
        return;
    }

    table.find('tr[data-electsys-id!=0]')
        .each(function () {
            let row = jQuery(this);
            let row_id = row.attr('data-electsys-id') - 0;

            course_list[row_id].is_selected = select_value;
            core_course_update_color(row, select_value);
        });
    
    core_course_update_score(course_list);
}

/**
 * 更新当前行颜色
 * @param row 当前行
 * @param is_selected 当前行是否选中
 */
function core_course_update_color(row, is_selected) {
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
function core_course_update_score(course_list) {
    let total_credit = 0;
    let total_gpa = 0;
    let total_score = 0;
    let selected_count = 0;

    course_list.forEach(function (course) {
        if (course.is_selected) {
            ++selected_count;
            total_credit += course.credit;
            total_gpa += course.gpa * course.credit;
            total_score += course.score * course.credit;
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
