class ErrorHandler {
  handleError(error, fallbackMsg = "Something went wrong") {
    const serverMsg = error?.response?.data?.message;

    if (serverMsg) {
      throw new Error(serverMsg);
    } else {
      throw new Error(fallbackMsg);
    }
  }
}

const errorHandler = new ErrorHandler();

export default errorHandler;
