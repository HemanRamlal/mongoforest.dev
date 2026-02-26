import axios from "axios";
import { useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { pushToast } from "../components/Toasts/Toasts";
import { axiosErrToToast } from "./toastObjects";

const withOnToastableError = options => {
  return {
    retry: false,
    ...options,
    onError: async (err, ...rest) => {
      const errBackup = err;
      try {
        await options?.onError?.(err, ...rest);
      } finally {
        if (axios.isAxiosError(errBackup)) pushToast(axiosErrToToast(errBackup));
        else if (errBackup.title && errBackup.message) pushToast(errBackup);
      }
    },
  };
};

const mutationWithOnToastableError = withOnToastableError;

export const useToastMutation = options => {
  return useMutation(mutationWithOnToastableError(options));
};

export const useToastQuery = options => {
  const { onError, ...queryOptions } = options ?? {};
  const query = useQuery({ retry: false, ...queryOptions });
  const lastHandledErrorAt = useRef(0);

  useEffect(() => {
    if (!query.isError) return;
    if (!query.errorUpdatedAt) return;
    if (lastHandledErrorAt.current == query.errorUpdatedAt) return;

    lastHandledErrorAt.current = query.errorUpdatedAt;
    const err = query.error;

    if (axios.isAxiosError(err)) pushToast(axiosErrToToast(err));
    else if (err?.title && err?.message) pushToast(err);
  }, [query.isError, query.errorUpdatedAt, query.error, onError]);

  return query;
};
