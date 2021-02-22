import { Module } from '@nestjs/common';
import { HeartBeat as HeartBeatResolver } from './heatBeat.resolver';

@Module({
  providers: [HeartBeatResolver],
})
export class HeartBeat {}
