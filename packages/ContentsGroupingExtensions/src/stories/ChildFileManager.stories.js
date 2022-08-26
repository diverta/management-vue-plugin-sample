import ChildFileManager from '../components/ChildFileManager.vue';

export default {
  title: 'Topics/Extensions/ChildFileManager',
  component: ChildFileManager,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ChildFileManager },
  template: '<child-file-manager v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
  name: 'NAME',
  ext_title: 'EXT_TITLE',
  value: 'VALUE'
};
