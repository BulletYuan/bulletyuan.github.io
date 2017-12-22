// ��ȡ gulp
var gulp = require('gulp')
// ��ȡ gulp-less ģ��
var less = require('gulp-less')

// ����less
// ������������ gulp less ����������
gulp.task('less', function () {
    // 1. �ҵ� less �ļ�
    gulp.src(['**.less'])
    // 2. ����Ϊcss
        .pipe(less())
    // 3. ����ļ�
        .pipe(gulp.dest('css'))
});

// ��������ʹ�� gulp auto ����������
gulp.task('auto', function () {
    // �����ļ��޸ģ����ļ����޸���ִ�� less ����
    gulp.watch('**.less', ['less'])
})

// ʹ�� gulp.task('default') ����Ĭ������
// ��������ʹ�� gulp ���� less ����� auto ����
gulp.task('default', ['less', 'auto'])