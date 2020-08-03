import {formatMessage} from './common/localize';

/* 日期、时间格式化 */
export const DATE_FORMAT = 'L';
export const DATETIME_FORMAT = 'LLL';

/* 金额格式化 */
export const AMOUNT_FORMAT = {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
};

/* 百分比格式化 */
export const PERCENT_FORMAT = {
    style: 'percent',
    minimumFractionDigits: 1,
};

/* Table.locale.emptyText，查询失败时展示信息 */
export const COMMON_TABLE_QUERY_FAIL_TEXT = formatMessage({
    id: 'table.queryFail',
    defaultMessage: '查询失败，请重试'
});
export const COMMON_TABLE_EMPTY_TEXT = undefined;

/* 文件存取 API */
export const FILES_API = Object.freeze({
    files: '/api/v1/files'
});

/* `操作`列，固定宽度 */
export const FIXED_COLUMN_WIDTH = '44px';
/* 指定左侧固定选择列宽度，规避 Antd 默认值无效 */
export const ROWSELECTION_FIXED_COLUMN_WIDTH = '60px';

/* 分页属性 */
export const PAGE = Object.freeze({
    // 默认每页显示条数
    size: 40,
    // 默认显示第一页
    index: 0,
    // 常用于 Model 展示 Table
    smallSize: 10
});

/* Pagination 默认设置 */
export const PAGINATION_OPTIONS = Object.freeze({
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: Object.freeze(['10', '20', '30', '40']),
    showTotal: total => formatMessage({
        id: 'table.showTableTotal',
        defaultMessage: '共 {total} 条记录'
    }, {total})
});

const TABLE_SCROLL = Object.freeze({
    x: 'max-content',
    y: false
});

/* TABLE 默认设置 */
export const TABLE = Object.freeze({
    scroll: TABLE_SCROLL,
    size: 'small',
    bordered: true
});

/* Form 响应式布局 */
const FORM_ITEM_LAYOUT_OPTIONS = Object.freeze({
    labelCol: {
        xxl: {span: 6},
        xl: {span: 9},
        md: {span: 8}
    },
    wrapperCol: {
        xxl: {span: 18},
        xl: {span: 15},
        md: {span: 16}
    }
});

const FORM_ITEM_BIG_LAYOUT_OPTIONS = Object.freeze({
    labelCol: {
        xl: {span: 6},
        md: {span: 4}
    },
    wrapperCol: {
        xl: {span: 18},
        md: {span: 20}
    }
});

const FORM_ITEM_ROW_LAYOUT_OPTIONS = Object.freeze({
    labelCol: {
        xxl: {span: 2},
        xl: {span: 3},
        md: {span: 4}
    },
    wrapperCol: {
        xxl: {span: 22},
        xl: {span: 21},
        md: {span: 20}
    }
});

const FORM_ITEM_COLON = true;

export const FORM_OPTIONS = Object.freeze({
    /* Col 参数 */
    col: Object.freeze({
        xl: 8,
        md: 12
    }),
    /* Form 参数*/
    item: Object.freeze({
        ...FORM_ITEM_LAYOUT_OPTIONS,
        colon: FORM_ITEM_COLON
    })
});

export const FORM_BIG_OPTIONS = Object.freeze({
    /* Col 参数 */
    col: Object.freeze({
        xxl: 8,
        xl: 12,
        md: 24
    }),
    /* Form 参数*/
    item: Object.freeze({
        ...FORM_ITEM_BIG_LAYOUT_OPTIONS,
        colon: FORM_ITEM_COLON
    })
});

export const FORM_ROW_OPTIONS = Object.freeze({
    /* Form 参数*/
    item: Object.freeze({
        ...FORM_ITEM_ROW_LAYOUT_OPTIONS,
        colon: FORM_ITEM_COLON
    })
});
