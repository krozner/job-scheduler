import { ApiProperty } from '@nestjs/swagger';
import { IPages } from '../../utils/paginator';

export class PagesView implements IPages {
    @ApiProperty()
    total: number;

    @ApiProperty({ required: false })
    nextPage?: number;

    @ApiProperty({ required: false })
    prefPage?: number;
}
