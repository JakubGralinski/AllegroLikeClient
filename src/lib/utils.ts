import { NETWORK_ERR_MSG, SERVER_ERR_MSG } from "./constants";
import { Result } from "./types";

export function handleApiResponseError<T>(err: any): Result<T> {
  if (err.response) {
    if (err.response.status === 500) {
      return {
        isSuccess: false,
        errMessage: SERVER_ERR_MSG,
      };
    }

    return {
      isSuccess: false,
      errMessage: err.response.data?.message,
    };
  }

  return {
    isSuccess: false,
    errMessage: NETWORK_ERR_MSG,
  };
}
