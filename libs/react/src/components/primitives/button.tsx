import styled from 'styled-components'

interface Props {
  variant?: 'contained' | 'link';
}

export const Button = styled('button')<Props>(({ variant = 'contained', disabled }) => ({
  padding: 12,
  borderRadius: 8,
  backgroundColor:
    variant === 'contained'
    ? (disabled ? '#a3c9d1' : '#03728c')
    : 'inherit',
  color:
    variant === 'contained'
    ? (disabled ? '#eee' : '#fff')
    : (disabled ? '#a3a3a3' : 'inherit'),
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  gap: 6
}))
