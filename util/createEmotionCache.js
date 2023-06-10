import createCache from "@emotion/cache";

export default () => {
  let insertionPoint;

  // if we're on the client
  if (typeof document !== "undefined") {
    const emotionInsertionPoint = document.querySelector(
      'meta[name="emotion-insertion-point"]'
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ key: "mui-style", insertionPoint });
};
