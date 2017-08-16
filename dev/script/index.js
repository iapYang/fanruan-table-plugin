import '../style/style.scss';
import '../style/table.scss';

import Table from './table';

new Table('.table-container', {
    rowHeader: true,
    colHeader: true,
    hasBorder: true,
});
