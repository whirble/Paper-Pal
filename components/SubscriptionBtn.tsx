'use client'
import axios from 'axios'
import React from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react';

type Props = {isPro: boolean}

const SubscriptionBtn = (props: Props) => {
    const [Loading, setLoading] = React.useState(false)
    const handleSubscription = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/stripe')
            window.location.href = response.data.url
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    };
    return (
        <Button disabled={Loading} onClick={handleSubscription} 
        className={ cn('bg-white text-dark hover:underline hover:bg-white', {
            // 'bg-white text-dark hover:underline hover:bg-white' : props.isPro, // Subscribed
            // 'bg-white text-dark hover:bg-white' : !props.isPro, // Free Plan
        })}>
            {Loading ? (
                <>
                <p>{props.isPro ? 'Manage Subscriptions' : 'Upgrade to premium'}</p>
                <Loader2 className='w-4 h-4 animate-spin'/>
                </>
            ): (
                props.isPro ? 'Manage Subscriptions' : 'Upgrade to premium'
            )}
            <ArrowUpRight className='w-5 h-5 ml-2'/>
        </Button>
    )

}

export default SubscriptionBtn;