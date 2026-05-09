export const throwIfNotExists = <T>(value: T | undefined, message = "Value does not exist"): T => {
  if (value === undefined) {
    throw new Error(message);
  }

  return value;
}
