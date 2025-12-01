// Test básico para verificar que la app se renderiza
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('App se renderiza sin errores', () => {
  const { container } = render(<App />);
  expect(container).toBeTruthy();
});
