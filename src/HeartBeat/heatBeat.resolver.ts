import { AuthGuard } from './../common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';

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
}
