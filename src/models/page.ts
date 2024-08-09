type Paging = {
  page: number;
  perPage: number;
  totalPages: number;
};

type Pageable<T> = {
  data: Array<T>;
  paging: Paging;
};
