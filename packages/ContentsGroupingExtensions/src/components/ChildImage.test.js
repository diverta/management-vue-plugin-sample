import { shallowMount } from '@vue/test-utils';
import Component from './ChildImage.vue';

// eslint-disable-next-line prettier/prettier
import "regenerator-runtime/runtime.js";

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
        expect(wrapper.find('textarea').attributes().name).toEqual('name');
        expect(wrapper.find('textarea').element.value).toEqual('value');
    });

    describe('image preview', () => {
        it('shows image while fileURL exists', () => {
            const file_url = 'file_url';
            const wrapper = shallowMount(Component, {
                propsData: {
                    file_url,
                },
            });
            expect(wrapper.find('img').exists()).toBe(true);
            expect(wrapper.find('img').attributes().src).toEqual(file_url);
        });

        it('hides image while fileURL does not exists', () => {
            const file_url = undefined;
            const wrapper = shallowMount(Component, {
                propsData: {
                    file_url,
                },
            });
            expect(wrapper.find('img').exists()).toBe(false);
        });
    });
});

describe('action', () => {
    test("show error msg and won't show img when upload() gets error", async () => {
        const requestUploadFile = jest.fn();
        const wrapper = shallowMount(Component, {
            methods: {
                requestUploadFile,
            },
        });

        expect(wrapper.vm.fileURL).toBe(null);
        const file = {
            size: 1024 * 1024 * 10 + 1,
            type: 'image/png',
            name: 'image.png',
        };
        await wrapper.vm.upload({
            target: {
                files: [file],
            },
        });

        expect(wrapper.vm.fileURL).toBe(null);
        expect(requestUploadFile).not.toHaveBeenCalledWith(file);
        expect(wrapper.vm.msg).toEqual('ファイルサイズが大きすぎます。');
        expect(wrapper.find('a img').exists()).toBeFalsy();
    });

    test('show OK msg and img when upload() succeeded', async () => {
        const dummyURL = 'dummyURL';
        const requestUploadFile = jest.fn().mockReturnValue(`<img href="${dummyURL}" />`);
        const wrapper = shallowMount(Component, {
            methods: {
                requestUploadFile,
            },
        });

        expect(wrapper.vm.fileURL).toBe(null);
        const file = {
            size: 1024 * 1024 * 10,
            type: 'image/png',
            name: 'image.png',
        };

        await wrapper.vm.upload({
            target: {
                files: [file],
            },
        });

        expect(wrapper.vm.fileURL).toBe(dummyURL);
        expect(requestUploadFile).toHaveBeenCalledWith(file);
        expect(wrapper.vm.msg).toEqual('更新する準備ができました。');
        expect(wrapper.find('a img').exists()).toBeTruthy();
    });
});
