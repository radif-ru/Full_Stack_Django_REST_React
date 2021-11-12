import {render, screen} from '@testing-library/react';

import {GeneralApp} from "./GeneralApp";


test('renders learn react link', () => {
  render(<GeneralApp/>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
