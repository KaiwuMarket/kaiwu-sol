"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, ShoppingBag, Tag } from "lucide-react"

const activities = [
  {
    type: "sale",
    from: "0x1234...5678",
    to: "0x8765...4321",
    price: 45.5,
    time: "2 hours ago",
  },
  {
    type: "listing",
    from: "0x8765...4321",
    price: 45.5,
    time: "5 hours ago",
  },
  {
    type: "offer",
    from: "0x9876...1234",
    price: 42.0,
    time: "1 day ago",
  },
  {
    type: "sale",
    from: "0x5555...6666",
    to: "0x1234...5678",
    price: 43.2,
    time: "3 days ago",
  },
  {
    type: "listing",
    from: "0x5555...6666",
    price: 43.2,
    time: "4 days ago",
  },
]

const priceHistory = [
  { date: "Jan 15", price: 38.5 },
  { date: "Jan 20", price: 41.2 },
  { date: "Jan 25", price: 39.8 },
  { date: "Feb 1", price: 43.2 },
  { date: "Feb 5", price: 45.5 },
]

export function ProductActivity() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Activity</h2>

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="price-history">Price History</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4 mt-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                {activity.type === "sale" && <ShoppingBag className="w-5 h-5" />}
                {activity.type === "listing" && <Tag className="w-5 h-5" />}
                {activity.type === "offer" && <TrendingUp className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium capitalize">{activity.type}</span>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.type === "sale" && (
                    <>
                      From <span className="font-mono">{activity.from}</span> to{" "}
                      <span className="font-mono">{activity.to}</span>
                    </>
                  )}
                  {activity.type === "listing" && (
                    <>
                      Listed by <span className="font-mono">{activity.from}</span>
                    </>
                  )}
                  {activity.type === "offer" && (
                    <>
                      Offer by <span className="font-mono">{activity.from}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{activity.price} SOL</p>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="price-history" className="mt-6">
          <div className="space-y-4">
            {priceHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
              >
                <span className="text-muted-foreground">{item.date}</span>
                <span className="font-bold">{item.price} SOL</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
