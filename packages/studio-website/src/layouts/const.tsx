import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faDownload, faDiagramProject } from '@fortawesome/free-solid-svg-icons';

export const TOOLS_MENU = [
  {
    label: <FormattedMessage id="Modeling" />,
    value: '/modeling',
    key: '/modeling',
    icon: <FontAwesomeIcon icon={faDiagramProject} />,
  },
  {
    label: <FormattedMessage id="Importing" />,
    key: '/importing',
    value: '/importing',
    icon: <FontAwesomeIcon icon={faDownload} />,
  },
  {
    label: <FormattedMessage id="Querying" />,
    key: '/querying',
    value: '/querying',
    icon: <FontAwesomeIcon icon={faMagnifyingGlass} />,
  },
];

export const STATUS_MAP = {
  Running: {
    color: 'green',
  },
  Stopped: {
    color: 'red',
  },
};
