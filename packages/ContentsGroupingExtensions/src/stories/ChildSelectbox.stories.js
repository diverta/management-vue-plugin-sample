import ChildSelectbox from '../components/ChildSelectbox.vue';

export default {
    title: 'Topics/Extensions/ChildSelectbox',
    component: ChildSelectbox,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ChildSelectbox },
    template: '<child-selectbox v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
    name: 'NAME',
    ext_title: 'EXT_TITLE',
    options: {
        key1: 'value1',
        key2: 'value2',
    },
};

export const Required = Template.bind({});
Required.args = {
    name: 'NAME',
    ext_title: 'EXT_TITLE',
    options: {
        key1: 'value1',
        key2: 'value2',
    },
    limits: {
        required: true,
    },
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
    name: 'NAME',
    ext_title: 'EXT_TITLE',
    value: 'key2',
    options: {
        key1: 'value1',
        key2: 'value2',
    },
};
