import { Request } from 'express';
import { JobEntity } from '../entities/job.entity';

type IOrderBy<T> = {
  [K in keyof T]?: 'ASC' | 'DESC';
};

export class Paginator {
  static LIMIT = Number.MAX_SAFE_INTEGER;

  constructor(private request: Request) {}

  get offset(): number {
    const { offset, page } = this.request.query;
    if (offset) {
      return Number(offset);
    }
    if (page) {
      return Number(page) * this.limit - this.limit;
    }
    return 0;
  }

  get limit(): number {
    const { limit } = this.request.query;
    return Number(limit ?? Paginator.LIMIT);
  }

  get orderBy(): IOrderBy<JobEntity> {
    return { id: 'DESC' };
  }
}
