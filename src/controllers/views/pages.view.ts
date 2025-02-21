import { ApiProperty } from '@nestjs/swagger';
import { IPages } from '../../utils/paginator';

export class PagesView implements IPages {
    @ApiProperty()
    totalItems: number;

    @ApiProperty()
    pagesCount: number;

    @ApiProperty({ required: false })
    nextPage?: number;

    @ApiProperty({ required: false })
    prevPage?: number;
}
