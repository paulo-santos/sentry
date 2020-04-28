import Reflux from 'reflux';

export default Reflux.createActions([
  'reset',
  'initializeUrlState',
  'syncStoreToUrl',
  'enforceProject',
  'skipEnforceProject',
  'updateProjects',
  'updateDateTime',
  'updateEnvironments',
  'save',
]);
