import ChildMultipleCheckbox from '../components/ChildMultipleCheckbox.vue';

export default {
    title: 'Topics/Extensions/ChildMultipleCheckbox',
    component: ChildMultipleCheckbox,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ChildMultipleCheckbox },
    template: '<child-multiple-checkbox v-bind="$props" />',
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

export const DefaultValue = Template.bind({});
DefaultValue.args = {
    name: 'NAME',
    ext_title: 'EXT_TITLE',
    value: {
        key2: 'value2',
    },
    options: {
        key1: 'value1',
        key2: 'value2',
    },
};
