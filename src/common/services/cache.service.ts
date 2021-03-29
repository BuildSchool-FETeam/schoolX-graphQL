import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  setValue<T>(key: string, value: T) {
    return this.cacheManager.set(key, value);
  }

  async getValue<T>(key: string) {
    return this.cacheManager.get<T>(key);
  }
}
