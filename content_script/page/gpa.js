/**
 * Electsys++ Project
 * ----------------------------
 * GPA 查询优化模块
 */


function optimize_gpa_query() {
	if (!inUrl("/edu/StudentScore/StudentScoreQuery.aspx"))
		return;
    
    // 更新下拉框学期（与成绩模块共用）
    score_update_semester();

    // 没有成绩时返回（与成绩模块共用）
	if (!score_has_result_table())
		return;
    
    // 插入样式表（与成绩模块共用）
    score_insert_css();

	// 解析数据
    let course_list = gpa_scan_gpa();

    // 启用筛选（与成绩模块共用）
    score_enable_select(course_list);
}

/**
 * 读取课程数据
 * @return array 课程数组
 */
function gpa_scan_gpa() {
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
            let row_info = gpa_parse_row(row);

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
                return true;
            }
        });

    return course_list;
}

/**
 * 解析一行课程数据
 * @return object 课程数据
 */
function gpa_parse_row(row) {
    // 初始化
    let row_info = {
        is_head: false,
        is_selected: false,
        is_final: true,
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
    row_info.score      = columns.eq(2).text() - 0;
    row_info.credit     = columns.eq(3).text() - 0;
    row_info.gpa        = columns.eq(4).text() - 0;

    // 无效数据不列入计算
    if (isNaN(row_info.gpa - 0) || isNaN(row_info.score - 0)) {
        row_info.gpa = 0;
        row_info.score = 0;
        row_info.credit = 0;
    }

    // 兼容成绩模块
    row_info.percent_score = row_info.score;

    return row_info;
}

