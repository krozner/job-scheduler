import { ApiProperty } from '@nestjs/swagger';
import { PagesView } from './pages.view';

export class ListView<T> {
    @ApiProperty({ type: PagesView })
    pages: PagesView;

    @ApiProperty({ isArray: true })
    items: T[];
}
