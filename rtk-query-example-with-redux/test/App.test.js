// Basic example of an integration test over the "App" component.
// Extend this as necessary to depict your test scenario.
import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../src/App'

test('passes', async () => {
  render(<App />)

  expect(
    // Expect the mocked response to be present in the DOM.
    await screen.findByText(`{"id":1,"firstName":"John"}`),
  ).toBeInTheDocument()
})
