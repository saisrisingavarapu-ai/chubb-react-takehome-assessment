export function logError(error, context = '') {
  console.error('[Logger]', context, error?.message ?? error);
}

export function logInfo(message, data = null) {
  console.info('[Logger]', message, data);
}
