/**
 * Electsys++ Project
 * ----------------------------
 * 成绩 / GPA 转换
 */

function score_fix(score, fix_pass) {
    // 对于 P 的处理待改进
    switch (score) {
        case "成绩":    return "GPA";
        case "A+":      return 95;
        case "A":       return 90;
        case "A-":      return 85;
        case "B+":      return 80;
        case "B":       return 75;
        case "B-":      return 70;
        case "C+":      return 67;
        case "C":       return 65;
        case "C-":      return 63;
        case "D":       return 60;
        case "通过":    return (fix_pass ? 85 : score);
        default:        return score;
    }
}

function score2gpa(score) {
    if (score >= 0) {
        if (score >= 95)    return 4.30;
        if (score >= 90)    return 4.00;
        if (score >= 85)    return 3.70;
        if (score >= 80)    return 3.30;
        if (score >= 75)    return 3.00;
        if (score >= 70)    return 2.70;
        if (score >= 67)    return 2.30;
        if (score >= 65)    return 2.00;
        if (score >= 63)    return 1.70;
        if (score >= 60)    return 1.00;
        return 0.00;
    }
    return score;
}