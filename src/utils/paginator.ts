import { Request } from 'express';

type IOrderBy<T> = {
    [K in keyof T]?: 'ASC' | 'DESC';
};

export interface IPages {
    total: number;
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

    private total: number = 0;
    private nextPage?: number;
    private prevPage?: number;

    get pages(): IPages {
        return {
            total: this.total,
            nextPage: this.nextPage,
            prevPage: this.prevPage,
        };
    }

    setTotal(total: number): this {
        this.total = total;
        return this;
    }

    private alias?: string;

    setAlias(alias: string): this {
        this.alias = alias;
        return this;
    }
}
