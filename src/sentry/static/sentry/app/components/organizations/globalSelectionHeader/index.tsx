import React from 'react';
import * as ReactRouter from 'react-router';
import partition from 'lodash/partition';

import {Organization, Project, GlobalSelection} from 'app/types';
import ConfigStore from 'app/stores/configStore';
import withGlobalSelection from 'app/utils/withGlobalSelection';
import withOrganization from 'app/utils/withOrganization';
import withProjectsSpecified from 'app/utils/withProjectsSpecified';

import EnforceSingleProject from './enforceSingleProject';

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
      globalSelectionInitialized,
      hasCustomRouting,
      organization,
      router,
      ...props
    } = this.props;
    const enforceSingleProject = !organization.features.includes('global-views');
    const [memberProjects, nonMemberProjects] = this.getProjects();

    // console.log({globalSelectionInitialized});

    // if (!globalSelectionInitialized) {
    //   return null;
    // }

    return (
      <EnforceSingleProject
        isEnforced={enforceSingleProject}
        memberProjects={memberProjects}
        nonMemberProjects={nonMemberProjects}
        organization={organization}
        hasCustomRouting={!!hasCustomRouting}
        {...props}
        routerForControlledRouting={!hasCustomRouting ? router : null}
      />
    );
  }
}

export default withOrganization(
  withProjectsSpecified(
    ReactRouter.withRouter(withGlobalSelection(GlobalSelectionHeaderContainer))
  )
);
