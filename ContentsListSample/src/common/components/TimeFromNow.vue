<template>
    <span :class="{ highlight: isLessThanOneDay }">{{ displayTime }}</span>
</template>

<script>
import Base from '@/common/Base.vue';
import moment from 'moment';

const ONE_MINUTE_IN_MILLS = 60 * 1000;
const ONE_HOUR_IN_MILLS = 60 * 60 * 1000;
const ONE_DAY_IN_MILLS = 24 * 60 * 60 * 1000;

/**
 * Display a time label text depends on the time and now time difference.
 */
export default {
    extends: Base,
    props: {
        time: {
            type: String,
            default: '',
        },
    },
    data() {
        return {};
    },
    computed: {
        timeObj() {
            return moment(this.time);
        },
        isLessThanOneDay() {
            const now = moment();
            return now.diff(this.timeObj) < ONE_DAY_IN_MILLS && now.diff(this.timeObj) >= 0;
        },
        displayTime() {
            if (this.isLessThanOneDay) {
                const now = moment();
                let diff = 0;
                let relativeTimeStr = '';
                if (now.diff(this.timeObj) < ONE_MINUTE_IN_MILLS) {
                    diff = now.diff(this.timeObj, 'seconds');
                    relativeTimeStr = this.translate('/label/update_seconds_ago', [diff]);
                } else if (now.diff(this.timeObj) < ONE_HOUR_IN_MILLS) {
                    diff = now.diff(this.timeObj, 'minutes');
                    relativeTimeStr = this.translate('/label/update_minutes_ago', [diff]);
                } else {
                    diff = now.diff(this.timeObj, 'hours');
                    relativeTimeStr = this.translate('/label/update_hours_ago', [diff]);
                }
                return `${this.timeObj.format('HH:mm:ss')}(${relativeTimeStr})`;
            } else {
                return this.timeObj.format('YYYY/MM/DD(ddd) HH:mm:ss');
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.highlight {
    color: #5faf23;
    font-weight: bold;
}
</style>
