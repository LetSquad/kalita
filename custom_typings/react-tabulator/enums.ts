export enum HorizontalAlignValues {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right"
}

export enum VerticalAlignValues {
    TOP = "top",
    MIDDLE = "middle",
    BOTTOM = "bottom"
}

export enum FormattersValues {
    PLAINTEXT = "plaintext",
    TEXTAREA = "textarea",
    HTML = "html",
    MONEY = "money",
    IMAGE = "image",
    LINK = "link",
    DATETIME = "datetime",
    DATETIME_DIFF = "datetimediff",
    TICK_CROSS = "tickCross",
    COLOR = "color",
    STAR = "star",
    TRAFFIC = "traffic",
    PROGRESS = "progress",
    LOOKUP = "lookup",
    BUTTON_TICK = "buttonTick",
    BUTTON_CROSS = "buttonCross",
    ROW_NUM = "rownum",
    HANDLE = "handle"
}

export enum SortersValues {
    STRING = "string",
    NUMBER = "number",
    ALPHANUM = "alphanum",
    BOOLEAN = "boolean",
    EXISTS = "exists",
    DATE = "date",
    TIME = "time",
    DATETIME = "datetime",
    ARRAY = "array"
}

export enum EditorsValues {
    INPUT = "input",
    TEXTAREA = "textarea",
    NUMBER = "number",
    RANGE = "range",
    TICK_CROSS = "tickCross",
    STAR = "star",
    SELECT = "select",
    AUTOCOMPLETE = "autocomplete"
}

export enum ValidatorsValues {
    REQUIRED = "required",
    UNIQUE = "unique",
    INTEGER = "integer",
    FLOAT = "float",
    NUMERIC = "numeric",
    STRING = "string"
}

export enum CalcsValues {
    AVG = "avg",
    MAX = "max",
    MIN = "min",
    SUM = "sum",
    CONCAT = "concat",
    COUNT = "count"
}

export enum TooltipGenerationMode {
    LOAD = "load",
    HOVER = "hover"
}

export enum RowRange {
    VISIBLE = "visible",
    ACTIVE = "active",
    SELECTED = "selected",
    ALL = "all"
}

export enum ValidationMode {
    BLOCKING = "blocking",
    HIGHLIGHT = "highlight",
    MANUAL = "manual"
}

export enum TextDirection {
    AUTO = "auto",
    RTL = "rtl",
    LTR = "ltr"
}

export enum TableLayout {
    FIT_DATA = "fitData",
    FIT_DATA_FILL = "fitDataFill",
    FIT_DATA_STRETCH = "fitDataStretch",
    FIT_DATA_TABLE = "fitDataTable",
    FIT_COLUMNS = "fitColumns"
}

export enum ResponsiveLayout {
    HIDE = "hide",
    COLLAPSE = "collapse"
}

export enum ColumnCalcsPosition {
    BOTH = "both",
    TABLE = "table",
    GROUP = "group"
}

export enum RowPos {
    TOP = "top",
    BOTTOM = "bottom"
}

export enum MovableRowsReceiverAction {
    INSERT = "insert",
    ADD = "add",
    UPDATE = "update",
    REPLACE = "replace"
}

export enum ScrollToRowPosition {
    TOP = "top",
    CENTER = "center",
    BOTTOM = "bottom",
    NEAREST = "nearest"
}

export enum AjaxContentType {
    FORM = "form",
    JSON = "json"
}

export enum FilterType {
    EQUAL = "=",
    NOT_EQUAL = "!=",
    LIKE = "like",
    KEYWORDS = "keywords",
    STARTS_WITH = "starts",
    ENDS_WITH = "ends",
    LESS_THEN = "<",
    LESS_THEN_OR_EQUAL_TO = "<=",
    GREATER = ">",
    GREATER_THEN_OR_EQUAL_TO = ">=",
    IN_ARRAY = "in",
    REGEX = "regex"
}

export enum GroupToggleElement {
    ARROW = "arrow",
    HEADER = "header"
}

export enum PaginationMethod {
    LOCAL = "local",
    REMOTE = "remote"
}

export enum PaginationAddRowType {
    PAGE = "page",
    TABLE = "table"
}

export enum PersistenceMode {
    LOCAL = "local",
    COOKIE = "coolie"
}

export enum ClipboardPasteAction {
    INSERT = "insert",
    UPDATE = "update",
    REPLACE = "replace"
}

export enum ClipboardMode {
    PASTE = "paste",
    COPY = "copy"
}

export enum AccessorType {
    DATA = "data",
    DOWNLOAD = "download",
    CLIPBOARD = "clipboard"
}
