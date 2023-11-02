export const errorString = (e: any) =>
  e?.response?.data?.message || e?.message || JSON.stringify(e);
