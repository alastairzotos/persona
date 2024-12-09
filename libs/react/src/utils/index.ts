import { LoginProps } from "../models";

export const errorString = (e: any) => 
  typeof e?.response?.data === 'string'
    ? e.response?.data
    : e?.response?.data?.message || e?.message || JSON.stringify(e);

export const oauthLoginParams = ({ fwdUrl, registerState }: LoginProps) => {
  const data: Record<string, string> = {};

  if (fwdUrl) {
    data.fwdUrl = fwdUrl;
  }

  if (registerState) {
    data.registerState = registerState;
  }

  const params = (new URLSearchParams(data)).toString().trim();

  if (params.length) {
    return '&' + params;
  }

  return '';
}
