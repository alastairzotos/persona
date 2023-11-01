import React from 'react';
import { Test } from '@bitmetro/persona-types';

const t: Test = {
  foo: "Hello there"
}

export const Foo = () => {
  return <p>{t.foo}</p>
}
