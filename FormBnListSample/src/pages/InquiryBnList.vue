<template>
    <div>
        <vue-progress-bar></vue-progress-bar>

        <sub-table
            tableForm="batch_inquiry_bn_list_form"
            mt="batch"
            ct="batch_list"
            ref="batch_inquiry_bn_list_form"
            refs="inquiry_bn_list_form"
            :subForms="batchForms"
            :module_id="inquiry_id"
            :columns="batchColumns"
        ></sub-table>
        <div class="clear"></div>

        <rcms-msg-box :errors="errors" :messages="messages"></rcms-msg-box>
        <div class="search-bar mb-2">
            <div
                :class="['btn', 'filter', hasFilterConditions ? 'has-conditions' : '']"
                @click.prevent="toggleFiltersVisibility"
            >
                <span>{{ labels.filter_btn }}</span>
            </div>
            <input
                type="text"
                class="search-input"
                name="keyword"
                v-model="keyword"
                :placeholder="labels.keyword"
                @keyup.enter="handleSearchBtnClick"
            />
            <div v-if="!loading" class="btn" @click.prevent="handleSearchBtnClick">
                <span>{{ labels.search_btn }}</span>
            </div>
            <div v-else class="btn btn__loading">
                <i class="fa fa-circle-o-notch fa-spin fa-fw icon-loading"></i>
            </div>

            <button type="button" data-bs-toggle="modal" data-bs-target="#modalDownload" class="btn">
                {{ labels.download_all_btn }}
            </button>
        </div>

        <form name="inquiry_bn_list_form" ref="inquiry_bn_list_form" class="inquiry-bn-list-form">
            <input type="hidden" name="pageID" :value="pageID" />
            <input type="hidden" name="MODE" :value="MODE" />
            <input type="hidden" name="filters" :value="filtersValue" />
            <input type="hidden" name="inquiry_id" :value="inquiry_id" />
            <input type="hidden" name="perPage" :value="perPage" />

            <div class="d-flex">
                <div v-if="hasDataInitialized" class="flex-grow-1">
                    <pager :pageInfo="pageInfo" @change-page="handlePageIndicatorChange" />
                </div>
                <div v-if="hasDataInitialized" class="align-self-center">
                    <DisplayItemSettingBtn @click-handler="showTableColumnEditModal"></DisplayItemSettingBtn>
                </div>
            </div>

            <base-table
                v-if="hasDataInitialized"
                tableId="table_admin_inquiry_bn_list"
                :listData="dataList"
                :columns="currDisplayColumns"
                :auth="auth"
                rowCheckedKey="inquiry_bn_id"
                :sortKey="sortKey"
                :isDesc="isDesc"
                @columnSortStateChange="handleSortStateChange"
            >
                <template v-slot:body="{ dataItem }">
                    <!-- eslint-disable vue/no-use-v-if-with-v-for -->
                    <table-column-content
                        v-for="column in currDisplayColumns"
                        :key="column.key_name"
                        :columnItem="dataItem"
                        :columnKey="column.key_name"
                    >
                        <template v-slot:inquiry_bn_id>
                            <a
                                :href="
                                    `/management/inquiry/inquiry_reply_edit/?inquiry_bn_id=${dataItem.inquiry_bn_id}`
                                "
                            >
                                {{ dataItem.inquiry_bn_id }}
                            </a>
                        </template>
                        <template v-slot:inquiry_category_id>
                            {{ dataItem.inquiry_category_name }}
                        </template>
                        <template v-slot:status>
                            {{ dataItem.status_txt }}
                        </template>
                        <template v-slot:receive_date>
                            <time-from-now v-slot:receive_date :time="dataItem.receive_date" />
                        </template>
                        <template v-slot:update_ymdhi>
                            <time-from-now v-slot:update_ymdhi :time="dataItem.update_ymdhi" />
                        </template>
                        <template v-for="slot in columnOptions" v-slot:[slot.key_name]>
                            <span
                                v-if="
                                    slot.type == INQUIRY_EXT.INQUIRY_RADIO_BUTTON_FORMAT ||
                                        slot.type == INQUIRY_EXT.INQUIRY_SELECT_BOX_FORMAT
                                "
                                :key="slot.key_name"
                            >
                                {{ dataItem[slot.key_name].label }}
                            </span>
                            <span v-else-if="slot.type == INQUIRY_EXT.INQUIRY_CHECK_BOX_FORMAT" :key="slot.key_name">
                                <span v-for="(singleItem, index) in dataItem[slot.key_name]" :key="index">
                                    {{ singleItem.label }}
                                </span>
                            </span>
                            <span v-else-if="slot.type == INQUIRY_EXT.INQUIRY_FILE_FORMAT" :key="slot.key_name">
                                <a :href="dataItem[slot.key_name].url" target="_blank">
                                    <span v-if="dataItem[slot.key_name].desc != ''">
                                        {{ dataItem[slot.key_name].desc }}
                                    </span>
                                    <span v-else>
                                        {{ dataItem[slot.key_name].id }}
                                    </span>
                                </a>
                            </span>
                            <span v-else-if="slot.type == INQUIRY_EXT.INQUIRY_TDFK_FORMAT" :key="slot.key_name">
                                {{ dataItem[slot.key_name].tdfk_nm }}
                            </span>
                        </template>
                    </table-column-content>
                </template>
            </base-table>

            <pager v-if="hasDataInitialized" :pageInfo="pageInfo" @change-page="handlePageIndicatorChange" />

            <div v-if="hasDataInitialized && (auth.update || auth.delete)" class="buttonbox">
                <ul>
                    <p>{{ labels.withselected }}</p>
                    <form-action-button
                        v-if="auth.delete"
                        className="danger large"
                        leftIconClass="fa fa-trash-o"
                        actionMode="delete"
                        :text="labels.delete_btn"
                        @click="handleFormActionBtnClick"
                    />
                </ul>
            </div>

            <!-- Modal -->
            <div
                class="modal fade"
                id="modalDownload"
                tabindex="-1"
                aria-labelledby="modalDownloadLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-card card">
                            <div class="card-header">
                                <div class="card-header-title h3 fw-bold" id="modalDownloadLabel">
                                    <div class="d-flex align-items-center fw-bold">
                                        {{ translate('/label/download_settings') }}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    class="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3 row">
                                    <label for="encoding" class="col-sm-2 col-form-label">{{
                                        translate('/label/charset')
                                    }}</label>
                                    <div class="col-sm-10">
                                        <select name="encoding" id="encoding" class="form-select">
                                            <option
                                                v-for="option in encodingOptions"
                                                :value="option.value"
                                                :key="option.value"
                                                :selected="
                                                    (I18N_DEFAULT_LANGUAGES == 'ja' && option.value == 'sjis') ||
                                                        (I18N_DEFAULT_LANGUAGES == 'en' && option.value == 'utf8')
                                                "
                                            >
                                                {{ option.text }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-2">
                                    <a
                                        @click="hideSelectedOutputCols = !hideSelectedOutputCols"
                                        href="javascript:void(0)"
                                        >{{
                                            translate('/msg/selecting_item_message', [
                                                translate('/label/output_columns'),
                                            ])
                                        }}</a
                                    >
                                </div>

                                <div v-if="!hideSelectedOutputCols" id="selected_output_columns">
                                    <div class="mb-2">
                                        <p class="hint">
                                            {{
                                                translate('/msg/select_no_item_error', [
                                                    translate('/label/output_columns'),
                                                ])
                                            }}
                                        </p>
                                    </div>
                                    <div class="mb-2">
                                        <input
                                            @click="selectAll"
                                            v-model="allSelected"
                                            type="checkbox"
                                            class="form-check-input"
                                            :indeterminate.prop="selectAllIndeterminated"
                                            id="select_all"
                                        />
                                        <label for="select_all" class="form-check-label">{{
                                            translate('/label/all_check')
                                        }}</label>
                                    </div>
                                    <div v-for="(value, key) in outputColumns" class="mb-2" :key="key">
                                        <input
                                            type="checkbox"
                                            name="output_columns[]"
                                            :id="'output_column_' + key"
                                            :value="key"
                                            v-model="selectedOutputColumns"
                                            class="form-check-input"
                                        />
                                        <label :for="'output_column_' + key" class="form-check-label">{{
                                            value
                                        }}</label>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-white me-2" data-bs-dismiss="modal">
                                    <i class="fe fe-x me-1 text-gray-500"></i>{{ translate('/label/cancel') }}
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    @click="handleDownloadBtnClick('DOWNLOAD')"
                                >
                                    <i class="fa fa-download"></i>{{ labels.download_all_btn }}
                                </button>
                                <button
                                    v-if="useDownloadAttachments"
                                    type="button"
                                    class="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    @click="handleDownloadBtnClick('DOWNLOAD_ATTACHMENTS')"
                                >
                                    <i class="fa fa-download"></i>{{ labels.download_attachments }}
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    @click="handleBatchDownloadBtnClick('SEND_BAT')"
                                >
                                    <i class="fa fa-download"></i>{{ labels.download_all_bat_btn }}
                                </button>
                                <button
                                    v-if="useSendBatAttachments"
                                    type="button"
                                    class="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    @click="handleBatchDownloadBtnClick('SEND_BAT_ATTACHMENTS')"
                                >
                                    <i class="fa fa-download"></i>{{ labels.download_attachments_bat }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <TableColumnEditModal
            :columnOptions="columnOptions"
            :selectedColumns="currDisplayColumns"
            @confirm="handleTableColumnEditConfirm"
            @cancel="hideTableColumnEditModal"
        />
    </div>
</template>

<script>
import axios from 'axios';
import BaseTablePage from '@/common/components/base-table/BaseTablePage.vue';
import Pager from '@/common/components/original-plugins/Pager.vue';
import RcmsMsgBox from '@/common/components/RcmsMsgBox.vue';
import BaseTable from '@/common/components/base-table/BaseTable.vue';
import TableColumnContent from '@/common/components/base-table/table-column-content/TableColumnContent.vue';
import TableColumnEditModal from '@/common/components/base-table/table-column-edit-modal/TableColumnEditModal.vue';
import DisplayItemSettingBtn from '@/common/components/base-table/table-column-edit-modal/DisplayItemSettingBtn.vue';
import TimeFromNow from '@/common/components/TimeFromNow.vue';
import FormActionButton from '@/common/components/FormActionButton.vue';
import SubTable from '@/common/components/sub-table/SubTable.vue';

const Table_Form_Name = 'inquiry_bn_list_form';
const Filter_Form_Name = 'inquiry_search_form';
const Batch_Form_Name = 'batch_inquiry_bn_list_form';

const EINQUIRY_BN_LIST_REQUEST_MODE = {
    DELETE: 'delete',
};

export default {
    extends: BaseTablePage,
    name: 'inquiry-bn-list',
    components: {
        FormActionButton,
        Pager,
        RcmsMsgBox,
        TimeFromNow,
        BaseTable,
        TableColumnContent,
        TableColumnEditModal,
        DisplayItemSettingBtn,
        SubTable,
    },
    props: {
        auth: {
            type: Object, // like { update: true, delete: true }
            default: () => ({}),
        },
        /** default columns for table to display */
        defaultColumns: {
            type: Array,
            default: () => [],
        },
        /** user custom columns for table to display, looks like ["member_id", "custom1", "update_at"] */
        selectedColumns: {
            type: Array,
            default: () => [],
        },
        // configurable column options in the middle of the table
        columnOptions: {
            type: Array, // for example [{ key_name: 'email', disp_name: 'EMAIL', sortable: true }, { key_name: 'sex', disp_name: 'SEX', sortable: true }]
            default: () => [],
        },
        outputColumns: {
            type: Object,
            default: () => ({}),
        },
        MODE: {
            type: String,
            default: () => '',
        },
        status: {
            type: String,
            default: () => '',
        },
        filtersValue: {
            type: String,
            default: () => '',
        },
        inquiry_id: {
            type: Number,
            default: () => null,
        },
        useDownloadAttachments: {
            type: Boolean,
            default: () => false,
        },
        useSendBatAttachments: {
            type: Boolean,
            default: () => false,
        },
        perPage: {
            type: Number,
            default: () => 20,
        },
        inquiryExtConst: {
            type: Object,
            default: () => ({}),
        },
        I18N_DEFAULT_LANGUAGES: {
            type: String,
            default: 'ja',
        },
    },
    data() {
        return {
            labels: {
                publish: this.translate('/label/publish'),
                inquiry_bn_id: this.translate('/label/id'),
                order_no: this.translate('/label/order_no'),
                status: this.translate('/label/status_katakana'),
                title: this.translate('/label/title'),
                total: this.translate('/label/total'),
                default_count: this.translate('/label/default_status_count'),
                update_time: this.translate('/label/update_time'),
                withselected: this.translate('/label/withselected'),
                activate_btn: this.translate('/label/activate_btn'),
                pause_btn: this.translate('/label/pause_btn'),
                delete_btn: this.translate('/label/delete_btn'),
                download_all_btn: this.translate('/label/download_btn'),
                download_attachments: this.translate('/label/filedownload'),
                download_all_bat_btn: this.translate('/label/send_batch'),
                download_attachments_bat: this.translate('/label/send_batch_file'),
                change_order_btn: this.translate('/label/change_order_btn'),
                confirm_del_selected_items: this.translate('/msg/confirm_del_selected_items'),
                keyword: this.translate('/label/keyword'),
                filter_btn: this.translate('/label/filter_btn'),
                search_btn: this.translate('/label/search_btn'),
            },
            /**
             * all columns in the table, include preset and user selected from table column edit modal
             * column order is like:
             * ...defaultColumns  ...selectedDisplayColumns
             * this will be set in initTableColumns()
             **/
            currDisplayColumns: [],
            batchColumns: [
                { key_name: 'status', disp_name: this.translate('/label/status_katakana') },
                { key_name: 'do_datetime', disp_name: this.translate('/modules/batch/label/run_date') },
                { key_name: 'last_do_ymdhi', disp_name: this.translate('/modules/batch/label/last_do_ymdhi') },
                { key_name: 'expire', disp_name: this.translate('/label/expire') },
                { key_name: 'result', disp_name: this.translate('/label/result') },
            ],
            batchForms: [
                { key_name: 'module_type[]', value: 'inquiry' },
                { key_name: 'ct', value: 'inquiry_bn_download' },
                { key_name: 'from_do_datetime', value: '-14 days' },
                { key_name: 'status[]', value: '0' },
                { key_name: 'status[]', value: '10' },
                { key_name: 'status[]', value: '15' },
                { key_name: 'status[]', value: '99' },
                { key_name: 'ext_data[inquiry_id]', value: `["${this.inquiry_id}"]` },
            ],
            messages: [],
            dataListKey: 'list', // dataList key in the api response
            hideSelectedOutputCols: true,
            encodingOptions: [
                { text: 'Shift-JIS', value: 'sjis' },
                { text: 'UTF-8', value: 'utf8' },
            ],
            selectedOutputColumns: [],
            allSelected: true,
            selectAllIndeterminated: false,
            keyword: '',
        };
    },
    created() {
        this.INQUIRY_EXT = Object.freeze(this.inquiryExtConst);
    },
    mounted() {
        this.initTableColumns();
        this.$nextTick(this.refreshTableListData);
        this.setProxyForFilterForm();
        for (const col in this.outputColumns) {
            this.selectedOutputColumns.push(col);
        }
        if (this.hasFilterConditions && !this.hasOnlyKeywordFilter()) {
            this.toggleFiltersVisibility();
        }
    },
    watch: {
        selectedOutputColumns: function(newVal) {
            this.allSelected = newVal.length === Object.keys(this.outputColumns).length;
            this.selectAllIndeterminated =
                newVal.length !== Object.keys(this.outputColumns).length && newVal.length > 0;
        },
    },
    computed: {
        hasFilterConditions() {
            const { filtersValue } = this;
            return filtersValue && filtersValue !== '{"filter":"","order":""}';
        },
    },
    methods: {
        initTableColumns() {
            let currDisplayColumns = [];

            if (this.selectedColumns && this.selectedColumns.length > 0) {
                const allColumnOptions = [...this.columnOptions, ...this.defaultColumns];
                this.selectedColumns = this.selectedColumns.map(columnKey => {
                    return allColumnOptions.find(column => column.key_name === columnKey);
                });

                const defaultColumnKeys = {};
                this.defaultColumns.forEach(column => (defaultColumnKeys[column.key_name] = column.key_name));
                currDisplayColumns = this.selectedColumns.map(column => {
                    if (column === undefined) {
                        return {};
                    }
                    if (defaultColumnKeys[column.key_name]) {
                        return {
                            ...column,
                            undeletable: true,
                        };
                    }
                    return column;
                });
            } else {
                currDisplayColumns = this.defaultColumns.map(column => ({ ...column, undeletable: true }));
            }
            this.currDisplayColumns = currDisplayColumns;
        },
        selectAll() {
            this.selectedOutputColumns = [];

            if (!this.allSelected) {
                for (const col in this.outputColumns) {
                    this.selectedOutputColumns.push(col);
                }
            }
        },
        fetchInquiryListData(queryStr = '', method = 'GET') {
            const query = queryStr.startsWith('?') ? queryStr : `?${queryStr}`;
            const url = `/management/inquiry/inquiry_bn_list/${query}`;
            this.setFilterHistory(url, method);
            this.fetchTableListData(url, method);
            this.setKeyword();
        },
        setFilterHistory(url, method) {
            if (method.toUpperCase() == 'GET') {
                window.history.pushState({}, '', url);
            }
        },
        refreshTableListData(extraData = {}, method) {
            if (!extraData.hasOwnProperty('sort')) {
                extraData.sort = this.sortKey;
                if (this.isDesc) {
                    extraData.desc = '1';
                }
            }
            const formElem = this.$refs[Table_Form_Name];
            const filterForm = document.forms[Filter_Form_Name];
            if (filterForm.perPage !== undefined) {
                this.perPage = formElem.perPage.value = filterForm.perPage.value;
            }
            const query = this.convertFormDataToQueryString(formElem, extraData);
            this.fetchInquiryListData(query, method);
        },
        handleSortStateChange(payload) {
            const { columnKey, isDesc } = payload;
            this.sortKey = columnKey;
            this.isDesc = isDesc;

            const extraData = { sort: columnKey };
            if (isDesc) {
                extraData.desc = '1';
            }
            this.refreshTableListData(extraData);
        },
        handlePageIndicatorChange(e) {
            const extraData = { pageID: e, perPage: this.perPage };
            this.refreshTableListData(extraData);
        },
        handleFormActionBtnClick(payload) {
            const mode = payload;
            if (EINQUIRY_BN_LIST_REQUEST_MODE.DELETE === mode && !confirm(this.labels.confirm_del_selected_items)) {
                return;
            }
            this.refreshTableListData({ MODE: mode }, 'POST');
        },
        handleSearchBtnClick() {
            const extraData = { search_flg: '1' };
            this.loading = true;
            this.refreshTableListData(extraData);
        },
        handleBatchDownloadBtnClick(mode) {
            const url = `/management/inquiry/inquiry_bn_list/?MODE=${mode}&inquiry_id=${this.inquiry_id}`;
            this.$nextTick(() => {
                this.$refs[Batch_Form_Name].handleSubTableBtnClick(url, 'post', { filters: this.filtersValue }).then(
                    () => {
                        this.messages = this.$refs[Batch_Form_Name].messages;
                    }
                );
            });
        },
        handleDownloadBtnClick(mode) {
            const formElem = this.$refs[Table_Form_Name];
            formElem.filters.value = this.keyword ? this.mergeKeywordFilter(this.filtersValue) : this.filtersValue;
            formElem.MODE.value = mode;
            formElem.submit();
            formElem.MODE.value = '';
            formElem.filters.value = '';
        },
        toggleFiltersVisibility() {
            const filterForm = document.forms[Filter_Form_Name];
            if (!filterForm) return;
            const showing = getComputedStyle(filterForm).display !== 'none';
            filterForm.style.display = showing ? 'none' : 'block';
        },
        setProxyForFilterForm() {
            const filterForm = document.forms[Filter_Form_Name];
            filterForm.onsubmit = this.handleFilterFormSubmit;
            document.addEventListener('filters-change', e => {
                this.filtersValue = e.detail;
            });
        },
        hasOnlyKeywordFilter() {
            const { filtersValue } = this;
            const logicOperatorReg = /\s*( AND | OR )\s*/i;
            return filtersValue.includes(`keyword contains`) && !filtersValue.match(logicOperatorReg);
        },
        setKeyword() {
            if (this.hasFilterConditions) {
                const keywordVal = this.filtersValue.match(/keyword contains \\"(.*)\\"",/);
                if (keywordVal !== null && keywordVal[1] !== undefined) {
                    this.keyword = keywordVal[1];
                }
            }
        },
        showTableColumnEditModal() {
            this.$modal.show('table-column-edit-modal');
        },
        hideTableColumnEditModal() {
            this.$modal.hide('table-column-edit-modal');
        },
        handleTableColumnEditConfirm(payload) {
            this.updateDisplayColumnData([...payload]);
            this.hideTableColumnEditModal();
        },
        updateDisplayColumnData(selectedColumns) {
            let hasModified = false;
            const originalColumns =
                this.selectedColumns && this.selectedColumns.length > 0 ? this.selectedColumns : this.defaultColumns;
            if (selectedColumns.length === originalColumns.length) {
                hasModified = selectedColumns.some(
                    (column, index) =>
                        originalColumns[index] === undefined || column.key_name !== originalColumns[index].key_name
                );
            } else {
                hasModified = true;
            }
            if (!hasModified) {
                return;
            }
            const query = selectedColumns
                .map(column => column.key_name)
                .map(columnKey => `data[]=${columnKey}`)
                .join('&');
            const apiBaseUrl =
                '/direct/menu/updateMemberExData/?target=inquiry_bn_list_selectedColumns_' + this.inquiry_id;
            const requestUrl = `${apiBaseUrl}&${query}`;
            return axios(requestUrl, {
                withCredentials: true,
                method: 'POST',
            })
                .then(res => {
                    if (res.errors && res.errors.length > 0) {
                        this.errors = res.errors;
                    } else {
                        this.currDisplayColumns = selectedColumns;
                    }
                })
                .catch(err => {
                    if (err && Array.isArray(err.errors) && err.errors.length > 0) {
                        this.errors = err.errors;
                    }
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.search-bar {
    margin: 24px 0;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background-color: #eee;
    border: solid #d5d5d5 1px;
    padding: 8px 10px;
    border-radius: 2px;

    > * {
        box-sizing: border-box;
    }

    .search-input {
        width: 400px;
        height: 28px;
        outline: none;
        padding: 2px 8px;
        border: 1px solid #555;
        border-radius: 2px;

        &:focus {
            outline: none;
            border: 1px solid #2d6bb3;
        }
    }

    .btn {
        min-width: 90px;
        height: 28px;
        margin-left: 24px;
        padding: 0 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #006b92;
        border: 1px solid #006b92;
        border-radius: 2px;
        cursor: pointer;
        user-select: none;
        background-color: #fff;

        &:hover {
            color: #ff8e51;
            border-color: #ff8e51;
        }
    }

    .btn__loading {
        border: none;

        &:hover {
            cursor: not-allowed;
        }

        i.icon-loading {
            margin: 0;
            font-size: 1.5em;
            color: #006b92;
        }
    }

    .filter {
        &.has-conditions {
            &:hover {
                border-color: #0076ff;
                background-color: #0076ff;
            }

            color: #fefefe;
            background-color: #2d6bb3;
        }
    }
}
</style>
