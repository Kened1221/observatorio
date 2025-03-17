"use client";

import * as React from "react";
import {
  Calendar,
  ChevronDown,
  CreditCard,
  Package,
  Plus,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {

  return (
    <main className="p-6 rounded-b-lg">
      <div className="mb-6">
        <h1 className="text-xl font-medium">Good Morning, Miguel!</h1>
        <p className="text-sm text-muted-foreground">
          Heres whats happening with your store today.
        </p>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            01 Jan, 2025 to 31 Jan, 2025
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          <Button
            variant="outline"
            className="bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="TOTAL EARNINGS"
          value="$559.25k"
          change="+16.24%"
          changeType="positive"
          link="View net earnings"
          icon={<CreditCard className="h-5 w-5 text-red-400" />}
          iconBg="bg-red-100"
        />
        <StatsCard
          title="ORDERS"
          value="36,894"
          change="-3.57%"
          changeType="negative"
          link="View all orders"
          icon={<ShoppingBag className="h-5 w-5 text-blue-400" />}
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="CUSTOMERS"
          value="183.35M"
          change="+29.08%"
          changeType="positive"
          link="See details"
          icon={<Users className="h-5 w-5 text-green-400" />}
          iconBg="bg-green-100"
        />
        <StatsCard
          title="MY BALANCE"
          value="$165.89k"
          change="+0.00%"
          changeType="neutral"
          link="Withdraw money"
          icon={<Wallet className="h-5 w-5 text-yellow-400" />}
          iconBg="bg-yellow-100"
        />
      </div>
      <div className="mb-8 grid gap-6 lg:grid-cols-5">
        <Card className="col-span-3 overflow-hidden">
          <div className="flex items-center justify-between border-b p-5">
            <h3 className="text-lg font-medium">Revenue</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full bg-red-100 px-3 text-xs font-medium text-red-500 hover:bg-red-200"
              >
                ALL
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full bg-muted px-3 text-xs font-medium hover:bg-muted/80"
              >
                1M
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full bg-muted px-3 text-xs font-medium hover:bg-muted/80"
              >
                6M
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full bg-muted px-3 text-xs font-medium hover:bg-muted/80"
              >
                1Y
              </Button>
            </div>
          </div>
          <CardContent className="p-5 pt-6">
            <div className="mb-8 grid grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Orders</div>
                <div className="text-2xl font-semibold">7,585</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Earnings</div>
                <div className="text-2xl font-semibold">$22.89k</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Refunds</div>
                <div className="text-2xl font-semibold">367</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Conversation Ratio
                </div>
                <div className="text-2xl font-semibold text-green-500">
                  18.92%
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <RevenueChart />
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 overflow-hidden">
          <div className="flex items-center justify-between border-b p-5">
            <h3 className="text-lg font-medium">Sales by Locations</h3>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-blue-50 text-blue-500 hover:bg-blue-100"
            >
              Export Report
            </Button>
          </div>
          <CardContent className="p-5">
            <div className="mb-6 h-[240px] w-full">
              <Image
                src="/placeholder.svg?height=240&width=400"
                width={400}
                height={240}
                alt="World map"
                className="h-full w-full"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span>Canada</span>
                </div>
                <div className="font-medium">75%</div>
              </div>
              <Progress value={75} className="h-2 w-full bg-muted" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span>Greenland</span>
                </div>
                <div className="font-medium">47%</div>
              </div>
              <Progress value={47} className="h-2 w-full bg-muted" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span>Russia</span>
                </div>
                <div className="font-medium">82%</div>
              </div>
              <Progress value={82} className="h-2 w-full bg-muted" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b p-5">
            <h3 className="text-lg font-medium">Best Selling Products</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">SORT BY:</span>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                Today
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm font-medium text-muted-foreground">
                    Orders
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm font-medium text-muted-foreground">
                    Stock
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm font-medium text-muted-foreground">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="flex items-center gap-3 px-5 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-red-100">
                      <Package className="h-5 w-5 text-red-500" />
                    </div>
                    <span className="font-medium">Branded T-Shirts</span>
                  </td>
                  <td className="px-5 py-3">$29.00</td>
                  <td className="px-5 py-3">62</td>
                  <td className="px-5 py-3">510</td>
                  <td className="px-5 py-3">$1,798</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b p-5">
            <h3 className="text-lg font-medium">Top Sellers</h3>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              Report
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm font-medium text-muted-foreground">
                    Seller
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm font-medium text-muted-foreground">
                    Sales
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm font-medium text-muted-foreground">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="flex items-center gap-3 px-5 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-sm font-medium text-blue-500">
                        iT
                      </span>
                    </div>
                    <span className="font-medium">iTest Factory</span>
                  </td>
                  <td className="px-5 py-3">Bags and Wallets</td>
                  <td className="px-5 py-3">8547</td>
                  <td className="px-5 py-3">$541200</td>
                  <td className="px-5 py-3 text-green-500">
                    32%{" "}
                    <ChevronDown className="inline h-4 w-4 -rotate-180 text-green-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}

function StatsCard({
  title,
  value,
  change,
  changeType,
  link,
  icon,
  iconBg,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  link: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">
            {title}
          </div>
          <div
            className={`text-xs font-medium ${
              changeType === "positive"
                ? "text-green-500"
                : changeType === "negative"
                ? "text-red-500"
                : "text-muted-foreground"
            }`}
          >
            {change}
          </div>
        </div>
        <div className="mb-4 text-2xl font-semibold">{value}</div>
        <div className="flex items-center justify-between">
          <Link href="#" className="text-sm text-blue-500 hover:underline">
            {link}
          </Link>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RevenueChart() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 top-0 flex h-full w-full flex-col justify-between text-xs text-muted-foreground">
        <div>120.00</div>
        <div>100.00</div>
        <div>80.00</div>
        <div>60.00</div>
        <div>40.00</div>
        <div>20.00</div>
        <div>0.00</div>
      </div>
      <div className="absolute bottom-0 left-8 right-0 flex h-[240px] items-end justify-between">
        <div className="flex w-full flex-col items-center">
          <div className="h-[88px] w-6 rounded bg-blue-500"></div>
          <div className="mt-2 text-xs text-muted-foreground">Jan</div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="h-[98px] w-6 rounded bg-blue-500"></div>
          <div className="mt-2 text-xs text-muted-foreground">Feb</div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="h-[68px] w-6 rounded bg-blue-500"></div>
          <div className="mt-2 text-xs text-muted-foreground">Mar</div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="h-[120px] w-6 rounded bg-blue-500"></div>
          <div className="mt-2 text-xs text-muted-foreground">Apr</div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="h-[78px] w-6 rounded bg-blue-500"></div>
          <div className="mt-2 text-xs text-muted-foreground">May</div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="h-[82px] w-6 rounded bg-blue-500"></div>
          <div className="mt-2 text-xs text-muted-foreground">Jun</div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="h-[50px] w-6 rounded bg-blue-500"></div>
          <div className="mt-2 text-xs text-muted-foreground">Jul</div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="h-[30px] w-6 rounded bg-blue-500"></div>
          <div className="mt-2 text-xs text-muted-foreground">Aug</div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="h-[90px] w-6 rounded bg-blue-500"></div>
          <div className="mt-2 text-xs text-muted-foreground">Sep</div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="h-[42px] w-6 rounded bg-blue-500"></div>
          <div className="mt-2 text-xs text-muted-foreground">Oct</div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="h-[88px] w-6 rounded bg-blue-500"></div>
          <div className="mt-2 text-xs text-muted-foreground">Nov</div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="h-[35px] w-6 rounded bg-blue-500"></div>
          <div className="mt-2 text-xs text-muted-foreground">Dec</div>
        </div>
      </div>
      <div className="absolute bottom-[120px] left-8 right-0 border-b border-dashed border-red-300"></div>
    </div>
  );
}
