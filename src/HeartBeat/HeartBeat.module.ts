import { CommonModule } from 'src/common/Common.module';
import { Module } from '@nestjs/common';
import { HeartBeat as HeartBeatResolver } from './heatBeat.resolver';

@Module({
  imports: [CommonModule],
  providers: [HeartBeatResolver],
})
export class HeartBeat { }
