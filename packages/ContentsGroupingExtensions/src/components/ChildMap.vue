<template>
    <div>
        <dt class="after_second">{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
            ref="form"
        >
            <span class="hint">地図上をクリックすると設定される位置が変わります。ズームなどの状態も設定できます。</span
            ><br />

            <input type="hidden" :id="`gmap_x${id}`" :name="`${name}[gmap_x]`" :value="value ? value.gmap_x : ''" />
            <input type="hidden" :id="`gmap_y${id}`" :name="`${name}[gmap_y]`" :value="value ? value.gmap_y : ''" />
            <input
                type="hidden"
                :id="`gmap_zoom${id}`"
                :name="`${name}[gmap_zoom]`"
                :value="value ? value.gmap_zoom : ''"
            />
            <input
                type="hidden"
                :id="`gmap_type${id}`"
                :name="`${name}[gmap_type]`"
                :value="value ? value.gmap_type : ''"
            />
            <input
                type="hidden"
                :id="`gmap_place_id${id}`"
                :name="`${name}[gmap_place_id]`"
                :value="value ? value.gmap_place_id : ''"
            />

            <iframe
                :src="iframeSrc"
                :id="`googlemap_iframe_${id}`"
                name="googlemap"
                width="490"
                height="450"
                scrolling="auto"
                marginheight="0"
                marginwidth="0"
                frameborder="0"
            />
            <p v-if="$attrs.ext_help_msg">
                <span class="hint">{{ $attrs.ext_help_msg }}</span>
            </p>

            <div>
                <input type="button" value="登録場所をクリアする" @click.prevent="clear" />
            </div>
        </dd>
    </div>
</template>

<script>
export default {
    props: ['name', 'repeatCnt', 'ext_col_nm', 'value'],
    computed: {
        id() {
            const repeatCountToken =
                this.repeatCnt !== null && this.repeatCnt !== undefined ? `_${this.repeatCnt}` : '';
            return `${this.ext_col_nm}${repeatCountToken}`;
        },
        iframeSrc() {
            const query = new URLSearchParams({
                ...this.$props.value,
                suffix: this.id,
            });
            return `/management/topics/location_map/?${query}`;
        },
    },
    methods: {
        clear() {
            const $elm = this.$refs.form;
            const input = {
                x: $elm.querySelector(`#gmap_x${this.id}`),
                y: $elm.querySelector(`#gmap_y${this.id}`),
                gmapPlaceId: $elm.querySelector(`#gmap_place_id${this.id}`),
            };
            const $iframe = $elm.querySelector(`#googlemap_iframe_${this.id}`);

            $iframe.contentWindow.marker.setVisible(false);
            $iframe.contentWindow.document.getElementById('message').innerHTML = '登録場所を指定してください。';
            if (input.gmapPlaceId.value) {
                $iframe.contentWindow.infowindow.close();
            }

            Object.values(input).forEach($e => {
                $e.value = '';
            });
        },
    },
};
</script>
