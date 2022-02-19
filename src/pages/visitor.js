import ApplicationLogo from '@/components/ApplicationLogo'
import AuthCard from '@/components/AuthCard'
import AuthSessionStatus from '@/components/AuthSessionStatus'
import AuthValidationErrors from '@/components/AuthValidationErrors'
import Button from '@/components/Button'
import GuestLayout from '@/components/Layouts/GuestLayout'
import Input from '@/components/Input'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Login = () => {
    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    return (
        <GuestLayout>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque
                totam omnis sed reprehenderit inventore fuga veniam, aut
                repellat ipsam dolorem dolor quasi, nisi doloribus? Numquam
                animi distinctio odio qui eaque.
            </div>
        </GuestLayout>
    )
}

export default Login
