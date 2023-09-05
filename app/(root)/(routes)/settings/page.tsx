import { SubscriptionButton } from "@/components/subscriptionButton";
import { checkSubscription } from "@/lib/subscription"


const SettingsPage = async () => {
    const isPro = await checkSubscription();

  return (
    <div className="h-full p-4 space-y-2">
        <h3 className="text-lg font-medium">Settings</h3>
        <div className="text-muted-foregroud text-sm">
            {isPro ? "You are a pro user" : "You are not a pro user"}
        </div>
        <SubscriptionButton isPro={isPro!}/>
    </div>
  )
}

export default SettingsPage