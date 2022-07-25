import { shallowMount } from '@vue/test-utils';
import Component from './ChildTextarea.vue';

describe('mounted', () => {
    it('is a Vue instance', () => {
        const wrapper = shallowMount(Component);
        expect(wrapper.isVueInstance).toBeTruthy();
    });

    it('has Title', () => {
        const wrapper = shallowMount(Component, {
            propsData: {
                ext_title: 'ext_title',
            },
        });
        expect(wrapper.html()).toMatch(/<dt \S+>ext_title<\/dt>/);
    });

    it('has Input', () => {
        const wrapper = shallowMount(Component, {
            propsData: {
                name: 'name',
                value: 'value',
            },
        });
        expect(wrapper.find('textarea').element.getAttribute('name')).toEqual('name');
        expect(wrapper.find('textarea').element.value).toEqual('value');
    });
});
