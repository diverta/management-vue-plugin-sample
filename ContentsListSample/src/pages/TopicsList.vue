<template>
    <div>
        <vue-progress-bar></vue-progress-bar>

        <sub-table
            tableForm="batch_topics_list_form"
            mt="batch"
            ct="batch_list"
            ref="batch_topics_list_form"
            refs="topics_list_form"
            :subForms="batchForms"
            :module_id="topics_group_id"
            :columns="batchColumns"
        ></sub-table>
        <div class="clear"></div>

        <rcms-msg-box :errors="errors" :messages="messages"></rcms-msg-box>
        <span>original</span>
        <form method="post" name="topics_list_form" ref="topics_list_form" class="topics-list-form">
            <input type="hidden" name="pageID" :value="pageID" />
            <input type="hidden" name="MODE" value="" />
            <input type="hidden" name="filters" :value="filtersValue" />
            <input type="hidden" name="per_page" :value="per_page" />
            <input type="hidden" name="topics_group_id" :value="topics_group_id" />
            <input type="hidden" name="contents_type" :value="contents_type" />
            <input type="hidden" name="tag_relation" :value="tag_relation" />
            <input type="hidden" name="multilang_search" :value="multilang_search" />
            <input type="hidden" name="search_open_sta_date" :value="search_open_sta_date" />
            <input type="hidden" name="search_open_end_date" :value="search_open_end_date" />
            <input type="hidden" name="opflg" :value="opflg" />

            <div class="search-bar">
                <div
                    :class="['btn', 'filter', hasFilterConditions ? 'has-conditions' : '']"
                    @click.prevent="toggleFiltersVisibility"
                >
                    <span>{{ labels.filter_btn }}</span>
                </div>
                <input
                    type="text"
                    class="search-input"
                    name="topics_keyword"
                    :value="topics_keyword"
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
                tableId="table_admin_topics_list"
                :listData="dataList"
                :columns="currDisplayColumns"
                :auth="auth"
                rowCheckedKey="topics_id"
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
                        <template v-slot:open_status>
                            <FlagPublishIndicator v-slot:open_status :flag="dataItem.open_status" />
                        </template>
                        <template v-slot:subject>
                            <a :href="`/management/topics/topics_edit/?topics_id=${dataItem.topics_id}`">
                                {{ dataItem.subject }}
                            </a>
                            <LanguageStatus
                                :docmeta="docmetas[dataItem.topics_id]"
                                :urlPrefix="`/management/topics/topics_edit/?topics_id=${dataItem.topics_id}`"
                            ></LanguageStatus>
                        </template>
                        <template v-slot:order_no>
                            <input
                                type="text"
                                :name="`order_no[${dataItem.topics_id}]`"
                                :value="dataItem.order_no"
                                size="6"
                            />
                        </template>
                        <template v-for="(slot, slot_index) in columnOptions" v-slot:[slot.key_name]>
                            <span
                                v-if="isFileType(slot.type)"
                                :key="'file_type_' + slot.key_name + slot_index + dataItem.topics_id"
                            >
                                <span v-for="(singItem, index) in dataItem[slot.key_name]" :key="index">
                                    <a :href="singItem.file_url" target="_blank">
                                        {{ singItem.value }}
                                    </a>
                                    <br />
                                </span>
                            </span>
                            <span
                                v-else-if="slot.type == topicsExtType.TOPICS_EXT_TYPE_RELATION"
                                :key="'relation_' + slot.key_name + slot_index + dataItem.topics_id"
                            >
                                <span v-for="(singItem, index) in dataItem[slot.key_name]" :key="index">
                                    <span v-if="singItem.module_type == 'topics'">
                                        <a :href="`/management/topics/topics_edit/?topics_id=${singItem.module_id}`">
                                            {{ singItem.label }}
                                        </a>
                                        <br />
                                    </span>
                                    <span v-else-if="singItem.module_type == 'member'">
                                        <a :href="`/management/member/member_edit/?member_id=${singItem.module_id}`">
                                            {{ singItem.label }}
                                        </a>
                                        <br />
                                    </span>
                                    <span v-else-if="singItem.module_type == 'inquiry'">
                                        <a :href="`/management/inquiry/inquiry_edit/?inquiry_id=${singItem.module_id}`">
                                            {{ singItem.label }}
                                        </a>
                                        <br />
                                    </span>
                                </span>
                            </span>
                            <span v-else :key="'other_types_' + slot.key_name + slot_index + dataItem.topics_id">
                                <span v-if="isArrayOfArrays(dataItem[slot.key_name])">
                                    <span
                                        v-for="(singItem, index) in filterEmptyEntriesFromArray(
                                            dataItem[slot.key_name]
                                        )"
                                        :key="index"
                                    >
                                        <span
                                            v-for="(Item, item_index) in filterEmptyEntriesFromArray(singItem)"
                                            :key="item_index"
                                        >
                                            <span v-if="item_index < defaultDisplayItemsLimit">
                                                {{ Item }} <br />
                                            </span>
                                            <span
                                                v-if="
                                                    item_index >= defaultDisplayItemsLimit &&
                                                        showMoreInArrayItems[dataItem.topics_id + '-' + slot.key_name]
                                                "
                                            >
                                                {{ Item }} <br />
                                            </span>
                                        </span>
                                        <a
                                            href="javascript:void(0)"
                                            v-if="
                                                filterEmptyEntriesFromArray(singItem).length >
                                                    defaultDisplayItemsLimit &&
                                                    showMoreInArrayItems[dataItem.topics_id + '-' + slot.key_name]
                                            "
                                            @click.prevent="displayMoreInArrayItems(dataItem.topics_id, slot.key_name)"
                                        >
                                            {{ labels.show_less }}
                                        </a>
                                        <a
                                            href="javascript:void(0)"
                                            v-if="
                                                filterEmptyEntriesFromArray(singItem).length >
                                                    defaultDisplayItemsLimit &&
                                                    !showMoreInArrayItems[dataItem.topics_id + '-' + slot.key_name]
                                            "
                                            @click.prevent="displayMoreInArrayItems(dataItem.topics_id, slot.key_name)"
                                        >
                                            {{ labels.show_more }}
                                        </a>
                                    </span>
                                </span>
                                <span v-else-if="isArray(dataItem[slot.key_name])">
                                    <span
                                        v-for="(singItem, index) in filterEmptyEntriesFromArray(
                                            dataItem[slot.key_name]
                                        )"
                                        :key="index"
                                    >
                                        <span v-if="index < defaultDisplayItemsLimit"> {{ singItem }} <br /> </span>
                                        <span
                                            v-if="
                                                index >= defaultDisplayItemsLimit &&
                                                    showMoreItems[dataItem.topics_id + '-' + slot.key_name]
                                            "
                                        >
                                            {{ singItem }} <br
                                        /></span>
                                    </span>
                                    <a
                                        href="javascript:void(0)"
                                        v-if="
                                            filterEmptyEntriesFromArray(dataItem[slot.key_name]).length >
                                                defaultDisplayItemsLimit &&
                                                showMoreItems[dataItem.topics_id + '-' + slot.key_name]
                                        "
                                        @click.prevent="displayMoreItems(dataItem.topics_id, slot.key_name)"
                                    >
                                        {{ labels.show_less }}
                                    </a>
                                    <a
                                        href="javascript:void(0)"
                                        v-if="
                                            filterEmptyEntriesFromArray(dataItem[slot.key_name]).length >
                                                defaultDisplayItemsLimit &&
                                                !showMoreItems[dataItem.topics_id + '-' + slot.key_name]
                                        "
                                        @click.prevent="displayMoreItems(dataItem.topics_id, slot.key_name)"
                                    >
                                        {{ labels.show_more }}
                                    </a>
                                </span>
                                <span v-else>
                                    {{ dataItem[slot.key_name] }}
                                </span>
                            </span>
                        </template>
                        <template v-slot:tag_relations>
                            <span v-for="(singItem, index) in dataItem.tag_relations" :key="index">
                                <span v-if="index < defaultDisplayItemsLimit"> {{ singItem }} <br /> </span>
                                <span v-if="index >= defaultDisplayItemsLimit && showMoreTags[dataItem.topics_id]">
                                    {{ singItem }} <br
                                /></span>
                            </span>
                            <a
                                href="javascript:void(0)"
                                v-if="
                                    dataItem.tag_relations.length > defaultDisplayItemsLimit &&
                                        showMoreTags[dataItem.topics_id]
                                "
                                @click.prevent="displayMoreTags(dataItem.topics_id)"
                            >
                                {{ labels.show_less }}
                            </a>
                            <a
                                href="javascript:void(0)"
                                v-if="
                                    dataItem.tag_relations.length > defaultDisplayItemsLimit &&
                                        !showMoreTags[dataItem.topics_id]
                                "
                                @click.prevent="displayMoreTags(dataItem.topics_id)"
                            >
                                {{ labels.show_more }}
                            </a>
                        </template>
                        <template v-slot:update_ymdhi>
                            <time-from-now v-slot:update_ymdhi :time="dataItem.update_ymdhi" />
                        </template>
                    </table-column-content>
                </template>
            </base-table>

            <pager v-if="hasDataInitialized" :pageInfo="pageInfo" @change-page="handlePageIndicatorChange" />
            <div v-if="hasDataInitialized && (auth.update || auth.delete)" class="buttonbox">
                <ul>
                    <p>{{ labels.withselected }}</p>
                    <form-action-button
                        v-if="auth.update"
                        className="success large mr5"
                        leftIconClass="fa fa-check-circle"
                        actionMode="public"
                        :text="labels.publish_btn"
                        @click="handleFormActionBtnClick"
                    />
                    <form-action-button
                        v-if="auth.update"
                        className="success large"
                        leftIconClass="fa fa-ban"
                        actionMode="private"
                        :text="labels.unpublish_btn"
                        @click="handleFormActionBtnClick"
                    />
                    <form-action-button
                        v-if="auth.delete"
                        className="danger large"
                        leftIconClass="fa fa-trash-o"
                        actionMode="delete"
                        :text="labels.delete_btn"
                        @click="handleFormActionBtnClick"
                    />
                    <form-action-button
                        v-if="auth.update && no_use_ymd"
                        className="large"
                        style="float: right"
                        leftIconClass="fa fa-refresh"
                        actionMode="change_order"
                        :text="labels.change_order_btn"
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
                                <div class="mb-2 row">
                                    <label for="encoding" class="col-sm-4 col-form-label">{{
                                        translate('/label/charset')
                                    }}</label>
                                    <div class="col-sm-8">
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
                                <div class="mb-3 row">
                                    <label for="encoding" class="col-sm-4 col-form-label">{{
                                        translate('/label/download/loop_format')
                                    }}</label>
                                    <div class="col-sm-8">
                                        <select name="loop_format" id="loop_format" class="form-select">
                                            <option value="1">{{
                                                translate('/label/download/cvs_col_combine')
                                            }}</option>
                                            <option value="2">{{
                                                translate('/label/download/cvs_col_separate')
                                            }}</option>
                                            <option value="3">{{
                                                translate('/label/download/cvs_col_grouped')
                                            }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div v-if="useMultilang" class="mb-3 row">
                                    <label for="download_lang" class="col-sm-4 col-form-label">{{
                                        translate('/label/select-lang')
                                    }}</label>
                                    <div class="col-sm-8">
                                        <select name="download_lang" id="download_lang" class="form-select">
                                            <option v-for="lang in supportedLangs" :value="lang" :key="lang">
                                                {{ lang }}
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
                                    <div v-for="col in outputColumns" class="mb-2" :key="col.key">
                                        <input
                                            type="checkbox"
                                            name="outputcolumns[]"
                                            :id="'outputcolumns_' + col.key"
                                            :value="col.key"
                                            v-model="selectedOutputColumns"
                                            class="form-check-input"
                                        />
                                        <label :for="'outputcolumns_' + col.key" class="form-check-label">{{
                                            col.name
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
                                    type="button"
                                    class="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    @click="handleDownloadBtnClick('FILEDOWNLOAD')"
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
                                    type="button"
                                    class="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    @click="handleBatchDownloadBtnClick('SEND_BAT_FILE')"
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
import BaseTable from '@/common/components/base-table/BaseTable.vue';
import BaseTablePage from '@/common/components/base-table/BaseTablePage.vue';
import FlagPublishIndicator from '@/common/components/FlagPublishIndicator.vue';
import FormActionButton from '@/common/components/FormActionButton.vue';
import LanguageStatus from '@/common/components/base-table/LanguageStatus.vue';
import Pager from '@/common/components/original-plugins/Pager.vue';
import RcmsMsgBox from '@/common/components/RcmsMsgBox.vue';
import TableColumnContent from '@/common/components/base-table/table-column-content/TableColumnContent.vue';
import TableColumnEditModal from '@/common/components/base-table/table-column-edit-modal/TableColumnEditModal.vue';
import DisplayItemSettingBtn from '@/common/components/base-table/table-column-edit-modal/DisplayItemSettingBtn.vue';
import TimeFromNow from '@/common/components/TimeFromNow.vue';
import SubTable from '@/common/components/sub-table/SubTable.vue';

const Filter_Form_Name = 'topics_list_search_box';
const Table_Form_Name = 'topics_list_form';
const Batch_Form_Name = 'batch_topics_list_form';

const TOPICS_LIST_REQUEST_MODE = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    DELETE: 'delete',
    CHANGE_ORDER: 'change_order',
};

export default {
    extends: BaseTablePage,
    name: 'topics-list',
    components: {
        BaseTable,
        FlagPublishIndicator,
        FormActionButton,
        LanguageStatus,
        Pager,
        RcmsMsgBox,
        TableColumnContent,
        TableColumnEditModal,
        DisplayItemSettingBtn,
        TimeFromNow,
        SubTable,
    },
    props: {
        auth: {
            type: Object, // like { update: true, delete: true }
            default: () => ({}),
        },
        per_page: {
            type: Number,
            default: () => 20,
        },
        topics_group_id: {
            type: Number,
            default: () => 0,
        },
        contents_type: {
            type: Number,
            default: () => null,
        },
        tag_relation: {
            type: Number,
            default: () => null,
        },
        opflg: {
            type: Number,
            default: () => null,
        },
        no_use_ymd: {
            type: Number,
            default: () => 0,
        },
        multilang_search: {
            type: String,
            default: () => '',
        },
        search_open_sta_date: {
            type: String,
            default: () => '',
        },
        search_open_end_date: {
            type: String,
            default: () => '',
        },
        topics_keyword: {
            type: String,
            default: () => '',
        },
        filtersValue: {
            type: String,
            default: () => '',
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
        /** configurable column options in the middle of the table */
        columnOptions: {
            type: Array, // for example [{ key_name: 'email', disp_name: 'EMAIL', sortable: true }, { key_name: 'sex', disp_name: 'SEX', sortable: true }]
            default: () => [],
        },
        outputColumns: {
            type: Array,
            default: () => [],
        },
        topicsExtType: {
            type: Object,
            default: () => ({}),
        },
        useMultilang: {
            // "1" or "0"
            type: String,
            default: '',
        },
        supportedLangs: {
            type: Array,
            default: () => [],
        },
        DG_CODE: {
            type: String,
            default: '',
        },
        I18N_DEFAULT_LANGUAGES: {
            type: String,
            default: 'ja',
        },
    },
    data() {
        return {
            labels: {
                withselected: this.translate('/label/withselected'),
                publish_btn: this.translate('/label/publish_btn'),
                unpublish_btn: this.translate('/label/unpublish_btn'),
                delete_btn: this.translate('/label/delete_btn'),
                change_order_btn: this.translate('/label/change_order_btn'),
                confirm_del_selected_items: this.translate('/msg/confirm_del_selected_items'),
                filter_btn: this.translate('/label/filter_btn'),
                keyword: this.translate('/label/keyword'),
                search_btn: this.translate('/label/search_btn'),
                show_more: this.translate('/label/show_more'),
                show_less: this.translate('/label/show_less'),
                download_all_btn: this.translate('/label/download_btn'),
                download_attachments: this.translate('/label/filedownload'),
                download_all_bat_btn: this.translate('/label/send_batch'),
                download_attachments_bat: this.translate('/label/send_batch_file'),
            },
            currDisplayColumns: [],
            keyword: '',
            defaultDisplayItemsLimit: 5,
            showMoreTags: {},
            showMoreInArrayItems: {},
            showMoreItems: {},
            dataListKey: 'topics_list', // dataList key in the api response
            hideSelectedOutputCols: true,
            encodingOptions: [
                { text: 'Shift-JIS', value: 'sjis' },
                { text: 'UTF-8', value: 'utf8' },
            ],
            selectedOutputColumns: [],
            allSelected: true,
            selectAllIndeterminated: false,
            batchColumns: [
                { key_name: 'status', disp_name: this.translate('/label/status_katakana') },
                { key_name: 'do_datetime', disp_name: this.translate('/modules/batch/label/run_date') },
                { key_name: 'last_do_ymdhi', disp_name: this.translate('/modules/batch/label/last_do_ymdhi') },
                { key_name: 'expire', disp_name: this.translate('/label/expire') },
                { key_name: 'result', disp_name: this.translate('/label/result') },
            ],
            batchForms: [
                { key_name: 'module_type[]', value: 'topics' },
                { key_name: 'ct', value: 'topics_download' },
                { key_name: 'from_do_datetime', value: '-14 days' },
                { key_name: 'status[]', value: '0' },
                { key_name: 'status[]', value: '10' },
                { key_name: 'status[]', value: '15' },
                { key_name: 'status[]', value: '99' },
                { key_name: 'ext_data[topics_group_id]', value: `${this.topics_group_id}` },
            ],
        };
    },
    watch: {
        selectedOutputColumns: function(newVal) {
            this.allSelected = newVal.length === this.outputColumns.length;
            this.selectAllIndeterminated = newVal.length !== this.outputColumns.length && newVal.length > 0;
        },
    },
    computed: {
        hasFilterConditions() {
            const { filtersValue } = this;
            return (
                this.opflg ||
                this.tag_relation ||
                this.contents_type ||
                this.multilang_search ||
                this.search_open_sta_date ||
                this.search_open_end_date ||
                (filtersValue && filtersValue !== '{"filter":"","order":""}')
            );
        },
        columnOptionsWithoutDefaultOnes() {
            const defaults = this.defaultColumns.map(item => {
                return item.key_name;
            });
            return this.columnOptions.filter(function(obj) {
                return !defaults.includes(obj.key_name);
            });
        },
    },
    created() {},
    mounted() {
        this.initTableColumns();
        this.setProxyForFilterForm();
        if (this.hasFilterConditions) {
            this.toggleFiltersVisibility();
        }
        for (const col of this.outputColumns) {
            this.selectedOutputColumns.push(col.key);
        }
        this.$nextTick(this.refreshTableListData);
    },
    methods: {
        isArray(item) {
            return Array.isArray(item);
        },
        isArrayOfArrays(item) {
            if (item) return Array.isArray(item[0]);
            else return false;
        },
        filterEmptyEntriesFromArray(item) {
            return Array.isArray(item) ? item.filter(e => e) : item;
        },
        selectAll() {
            this.selectedOutputColumns = [];

            if (!this.allSelected) {
                for (const col of this.outputColumns) {
                    this.selectedOutputColumns.push(col.key);
                }
            }
        },
        isFileType(type) {
            const extFileTypeCompare = [
                this.topicsExtType.TOPICS_EXT_TYPE_FILEMANGER,
                this.topicsExtType.TOPICS_EXT_TYPE_GCSFILE,
                this.topicsExtType.TOPICS_EXT_TYPE_FILE,
                this.topicsExtType.TOPICS_EXT_TYPE_S3FILE,
                this.topicsExtType.TOPICS_EXT_TYPE_IMAGE,
            ];
            return extFileTypeCompare.includes(parseInt(type));
        },
        displayMoreTags(topics_id) {
            this.$set(this.showMoreTags, topics_id, !this.showMoreTags[topics_id]);
        },
        displayMoreItems(topics_id, extNumber) {
            this.$set(
                this.showMoreItems,
                topics_id + '-' + extNumber,
                !this.showMoreItems[topics_id + '-' + extNumber]
            );
        },
        displayMoreInArrayItems(topics_id, extNumber) {
            this.$set(
                this.showMoreInArrayItems,
                topics_id + '-' + extNumber,
                !this.showMoreInArrayItems[topics_id + '-' + extNumber]
            );
        },
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
        fetchTopicsListData(queryStr = '', method = 'GET') {
            const query = queryStr.startsWith('?') ? queryStr : `?${queryStr}`;
            const url = `/management/topics/topics_list/${query}`;
            this.setFilterHistory(url, method);
            this.fetchTableListData(url, method);
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

            const formElem = this.buildfilterForm();
            const query = this.convertFormDataToQueryString(formElem, extraData);
            this.fetchTopicsListData(query, method);
        },
        buildfilterForm() {
            const formElem = this.$refs[Table_Form_Name];
            const filterForm = document.forms[Filter_Form_Name];

            this['topics_keyword'] = formElem.topics_keyword.value;

            for (const filterProp of [
                'opflg',
                'per_page',
                'contents_type',
                'tag_relation',
                'multilang_search',
                'search_open_sta_date',
                'search_open_end_date',
            ]) {
                if (filterForm[filterProp] !== undefined) {
                    this[filterProp] = formElem[filterProp].value = filterForm[filterProp].value;
                }
            }
            return formElem;
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
                '/direct/menu/updateMemberExData/?target=topics_list_selectedColumns_' + this.topics_group_id;
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
        setProxyForFilterForm() {
            const filterForm = document.forms[Filter_Form_Name];
            filterForm.onsubmit = this.handleFilterFormSubmit;
            filterForm.style.display = 'none';
            document.addEventListener('filters-change', e => {
                this.filtersValue = e.detail;
            });
        },
        toggleFiltersVisibility() {
            const filterForm = document.forms[Filter_Form_Name];
            if (!filterForm) return;
            const showing = getComputedStyle(filterForm).display !== 'none';
            filterForm.style.display = showing ? 'none' : 'block';
        },
        handleSearchBtnClick() {
            this.loading = true;
            this.refreshTableListData();
        },
        handleFormActionBtnClick(payload) {
            const mode = payload;
            if (TOPICS_LIST_REQUEST_MODE.DELETE === mode && !confirm(this.labels.confirm_del_selected_items)) {
                return;
            }
            this.refreshTableListData({ MODE: mode }, 'POST');
        },
        handleDownloadBtnClick(mode) {
            const formElem = this.$refs[Table_Form_Name];
            formElem.filters.value = this.keyword ? this.mergeKeywordFilter(this.filtersValue) : this.filtersValue;
            formElem.MODE.value = mode;
            formElem.submit();
            formElem.MODE.value = '';
            formElem.filters.value = '';
        },
        handleBatchDownloadBtnClick(mode) {
            const formElem = this.buildfilterForm();
            formElem.MODE.value = mode;
            const query = this.convertFormDataToQueryString(formElem, {});
            const url = `/management/topics/topics_list/?${query}`;
            this.$nextTick(() => {
                this.$refs[Batch_Form_Name].handleSubTableBtnClick(url, 'post').then(() => {
                    this.messages = this.$refs[Batch_Form_Name].messages;
                });

                formElem.MODE.value = '';
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
}

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
