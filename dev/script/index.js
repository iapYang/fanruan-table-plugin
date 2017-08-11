import '../style/style.scss';
import '../style/table.scss';

import Table from './table';

new Table('.table-container', {
    data: [['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
        ['2016', 10, 11, 12, 13],
        ['2017', 20, 11, 14, 13],
        ['2017', 20, 11, 14, 13],
        ['2017', 20, 11, 14, 13],
        ['2017', 20, 11, 14, 13],
        ['2017', 20, 11, 14, 13],
        ['2017', 20, 11, 14, 13],
        ['2017', 20, 11, 14, 13],
        ['2017', 20, 11, 14, 13],
        ['2017', 20, 11, 14, 13],
        ['2017', 20, 11, 14, 13],
        ['2018', 30, 15, 12, 13]],
    rowHeader: true,
    colHeader: true,
    hasBorder: true,
});
