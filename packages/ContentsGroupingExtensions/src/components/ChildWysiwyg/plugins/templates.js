import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageTemplates from '../icons/templates.svg';
import '../style/templates.css';
import { createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import uuid from 'uuid/v1';

import { View } from 'ckeditor5/src/ui';

class TemplatesView extends View {
    constructor({ locale, templates, labels, editor }) {
        super(locale);

        const uid = uuid();

        const templatesList = [];

        for (const t in templates) {
            templatesList.push({
                tag: 'li',
                attributes: {
                    class: `ck-templates-plugin__templates-list-item ck-reset_all-excluded templates-list-item-${uid}`,
                    'data-id': t,
                },
                children: [
                    {
                        text: templates[t].name,
                    },
                ],
            });
        }

        this.setTemplate({
            tag: 'div',
            attributes: {
                class: 'ck-templates-plugin__wrap ck-reset_all-excluded',
            },
            children: [
                {
                    tag: 'div',
                    attributes: {
                        class: 'ck-templates-plugin__header',
                    },
                    children: [
                        {
                            text: labels.templates_list,
                        },
                    ],
                },
                {
                    tag: 'div',
                    attributes: {
                        class: 'ck-templates-plugin__mode-wrap',
                    },
                    children: [
                        {
                            tag: 'input',
                            attributes: {
                                type: 'checkbox',
                                value: 1,
                                id: `ck-templates-mode-checkbox-${uid}`,
                            },
                        },
                        {
                            tag: 'label',
                            attributes: {
                                for: `ck-templates-mode-checkbox-${uid}`,
                                onclick: 'return false;',
                            },
                            children: [
                                {
                                    text: labels.replace_content,
                                },
                            ],
                        },
                    ],
                },

                {
                    tag: 'ul',
                    attributes: {
                        class: 'ck-templates-plugin__templates-list ck-reset_all-excluded',
                    },
                    children: templatesList,
                },
                {
                    tag: 'div',
                    attributes: {
                        class: 'ck-templates-plugin__template-preview ck-reset_all-excluded',
                        id: `ck-templates-preview-container-${uid}`,
                    },
                    children: [
                        {
                            text: labels.select_template,
                        },
                    ],
                },
            ],
        });

        document.addEventListener(
            'mouseover',
            (event) => {
                if (event.target && event.target.matches(`.templates-list-item-${uid}`)) {
                    const templateContainer = document.querySelector(`#ck-templates-preview-container-${uid}`);

                    const html = templates[event.target.dataset.id].template;
                    templateContainer.innerHTML = html;
                }
            },
            false
        );

        document.addEventListener(
            'mousedown',
            (event) => {
                if (event.target && event.target.matches(`.templates-list-item-${uid}`)) {
                    const html = templates[event.target.dataset.id].template;
                    const checkbox = document.querySelector(`#ck-templates-mode-checkbox-${uid}`);

                    if (checkbox.checked) {
                        editor.setData(html);
                    } else {
                        const htmlDP = editor.data.processor;
                        const viewFragment = htmlDP.toView(html);
                        const modelFragment = editor.data.toModel(viewFragment);
                        editor.model.insertContent(modelFragment);
                    }
                }
            },
            false
        );
    }
}

export default class Templates extends Plugin {
    init() {
        const editor = this.editor;
        const config = editor.config.get('templatesConfig');
        const templates = config.templates;
        const labels = config.labels;

        editor.ui.componentFactory.add('templates', (locale) => {
            const dropdownView = createDropdown(locale);
            let templateViewRendered = false;

            dropdownView.buttonView.set({
                label: 'Templates',
                tooltip: true,
                withText: false,
                icon: ImageTemplates,
            });

            dropdownView.on('change:isOpen', () => {
                if (!templateViewRendered) {
                    templateViewRendered = true;
                    const templatesView = new TemplatesView({ locale, templates, labels, editor });
                    dropdownView.panelView.children.add(templatesView);
                }
            });

            this.listenTo(dropdownView, 'execute', (event) => {
                this.editor.model.change(() => {
                    const htmlDP = this.editor.data.processor;
                    const viewFragment = htmlDP.toView(templates[event.source.commandParam].template);
                    const modelFragment = this.editor.data.toModel(viewFragment);
                    this.editor.model.insertContent(modelFragment);
                });
            });

            return dropdownView;
        });
    }
}
