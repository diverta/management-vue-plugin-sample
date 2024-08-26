import ChildCsvtable from '../components/ChildCsvtable.vue';

export default {
    title: 'Topics/Extensions/ChildCsvtable',
    component: ChildCsvtable,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ChildCsvtable },
    template: '<child-csv-table v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
    name: 'NAME',
    ext_title: 'EXT_TITLE',
    value: 'VALUE',
};
