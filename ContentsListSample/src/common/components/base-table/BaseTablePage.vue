<template>
    <div></div>
</template>

<script>
import Base from '@/common/Base.vue';
import qs from 'qs';
import axios from 'axios';
import { processError } from '@/api/utils';

export default {
    extends: Base,
    data() {
        return {
            hasDataInitialized: false,
            errors: [],
            messages: [],
            dataList: [],
            pageInfo: {
                totalCnt: 0,
                firstIndex: 0,
                lastIndex: 0,
                totalPageCnt: 0,
                startPageNo: 0,
                pageNo: 0,
                perPage: 0,
            },
            docmetas: {},
            pageID: 1,
            sortKey: '',
            isDesc: false,
            loading: false,
        };
    },
    mounted() {
        this.initStateFromURLQuery();
    },
    methods: {
        initStateFromURLQuery() {
            const searchObj = location.search ? qs.parse(location.search, { ignoreQueryPrefix: true }) : '';
            if (searchObj.sort) {
                this.sortKey = searchObj.sort;
                this.isDesc = searchObj.desc == 1;
            }
            if (searchObj.pageID) {
                this.pageID = searchObj.pageID;
            }
            if (searchObj.perPage) {
                this.perPage = searchObj.perPage;
            }
        },
        convertFormDataToQueryString(formElem, extraData = {}) {
            const formData = new FormData(formElem);
            for (const entry of Object.entries(extraData)) {
                formData.set(entry[0], entry[1]);
            }
            // return [...formData.entries()].map(item => encodeURIComponent(`${item[0]}=${item[1]}`)).join('&');
            return [...formData.entries()]
                .map(item => {
                    const [name, value] = item;
                    if (name === 'filters' && this.keyword) {
                        // append search keyword to filters params
                        const mergedKeywordFilters = this.mergeKeywordFilter(value);
                        return `${name}=${mergedKeywordFilters}`;
                    }
                    return `${name}=${value}`;
                })
                .join('&');
        },
        mergeKeywordFilter(filters) {
            // append search keyword to filters params
            if (filters) {
                // filter params is not empty
                const filtersObj = JSON.parse(filters);
                if (filtersObj.filter) {
                    // filter params has filter value
                    if (/\s*OR\s*/.test(filtersObj.filter)) {
                        filtersObj.filter = `${filtersObj.filter} OR keyword contains "${this.keyword.replace(
                            '+',
                            '%2b'
                        )}"`;
                    } else {
                        filtersObj.filter = `${filtersObj.filter} AND keyword contains "${this.keyword.replace(
                            '+',
                            '%2b'
                        )}"`;
                    }
                } else {
                    // filter params has not filter value
                    filtersObj.filter = `keyword contains "${this.keyword.replace('+', '%2b')}"`;
                }
                return `${JSON.stringify(filtersObj)}`;
            } else {
                const filtersObj = {};
                filtersObj.filter = `keyword contains "${this.keyword.replace('+', '%2b')}"`;
                // filter params is empty
                return `${JSON.stringify(filtersObj)}`;
            }
        },
        fetchTableListData(url, method = 'GET') {
            this.errors = [];
            this.messages = [];
            axios(url, {
                headers: { Accept: 'application/json' },
                withCredentials: true,
                method,
            })
                .then(processError)
                .then(res => {
                    if (res.errors && res.errors.length > 0) {
                        this.errors = res.errors;
                    } else {
                        this.messages = res.messages;
                        this.pageInfo = res.pageInfo;
                        this.pageID = res.pageInfo.pageNo;
                        this.dataList = res[this.dataListKey];
                        if (res.hasOwnProperty('docmetas')) this.docmetas = res.docmetas;
                        if (!this.hasDataInitialized) this.hasDataInitialized = true;
                    }
                })
                .catch(err => {
                    if (err && Array.isArray(err.errors) && err.errors.length > 0) {
                        this.errors = err.errors;
                    }
                })
                .then(() => {
                    this.loading = false;
                });
        },
        handleFilterFormSubmit(e) {
            e.preventDefault();
            setTimeout(() => {
                this.filtersValue = e.target.filters.value;
                const displayNum = e.target.perPage.value;
                if (Number(displayNum) > 0) {
                    this.perPage = Number(displayNum);
                }
                this.refreshTableListData();
            }, 0);
        },
    },
};
</script>
