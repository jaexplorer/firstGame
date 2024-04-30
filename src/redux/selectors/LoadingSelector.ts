/* eslint-disable @typescript-eslint/no-unsafe-return */
import _ from 'lodash';
import { ApplicationState } from '../state/ApplicationState';

/*
  Show loading when any of GET_TODOS_REQUEST, GET_USER_REQUEST is active
  const loadingSelector = loadingSelector([TodoActionTypes.GET_TODO, TodoActionTypes.GET_USER]);
  const mapStateToProps = (state) => ({ isFetching: loadingSelector(state) });
*/
export const loadingSelector = (actions: string[]) => (state: ApplicationState) => {
  // returns true only when all actions is not loading
  return _(actions).some((action) => _.get(state, `loadingState.${action}`));
};
