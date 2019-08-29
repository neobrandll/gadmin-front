import { MatPaginatorIntl } from '@angular/material';

export class CustomPaginator extends MatPaginatorIntl {
  itemsPerPageLabel = 'Items por página';
  firstPageLabel = 'Primera página';
  lastPageLabel = 'Última página';
  nextPageLabel = 'Página siguiente';
  previousPageLabel = 'Página anterior';

  constructor() {
    super();
  }
}
