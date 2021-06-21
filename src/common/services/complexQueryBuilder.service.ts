import { CompareInputDate, CompareInputString } from './../../graphql';
import { Injectable } from "@nestjs/common";
import { Brackets, SelectQueryBuilder } from "typeorm";
import * as _ from 'lodash';

interface ICompareQueryBuilderConfig {
  fieldCompare: string;
  alias: string
  type: 'date' | 'string'
}

@Injectable() 
export class ComplexQueryBuilderService {

  addAndWhereToQueryBuilder<T>(
    query: SelectQueryBuilder<T>, 
    config: ICompareQueryBuilderConfig,
    data: CompareInputDate | CompareInputString
  ) {
    const stringCompareBuilderFnc = this.getCompareGenerateFunc(config.type);

    query.andWhere(
      new Brackets((qb) => {
        const beginningWhere = qb.where(`${config.alias}.id IS NOT NULL`);

        _.forOwn(data, (value, key) => {
          const {
            compareString,
            compareObj,
          } = stringCompareBuilderFnc(
            {
              field: config.fieldCompare,
              alias: config.alias,
            },
            value,
            key,
          );

          beginningWhere.andWhere(compareString, compareObj);
        });
      }),

    );
  }

  private getCompareGenerateFunc(type: ICompareQueryBuilderConfig['type']) {
    switch (type) {
      case 'date':
        return this.buildTheCompareStringForDate
      case 'string':
        return this.buildTheCompareStringForString
    }
  }

  private buildTheCompareStringForDate(
    stringBuilderConfig: { field: string; alias: string },
    valueCompare: number,
    key: string,
  ) {
    let compareString = '';
    let compareVal = {};
    const { field, alias } = stringBuilderConfig;

    function _getQueryString(operator: string, opName: string) {
      return `${alias}.${field} ${operator} :value${opName}::date`;
    }

    switch (key) {
      case 'eq':
        compareString = _getQueryString('=', key);
        break;
      case 'gt':
        compareString = _getQueryString('>', key);
        break;
      case 'lt':
        compareString = _getQueryString('<', key);
        break;
      case 'ne':
        compareString = _getQueryString('!=', key);
        break;
    }
    compareVal = { [`value${key}`]: valueCompare };

    return {
      compareString,
      compareObj: compareVal,
    };
  }

  private buildTheCompareStringForString(
    stringBuilderConfig: { field: string; alias: string },
    valueCompare: any,
    key: string,
  ) {
    let compareString = '';
    let compareVal = {};
    const { field, alias } = stringBuilderConfig;

    function _getQueryString(operator: string, opName: string) {
      const valueCompare = `:value${opName}`
      return `${alias}.${field} ${operator} ${valueCompare}`;
    }

    switch (key) {
      case 'eq':
        compareString = _getQueryString('=', key);
        break;
      case 'ne':
        compareString = _getQueryString('!=', key);
        break;
      case 'ct':
        compareString = _getQueryString('ILIKE', key);
        break;
      case 'nc':
        compareString = _getQueryString('NOT ILIKE', key);
        break;
    }
    valueCompare = ['ct', 'nc'].includes(key) ? `%${valueCompare}%` : valueCompare
    compareVal = { [`value${key}`]: valueCompare };

    return {
      compareString,
      compareObj: compareVal,
    };
  }
}