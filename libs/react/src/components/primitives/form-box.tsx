import styled from 'styled-components'

export const FormBox = styled('div')(({ theme }) => ({
  width: '100%',
  padding: theme.pad * 8,
  backgroundColor: theme.backgroundColor,
  border: theme.showOutline ? `1px solid ${theme.brandColor}` : 'none',
  borderTop: theme.showOutline ? `4px solid ${theme.brandColor}` : 'none',
  borderRadius: theme.borderRadius,
  fontFamily: `${theme.fontFamily}`,
}))
