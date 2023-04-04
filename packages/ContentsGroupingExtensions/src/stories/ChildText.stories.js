import ChildText from '../components/ChildText.vue';

export default {
    title: 'Topics/Extensions/ChildText',
    component: ChildText,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ChildText },
    template: '<child-text v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
    name: 'NAME',
    ext_title: 'EXT_TITLE',
    value: 'VALUE',
};
