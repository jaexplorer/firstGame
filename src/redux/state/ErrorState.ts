export interface ErrorState {
  [type: string]: string | undefined;
}

export const initialErrorState: ErrorState = {};
