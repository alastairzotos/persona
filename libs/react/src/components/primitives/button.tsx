import styled from 'styled-components'
import Color from 'color';

interface Props {
  variant?: 'contained' | 'link';
}

export const Button = styled('button')<Props>(({ variant = 'contained', disabled, theme }) => ({
  padding: theme.pad * 3,
  border: 'none',
  borderRadius: theme.borderRadius,

  backgroundColor:
    variant === 'contained'
      ? (disabled ? Color(theme.brandColor).grayscale().hex() : theme.brandColor)
      : 'inherit',

  color:
    variant === 'contained'
      ? (disabled ? Color(theme.buttonTextColor).darken(0.2).hex() : theme.buttonTextColor)
      : (disabled ? Color(theme.linkColor).lighten(0.5).hex() : theme.linkColor),

  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  gap: theme.pad * 2
}))
