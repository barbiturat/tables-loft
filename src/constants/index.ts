import {getProcessEnv} from '../helpers/processEnv';

export const API_URL = (getProcessEnv().API_HOST || '') + ':' + (getProcessEnv().API_PORT || '');
