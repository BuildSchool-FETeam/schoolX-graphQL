import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query()
  user() {
    return 'Hi there';
  }
}
