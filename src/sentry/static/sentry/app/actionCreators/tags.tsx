import {Query} from 'history';

import {t} from 'app/locale';
import {Client} from 'app/api';
import {Tag, GlobalSelection} from 'app/types';
import TagStore from 'app/stores/tagStore';
import TagActions from 'app/actions/tagActions';
import AlertActions from 'app/actions/alertActions';
import {getParams} from 'app/components/organizations/globalSelectionHeader/getParams';

const MAX_TAGS = 1000;

const BUILTIN_TAGS = [
  'event.type',
  'platform',
  'message',
  'title',
  'location',
  'timestamp',
  'release',
  'user.id',
  'user.username',
  'user.email',
  'user.ip',
  'sdk.name',
  'sdk.version',
  'contexts.key',
  'contexts.value',
  'http.method',
  'http.url',
  'os.build',
  'os.kernel_version',
  'device.brand',
  'device.locale',
  'device.uuid',
  'device.model_id',
  'device.arch',
  'device.orientation',
  'geo.country_code',
  'geo.region',
  'geo.city',
  'error.type',
  'error.value',
  'error.mechanism',
  'error.handled',
  'stack.abs_path',
  'stack.filename',
  'stack.package',
  'stack.module',
  'stack.function',
  'stack.stack_level',
].map(tag => ({
  key: tag,
  name: tag,
}));

function tagFetchSuccess(tags: Tag[]) {
  const trimmedTags = tags.slice(0, MAX_TAGS);

  if (tags.length > MAX_TAGS) {
    AlertActions.addAlert({
      message: t('You have too many unique tags and some have been truncated'),
      type: 'warn',
    });
  }
  TagActions.loadTagsSuccess(trimmedTags);
}

/**
 * Load an organization's tags based on a global selection value.
 */
export function loadOrganizationTags(
  api: Client,
  orgId: string,
  selection: GlobalSelection
) {
  TagStore.reset();

  const url = `/organizations/${orgId}/tags/`;
  const query: Query = selection.datetime ? {...getParams(selection.datetime)} : {};
  query.use_cache = '1';

  if (selection.projects) {
    query.project = selection.projects.map(String);
  }
  const promise = api
    .requestPromise(url, {
      method: 'GET',
      query,
    })
    .then((tags: Tag[]) => [...BUILTIN_TAGS, ...tags]);

  promise.then(
    results => {
      tagFetchSuccess(results);
    },
    reason => {
      TagActions.loadTagsError(reason);
    }
  );

  return promise;
}

/**
 * Fetch tags for an organization or a subset or projects.
 */
export function fetchOrganizationTags(
  api: Client,
  orgId: string,
  projectIds: string[] | null = null
) {
  TagStore.reset();

  const url = `/organizations/${orgId}/tags/`;
  const query: Query = {use_cache: '1'};
  if (projectIds) {
    query.project = projectIds;
  }

  const promise = api
    .requestPromise(url, {
      method: 'GET',
      query,
    })
    .then(tags => [...BUILTIN_TAGS, ...tags]);
  promise.then(tagFetchSuccess, TagActions.loadTagsError);

  return promise;
}

/**
 * Fetch tag values for an organization.
 * The `projectIds` argument can be used to subset projects.
 */
export function fetchTagValues(
  api: Client,
  orgId: string,
  tagKey: string,
  search: string | null = null,
  projectIds: string[] | null = null,
  endpointParams: Query | null = null
) {
  const url = `/organizations/${orgId}/tags/${tagKey}/values/`;

  const query: Query = {};
  if (search) {
    query.query = search;
  }
  if (projectIds) {
    query.project = projectIds;
  }
  if (endpointParams) {
    if (endpointParams.start) {
      query.start = endpointParams.start;
    }
    if (endpointParams.end) {
      query.end = endpointParams.end;
    }
    if (endpointParams.statsPeriod) {
      query.statsPeriod = endpointParams.statsPeriod;
    }
  }

  return api.requestPromise(url, {
    method: 'GET',
    query,
  });
}
