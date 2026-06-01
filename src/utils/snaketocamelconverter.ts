export const snakeToCamel = (str: string): string => {
  return str.replace(/([-_][a-z0-9])/gi, (group) => {
    return group.toUpperCase().replace("-", "").replace("_", "");
  });
};

export const convertObjectKeysToCamelCase = <T>(obj: Record<string, any>) => {
  return Object.keys(obj).reduce((prev, cur) => {
    return { ...prev, [snakeToCamel(cur)]: obj[cur] };
  }, {} as T);
};
