import { BadRequestException } from '@nestjs/common'
import { Scalar, CustomScalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

@Scalar('ScalarDate')
export class DateScalar implements CustomScalar<string, string> {
  description =
    'The custom scalar type using ISO String [exp: 2021-05-28T08:58:21.677Z]'

  parseValue(value: string): string {
    const pattern = /(\d{4}(-\d{2}){2})T(.+)Z/
    if (!pattern.test(value)) {
      throw new BadRequestException(
        'You should send the right ISO string format.'
      )
    }

    return value
  }

  serialize(value: string | number): string {
    if (typeof value === 'number') {
      return new Date(value).toISOString()
    }

    return value // value sent to the client
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING) {
      return this.parseValue(ast.value)
    }

    return null
  }
}
