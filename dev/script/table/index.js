import $ from 'jquery';

import Drag from './drag';

export default class {
    constructor(selector, options) {
        // this.data = options.data;
        this.hasBorder = options.hasBorder || false;

        this.mousedown = false;
        this.width = 5;
        this.height = 15;

        this.$container = $(selector);

        this.$table = this.createTable();
        this.$container.append(this.$table);

        this.$menu = this.createMenu();
        this.$container.append(this.$menu);
        this.menuStuffInit();

        this.tdEventListener();
    }
    createTable() {
        const $table = $('<table cellspacing="0"></table>');
        $table.append(this.createThead());
        this.$tbody = $('<tbody></tbody>');

        for (let i = 1; i <= this.height; i++) {
            const $tr = $('<tr></tr>');
            for (let j = 0; j <= this.width; j++) {
                let val = '';

                if (j === 0) {
                    val = i;
                }

                $tr.append(this.createTd(val, i, j, j === 0));
            }
            this.$tbody.append($tr);
        }

        $table.append(this.$tbody);

        if (this.hasBorder) {
            $table.addClass('border');
        }

        return $table;
    }
    createThead() {
        const $thead = $('<thead></thead>');
        const $tr = $('<tr></tr>');
        for (let i = 0; i <= this.width; i++) {
            let val = '';
            if (i > 0) {
                val = String.fromCharCode(64 + i);
            }

            $tr.append(this.createTd(val, 0, i, true, true));
        }

        $thead.append($tr).append($tr.clone());

        return $thead;
    }
    createTd(val, row, col, ifHeader, ifFirstRow) {
        const $td = $(`
            <td colspan="1" rowspan="1">
                <input
                    value="${val}"
                    disabled
                />
            </td>
        `)
            .data('row', row)
            .data('col', col)
            .addClass(`row-${row}`)
            .addClass(`col-${col}`);

        if (ifHeader) {
            $td.addClass('header-td');
        }

        if (col === 0) {
            $td.append(`
                <div class="drag drag-bottom"></div>
            `);

            new Drag($td);
        }

        if (ifFirstRow && col !== 0) {
            $td.append(`
                <div class="drag drag-right"></div>
            `);

            new Drag($td);
        }

        return $td;
    }
    selectTd() {
        const startNodeRow = this.$startNode.data('row');
        const startNodeCol = this.$startNode.data('col');

        const endNodeRow = this.$endNode.data('row');
        const endNodeCol = this.$endNode.data('col');

        const startRow = Math.min(startNodeRow, endNodeRow);
        const endRow = Math.max(startNodeRow, endNodeRow);

        const startCol = Math.min(startNodeCol, endNodeCol);
        const endCol = Math.max(startNodeCol, endNodeCol);

        this.$tbody.find('td').removeClass('selected');

        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                this.$tbody.find(`td.row-${i}.col-${j}`).addClass('selected');
            }
        }
    }
    createMenu() {
        const $ul = $(`
            <ul class="menu-list">
                <li class="allInOne">合并单元格</li>
                <li class="font">设置字体
                    <ul class="font-setting">
                        <li class="fontBlack">加粗 / 正常</li>
                        <li class="fontItalic">斜体 / 正常</li>
                        <li class="fontUnderline">下划线 / 正常</li>
                        <li class="fontAlign">文字对齐
                            <ul class="font-sub-setting">
                                <li class="textLeft">
                                    左对齐
                                </li>
                                <li class="textCenter">
                                    居中
                                </li>
                                <li class="textRight">
                                    右对齐
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li class="changeContent">
                    修改文字
                </li>
            </ul>
        `);

        return $ul;
    }
    menuStuffInit() {
        this.$btnFontBlack = this.$menu.find('.fontBlack');
        this.$btnFontItalic = this.$menu.find('.fontItalic');
        this.$btnFontUnderline = this.$menu.find('.fontUnderline');
        this.$btnTextLeft = this.$menu.find('.textLeft');
        this.$btnTextCenter = this.$menu.find('.textCenter');
        this.$btnTextRight = this.$menu.find('.textRight');

        this.$btnChangeContent = this.$menu.find('.changeContent');
        this.$btnAllInOne = this.$menu.find('.allInOne');
    }
    fontHandler(className) {
        const $selected = this.$table.find('.selected');

        if (className.search('text') !== -1) {
            $selected
                .removeClass('text-left')
                .removeClass('text-center')
                .removeClass('text-right')
                .addClass(className);
        } else {
            const funcName = $selected.hasClass(className) ? 'removeClass' : 'addClass';

            $selected[funcName](className);
        }
    }
    clearInputStatus($td) {
        $td.each((index, item) => {
            const $item = $(item);
            if (!$item.hasClass('selected')) {
                $item.find('input').attr('disabled', true);
            }
        });
    }
    enableInput() {
        const $selected = this.$table.find('.selected');

        $selected
            .find('input')
            .attr('disabled', false);
    }
    tdEventListener() {
        const $td = this.$tbody.find('td');

        $td
            .on('mousedown', e => {
                const $startNode = $(e.currentTarget);
                if ($startNode.hasClass('header-td')) return;
                if (e.button === 0) {
                    this.mousedown = true;
                    this.$startNode = $startNode;
                    this.endInput = e.target;
                }
            })
            .on('dblclick', () => {
                this.enableInput();
            });

        $td.contextmenu(e => {
            this.$menu.offset({
                top: e.pageY,
                left: e.pageX,
            }).addClass('active');

            return false;
        });

        $(document)
            .on('click', e => {
                if (e.button === 0) {
                    this.$menu.offset({
                        top: 0,
                        left: 0,
                    }).removeClass('active');
                }
            })
            .on('mousemove', e => {
                if (!(e.target.nodeName === 'INPUT' && this.mousedown)) return;
                const endInput = e.target;
                const $endNode = $(endInput).parent();

                if ($endNode.hasClass('header-td')) return;

                this.endInput = endInput;
                this.$endNode = $endNode;
                this.selectTd();
            })
            .on('mouseup', e => {
                if (e.button !== 0) return;
                if (e.target.nodeName === 'LI') return;
                if (!this.mousedown) {
                    this.$tbody.find('td').removeClass('selected');
                } else {
                    this.mousedown = false;
                    if (e.target.nodeName === 'INPUT') {
                        this.endInput = e.target;
                    }
                    this.$endNode = $(this.endInput).parent();

                    this.selectTd();
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

        this.$btnTextLeft.on('click', () => {
            this.fontHandler('text-left');
        });

        this.$btnTextCenter.on('click', () => {
            this.fontHandler('text-center');
        });

        this.$btnTextRight.on('click', () => {
            this.fontHandler('text-right');
        });

        this.$btnChangeContent.on('click', () => {
            this.enableInput();
        });

        this.$btnAllInOne.on('click', e => {
            const $selected = this.$tbody.find('td.selected');

            const rowSet = new Set();
            const colSet = new Set();

            $selected.each((index, item) => {
                const $item = $(item);
                rowSet.add($item.data('row'));
                colSet.add($item.data('col'));
            });

            console.log(rowSet.size, colSet.size);

            $selected.each((index, item) => {
                if (index !== 0) {
                    $(item).remove();
                }
            });

            $selected
                .eq(0)
                .attr('colspan', colSet.size)
                .attr('rowspan', rowSet.size);
        });
    }
}
