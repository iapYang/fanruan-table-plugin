import $ from 'jquery';

export default class {
    constructor(selector, table) {
        this.$table = $(table);
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
                    console.log(col, row);
                    this.$table.find(`.row-${row}`).css({
                        height: e.pageY - this.$td.offset().top,
                    });
                    this.$table.find(`.col-${col}`).css({
                        width: e.pageX - this.$td.offset().left,
                    });
                }
            })
            .on('mouseup', () => {
                this.isResizing = false;
            });
    }
}
