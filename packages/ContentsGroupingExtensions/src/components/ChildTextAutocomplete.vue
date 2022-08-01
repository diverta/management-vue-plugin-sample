<template>
    <div>
        <input
            type="text"
            :name="$attrs.name"
            v-model="inputValue"
            autocomplete="off"
            class="autocomplete-fld"
            @keyup="onValueChanged"
        />

        <div class="autocomplete-suggestions" v-if="showSuggestions">
            <a
                v-for="(item, index) in suggestions"
                :key="index"
                v-bind:class="{ 'autocomplete-link': true, 'autocomplete-link--active': index === activeLink }"
                @click.self.prevent="() => selectVal(item)"
                >{{ item }}</a
            >
            <p class="close-btn-wrap">
                <!-- TODO <a class="rcms_btn" @click.self.prevent="close()">{{ translate('/label/close') }}</a> -->
                <a class="rcms_btn" @click.self.prevent="close">閉じる</a>
            </p>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import { KEY_UP, KEY_DOWN, KEY_RETURN } from 'keycode-js';

export default {
    props: ['value', 'topics_group_id', 'topics_id'],
    data() {
        return {
            inputValue: this.$attrs.value || '',
            suggestions: [],
            showSuggestions: false,
            activeLink: -1,
        };
    },
    methods: {
        onValueChanged: _.debounce(function($event) {
            if (!this.showSuggestions) {
                this.loadData();
                return;
            }

            const reset = () => {
                this.activeLink = 0;
            };

            if ($event.keyCode === KEY_DOWN) {
                this.activeLink > this.suggestions.length ? reset() : this.activeLink++;
                return;
            }
            if ($event.keyCode === KEY_UP) {
                this.activeLink - 1 < 0 ? reset() : this.activeLink--;
                return;
            }
            if ($event.keyCode === KEY_RETURN && this.activeLink > -1) {
                this.selectVal(this.suggestions[this.activeLink]);
                return;
            }
        }, 100),

        // TODO Error: Incorrect field settings がレスポンスされてしまう
        async loadData() {
            const fldName = this.$attrs.name.replace(/\[\d+\]/, '');
            const res = await this.getAutocompleteList({
                topics_group_id: this.$attrs.options.topics_group_id,
                field: fldName,
                search: this.inputValue,
            });

            const d = await res.json();
            if (d.error) {
                throw new Error(d.error);
            }

            this.suggestions = d.data || [];
        },
        selectVal(item) {
            this.inputValue = item;
            this.showSuggestions = false;
            this.activeLink = -1;
        },
        close() {
            this.suggestions = [];
            this.showSuggestions = false;
            this.activeLink = -1;
        },

        async getAutocompleteList({ search = '', limit = 100, ...args }) {
            const url = '/direct/topics/autocomplete_suggestions/';
            const params = {
                action: 'load-suggestions',
                search: search,
                limit: limit,
                ...args,
            };

            return await fetch(`${url}?${new URLSearchParams(params)}`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
            });
        },
    },
};
</script>

<style scoped>
.autocomplete-fld {
    width: 370px;
}
.autocomplete-suggestions {
    position: absolute;
    background: #f3ecd1;
    border: 1px solid #ccc;
    width: 376px;
    overflow-y: scroll;
    max-height: 250px;
    min-height: 30px;
    z-index: 9999;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25), 0 5px 5px rgba(0, 0, 0, 0.22);
}
.close-btn-wrap {
    text-align: right;
    padding: 5px 10px;
}
.rcms_btn {
    /*height: 28px;*/
    padding: 3px 8px;
    margin-right: 3px;
}
.autocomplete-link {
    display: block;
    padding: 3px 5px;
    cursor: pointer;
}
.autocomplete-link--active {
    background: #d3f3ff;
}
.autocomplete-link:hover {
    background: #fff;
}
</style>
