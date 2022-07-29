/* eslint-disable no-unused-vars */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import ImageFullBig from '../icons/fullscreen-big.svg';
import ImageFullCancel from '../icons/fullscreen-cancel.svg';

import '../style/fullscreen.css';

export default class FullScreen extends Plugin {
    init() {
        const editor = this.editor;
        let currentState = 'normal';

        editor.ui.componentFactory.add('fullScreen', locale => {
            const view = new ButtonView(locale);
            view.set({
                label: 'FullScreen',
                tooltip: true,
                icon: ImageFullBig,
            });
            view.on('execute', () => {
                if (currentState === 'normal') {
                    editor.sourceElement.parentNode.classList.add('ckeditor-fullscreen-wrap');
                    editor.sourceElement.nextElementSibling.classList.add('ckeditor-fullscreen-mode');
                    view.set({
                        label: 'Normal',
                        tooltip: true,
                        icon: ImageFullCancel,
                    });
                    currentState = 'full';
                } else {
                    editor.sourceElement.parentNode.classList.remove('ckeditor-fullscreen-wrap');
                    editor.sourceElement.nextElementSibling.classList.remove('ckeditor-fullscreen-mode');
                    view.set({
                        label: 'FullScreen',
                        tooltip: true,
                        icon: ImageFullBig,
                    });
                    currentState = 'normal';
                }
                editor.fire('fullscreenMode');
            });
            return view;
        });
    }
}
