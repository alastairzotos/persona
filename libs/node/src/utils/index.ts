export const mapRecord = <K extends string, V = string>(obj: Record<K, V>, mapper: (value: V) => V) =>
  Object.keys(obj)
    .reduce((acc, key) => ({
      ...acc,
      [key]: !!obj[key as K] ? mapper(obj[key as K]) : obj[key as K]
    }), {} as Record<K, V>)
