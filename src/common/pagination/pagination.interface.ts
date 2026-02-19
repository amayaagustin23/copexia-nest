export interface PaginationArgs {
  page?: number;
  size?: number;
  orderBy?: 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
  search?: string;
  status?: string;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationAndProductArgs extends PaginationArgs {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
}
