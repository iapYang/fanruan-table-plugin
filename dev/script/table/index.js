import $ from 'jquery';

import Drag from './drag';

export default class {
    constructor(selector, options) {
        this.data = options.data;
        this.rowHeader = options.rowHeader || false;
        this.colHeader = options.colHeader || false;

        this.$container = $(selector);

        this.$table = this.createTable();
        this.$container.append(this.$table);

        this.$menu = this.createMenu();
        this.$container.append(this.$menu);

        this.$btnFontBlack = this.$menu.find('.fontBlack');
        this.$btnFontItalic = this.$menu.find('.fontItalic');
        this.$btnFontUnderline = this.$menu.find('.fontUnderline');

        this.tdEventListener();
    }
    createTable() {
        const $table = $('<table cellspacing="0"></table>');

        for (let i = 0; i < this.data.length; i++) {
            const $tr = $('<tr></tr>');
            for (let j = 0; j < this.data[i].length; j++) {
                const $td = $(`
                    <td>${this.data[i][j]}</td>
                `);
                const $drag = $(`
                    <div class="drag">
                        <img src="${require('../../image/triangle_16px_1103136_easyicon.net.png')}" />
                    </div>
                `);

                $td
                    .data('row', i)
                    .data('col', j)
                    .addClass(`row-${i}`)
                    .addClass(`col-${j}`);

                if (i === 0 && this.rowHeader) {
                    $td.addClass('header-td');
                }
                if (j === 0 && this.colHeader) {
                    $td.addClass('header-td');
                }

                if (!$td.hasClass('header-td')) {
                    $td.append($drag);
                    new Drag($td, $table);
                }

                $tr.append($td);
            }
            $table.append($tr);
        }

        return $table;
    }
    createMenu() {
        const $ul = $(`
            <ul class="menu-list">
                <li>合并单元格</li>
                <li class="font">设置字体
                    <ul class="font-setting">
                        <li class="fontBlack">加粗 / 正常</li>
                        <li class="fontItalic">斜体 / 正常</li>
                        <li class="fontUnderline">下划线 / 正常</li>
                    </ul>
                </li>
            </ul>
        `);

        return $ul;
    }
    fontHandler(className) {
        const $selected = this.$table.find('.selected');

        const funcName = $selected.hasClass(className) ? 'removeClass' : 'addClass';

        $selected[funcName](className);
    }
    tdEventListener() {
        const $td = this.$table.find('td');

        $td.on('click', e => {
            const $item = $(e.currentTarget);

            if ($item.hasClass('selected')) {
                $item.removeClass('selected');
            } else {
                $item.addClass('selected');
            }
        });

        $td.contextmenu(e => {
            this.$menu.offset({
                top: e.pageY,
                left: e.pageX,
            }).addClass('active');

            return false;
        });

        $(document).on('click', e => {
            if (e.button === 0) {
                this.$menu.offset({
                    top: 0,
                    left: 0,
                }).removeClass('active');
            }
        });

        this.$btnFontBlack.on('click', () => {
            this.fontHandler('bold');
        });

        this.$btnFontItalic.on('click', () => {
            this.fontHandler('italic');
        });

        this.$btnFontUnderline.on('click', () => {
            this.fontHandler('underline');
        });
    }
}
