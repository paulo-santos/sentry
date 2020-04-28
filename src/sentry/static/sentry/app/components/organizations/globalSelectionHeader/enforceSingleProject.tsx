import {WithRouterProps} from 'react-router/lib/withRouter';
import React from 'react';

import {Project} from 'app/types';
import {getStateFromQuery} from 'app/components/organizations/globalSelectionHeader/utils';
import {
  // updateDateTime,
  // updateEnvironments,
  // updateParams,
  enforceProject,
  skipEnforceProject,
  // updateParamsWithoutHistory,
  // updateProjects,
} from 'app/actionCreators/globalSelection';

import GlobalSelectionHeader from './globalSelectionHeader';

function getProjectIdFromProject(project) {
  return parseInt(project.id, 10);
}

type GlobalSelectionHeaderProps = Omit<
  React.ComponentPropsWithoutRef<typeof GlobalSelectionHeader>,
  'router'
>;

type Props = {
  isEnforced: boolean;
  memberProjects: Project[];
  nonMemberProjects: Project[];

  shouldForceProject?: boolean;
  routerForControlledRouting: WithRouterProps['router'] | null;
  hasCustomRouting: boolean;
} & GlobalSelectionHeaderProps;

class EnforceSingleProject extends React.Component<Props> {
  componentDidMount() {
    console.group('EnforceDidMount');
    this.performEnforcement();
    console.groupEnd();
  }

  componentDidUpdate() {
    console.group('EnforceDidUpdate');
    this.performEnforcement();
    console.groupEnd();
  }

  getFirstProject = () =>
    [...this.props.memberProjects, ...this.props.nonMemberProjects]
      .slice(0, 1)
      .map(getProjectIdFromProject);

  performEnforcement() {
    const {
      isEnforced,
      location,
      // selection,
      shouldForceProject,
      forceProject,
      routerForControlledRouting,
    } = this.props;

    console.log('performEnforcement');
    if (!isEnforced) {
      skipEnforceProject();
    }
    let newProject;

    const {project: projectsFromUrlParameters = []} = getStateFromQuery(location.query);

    console.log('enforceSingleProject', {
      forceProject,
      projectsFromUrlParameters,
      firstProject: this.getFirstProject(),
    });

    // This is the case where we *want* to force project, but we are still loading
    // the forced project's details
    if (shouldForceProject && !forceProject) {
      return;
    }

    if (forceProject) {
      // this takes precendence over the other options
      newProject = [getProjectIdFromProject(forceProject)];
    } else if (projectsFromUrlParameters && projectsFromUrlParameters.length > 0) {
      // If there is a list of projects from URL params, select first project from that list
      newProject = [projectsFromUrlParameters[0]];
    } else {
      // When we have finished loading the organization into the props,  i.e. the organization slug is consistent with
      // the URL param--Sentry will get the first project from the organization that the user is a member of.
      newProject = this.getFirstProject();
    }

    console.log('enforce new project', newProject);
    enforceProject(newProject, routerForControlledRouting);
  }

  render() {
    const {routerForControlledRouting, ...props} = this.props;
    return <GlobalSelectionHeader {...props} router={routerForControlledRouting} />;
  }
}

export default EnforceSingleProject;
