export const youAreOfflineToast = {
  code: 503,
  title: "You are offline",
  message: "Check your internet connection",
};
export function axiosErrToToast(err) {
  if (err.response) {
    return {
      code: err.response.status,
      ...err.response.data,
    };
  } else if (err.request) {
    return youAreOfflineToast;
  } else {
    return {
      title: "Dev error",
      message: err.toString(),
    };
  }
}

export function axiosResToToast(res) {
  const toast = {
    code: res.status,
    ...res.data,
  };

  return toast;
}
