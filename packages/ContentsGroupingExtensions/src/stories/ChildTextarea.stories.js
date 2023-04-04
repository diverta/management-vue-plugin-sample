import ChildTextarea from '../components/ChildTextarea.vue';

export default {
    title: 'Topics/Extensions/ChildTextarea',
    component: ChildTextarea,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ChildTextarea },
    template: '<child-textarea v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
    name: 'NAME',
    ext_title: 'EXT_TITLE',
    value: 'VALUE',
};
