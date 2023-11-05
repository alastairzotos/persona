import styled from '@emotion/styled'
import React, { Children } from 'react'
import { IconError } from '../icons'

const AlertContainer = styled('div')({
  padding: 10,
  margin: 10,
  backgroundColor: '#cf383a',
  color: '#fff',
  borderRadius: 4,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 6
})

export const Alert: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <AlertContainer>
      <IconError /> {children}
    </AlertContainer>
  )
}
