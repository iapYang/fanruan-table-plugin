import $ from 'jquery';

export default class {
    constructor(selector) {
        this.$td = $(selector);
        this.$drag = this.$td.find('.drag');

        this.isResizing = false;

        this.addEventListener();
    }
    addEventListener() {
        this.$drag.on('mousedown', e => {
            this.isResizing = true;
            e.preventDefault();
        });

        $(document)
            .on('mousemove', e => {
                if (this.isResizing) {
                    const col = this.$td.data('col');
                    const row = this.$td.data('row');
                    const $table = this.$td.parents('table');
                    if (this.$drag.hasClass('drag-bottom')) {
                        $table.find(`.row-${row}`).css({
                            height: e.pageY - this.$td.offset().top,
                        });
                    } else {
                        $table
                            .find(`.col-${col}`)
                            .find('input')
                            .css({
                                width: Math.max(
                                    e.pageX -
                                    this.$td.offset().left, 60
                                ),
                            });
                    }
                }
            })
            .on('mouseup', () => {
                this.isResizing = false;
            });
    }
}
