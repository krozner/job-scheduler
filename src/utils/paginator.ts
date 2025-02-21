import { Request } from 'express';
import { Expose } from 'class-transformer';

type IOrderBy<T> = {
    [K in keyof T]?: 'ASC' | 'DESC';
};

export interface IPages {
    totalItems: number;
    pagesCount: number;
    nextPage?: number;
    prevPage?: number;
}

export class Paginator<T> {
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

    get orderBy(): IOrderBy<T> {
        let property: string = 'id';
        if (this.alias) {
            property = this.alias + '.id';
        }
        return { [property]: 'DESC' } as IOrderBy<T>;
    }

    private totalItems: number = 0;
    private pagesCount?: number = 0;
    private nextPage?: number;
    private prevPage?: number;

    @Expose()
    get pages(): IPages {
        return {
            totalItems: this.totalItems,
            nextPage: this.nextPage,
            prevPage: this.prevPage,
            pagesCount: this.pagesCount,
        };
    }

    setTotal(total: number): this {
        this.totalItems = total;
        this.pagesCount = Math.ceil(total / this.limit);
        this.nextPage = Math.ceil((this.offset / this.limit + 1) * this.limit);
        this.prevPage = Math.ceil((this.offset / this.limit) * this.limit);

        if (this.nextPage >= this.pagesCount) {
            this.nextPage = undefined;
        }
        if (this.prevPage < 1) {
            this.prevPage = undefined;
        }

        return this;
    }

    private alias?: string;

    setAlias(alias: string): this {
        this.alias = alias;
        return this;
    }
}
