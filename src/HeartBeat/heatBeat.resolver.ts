import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class HeartBeat {
  @Query()
  heartBeat() {
    return 'Ba dum!!!';
  }
}
