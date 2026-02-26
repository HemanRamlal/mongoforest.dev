import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { pushToast } from "../components/Toasts/Toasts";
import { axiosErrToToast } from "./toastObjects";

export const useToastMutation = options => {
  return useMutation({
    ...options,
    onError: (err, ...rest) => {
      const errBackup = err;
      options?.onError?.(err, ...rest);

      if (axios.isAxiosError(errBackup)) pushToast(axiosErrToToast(errBackup));
      else if (errBackup.title && errBackup.message) pushToast(errBackup);
    },
  });
};
