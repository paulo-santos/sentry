import {
  BreadcrumbDetails,
  BreadcrumbType,
  BreadcrumbLevel,
} from '../../breadcrumbs/types';

type FilterGroupBase = {
  isChecked: boolean;
} & BreadcrumbDetails;

type FilterGroupTypeType = {
  groupType: 'type';
  type: BreadcrumbType;
} & FilterGroupBase;

type FilterGroupTypeLevel = {
  groupType: 'level';
  type: BreadcrumbLevel;
} & FilterGroupBase;

export type FilterGroup = FilterGroupTypeType | FilterGroupTypeLevel;

export type FilterGroupType =
  | FilterGroupTypeLevel['groupType']
  | FilterGroupTypeType['groupType'];

export type FilterType = BreadcrumbLevel | BreadcrumbType;

export {BreadcrumbDetails};
