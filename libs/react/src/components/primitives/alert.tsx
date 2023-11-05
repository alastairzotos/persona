import styled from 'styled-components'
import React from 'react'
import { IconError } from '../icons'

const AlertContainer = styled('div')(({ theme }) => ({
  padding: theme.pad * 3,
  margin: theme.pad * 2,
  backgroundColor: theme.errorBackgroundColor,
  color: theme.errorTextColor,
  borderRadius: theme.borderRadius,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.pad * 2
}))

export const Alert: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <AlertContainer>
      <IconError /> {children}
    </AlertContainer>
  )
}
