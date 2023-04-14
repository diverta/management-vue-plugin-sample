<template>
    <div>
        <dt class="after_second">{{ $attrs.ext_title }}</dt>
        <dd
            class="multi_dd"
            :class="`ext_item_${$attrs.ext_index - 1}`"
            :data-ext_type="$attrs.ext_type"
            :data-default_value="$attrs.default_value"
            ref="content"
        >
            <input
                type="text"
                :name="`${$attrs.name}[ymd]`"
                :id="datetimeInputID"
                :value="$attrs.value.ymd"
                autocomplete="off"
            />

            <template v-if="$attrs.options.add_time">
                <label>時刻:</label>
                <select ref="hour" style="width: 55px" :name="`${$attrs.name}[h]`">
                    <option label="00" value="0">00</option>
                    <option label="01" value="1">01</option>
                    <option label="02" value="2">02</option>
                    <option label="03" value="3">03</option>
                    <option label="04" value="4">04</option>
                    <option label="05" value="5">05</option>
                    <option label="06" value="6">06</option>
                    <option label="07" value="7">07</option>
                    <option label="08" value="8">08</option>
                    <option label="09" value="9">09</option>
                    <option label="10" value="10">10</option>
                    <option label="11" value="11">11</option>
                    <option label="12" value="12">12</option>
                    <option label="13" value="13">13</option>
                    <option label="14" value="14">14</option>
                    <option label="15" value="15">15</option>
                    <option label="16" value="16">16</option>
                    <option label="17" value="17">17</option>
                    <option label="18" value="18">18</option>
                    <option label="19" value="19">19</option>
                    <option label="20" value="20">20</option>
                    <option label="21" value="21">21</option>
                    <option label="22" value="22">22</option>
                    <option label="23" value="23">23</option>
                </select>
                :
                <select ref="minute" style="width: 55px" :name="`${$attrs.name}[i]`">
                    <option label="00" value="0">00</option>
                    <option label="01" value="1">01</option>
                    <option label="02" value="2">02</option>
                    <option label="03" value="3">03</option>
                    <option label="04" value="4">04</option>
                    <option label="05" value="5">05</option>
                    <option label="06" value="6">06</option>
                    <option label="07" value="7">07</option>
                    <option label="08" value="8">08</option>
                    <option label="09" value="9">09</option>
                    <option label="10" value="10">10</option>
                    <option label="11" value="11">11</option>
                    <option label="12" value="12">12</option>
                    <option label="13" value="13">13</option>
                    <option label="14" value="14">14</option>
                    <option label="15" value="15">15</option>
                    <option label="16" value="16">16</option>
                    <option label="17" value="17">17</option>
                    <option label="18" value="18">18</option>
                    <option label="19" value="19">19</option>
                    <option label="20" value="20">20</option>
                    <option label="21" value="21">21</option>
                    <option label="22" value="22">22</option>
                    <option label="23" value="23">23</option>
                    <option label="24" value="24">24</option>
                    <option label="25" value="25">25</option>
                    <option label="26" value="26">26</option>
                    <option label="27" value="27">27</option>
                    <option label="28" value="28">28</option>
                    <option label="29" value="29">29</option>
                    <option label="30" value="30">30</option>
                    <option label="31" value="31">31</option>
                    <option label="32" value="32">32</option>
                    <option label="33" value="33">33</option>
                    <option label="34" value="34">34</option>
                    <option label="35" value="35">35</option>
                    <option label="36" value="36">36</option>
                    <option label="37" value="37">37</option>
                    <option label="38" value="38">38</option>
                    <option label="39" value="39">39</option>
                    <option label="40" value="40">40</option>
                    <option label="41" value="41">41</option>
                    <option label="42" value="42">42</option>
                    <option label="43" value="43">43</option>
                    <option label="44" value="44">44</option>
                    <option label="45" value="45">45</option>
                    <option label="46" value="46">46</option>
                    <option label="47" value="47">47</option>
                    <option label="48" value="48">48</option>
                    <option label="49" value="49">49</option>
                    <option label="50" value="50">50</option>
                    <option label="51" value="51">51</option>
                    <option label="52" value="52">52</option>
                    <option label="53" value="53">53</option>
                    <option label="54" value="54">54</option>
                    <option label="55" value="55">55</option>
                    <option label="56" value="56">56</option>
                    <option label="57" value="57">57</option>
                    <option label="58" value="58">58</option>
                    <option label="59" value="59">59</option>
                </select>
                <br />
            </template>

            <span class="hint">(例 : 2005/01/27)</span>
            <p v-if="$attrs.ext_help_msg"><span class="hint">{$item.ext_help_msg}</span></p>
        </dd>
    </div>
</template>

<script>
export default {
    props: {
        activated: { type: Boolean, default: false },
    },
    computed: {
        datetimeInputID() {
            return `dt_${this.creationTime}`;
        },
        datetimeInputScriptID() {
            return `script_${this.datetimeInputID}`;
        },
    },
    data() {
        return {
            creationTime: Date.now(),
        };
    },
    methods: {
        mountDatetimePicker() {
            const script = `
                jQuery('#${this.datetimeInputID}').datepicker({
                    showOn: "button",
                    buttonImage: '/management/images/management/calendar_week.png',
                    dateFormat: 'yy/mm/dd',
                });`;
            const scriptElement = document.createElement('script');
            scriptElement.id = this.datetimeInputScriptID;
            scriptElement.innerHTML = script;
            this.$refs.content.appendChild(scriptElement);
        },
    },
    mounted() {
        console.log('DATE!', this.$attrs.value?.h, this.$attrs.value?.i);
        if (this.$refs.hour && this.$attrs.value?.h !== undefined) {
            const hourSelect = Array.from(this.$refs.hour.children).find(({ label }) => label === this.$attrs.value?.h);
            if (hourSelect) {
                hourSelect.selected = true;
            }
        }
        if (this.$refs.minute && this.$attrs.value?.i !== undefined) {
            const minuteSelect = Array.from(this.$refs.minute.children).find(
                ({ label }) => label === this.$attrs.value?.i
            );
            if (minuteSelect) {
                minuteSelect.selected = true;
            }
        }
    },
    watch: {
        activated: {
            handler(activated) {
                if (activated) {
                    this.$nextTick(this.mountDatetimePicker);
                    return;
                }
                document?.getElementById(this.datetimeInputScriptID)?.remove();
            },
            immediate: true,
        },
    },
};
</script>
