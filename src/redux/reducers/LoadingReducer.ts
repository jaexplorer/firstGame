import { Reducer, AnyAction } from 'redux';
import { initialLoadingState, LoadingState } from '../state/LoadingState';

export const LoadingReducer: Reducer<LoadingState, AnyAction> = (
  state = initialLoadingState,
  { type },
) => {
  const matches = /(.*)_(REQUEST|SUCCESS|ERROR)/.exec(type);

  // not a *_REQUEST / *_SUCCESS /  *_ERROR actions, so we ignore them
  if (!matches) return state;

  const [, requestName, requestState] = matches;
  return {
    ...state,
    // Store whether a request is happening at the moment or not
    // e.g. will be true when receiving GET_TODOS_REQUEST
    //      and false when receiving GET_TODOS_SUCCESS / GET_TODOS_ERROR
    [requestName]: requestState === 'REQUEST',
  };
};
