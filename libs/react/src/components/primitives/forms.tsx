import React from 'react';
import styled from 'styled-components';
import Color from 'color';


export const FormErrorMessage = styled('div')(({ theme }) => ({
  padding: 10,
  borderRadius: theme.borderRadius,
  backgroundColor: theme.errorBackgroundColor,
  color: theme.errorTextColor,
  fontSize: '0.9rem',
}))

interface InputProps {
  invalid?: boolean;
}

export const Input = styled('input')<InputProps>(({ invalid, theme }) => ({
  padding: theme.pad * 3,
  borderRadius: theme.borderRadius,
  borderColor: invalid ? 'red' : Color(theme.brandColor).lighten(0.9).hex(),
}));
