import { auth } from "@clerk/nextjs"
import { db } from "./db"
import { userSubscriptions } from "./db/schema"
import { eq } from "drizzle-orm"


const DayInMs = 1000 * 60 * 60 * 24

export const checkSubscription = async () => {
    const {userId} = await auth()
    if (!userId) {
        return false
    }

    const _userSubscriptions = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId))

    if (!_userSubscriptions[0]) {
        return false
    }

    const userSubscription = _userSubscriptions[0]

    const is_valid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime()! + DayInMs > Date.now()

    return !!is_valid;

}