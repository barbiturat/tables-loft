import {getProcessEnv} from '../helpers/process-env';

export const API_URL = (getProcessEnv().API_HOST || '') + ':' + (getProcessEnv().API_PORT || '');
