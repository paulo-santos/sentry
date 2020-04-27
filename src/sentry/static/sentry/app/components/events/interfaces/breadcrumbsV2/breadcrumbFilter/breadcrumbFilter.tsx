import React from 'react';
import styled from '@emotion/styled';
import isEqual from 'lodash/isEqual';

import {t} from 'app/locale';
import DropdownControl from 'app/components/dropdownControl';
import DropdownButton from 'app/components/dropdownButton';

import BreadcrumbFilterGroup from './breadcrumbFilterGroup';
import BreadcrumbFilterHeader from './breadcrumbFilterHeader';
import BreadcrumbFilterFooter from './breadcrumbFilterFooter';
import {FilterGroupLevel, FilterGroupType} from './types';

type FilterGroup = FilterGroupLevel | FilterGroupType;

type Props = {
  onFilter: (filterGroups: Array<FilterGroup>) => () => void;
  filterGroups: Array<FilterGroup>;
};

type State = {
  filterGroups: Array<FilterGroup>;
};

class BreadcrumbFilter extends React.Component<Props, State> {
  state: State = {
    filterGroups: [],
  };

  componentDidUpdate(prevProps: Props) {
    if (!isEqual(this.props.filterGroups, prevProps.filterGroups)) {
      this.loadState();
    }
  }

  loadState() {
    const {filterGroups} = this.props;
    this.setState({
      filterGroups,
    });
  }

  handleClickItem = (type: any, groupType: any) => {
    const {filterGroups} = this.state;
    const newFilterGroups = filterGroups.map(filterGroup => {
      if (filterGroup.groupType === groupType && filterGroup.type === type) {
        return {
          ...filterGroup,
          isChecked: !filterGroup.isChecked,
        };
      }
      return filterGroup;
    });

    this.setState({
      filterGroups: newFilterGroups,
    });
  };

  handleSelectAll = (selectAll: boolean) => {
    this.setState(prevState => ({
      filterGroups: prevState.filterGroups.map(data => ({
        ...data,
        isChecked: selectAll,
      })),
    }));
  };

  getDropDownButton = ({isOpen, getActorProps}) => {
    const {filterGroups} = this.props;

    const checkedFilterGroupsOptionsQuantity = filterGroups.filter(
      filterGroup => filterGroup.isChecked
    ).length;

    let buttonLabel = `${checkedFilterGroupsOptionsQuantity} ${t('Active Filters')}`;

    if (checkedFilterGroupsOptionsQuantity === 0) {
      buttonLabel = t('Filter By');
    }

    if (checkedFilterGroupsOptionsQuantity === 1) {
      buttonLabel = `${checkedFilterGroupsOptionsQuantity} ${t('Active Filter')}`;
    }

    return (
      <StyledDropdownButton
        {...getActorProps()}
        isOpen={isOpen}
        priority={checkedFilterGroupsOptionsQuantity > 0 ? 'primary' : 'default'}
      >
        {buttonLabel}
      </StyledDropdownButton>
    );
  };

  render() {
    const {onFilter} = this.props;
    const {filterGroups} = this.state;

    const selectedQuantity = filterGroups.filter(filterGroup => filterGroup.isChecked)
      .length;

    const hasFilterGroupsGroupTypeLevel = filterGroups.find(
      filterGroup => filterGroup.groupType === 'level'
    );

    return (
      <Wrapper>
        <DropdownControl menuWidth="50vh" blendWithActor button={this.getDropDownButton}>
          <React.Fragment>
            <BreadcrumbFilterHeader
              onSelectAll={this.handleSelectAll}
              selectedQuantity={selectedQuantity}
              isAllSelected={filterGroups.length === selectedQuantity}
            />
            <BreadcrumbFilterGroup
              groupHeaderTitle={t('Type')}
              onClick={this.handleClickItem}
              data={filterGroups.filter(filterGroup => filterGroup.groupType === 'type')}
            />
            {hasFilterGroupsGroupTypeLevel && (
              <BreadcrumbFilterGroup
                groupHeaderTitle={t('Level')}
                onClick={this.handleClickItem}
                data={filterGroups.filter(
                  filterGroup => filterGroup.groupType === 'level'
                )}
              />
            )}
            {!isEqual(this.props.filterGroups, filterGroups) && (
              <BreadcrumbFilterFooter onSubmit={onFilter(filterGroups)} />
            )}
          </React.Fragment>
        </DropdownControl>
      </Wrapper>
    );
  }
}

export default BreadcrumbFilter;

const StyledDropdownButton = styled(DropdownButton)`
  border-right: 0;
  z-index: ${p => p.theme.zIndex.dropdownAutocomplete.actor};
  border-radius: ${p =>
    p.isOpen
      ? `${p.theme.borderRadius} 0 0 0`
      : `${p.theme.borderRadius} 0 0 ${p.theme.borderRadius}`};
  white-space: nowrap;
  max-width: 200px;

  &:hover,
  &:active {
    border-right: 0;
  }
`;

const Wrapper = styled('div')`
  position: relative;
  display: flex;
`;
