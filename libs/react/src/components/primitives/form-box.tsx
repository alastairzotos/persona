import styled from 'styled-components'

export const FormBox = styled('div')(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.backgroundColor,
  fontFamily: `${theme.fontFamily}`,
}))
