<template>
    <p class="page_links">
        <input
            v-if="activePerPage"
            type="number"
            :value="pageInfo.perPage"
            @input="onUpdatePerPage"
            class="input-per-page"
        />
        <span class="summary" v-if="pageInfo.totalCnt > 0">{{
            translate('/label/pagination/summary', [pageInfo.totalCnt, pageInfo.firstIndex, pageInfo.lastIndex])
        }}</span>
        <template v-if="pageInfo['pageNo'] > 1">
            <a @click="getPage('First')" title="first page" class="first"
                ><span>{{ translate('/label/pagination/first') }}</span></a
            >
            <a @click="getPage('Previous')" title="previous page" class="back"
                ><span>{{ translate('/label/pagination/prev') }}</span></a
            >
        </template>
        <template v-for="i in rangeArray">
            <a :key="i" v-if="i != pageInfo['pageNo']" @click="getPage(`${i}`)" :title="`page ${i}`" class="page"
                ><span>{{ i }}</span></a
            >
            <span :key="i" v-else class="current">{{ i }}</span>
        </template>
        <template v-if="pageInfo.totalCnt > 0 && pageInfo['pageNo'] != pageInfo['totalPageCnt']">
            <a @click="getPage('Next')" title="next page" class="next"
                ><span>{{ translate('/label/pagination/next') }}</span></a
            >
            <a @click="getPage('Last')" title="last page" class="last"
                ><span>{{ translate('/label/pagination/last') }}</span></a
            >
        </template>
    </p>
</template>

<script>
import _ from 'lodash';

export default {
    name: 'pager',
    components: {},
    props: {
        pageInfo: {
            type: Object,
            default() {
                return {
                    totalCnt: 0,
                    firstIndex: 0,
                    lastIndex: 0,
                    totalPageCnt: 0,
                    startPageNo: 0,
                    pageNo: 0,
                    perPage: 0,
                };
            },
        },
        activePerPage: {
            type: Boolean,
            default: () => false,
        },
    },
    data: function() {
        return {
            num: 10,
        };
    },
    computed: {
        url: function() {
            return '';
        },
        startRange: function() {
            return this.pageInfo.startPageNo;
        },
        endRange: function() {
            return Math.min(this.pageInfo.totalPageCnt, this.pageInfo.startPageNo + this.num - 1);
        },
        separator: function() {
            return this.pageInfo.param == '' ? '?' : '&amp;';
        },
        rangeArray() {
            const { startRange, endRange } = this;
            const isNaN = Number.isNaN;
            if (
                typeof startRange === 'number' &&
                typeof endRange === 'number' &&
                !isNaN(startRange) &&
                !isNaN(endRange)
            ) {
                return Array.from(Array(endRange - startRange + 1).keys(), x => x + startRange);
            }
            return [];
        },
    },
    methods: {
        getPage(page) {
            if (page == 'First') {
                page = 1;
            } else if (page == 'Previous') {
                page = this.pageInfo['pageNo'] - 1;
            } else if (page == 'Last') {
                page = this.pageInfo['totalPageCnt'];
            } else if (page == 'Next') {
                page = this.pageInfo['pageNo'] + 1;
            }
            this.$emit('change-page', page);
        },
        onUpdatePerPage: _.debounce(function(event) {
            const new_per_page = parseInt(event.target.value);
            this.$emit('change-per-page', new_per_page);
        }, 350),
    },
    created() {},
    mounted() {},
    watch: {},
};
</script>

<style scoped>
.first,
.back,
.last,
.next,
.page {
    cursor: pointer;
}
.input-per-page {
    width: 4em;
}
</style>
