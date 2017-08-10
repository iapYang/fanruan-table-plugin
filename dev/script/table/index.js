import $ from 'jquery';

export default class {
    constructor(selector, options) {
        console.log(564);
        this.data = options.data;
        this.rowHeader = options.rowHeader || false;
        this.colHeader = options.colHeader || false;

        this.$container = $(selector);

        console.log(this.data);

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
                    <td>
                        ${this.data[i][j]}
                        <div class="drag" data-flag="false">
                            <img src="${require('../../image/triangle_16px_1103136_easyicon.net.png')}" />
                        </div>
                    </td>
                `);
                if (i === 0 && this.rowHeader) {
                    $td.addClass('header-td');
                }
                if (j === 0 && this.colHeader) {
                    $td.addClass('header-td');
                }
                $tr.append($td);
            }
            $table.append($tr);
        }

        return $table;
    }
    tdEventListener() {
        const $td = this.$table.find('td');
        const $drag = this.$table.find('.drag');

        $td.on('click', e => {
            const $item = $(e.currentTarget);

            if ($item.hasClass('selected')) {
                $item.removeClass('selected');
            } else {
                $item.addClass('selected');
            }
        });

        console.log($drag);

        $drag
            .on('mousedown', e => {
                const $item = $(e.currentTarget);
                $item.data('flag', true);

                e.preventDefault();

                return false;
            })
            .on('mousemove', e => {
                const $item = $(e.currentTarget);
                const $parentTd = $item.parent();
                const $parentTr = $parentTd.parent();

                if (!$item.data('flag')) return;
                const $allTd = $parentTr.find('td');
                $allTd.css({
                    height: Math.abs($parentTd.offset().top - e.pageY) + 3,
                });
            })
            .on('mouseleave', e => {
                const $item = $(e.currentTarget);
                const $parent = $item.parent();
                $item.data('flag', false);
            });
    }
}
