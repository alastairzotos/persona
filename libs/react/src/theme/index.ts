declare module 'styled-components' {
  export interface DefaultTheme  {
    showOutline: boolean;
    pad: number;
    brandColor: string;
    backgroundColor: string;
    borderRadius: number | string;
    fontFamily: string;
    textColor: string;
    buttonTextColor: string;
    linkColor: string;
    errorBackgroundColor: string;
    errorTextColor: string;
  }
}

import type { DefaultTheme } from 'styled-components';

export const defaultTheme: DefaultTheme = {
  showOutline: true,
  pad: 4,

  brandColor: '#2c63e6',
  backgroundColor: '#fff',
  borderRadius: 8,

  fontFamily: 'sans-serif',
  textColor: '#000',
  buttonTextColor: '#fff',
  linkColor: '#000',

  errorBackgroundColor: '#c96972',
  errorTextColor: '#fff',
}

export const extendPersonaTheme = (theme: Partial<DefaultTheme>): DefaultTheme => ({
  ...defaultTheme,
  ...theme,
})
