import React from 'react';
import { render } from '@testing-library/react';
import LandingPage from './LandingPage';

test('renders LandingPage correctly', () => {
  const { asFragment } = render(<LandingPage />);
  expect(asFragment()).toMatchSnapshot();
});