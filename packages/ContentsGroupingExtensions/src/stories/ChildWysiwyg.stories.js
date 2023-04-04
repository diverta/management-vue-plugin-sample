import ChildWysiwyg from '../components/ChildWysiwyg/index.vue';

export default {
    title: 'Topics/Extensions/ChildWysiwyg',
    component: ChildWysiwyg,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ChildWysiwyg },
    template: '<child-wysiwyg v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
    activated: true,
    ext_title: 'EXT_TITLE',
    value: 'VALUE',
};

export const Basic = Template.bind({});
Basic.args = {
    activated: true,
    ext_title: 'EXT_TITLE',
    value: 'VALUE',

    options: {
        toolbar: 'basic',
    },
};

export const Filtered = Template.bind({});
Filtered.args = {
    activated: true,
    ext_title: 'EXT_TITLE',
    value: 'VALUE',

    options: {
        removePlugins: 'SourceEditing,fullScreen,|,heading,ckfinder',
    },
};

export const Inactive = Template.bind({});
Inactive.args = {
    activated: false,
    ext_title: 'EXT_TITLE',
    value: 'VALUE',

    options: {
        removePlugins: 'SourceEditing,fullScreen,|,heading,ckfinder',
    },
};
