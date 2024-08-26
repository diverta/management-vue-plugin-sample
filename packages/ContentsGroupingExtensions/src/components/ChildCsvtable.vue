<template>
    <div>
        <dt>{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
        >
            <ExtCsvtable
                v-if="item.ext_option_parent_id && flagToLoadOnce"
                v-bind="item"
                :item="item"
                :target_id="$attrs.topics_group_id.toString()"
                module="topics"
                :name="$attrs.name"
                @hook:mounted="refireEvent"
            />
        </dd>
    </div>
</template>

<script>
import BaseMixin from './baseMixin.js';
import { GlobalEvent } from '@/common/globals';

export default {
    mixins: [BaseMixin],
    props: {
        topSelected: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            extComponentName: 'ExtCsvtable',
        };
    },
    methods: {
        refireEvent() {
            //Initially component isnt loaded so we cant listen to event
            // refire initial event when the child is loaded
            const id =
                this.$attrs.ext_option_parent_id + (this.$attrs.repeatCnt >= 0 ? '_' + this.$attrs.repeatCnt : '');
            GlobalEvent.dispatch(`ExtCsvtable.update.${id}`, this.topSelected);
        },
    },
    computed: {
        item() {
            return {
                ...this.$attrs,
                options: Object.entries(this.$attrs.options).map(([key, value]) => ({ key, value })),
            };
        },
        name() {
            return this.$attrs.name;
        },
        value() {
            return this.$attrs.value;
        },
    },
};
</script>
