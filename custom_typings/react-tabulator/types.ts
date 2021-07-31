import { Component } from "react";
import { BaseColumnNames, BrokerAccountColumnNames, ModelPortfolioColumnNames } from "../../src/models/table/enums";
import { RowData, TableData } from "../../src/models/table/types";
import {
    AjaxContentType,
    CalcsValues,
    ColumnCalcs,
    RowRange,
    EditorsValues,
    FilterType,
    FormattersValues,
    GroupToggleElement,
    HorizontalAlignValues,
    MovableRowsReceiverAction,
    PaginationAddRowType,
    PaginationMethod, PersistenceMode,
    ResponsiveLayout,
    RowPos,
    ScrollToRowPosition,
    SortersValues,
    TableLayout,
    TextDirection,
    TooltipGenerationMode,
    ValidationMode,
    ValidatorsValues,
    VerticalAlignValues, ClipboardPasteAction, ClipboardMode, AccessorType
} from "./enums";

export type DataTypes = string | number | boolean | object | null | undefined
| Array<string | number | boolean | object | null | undefined>;

export type Tooltip = ((cell: CellComponent) => string) | boolean | string;

export type CellMouseEventFunction = (e: MouseEvent, cell: CellComponent) => void | false;

export interface CellEvents {
    cellClick: CellMouseEventFunction;
    cellContext: CellMouseEventFunction;
    cellDblClick: CellMouseEventFunction;
    cellDblTap: CellMouseEventFunction;
    cellMouseEnter: CellMouseEventFunction;
    cellMouseLeave: CellMouseEventFunction;
    cellMouseMove: CellMouseEventFunction;
    cellMouseOut: CellMouseEventFunction;
    cellMouseOver: CellMouseEventFunction;
    cellTap: CellMouseEventFunction;
    cellTapHold: CellMouseEventFunction;
}

export interface CellComponent {
    _cell: Row;
    getValue: () => DataTypes;
    getOldValue: () => DataTypes;
    restoreOldValue: () => void;
    getInitialValue: () => DataTypes;
    restoreInitialValue: () => void;
    getElement: () => Element | undefined;
    getTable: () => Tabulator;
    getRow: () => RowComponent;
    getColumn: () => ColumnComponent;
    getData: () => RowData;
    getField: () => string;
    setValue: (newValue: DataTypes, isMutatorsApply?: boolean) => void;
    checkHeight: () => void;
    edit: (forceEdit?: boolean) => void;
    cancelEdit: () => void;
    isEdited: () => boolean;
    clearEdited: () => void;
    nav: () => {
        prev: () => void;
        next: () => void;
        left: () => void;
        right: () => void;
        up: () => void;
        down: () => void;
    };
    validate: () => void;
    isValid: () => boolean;
    clearValidation: () => void;
}

export interface Cell {
    column: Column;
    component: CellComponent;
    element: Element | false;
    height: number;
    initialValue: DataTypes;
    loaded: boolean;
    minWidth: null | number;
    modules: { [key: string]: Function };
    oldValue: DataTypes;
    row: Row;
    table: Tabulator;
    value: DataTypes;
    width: number;
    [key: string]: any;
}

export interface RowComponent {
    _row: Row;
    getData: () => RowData;
    getElement: () => Element | undefined;
    getTable: () => Tabulator;
    getNextRow: () => RowComponent | false;
    getPrevRow: () => RowComponent | false;
    getCells: () => CellComponent[];
    getCell: (column: string | ColumnComponent | Element) => CellComponent | false;
    getIndex: () => DataTypes;
    getPosition: (inFiltered?: boolean) => number;
    getGroup: () => GroupComponent | false;
    delete: Promise<void>;
    scrollTo: Promise<void>;
    pageTo: Promise<void>;
    move: (moveToRow: number | RowComponent | Element, isAbove: boolean) => void;
    update: Promise<(value: { [key: string]: DataTypes }) => void>;
    select: () => void;
    deselect: () => void;
    toggleSelect: () => void;
    isSelected: () => boolean;
    normalizeHeight: () => void;
    reformat: () => void;
    freeze: () => void;
    unfreeze: () => void;
    isFrozen: () => boolean;
    treeExpand: () => void;
    treeCollapse: () => void;
    treeToggle: () => void;
    getTreeParent: () => RowComponent | false;
    getTreeChildren: () => RowComponent | false;
    validate: () => true | CellComponent[];
}

export interface Row {
    cells: Cell[];
    data: RowData;
    component: RowComponent;
    created: boolean;
    element: Element | false;
    height: number;
    heightInitialized: boolean;
    heightStyled: string;
    initialized: boolean;
    manualHeight: boolean;
    modules: { [key: string]: Function };
    outerHeight: number;
    parent: RowManager;
    table: Tabulator;
    type: "row";
    [key: string]: any;
}

interface RowManager {
    activeRows: Row[];
    activeRowsCount: number;
    columnManager: ColumnManager;
    displayRows: ((Group | Row)[])[];
    displayRowsCount: number;
    element: Element | false;
    fixedHeight: boolean;
    height: number;
    heightFixer: Element | false;
    rows: Row[];
    scrollLeft: number;
    scrollTop: number;
    table: Tabulator;
    tableElement: Element | false;
    [key: string]: any;
}

export interface ExportRow {
    type: "row" | "calc" | "group" | "header";
    component: RowComponent;
    indent: number;
    columns: ExportColumn[];
}

export interface ColumnComponent {
    type: "ColumnComponent";
    _column: Column;
    getElement: () => Element | undefined;
    getTable: () => Tabulator;
    getDefinition: () => ColumnDefinition;
    updateDefinition: Promise<(value: { [key in keyof ColumnDefinition]: ColumnDefinition[key] }) => void>;
    getField: () => string;
    getCells: () => CellComponent[];
    getNextColumn: () => ColumnComponent | false;
    getPrevColumn: () => ColumnComponent | false;
    isVisible: () => boolean;
    show: () => void;
    hide: () => void;
    toggle: () => void;
    getWidth: () => number;
    setWidth: (size: number | true) => void;
    delete: Promise<void>;
    scrollTo: Promise<void>;
    move: (moveTo: string | ColumnComponent | Element, isAfter: boolean) => void;
    getSubColumns: () => ColumnComponent[];
    getParentColumn: () => ColumnComponent | false;
    headerFilterFocus: () => void;
    setHeaderFilterValue: (filter: string) => void;
    getHeaderFilterValue: () => string;
    reloadHeaderFilter: () => void;
    validate: () => true | CellComponent[];
}

export interface Column {
    cellEvents: CellEvents;
    cells: Cell[];
    columns: Column[];
    component: ColumnComponent;
    contentElement: Element | false;
    definition: ColumnDefinition;
    element: Element | false;
    field: string;
    fieldStructure: string[];
    getFieldValue: (data: TableData) => void;
    groupElement: Element | false;
    hozAlign: HorizontalAlignValues;
    isGroup: boolean;
    maxWidth: number | null;
    maxWidthStyled: string;
    minWidth: number | null;
    minWidthStyled: string;
    modules: { [key: string]: Function };
    parent: ColumnManager;
    setFieldValue: (data: TableData, value: DataTypes) => void;
    table: Tabulator;
    titleElement: Element | false;
    titleHolderElement: Element | false;
    tooltip: Tooltip;
    type: "column";
    vertAlign: VerticalAlignValues;
    visible: boolean;
    width: number;
    widthFixed: boolean;
    widthStyled: string;
    [key: string]: any;
}

export interface ColumnManager {
    columns: Column[];
    columnsByField: { [key: string]: Column };
    columnsByIndex: Column[];
    element: Element | false;
    headersElement: Element | false;
    rowManager: RowManager;
    scrollLeft: number;
    table: Tabulator;
    [key: string]: any;
}

export interface ExportColumn {
    value: DataTypes;
    width: number;
    height: number;
    depth: number;
    component: ColumnComponent | null;
}

export interface GroupComponent {
    type: "GroupComponent";
    _group: Group;
    getElement: () => Element | undefined;
    getTable: () => Tabulator;
    getKey: () => string;
    getField: () => string;
    getRows: () => RowComponent[];
    getSubGroups: () => GroupComponent[];
    getParentGroup: () => GroupComponent | false;
    isVisible: () => boolean;
    show: () => void;
    hide: () => void;
    toggle: () => void;
}

export interface Group {
    addRow: (row: Row) => void;
    arrowElement: Element | false;
    calcs: { top: Row | undefined; bottom: Row | undefined };
    component: GroupComponent;
    element: Element | false;
    elementContents: Element | false;
    field: string;
    generator: (value: DataTypes, count: number, data: TableData, group: Group) => void;
    groupList: Group[];
    groupManager: GroupRows;
    groups: Group[];
    hasSubGroups: boolean;
    height: number;
    initialized: boolean;
    key: string;
    level: number;
    modules: { [key: string]: Function };
    old: Group | false;
    outerHeight: number;
    parent: Group | false;
    rows: Row[];
    type: "group";
    visible: boolean;
    [key: string]: any;
}

interface GroupIDLookups {
    field: string;
    func: (data: DataTypes[]) => void;
    values: DataTypes[];
}

interface GroupRows {
    allowedValues: DataTypes;
    displayIndex: number;
    groupIDLookups: GroupIDLookups[];
    groupList: Group[];
    length: number;
    groups: { [key: string]: Group };
    headerGenerator: ((value: string, count: number, data: any[], group: Group) => void)[];
    initialized: boolean;
    startOpen: boolean[];
    table: Tabulator;
    [key: string]: any;
}

export interface TabulatorTableDownloadConfig {
    columnHeaders: boolean; // do not include column headers in downloaded table
    columnGroups: boolean; // do not include column groups in column headers for downloaded table
    rowGroups: boolean; // do not include row groups in downloaded table
    columnCalcs: boolean; // do not include column calcs in downloaded table
    dataTree: boolean; // do not include data tree in downloaded table
}

export interface TabulatorTableHtmlOutputPrintConfig extends TabulatorTableDownloadConfig {
    formatCells: boolean; // show raw cell values without formatter
}

type ContextMenu<T> = {
    label: ((component: T) => string) | string;
    action: (e: MouseEvent, component: T) => void;
    disabled?: boolean;
} | {
    separator:true;
};

export interface TabulatorOptions {
    height?: string | number | false;
    minHeight?: string | number | false;
    maxHeight?: string | number | false;
    virtualDom?: boolean;
    virtualDomBuffer?: number | false;
    virtualDomHoz?: boolean;
    placeholder?: string | Node;
    footerElement?: string | Node;
    tooltips?: ((cell: CellComponent) => string) | boolean;
    tooltipGenerationMode?: TooltipGenerationMode;
    history?: boolean;
    keybindings?: boolean | { [key: string]: string };
    locale?: boolean | string;
    langs?: object; // http://tabulator.info/docs/4.9/localize
    downloadConfig?: TabulatorTableDownloadConfig;
    downloadRowRange?: RowRange;
    htmlOutputConfig?: TabulatorTableHtmlOutputPrintConfig;
    reactiveData?: boolean;
    tabEndNewRow?: ((row: RowComponent) => RowData) | RowData | boolean;
    validationMode?: ValidationMode;
    textDirection?: TextDirection;
    invalidOptionWarnings?: boolean;
    columns?: ColumnDefinition[];
    autoColumns?: boolean;
    autoColumnsDefinitions?: ((definitions: ColumnDefinition) => ColumnDefinition) | ColumnDefinition[] | object; // http://tabulator.info/docs/4.9/columns#autocolumns
    layout?: TableLayout;
    layoutColumnsOnNewData?: boolean;
    responsiveLayout?: boolean | ResponsiveLayout;
    responsiveLayoutCollapseStartOpen?: boolean;
    responsiveLayoutCollapseUseFormatters?: boolean;
    responsiveLayoutCollapseFormatter?: (data: { title: string, value: DataTypes }) => Node | "";
    cellHozAlign?: HorizontalAlignValues;
    cellVertAlign?: VerticalAlignValues;
    headerHozAlign?: HorizontalAlignValues;
    columnMinWidth?: number;
    columnMaxWidth?: number;
    resizableColumns?: boolean;
    movableColumns?: boolean;
    tooltipsHeader?: ((column: ColumnComponent) => string) | boolean;
    columnHeaderVertAlign?: VerticalAlignValues;
    headerFilterPlaceholder?: string;
    scrollToColumnPosition?: HorizontalAlignValues;
    scrollToColumnIfVisible?: boolean;
    columnCalcs?: boolean | ColumnCalcs;
    nestedFieldSeparator?: boolean | string;
    headerVisible?: boolean;
    rowFormatter?: ((row: RowComponent) => void) | boolean;
    rowFormatterPrint?: ((row: RowComponent) => void) | boolean;
    rowFormatterClipboard?: ((row: RowComponent) => void) | boolean;
    rowFormatterHtmlOutput?: ((row: RowComponent) => void) | boolean;
    addRowPos?: RowPos;
    selectable?: boolean | number | "highlight";
    selectableRollingSelection?: boolean;
    selectablePersistence?: boolean;
    selectableCheck?: (row: RowComponent) => boolean;
    movableRows?: boolean;
    movableRowsConnectedTables?: boolean | Node;
    movableRowsSender?: ((fromRow: RowComponent, toRow: RowComponent, toTable: Tabulator) => void) | "delete";
    movableRowsReceiver?: ((fromRow: RowComponent, toRow: RowComponent, toTable: Tabulator) => void)
    | false | MovableRowsReceiverAction;
    movableRowsConnectedElements?: string | Node;
    movableRowsElementDrop?: ((e: MouseEvent, element: Element, row: RowComponent) => void);
    resizableRows?: boolean;
    scrollToRowPosition?: ScrollToRowPosition;
    scrollToRowIfVisible?: boolean;
    index?: string;
    data?: TableData;
    ajaxURL?: string;
    ajaxParams?: { [key: string ]: string };
    ajaxConfig?: string | Request;
    ajaxContentType?: AjaxContentType | {
        headers: { [key: string]: string },
        body: ((url: string, config: Request, params: { [key: string ]: string }) => string) | string
    };
    ajaxURLGenerator?: (url: string, config: Request, params: { [key: string ]: string }) => string;
    ajaxRequestFunc?: (url: string, config: Request, params: { [key: string ]: string }) => Promise<TableData>;
    ajaxFiltering?: boolean;
    ajaxSorting?: boolean;
    ajaxProgressiveLoad?: boolean;
    ajaxProgressiveLoadDelay?: number;
    ajaxProgressiveLoadScrollMargin?: number;
    ajaxLoader?: boolean;
    ajaxLoaderLoading?: string;
    ajaxLoaderError?: boolean;
    initialSort?: Sorter[];
    sortOrderReverse?: boolean;
    headerSort?: boolean;
    headerSortTristate?: boolean;
    headerSortElement?: string;
    initialFilter?: Filter;
    initialHeaderFilter?: Filter;
    headerFilterLiveFilterDelay?: number;
    groupBy?: ((data: TableData) => string | string[]) | string | string[];
    groupValues?: DataTypes[];
    groupHeader?: (value: DataTypes, count: number, data: TableData, group: GroupComponent) => Node | string;
    groupHeaderPrint?: (value: DataTypes, count: number, data: TableData, group: GroupComponent) => string;
    groupHeaderClipboard?: (value: DataTypes, count: number, data: TableData, group: GroupComponent) => string;
    groupHeaderDownload?: (value: DataTypes, count: number, data: TableData, group: GroupComponent) => string;
    groupHeaderHtmlOutput?: (value: DataTypes, count: number, data: TableData, group: GroupComponent) => string;
    groupStartOpen?: ((value: DataTypes, count: number, data: TableData, group: GroupComponent) => boolean) | boolean;
    groupToggleElement?: GroupToggleElement | false;
    groupClosedShowCalcs?: boolean;
    pagination?: PaginationMethod;
    paginationSize?: number;
    paginationSizeSelector?: boolean | number[] | [...number[], true];
    paginationElement?: Node;
    paginationDataReceived?: {
        "last_page": number
    };
    paginationDataSent?: {
        page: number;
        size: number;
        sorters: Sorter[];
        filter: Filter[]
    };
    paginationAddRow?: PaginationAddRowType;
    paginationButtonCount?: number;
    persistenceID?: string;
    persistenceMode?: boolean | PersistenceMode;
    persistentLayout?: boolean;
    persistentSort?: boolean;
    persistentFilter?: boolean;
    clipboard?: ClipboardMode | boolean;
    clipboardCopyRowRange?: RowRange;
    clipboardCopyFormatter?: (type: "plain" | "html", output: string) => string;
    clipboardPasteParser?: ((clipboard: string) => string[]) | string;
    clipboardPasteAction?: ((rowData: RowData) => void) | ClipboardPasteAction;
    dataTree?: boolean;
    dataTreeFilter?: boolean;
    dataTreeSort?: boolean;
    dataTreeElementColumn?: BaseColumnNames | ModelPortfolioColumnNames | BrokerAccountColumnNames;
    dataTreeBranchElement?: boolean;
    dataTreeChildIndent?: number;
    dataTreeChildField?: string;
    dataTreeCollapseElement?: string | Node;
    dataTreeExpandElement?: string | Node;
    dataTreeStartExpanded?: ((row: RowComponent, level: number) => boolean | boolean[]) | boolean | boolean[];
    dataTreeSelectPropagate?: boolean;
    dataTreeChildColumnCalcs?: boolean;
    printAsHtml?: boolean;
    printStyled?: boolean;
    printRowRange?: RowRange;
    printConfig?: TabulatorTableHtmlOutputPrintConfig;
    printHeader?: string | Node;
    printFooter?: string | Node;
    printFormatter?: (tableHolderElement: Element, tableElement: Element) => void;
    rowContextMenu?: ContextMenu<RowComponent>[];
    rowClickMenu?: ContextMenu<RowComponent>[];
    groupContextMenu?: ContextMenu<GroupComponent>[];
    groupClickMenu?: ContextMenu<GroupComponent>[];
}

export interface FooterManager {
    active: boolean;
    element: Element;
    external: boolean;
    table: Tabulator;
    [key: string]: any;
}

export interface AccessorModule {
    table: Tabulator;
    allowedTypes: ["", "data", "download", "clipboard", "print", "htmlOutput"];
    accessors: any;
    initializeColumn: (column: ColumnComponent) => void;
    lookupAccessor: (value: DataTypes) => void;
    transformRow: (row: RowComponent, type: AccessorType) => void
}

export interface AjaxModule {
    table: Tabulator;
    config: string | Request;
    errorElement: false | Element;
    loaderElement: false | Element;
    loaderPromise: (url: string, config: Request, params: { [key: string ]: string }) => void;
    loading: boolean;
    loadingElement: false | Element;
    msgElement: false | Element;
    params: { [key: string ]: string };
    progressiveLoad: boolean;
    requestOrder: number;
    url: string;
    urlGenerator: (url: string, config: Request, params: { [key: string ]: string }) => string;
    [key: string]: any;
}

export interface ClipboardModule {
    table: Tabulator;
    blocked: boolean;
    customSelection: boolean;
    mode: ClipboardMode | boolean;
    pasteAction: ((rowData: RowData) => void) | ClipboardPasteAction;
    pasteParser: ((clipboard: string) => string[]) | string;
    rowRange: RowRange;
    [key: string]: any;
}

export interface ColumnCalcsModule {
    table: Tabulator;
    botCalcs: Column[];
    botElement: false | Element;
    botInitialized: boolean;
    botRow: Row;
    genColumn: Column;
    topCalcs: Column[];
    topElement: false | Element;
    topInitialized: boolean;
    topRow: Row;
    [key: string]: any;
}

export interface CommsModule {
    table: Tabulator;
    [key: string]: any;
}

export interface DataTreeModule {
    table: Tabulator;
    branchEl: null | Element;
    collapseEl: null | Element;
    displayIndex: number;
    elementField: null | Element;
    expandEl: null | Element;
    field: string;
    indent: number;
    startOpen: () => void;
    [key: string]: any;
}

export interface DownloadModule {
    table: Tabulator;
    [key: string]: any;
}

export interface EditModule {
    table: Tabulator;
    currentCell: CellComponent;
    editedCells: CellComponent[];
    invalidEdit: CellComponent | false;
    mouseClick: boolean;
    recursionBlock: boolean;
    [key: string]: any;
}

export interface ExportModule {
    table: Tabulator;
    cloneTableStyle: true
    colVisProp: ""
    config: {}
    generateExportList: (config: TabulatorTableDownloadConfig, style: boolean, range: RowRange, colVisProp: string) => ExportRow[];
    [key: string]: any;
}

export interface FilterModule {
    table: Tabulator;
    [key: string]: any;
}

export interface FormatModule {
    table: Tabulator;
    [key: string]: any;
}

export interface FrozenColumnsModule {
    table: Tabulator;
    [key: string]: any;
}

export interface FrozenRowsModule {
    table: Tabulator;
    [key: string]: any;
}

export interface GroupRowsModule {
    table: Tabulator;
    [key: string]: any;
}

export interface HistoryModule {
    table: Tabulator;
    [key: string]: any;
}

export interface HtmlTableImportModule {
    table: Tabulator;
    [key: string]: any;
}

export interface KeybindingsModule {
    table: Tabulator;
    [key: string]: any;
}

export interface LayoutModule {
    table: Tabulator;
    [key: string]: any;
}

export interface LocalizeModule {
    table: Tabulator;
    [key: string]: any;
}

export interface MenuModule {
    table: Tabulator;
    [key: string]: any;
}

export interface MoveColumnsModule {
    table: Tabulator;
    [key: string]: any;
}

export interface MoveRowsModule {
    table: Tabulator;
    [key: string]: any;
}

export interface MutatorModule {
    table: Tabulator;
    [key: string]: any;
}

export interface PageModule {
    table: Tabulator;
    [key: string]: any;
}

export interface PersistenceModule {
    table: Tabulator;
    [key: string]: any;
}

export interface PrintModule {
    table: Tabulator;
    [key: string]: any;
}

export interface ReactiveDataModule {
    table: Tabulator;
    [key: string]: any;
}

export interface ResizeColumnsModule {
    table: Tabulator;
    [key: string]: any;
}

export interface ResizeRowsModule {
    table: Tabulator;
    [key: string]: any;
}

export interface ResizeTableModule {
    table: Tabulator;
    [key: string]: any;
}

export interface ResponsiveLayoutModule {
    table: Tabulator;
    [key: string]: any;
}

export interface SelectRowModule {
    table: Tabulator;
    [key: string]: any;
}

export interface SortModule {
    table: Tabulator;
    [key: string]: any;
}

export interface ValidateModule {
    table: Tabulator;
    [key: string]: any;
}

export interface Modules {
    accessor: AccessorModule;
    ajax: AjaxModule;
    clipboard: ClipboardModule;
    columnCalcs: ColumnCalcsModule;
    comms: CommsModule;
    dataTree: DataTreeModule;
    download: DownloadModule;
    edit: EditModule
    export: ExportModule;
    filter: FilterModule;
    format: FormatModule;
    frozenColumns: FrozenColumnsModule;
    frozenRows: FrozenRowsModule;
    groupRows: GroupRowsModule;
    history: HistoryModule;
    htmlTableImport: HtmlTableImportModule;
    keybindings: KeybindingsModule;
    layout: LayoutModule;
    localize: LocalizeModule;
    menu: MenuModule;
    moveColumn: MoveColumnsModule;
    moveRow: MoveRowsModule;
    mutator: MutatorModule
    page: PageModule
    persistence: PersistenceModule
    print: PrintModule
    reactiveData: ReactiveDataModule
    resizeColumns: ResizeColumnsModule
    resizeRows: ResizeRowsModule
    resizeTable: ResizeTableModule;
    responsiveLayout: ResponsiveLayoutModule;
    selectRow: SelectRowModule;
    sort: SortModule;
    validate: ValidateModule;
}

export interface Tabulator {
    browser: string;
    browserMobile: boolean;
    browserSlow: boolean;
    columnManager: ColumnManager;
    element: Element | false;
    footerManager: FooterManager;
    modules: Modules;
    options: TabulatorOptions;
    rowManager: RowManager;
    rtl: boolean;
    [key: string]: any;
}

interface TabulatorRefProps {
    cellEdited: (cell: CellComponent) => boolean;
    className: string;
    columns: ColumnDefinition[];
    data: TableData;
    options: TabulatorOptions
    rowMoved: (row: RowComponent) => boolean;
    [key: string]: any;
}

interface TabulatorRefState {
    columns: ColumnDefinition[];
    data: TableData;
    options: TabulatorOptions
}

export interface TabulatorRef extends Component<any> {
    htmlProps: { className: string }
    mainId: string;
    props: TabulatorRefProps;
    ref: Element;
    state: TabulatorRefState;
    table: Tabulator;
    pickValidHTMLProps: () => void;
    initTabulator(): Promise<void>;
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: TabulatorRefProps, prevState: TabulatorRefState): void;
    render(): JSX.Element;
    [key: string]: any;
}

type CustomValidators = `min:${number}` | `max:${number}` | `minLength:${number}` | `maxLength:${number}` |
    `starts:${string}` | `ends:${string}` | `regex:${string}`;

type ClickMenu = {
    label: string;
    action: (e: Event, cell: CellComponent) => void;
}[];

type Sorter = ((
    a: DataTypes,
    b: DataTypes,
    aRow: RowComponent,
    bRow: RowComponent,
    column: ColumnComponent,
    ir: "asc" | "desc",
    sorterParams: { [key: string]: any }
) => number) | SortersValues.STRING | SortersValues.NUMBER | SortersValues.ALPHANUM | SortersValues.BOOLEAN |
SortersValues.EXISTS | SortersValues.DATE | SortersValues.TIME | SortersValues.DATETIME | SortersValues.ARRAY;

interface Filter {
    field: BaseColumnNames | ModelPortfolioColumnNames | BrokerAccountColumnNames,
    type: FilterType,
    value: DataTypes
}

type SorterParams = {
    locale?: string | boolean;
    alignEmptyValues?: "top" | "bottom";
} | {
    thousandSeparator?: string;
    decimalSeperator?: string;
    alignEmptyValues?: "top" | "bottom";
} | {
    alignEmptyValues?: "top" | "bottom";
} | {
    format?: string;
    alignEmptyValues?: "top" | "bottom";
} | {
    type?: "length" | "sum" | "max" | "min" | "avg";
    alignEmptyValues?: "top" | "bottom";
} | { [key: string]: any };

type Formatter = (
    (
        cell: CellComponent,
        formatterParams: { [key: string]: any },
        onRendered: (callback: () => void) => void
    ) => string
) |
FormattersValues.PLAINTEXT | FormattersValues.TEXTAREA | FormattersValues.HTML | FormattersValues.COLOR |
FormattersValues.BUTTON_TICK | FormattersValues.BUTTON_CROSS | FormattersValues.ROW_NUM | FormattersValues.HANDLE |
FormattersValues.MONEY | FormattersValues.IMAGE | FormattersValues.LINK | FormattersValues.DATETIME |
FormattersValues.DATETIME_DIFF | FormattersValues.TICK_CROSS | FormattersValues.STAR | FormattersValues.TRAFFIC |
FormattersValues.PROGRESS | FormattersValues.LOOKUP;

type FormatterParams = {
    decimal?: string;
    thousand?: string;
    symbol?: string;
    symbolAfter?: string | false;
    precision?: number | false;
} | {
    height?: string;
    width?: string;
    urlPrefix?: string;
    urlSuffix?: string;
} | {
    labelField?: string;
    label?: ((cell: CellComponent) => string) | string;
    urlPrefix?: string;
    urlField?: string;
    url?: ((cell: CellComponent) => string) | string;
    target?: string;
    download?: ((cell: CellComponent) => string) | true | string;
} | {
    inputFormat?: string;
    outputFormat?: string;
    invalidPlaceholder?: ((cell: CellComponent) => string | number) | true | string | number;
    timezone: any; //  Moment Timezone object (https://momentjs.com/timezone/docs/#/data-loading/getting-zone-names/)
} | {
    inputFormat?: string;
    date?: any; // Moment date object
    humanize?: boolean;
    unit?: "years" | "months" | "weeks" | "days" | "hours" | "minutes" | "seconds";
    invalidPlaceholder?: ((cell: CellComponent) => string | number) | true | string | number;
} | {
    allowEmpty?: boolean;
    allowTruthy?: boolean;
    tickElement?: Element | false;
    crossElement?: Element | false;
} | {
    stars?: number;
} | {
    min?: number;
    max?: number;
    color?: ((cell: CellComponent) => string) | string[];
} | {
    min?: number;
    max?: number;
    color?: ((cell: CellComponent) => string) | string[] | string;
    legend?: ((cell: CellComponent) => string) | string | true;
    legendColor?: string;
    legendAlign?: "center" | "left" | "right" | "justify";
} | { [key: string]: any };

type Editor = ((
    cell: CellComponent,
    onRendered: (callback: () => void) => void,
    success: () => void,
    cancel: () => void,
    editorParams: { [key: string]: any }
) => string) | EditorsValues.INPUT | EditorsValues.TEXTAREA | EditorsValues.NUMBER | EditorsValues.RANGE | EditorsValues.TICK_CROSS |
EditorsValues.STAR | EditorsValues.SELECT | EditorsValues.AUTOCOMPLETE;

type EditorParams = {
    search?: boolean;
    mask?: string;
    elementAttributes?: { [key: string]: any };
} | {
    mask?: string;
    elementAttributes?: { [key: string]: any };
    verticalNavigation?: "hybrid" | "editor" | "table";
} | {
    max?: number;
    min?: number;
    step?: number;
    mask?: string;
    elementAttributes?: { [key: string]: any };
    verticalNavigation?: "editor" | "table";
} | {
    max?: number;
    min?: number;
    step?: number;
    elementAttributes?: { [key: string]: any };
} | {
    tristate?: boolean;
    indeterminateValue?: string | null;
    elementAttributes?: { [key: string]: any };
} | {
    elementAttributes?: { [key: string]: any };
} | {
    values?: ((cell: CellComponent) => { [key: string]: DataTypes }) | true | DataTypes | DataTypes[] |
    { [key: string]: DataTypes } |
    (
        { label: string } &
        (
            { options: { label: string, value: DataTypes, elementAttributes?: { [key: string]: any } } } | { value: DataTypes }
        )
    )[];
    listItemFormatter?: (value: DataTypes, title: string) => string;
    sortValuesList?: "asc" | "desc";
    defaultValue?: string;
    elementAttributes?: { [key: string]: any };
    verticalNavigation?: "hybrid" | "editor" | "table";
    multiselect?: true | number;
} | {
    values?: true | DataTypes | DataTypes[] | { [key: string]: DataTypes } | { label: string, value: DataTypes }[];
    showListOnEmpty?: boolean;
    freetext?: boolean;
    allowEmpty?: boolean;
    searchFunc?: (<T>(term: T, values: T[]) => T[]) | Promise<<T>(term: T, values: T[]) => T[]>;
    searchingPlaceholder?: string;
    emptyPlaceholder?: string;
    listItemFormatter?: (value: DataTypes, title: string) => string;
    sortValuesList?: "asc" | "desc";
    defaultValue?: string;
    elementAttributes?: { [key: string]: any };
    mask?: string;
    verticalNavigation?: "hybrid" | "editor" | "table";
} | { [key: string]: any };

export type ColumnDefinition = {
    title?: string;
    field: BaseColumnNames | ModelPortfolioColumnNames | BrokerAccountColumnNames;
    visible?: boolean;
    hozAlign?: HorizontalAlignValues;
    vertAlign?: VerticalAlignValues;
    headerHozAlign?: HorizontalAlignValues;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    widthGrow?: number;
    widthShrink?: number;
    resizable?: boolean;
    frozen?: boolean;
    responsive?: number;
    tooltip?: Tooltip;
    cssClass?: string;
    rowHandle?: boolean;
    htmlOutput?: boolean | string;
    print?: boolean;
    clipboard?: boolean;
    sorter?: Sorter;
    sorterParams?: SorterParams;
    formatter?: Formatter;
    formatterParams?: FormatterParams;
    formatterPrint?: ((
        cell: CellComponent,
        formatterParams: { [key: string]: any },
        onRendered: (callback: () => void) => void) => string
    ) | string | false;
    formatterPrintParams?: { [key: string]: any };
    formatterClipboard?: ((
        cell: CellComponent,
        formatterParams: { [key: string]: any },
        onRendered: (callback: () => void) => void) => string
    ) | string | false;
    formatterClipboardParams?: { [key: string]: any };
    formatterHtmlOutput?: ((
        cell: CellComponent,
        formatterParams: { [key: string]: any },
        onRendered: (callback: () => void) => void) => string
    ) | string | false;
    formatterHtmlOutputParams?: { [key: string]: any };
    variableHeight?: number;
    editable?: boolean;
    editor?: Editor;
    editorParams?: EditorParams;
    validator?: ((cell: CellComponent, value: string) => boolean) | ValidatorsValues | CustomValidators | string |
    (ValidatorsValues | string | CustomValidators)[] |
    {
        type: (cell: CellComponent, value: DataTypes, parameters: { [key: string]: any }) => boolean,
        parameters?: { [key: string]: any }
    };
    contextMenu?: ClickMenu;
    clickMenu?: ClickMenu;
    mutatorClipboardParams?: { [key: string]: any };
    download?: boolean;
    titleDownload?: string;
    topCalc?: (<T>(values: T[], data: TableData, calcParams: { [key: string]: any }) => T) | CalcsValues.AVG | CalcsValues.MAX |
    CalcsValues.MIN | CalcsValues.SUM | CalcsValues.COUNT | CalcsValues.CONCAT;
    topCalcParams?: {
        precision: number | false;
    } | { [key: string]: any }
    bottomCalc?: (<T>(values: T[], data: TableData, calcParams: { [key: string]: any }) => T) | CalcsValues.AVG | CalcsValues.MAX |
    CalcsValues.MIN | CalcsValues.SUM | CalcsValues.COUNT | CalcsValues.CONCAT;
    bottomCalcParams?: {
        precision: number | false;
    } | { [key: string]: any };
    cellClick?: CellMouseEventFunction;
    cellContext?: CellMouseEventFunction;
    cellDblClick?: CellMouseEventFunction;
    cellDblTap?: CellMouseEventFunction;
    cellMouseEnter?: CellMouseEventFunction;
    cellMouseLeave?: CellMouseEventFunction;
    cellMouseMove?: CellMouseEventFunction;
    cellMouseOut?: CellMouseEventFunction;
    cellMouseOver?: CellMouseEventFunction;
    cellTap?: CellMouseEventFunction;
    cellTapHold?: CellMouseEventFunction;
    headerSort?: boolean;
    headerSortStartingDir?: "asc" | "desc";
    headerSortTristate?: boolean;
    headerTooltip?: string;
    headerVertical?: boolean;
    editableTitle?: boolean;
    [key: string]: any;
};

export interface BaseTabulatorColumnsDefinition extends ColumnDefinition {
    field: BaseColumnNames,
}

export interface ModelPortfolioTabulatorColumnsDefinition extends ColumnDefinition {
    field: BaseColumnNames | ModelPortfolioColumnNames,
}

export interface BrokerAccountTabulatorColumnsDefinition extends ColumnDefinition {
    field: BaseColumnNames | BrokerAccountColumnNames,
}
