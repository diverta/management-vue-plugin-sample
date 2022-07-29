/* eslint-disable no-unused-vars */

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageBlock from '@ckeditor/ckeditor5-image/src/imageblock';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import FindAndReplace from '@ckeditor/ckeditor5-find-and-replace/src/findandreplace';

import FullScreen from './plugins/fullscreen';

export default [
    Essentials,
    UploadAdapter,
    Autoformat,
    Essentials,
    Bold,
    Italic,
    Underline,
    Paragraph,
    SourceEditing,
    BlockQuote,
    Heading,
    Image,
    ImageBlock,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageInsert,
    ImageUpload,
    ImageResize,
    LinkImage,
    Link,
    List,
    FullScreen,
    Alignment,
    FontSize,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    Table,
    TableToolbar,
    CKFinder,
    MediaEmbed,
    GeneralHtmlSupport,
    CodeBlock,
    PasteFromOffice,
    FindAndReplace,
];
