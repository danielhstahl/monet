import Metrics from './Metrics'
import { render } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from '@apollo/client/testing';

describe('Metrics', () => {
    test('renders', () => {
        render(
            <MemoryRouter>
                <MockedProvider>
                    <Metrics company="mycompany"/>
                </MockedProvider>
            </MemoryRouter>
        )
    })
})