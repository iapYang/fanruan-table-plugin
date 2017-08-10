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
                    .addClass(`col-${j}`)
                ;

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
    }
}
