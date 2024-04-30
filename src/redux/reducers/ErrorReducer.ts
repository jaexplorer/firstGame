import { Reducer, AnyAction } from 'redux';
import { ErrorState, initialErrorState } from '../state/ErrorState';

export const ErrorReducer: Reducer<ErrorState, AnyAction> = (
  state = initialErrorState,
  { type, data },
) => {
  const matches = /(.*)_(REQUEST|ERROR)/.exec(type);

  // not a *_REQUEST / *_ERROR actions, so we ignore them
  if (!matches) return state;

  const [, requestName, requestState] = matches;
  return {
    ...state,
    // Store errorMessage
    // e.g. stores errorMessage when receiving GET_TODOS_ERROR
    //      else clear errorMessage when receiving GET_TODOS_REQUEST
    [requestName]: requestState === 'ERROR' ? (data as string) : undefined,
  };
};
