import { Injectable } from '@nestjs/common'
import { Brackets, SelectQueryBuilder } from 'typeorm'
import * as _ from 'lodash'
import { CompareInputDate, CompareInputString } from '../../graphql'

export interface ICompareQueryBuilderConfig {
  fieldCompare: string
  tableAlias: string
  compareType: 'date' | 'string'
}

@Injectable()
export class ComplexQueryBuilderService {
  addAndWhereCompareToQueryBuilder<T>(
    query: SelectQueryBuilder<T>,
    config: ICompareQueryBuilderConfig,
    compareData: CompareInputDate | CompareInputString
  ) {
    const stringCompareBuilderFnc = this.getCompareStringGeneratorFunc(
      config.compareType
    )

    query.andWhere(
      new Brackets((qb) => {
        const beginningWhere = qb.where(`${config.tableAlias}.id IS NOT NULL`)

        _.forOwn(compareData, (value, key) => {
          const { compareString, compareObj } = stringCompareBuilderFnc(
            {
              field: config.fieldCompare,
              alias: config.tableAlias,
            },
            value,
            key
          )

          beginningWhere.andWhere(compareString, compareObj)
        })
      })
    )
  }

  private getCompareStringGeneratorFunc(
    type: ICompareQueryBuilderConfig['compareType']
  ) {
    switch (type) {
      case 'date':
        return this.buildTheCompareStringForDate.bind(this)
      case 'string':
        return this.buildTheCompareStringForString.bind(this)
      default:
        return null
    }
  }

  private buildTheCompareStringForDate(
    stringBuilderConfig: { field: string; alias: string },
    valueCompare: number,
    key: string
  ) {
    let compareString = ''
    let compareVal = {}
    const { field, alias } = stringBuilderConfig

    function _getQueryString(operator: string, opName: string) {
      return `${alias}.${field} ${operator} :value${opName}::date`
    }

    switch (key) {
      case 'eq':
        compareString = _getQueryString('=', key)
        break
      case 'gt':
        compareString = _getQueryString('>', key)
        break
      case 'lt':
        compareString = _getQueryString('<', key)
        break
      case 'ne':
        compareString = _getQueryString('!=', key)
        break
      default:
        return null
    }
    compareVal = { [`value${key}`]: valueCompare }

    return {
      compareString,
      compareObj: compareVal,
    }
  }

  private buildTheCompareStringForString(
    stringBuilderConfig: { field: string; alias: string },
    valueCompare: string,
    key: string
  ) {
    let compareString = ''
    let compareVal = {}
    const { field, alias } = stringBuilderConfig

    function _getQueryString(operator: string, opName: string) {
      const valueCompare = `:value${opName}`

      return `${alias}.${field} ${operator} ${valueCompare}`
    }

    switch (key) {
      case 'eq':
        compareString = _getQueryString('=', key)
        break
      case 'ne':
        compareString = _getQueryString('!=', key)
        break
      case 'ct': // contain
        compareString = _getQueryString('ILIKE', key)
        break
      case 'nc': // not contain
        compareString = _getQueryString('NOT ILIKE', key)
        break
      default:
        return null
    }
    valueCompare = ['ct', 'nc'].includes(key)
      ? `%${valueCompare}%`
      : valueCompare
    compareVal = { [`value${key}`]: valueCompare }

    return {
      compareString,
      compareObj: compareVal,
    }
  }
}
