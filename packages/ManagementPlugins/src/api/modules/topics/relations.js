import axios from 'axios';

import { processError } from '../../utils';

export function getRelatedFldLabel({ table_id, selected_item, lang, allowed_id }) {
  const params = {
    tableID: table_id,
    id: selected_item,
    lang: lang,
    allowedID: allowed_id,
  };

  return axios
    .get('/direct/topics/relation_item/', { params })
    .then(processError)
    .catch(err =>
      Promise.reject(
        err || {
          errors: ['要求中のエラー'],
        }
      )
    );
}

export function getRelatedFldList({
  table_id,
  allowed_id,
  keyword,
  lang,
  call_from_module,
  setting_id,
  ext_no,
  filters = [],
  limit = 100,
  offset = 0,
}) {
  limit = limit || 100;
  offset = offset || 0;

  const params = {
    tableID: table_id,
    lang: lang,
    allowedId: allowed_id,
    callFromModule: call_from_module,
    settingId: setting_id,
    extNo: ext_no,
    limit: limit,
    offset: offset,
  };

  if (keyword.length >= 1) {
    params.keyword = keyword;
  }

  for (const name in filters) {
    if (typeof filters[name] !== 'undefined') {
      params[name] = filters[name].value;
    }
  }

  return axios
    .get('/direct/topics/relation/', { params })
    .then(processError)
    .catch(err =>
      Promise.reject(
        err || {
          errors: ['要求中のエラー'],
        }
      )
    );
}

export default {
  getRelatedFldLabel,
  getRelatedFldList,
};
