import React from 'react';
import styled from 'styled-components';


export const FormErrorMessage = styled('div')({
  padding: 10,
  backgroundColor: '#c96972',
  borderRadius: 4,
  color: '#fff',
  fontSize: '0.9rem',
})

interface InputProps {
  invalid?: boolean;
}

export const Input = styled('input')<InputProps>(({ invalid }) => ({
  padding: 5,
  borderRadius: 4,
  borderColor: invalid ? 'red' : '#03728c'
}));
