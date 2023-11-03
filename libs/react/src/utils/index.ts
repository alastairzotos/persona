export const errorString = (e: any) => 
  typeof e?.response?.data === 'string'
    ? e.response?.data
    : e?.response?.data?.message || e?.message || JSON.stringify(e);
