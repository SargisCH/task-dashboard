import { Module } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Module({
    imports: [],
    providers: [AvailabilityService],
})
export class AvailabilityModule {}
