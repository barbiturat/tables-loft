export const isNotEmpty = (val = '') => !!val.length;

export const anyTypeGuard = <T>(dataToCheck: any, condition: (data: any) => boolean): dataToCheck is T => {
  return condition(dataToCheck);
};
