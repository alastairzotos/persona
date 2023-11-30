import styled from 'styled-components'

export const FormBox = styled('div')(({ theme }) => ({
  width: '100%',
  padding: theme.pad * 8,
  backgroundColor: theme.backgroundColor,
  fontFamily: `${theme.fontFamily}`,
}))
