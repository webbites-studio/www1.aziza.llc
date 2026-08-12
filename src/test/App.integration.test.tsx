import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'

async function signIn(role: 'customer' | 'admin') {
    const user = userEvent.setup()
    render(<App />)
    if (role === 'admin') await user.click(screen.getByRole('button', { name: 'Administrator' }))
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    return user
}

describe('customer journey', () => {
    it('shows requested travel documents, schedule, and converted pricing', async () => {
        const user = await signIn('customer')
        const navigation = screen.getByRole('navigation')

        await user.click(within(navigation).getByRole('button', { name: 'Documents' }))
        expect(screen.getByText('Flight ticket')).toBeVisible()
        expect(screen.getByText('Hotel booking')).toBeVisible()

        await user.click(within(navigation).getByRole('button', { name: 'Schedule' }))
        expect(screen.getByText('Bank appointment')).toBeVisible()
        expect(screen.getByText('Accountant consultation')).toBeVisible()

        await user.click(within(navigation).getByRole('button', { name: 'Services & pricing' }))
        expect(screen.getByText('₸595,000')).toBeVisible()
        expect(screen.getByText('≈ €1,071')).toBeVisible()
    })
})

describe('administrator journey', () => {
    it('opens a customer and adds a required document', async () => {
        const user = await signIn('admin')

        expect(screen.getByRole('heading', { name: 'Customers' })).toBeVisible()
        await user.click(screen.getByRole('button', { name: /Elena Volkova/ }))
        await user.type(screen.getByPlaceholderText('New required document'), 'Marriage certificate')
        await user.click(screen.getByRole('button', { name: 'Add request' }))

        const documentName = screen.getByText('Marriage certificate')
        const documentRow = documentName.closest('.document-row')
        expect(documentRow).not.toBeNull()
        expect(within(documentRow as HTMLElement).getByText('Missing')).toBeVisible()
    })

    it('creates a customer account that can sign in', async () => {
        const user = await signIn('admin')
        await user.click(screen.getByRole('button', { name: 'Add customer' }))
        await user.type(screen.getByLabelText('First name'), 'Maya')
        await user.type(screen.getByLabelText('Last name'), 'Ivanova')
        await user.type(screen.getByLabelText('Date of birth'), '1990-05-15')
        await user.type(screen.getByLabelText('Email / login'), 'maya@example.com')
        await user.click(screen.getByRole('button', { name: 'Create customer' }))

        expect(screen.getByText('Maya Ivanova')).toBeVisible()
        await user.click(screen.getByRole('button', { name: 'Sign out' }))
        await user.clear(screen.getByLabelText('Email address'))
        await user.type(screen.getByLabelText('Email address'), 'maya@example.com')
        await user.click(screen.getByRole('button', { name: 'Sign in' }))

        expect(screen.getByRole('heading', { level: 1, name: 'Maya Ivanova' })).toBeVisible()
    })
})