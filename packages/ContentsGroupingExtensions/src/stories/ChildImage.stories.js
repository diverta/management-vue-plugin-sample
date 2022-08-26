import ChildImage from '../components/ChildImage.vue';

export default {
  title: 'Topics/Extensions/ChildImage',
  component: ChildImage,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ChildImage },
  template: '<child-image v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
  name: 'NAME',
  ext_title: 'EXT_TITLE',
  value: 'VALUE'
};
