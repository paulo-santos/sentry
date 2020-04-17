import React from 'react';
import * as ReactRouter from 'react-router';
import partition from 'lodash/partition';

import {GlobalSelection, Organization, Project} from 'app/types';
import ConfigStore from 'app/stores/configStore';
import withGlobalSelection from 'app/utils/withGlobalSelection';
import withOrganization from 'app/utils/withOrganization';
import withProjectsSpecified from 'app/utils/withProjectsSpecified';

import EnforceSingleProject from './enforceSingleProject';
import SyncStoreToUrl from './syncStoreToUrl';
import SyncUrlParams from './syncUrlParams';

type EnforceSingleProjectProps = Omit<
  React.ComponentPropsWithoutRef<typeof EnforceSingleProject>,
  | 'router'
  | keyof ReactRouter.WithRouterProps
  | 'routerForControlledRouting'
  | 'nonMemberProjects'
  | 'memberProjects'
  | 'hasCustomRouting'
  | 'isEnforced'
>;
type Props = {
  organization: Organization;
  projects: Project[];
  selection: GlobalSelection;
  globalSelectionInitialized?: boolean;
  hasCustomRouting?: boolean;
  loadingProjects: boolean;
  specificProjectSlugs?: string[];
} & ReactRouter.WithRouterProps &
  EnforceSingleProjectProps;

class GlobalSelectionHeaderContainer extends React.Component<Props> {
  getProjects = () => {
    const {organization, projects} = this.props;
    const {isSuperuser} = ConfigStore.get('user');
    const isOrgAdmin = organization.access.includes('org:admin');

    const [memberProjects, nonMemberProjects] = partition(
      projects,
      project => project.isMember
    );

    if (isSuperuser || isOrgAdmin) {
      return [memberProjects, nonMemberProjects];
    }

    return [memberProjects, []];
  };

  render() {
    const {
      selection,
      isSelectionStoreReady,
      hasCustomRouting,
      organization,
      router,
      location,
      ...props
    } = this.props;
    const enforceSingleProject = !organization.features.includes('global-views');
    const [memberProjects, nonMemberProjects] = this.getProjects();

    // console.log({globalSelectionInitialized});

    // if (!globalSelectionInitialized) {
    //   return null;
    // }

    return (
      <React.Fragment>
        <SyncUrlParams isDisabled={hasCustomRouting} location={location} />
        <SyncStoreToUrl
          isDisabled={hasCustomRouting}
          selection={selection}
          router={router}
        />
        <EnforceSingleProject
          selection={selection}
          location={location}
          isEnforced={enforceSingleProject}
          memberProjects={memberProjects}
          nonMemberProjects={nonMemberProjects}
          organization={organization}
          hasCustomRouting={!!hasCustomRouting}
          {...props}
          routerForControlledRouting={!hasCustomRouting ? router : null}
        />
      </React.Fragment>
    );
  }
}

export default withOrganization(
  withProjectsSpecified(
    ReactRouter.withRouter(withGlobalSelection(GlobalSelectionHeaderContainer))
  )
);
