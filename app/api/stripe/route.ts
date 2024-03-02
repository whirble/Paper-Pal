import { db } from '@/lib/db'
import { userSubscriptions } from '@/lib/db/schema'
import { stripe } from '@/lib/stripe'
import {auth, currentUser} from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import {NextResponse} from 'next/server'

const base_url = process.env.NEXT_BASE_URL + '/'

export async function GET() {
    try {
        const {userId} = await auth()
        const user = await currentUser()
        if(!userId) {
            return new NextResponse('unauthorized', {status: 401})
        }
        // authorized
        const _userSubscriptions = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId))
        if(_userSubscriptions[0] && _userSubscriptions[0].stripeCustomerId) {
            // on Pro plan, trying to cancel at Billing Portal
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: _userSubscriptions[0].stripeCustomerId,
                return_url: base_url
            })
            return NextResponse.json({url: stripeSession.url})
        }
        // user trying to subscribe
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: base_url,
            cancel_url: base_url,
            payment_method_types:['card'],
            mode: 'subscription',
            billing_address_collection: 'auto',
            customer_email: user?.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: 'USD',
                        product_data: {
                            name: 'PaperPal Premium',
                            description: 'Limitless PDF sessions for seamless document management'
                        },
                        unit_amount: 999,
                        recurring: {
                            interval: 'month'
                        },
                    },
                    quantity: 1
                }
            ],
            metadata: {userId}
        })
        return NextResponse.json({url: stripeSession.url})

    } catch (error) {
        console.log('Stripe error', error);
        return new NextResponse('Internal server error', {status:500})
    }
}