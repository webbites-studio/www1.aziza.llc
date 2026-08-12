import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'

describe('portal login', () => {
    it('rejects invalid customer credentials', async () => {
        const user = userEvent.setup()
        render(<App />)

        const password = screen.getByLabelText('Password')
        await user.clear(password)
        await user.type(password, 'incorrect')
        await user.click(screen.getByRole('button', { name: 'Sign in' }))

        expect(screen.getByText('Email or password is incorrect.')).toBeVisible()
        expect(screen.getByRole('heading', { name: 'Welcome to Aziza' })).toBeVisible()
    })

    it('switches to the administrator credentials', async () => {
        const user = userEvent.setup()
        render(<App />)

        await user.click(screen.getByRole('button', { name: 'Administrator' }))

        expect(screen.getByLabelText('Email address')).toHaveValue('admin@aziza.kz')
        expect(screen.getByLabelText('Password')).toHaveValue('admin123')
    })
})