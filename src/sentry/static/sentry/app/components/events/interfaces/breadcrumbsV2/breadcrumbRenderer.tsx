import React from 'react';

import HttpRenderer from '../breadcrumbs/httpRenderer';
import DefaultRenderer from '../breadcrumbs/defaultRenderer';
import ErrorRenderer from '../breadcrumbs/errorRenderer';
import {Breadcrumb} from '../breadcrumbs/types';

type Props = {
  breadcrumb: Breadcrumb;
};

const BreadcrumbRenderer = ({breadcrumb}: Props) => {
  if (breadcrumb.type === 'http') {
    return <HttpRenderer breadcrumb={breadcrumb} />;
  }

  if (
    breadcrumb.type === 'warning' ||
    breadcrumb.type === 'message' ||
    breadcrumb.type === 'exception' ||
    breadcrumb.type === 'error'
  ) {
    return <ErrorRenderer breadcrumb={breadcrumb} />;
  }

  return <DefaultRenderer breadcrumb={breadcrumb} />;
};

export default BreadcrumbRenderer;
