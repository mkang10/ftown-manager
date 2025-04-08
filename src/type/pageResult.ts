export interface PageResult<T> {
  data: T[];
  totalRecords: number;
  page: number;
  pageSize: number;
}
