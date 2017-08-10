import $ from 'jquery';

export default class {
    constructor(selector) {
        this.$td = $(selector);
        this.$tr = this.$td.parent();
        this.$drag = this.$td.find('.drag');

        this.isResizing = false;
        this.lastDownX = 0;

        this.addEventListener();
    }
    addEventListener() {
        this.$drag.on('mousedown', e => {
            this.isResizing = true;
            this.lastDownX = e.clientX;
            console.log('mousedown');
            e.preventDefault();
        });

        $(document)
            .on('mousemove', e => {
                if (this.isResizing) {
                    console.log('23333');
                }
            })
            .on('mouseup', () => {
                this.isResizing = false;
            });
    }
}
