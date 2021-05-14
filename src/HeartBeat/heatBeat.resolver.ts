import { AuthGuard } from './../common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Subscription } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';

@Resolver()
export class HeartBeat {
  @Query()
  heartBeat() {
    return 'Ba dum !!!';
  }

  @Query()
  @UseGuards(AuthGuard)
  heartBeatWithAuth() {
    return "You 're authenticated";
  }

  // Only publish odd number
  @Subscription('beatCount', {
    filter: (
      payload: { beatCount: number },
      variables: { divideNumber: number },
    ) => {
      return payload.beatCount % variables.divideNumber === 0;
    },
  })
  beatCount() {
    const pubsub = new PubSub();
    let i = 0;
    setInterval(() => {
      pubsub.publish('BEAT_COUNT', { beatCount: i++ });
    }, 1000);
    return pubsub.asyncIterator('BEAT_COUNT');
  }
}
