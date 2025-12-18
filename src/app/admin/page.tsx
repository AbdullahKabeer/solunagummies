'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import DateRangePicker, { DateRange } from '@/components/admin/DateRangePicker';
import GranularityPicker from '@/components/admin/GranularityPicker';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ComposedChart,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";


// Colors for charts (prefer CSS variables so theming stays consistent)
const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export default function AdminAnalyticsConsole() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [liveHistory, setLiveHistory] = useState<any[]>([]);
  const [granularity, setGranularity] = useState('hourly');
  const [dateRange, setDateRange] = useState<DateRange>({
    label: 'Today',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999))
  });
  const supabase = useMemo(() => createClient(), []);

  const liveChartConfig = {
    visitors: {
      label: "Visitors",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now();
      const startDateStr = dateRange.startDate.toISOString();
      const endDateStr = dateRange.endDate.toISOString();

      // Calculate previous period for comparison
      const duration = dateRange.endDate.getTime() - dateRange.startDate.getTime();
      const prevEndDate = new Date(dateRange.startDate.getTime());
      const prevStartDate = new Date(prevEndDate.getTime() - duration);
      const prevStartDateStr = prevStartDate.toISOString();
      const prevEndDateStr = prevEndDate.toISOString();
      
      const [
        { data: sessions },
        { data: orders },
        { data: dailySales },
        { data: products },
        { data: customers },
        { data: funnel },
        { data: traffic },
        { data: cartEvents },
        { data: checkoutEvents },
        { data: pageViews },
        { data: productViews },
        { data: cartAbandonment },
        { data: subscriptionMrr },
        { data: customerSegments },
        { data: auditLogs },
        // Comparison Data
        { data: prevSessions },
        { data: prevOrders },
        { data: landingPageStats },
        { data: referrerStats },
        { data: campaignStats }
      ] = await Promise.all([
        supabase.from('sessions').select('*').gte('last_seen', startDateStr).lte('last_seen', endDateStr).order('last_seen', { ascending: false }).limit(1000),
        supabase.from('orders').select('*, order_items(*), customer:customers(*)').gte('created_at', startDateStr).lte('created_at', endDateStr).order('created_at', { ascending: false }).limit(1000),
        supabase.from('kpi_daily_sales').select('*').gte('day', startDateStr).lte('day', endDateStr).order('day', { ascending: true }),
        supabase.from('kpi_product_performance').select('*').order('gross_sales', { ascending: false }),
        supabase.from('kpi_customer_ltv').select('*').order('total_spent', { ascending: false }).limit(100),
        supabase.from('kpi_funnel_daily').select('*').gte('day', startDateStr).lte('day', endDateStr).order('day', { ascending: true }),
        supabase.from('kpi_traffic_sources').select('*').order('sessions', { ascending: false }),
        supabase.from('cart_events').select('*').gte('created_at', startDateStr).lte('created_at', endDateStr).order('created_at', { ascending: false }).limit(1000),
        supabase.from('checkout_events').select('*').gte('created_at', startDateStr).lte('created_at', endDateStr).order('created_at', { ascending: false }).limit(1000),
        supabase.from('page_views').select('*').gte('created_at', startDateStr).lte('created_at', endDateStr).order('created_at', { ascending: false }).limit(1000),
        supabase.from('product_views').select('*').gte('created_at', startDateStr).lte('created_at', endDateStr).order('created_at', { ascending: false }).limit(1000),
        supabase.from('kpi_cart_abandonment').select('*').gte('day', startDateStr).lte('day', endDateStr).order('day', { ascending: true }),
        supabase.from('kpi_subscription_mrr').select('*').gte('month', startDateStr).lte('month', endDateStr).order('month', { ascending: true }),
        supabase.from('customer_segments').select('*').order('created_at', { ascending: false }),
        supabase.from('audit_logs').select('*').gte('created_at', startDateStr).lte('created_at', endDateStr).order('created_at', { ascending: false }).limit(100),
        // Comparison Queries
        supabase.from('sessions').select('*').gte('last_seen', prevStartDateStr).lte('last_seen', prevEndDateStr).limit(1000),
        supabase.from('orders').select('total_amount, created_at').gte('created_at', prevStartDateStr).lte('created_at', prevEndDateStr).limit(1000),
        supabase.from('landing_page_stats').select('*'),
        supabase.from('referrer_stats').select('*'),
        supabase.from('campaign_stats').select('*')
      ]);

      // Compute real-time metrics
      const now = new Date();
      const thirtyMinsAgo = new Date(now.getTime() - 30 * 60 * 1000);
      const liveVisitors = (sessions || []).filter((s: any) => new Date(s.last_seen) > thirtyMinsAgo).length;
      
      // Update live history graph
      setLiveHistory(prev => {
        const newPoint = { time: now.toLocaleTimeString(), visitors: liveVisitors };
        const newHistory = [...prev, newPoint];
        if (newHistory.length > 20) newHistory.shift();
        return newHistory;
      });

      // Today's stats
      const today = now.toISOString().split('T')[0];
      const todaySales = (dailySales || []).find((d: any) => d.day && String(d.day).startsWith(today));

      setData({
        sessions: sessions || [],
        orders: orders || [],
        dailySales: (dailySales || []).map((d: any) => ({
          ...d,
          net_revenue: Number(d.net_revenue),
          total_orders: Number(d.total_orders)
        })),
        products: (products || []).map((p: any) => ({
          ...p,
          gross_sales: Number(p.gross_sales),
          gross_profit: Number(p.gross_profit),
          units_sold: Number(p.units_sold),
          profit_margin_pct: Number(p.profit_margin_pct)
        })),
        customers: customers || [],
        funnel: funnel || [],
        traffic: traffic || [],
        cartEvents: cartEvents || [],
        checkoutEvents: checkoutEvents || [],
        pageViews: pageViews || [],
        productViews: productViews || [],
        cartAbandonment: cartAbandonment || [],
        subscriptionMrr: subscriptionMrr || [],
        customerSegments: customerSegments || [],
        auditLogs: auditLogs || [],
        prevSessions: prevSessions || [],
        prevOrders: prevOrders || [],
        landingPageStats: landingPageStats || [],
        referrerStats: referrerStats || [],
        campaignStats: campaignStats || [],
        liveVisitors,
        todaySales,
        perf: (performance.now() - start).toFixed(0)
      });
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Faster polling for "insane" feel
    return () => clearInterval(interval);
  }, [dateRange]);

  if (loading) {
    return (
      <div className="p-6 max-w-[1800px] mx-auto min-h-screen space-y-8 animate-in fade-in duration-500">
        {/* Header Skeleton */}
        <div className="flex justify-end mb-4 gap-2">
           <Skeleton className="h-10 w-32 bg-muted" />
           <Skeleton className="h-10 w-64 bg-muted" />
        </div>
        
        <header className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
           <div className="space-y-3">
              <Skeleton className="h-10 w-48 bg-muted" />
              <Skeleton className="h-4 w-64 bg-muted" />
           </div>
            <Skeleton className="h-20 w-full rounded bg-card border border-border" />
            <Skeleton className="h-20 w-full rounded bg-card border border-border" />
        </header>

        {/* Tabs Skeleton */}
          <div className="flex gap-4 mb-6 border-b border-border pb-2 overflow-x-auto">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-8 w-32 bg-muted rounded" />)}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <Skeleton className="h-96 w-full rounded-lg bg-card border border-border" />
           <Skeleton className="h-96 w-full rounded-lg bg-card border border-border" />
           <Skeleton className="h-64 w-full rounded-lg bg-card border border-border" />
           <Skeleton className="h-64 w-full rounded-lg bg-card border border-border" />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Command Center' },
    { id: 'products', label: 'Product Analytics' },
    { id: 'funnel', label: 'Conversion Funnel' },
    { id: 'traffic', label: 'Traffic Intelligence' },
    { id: 'landing_pages', label: 'Landing Pages' },
    { id: 'sessions', label: 'Live Sessions' },
    { id: 'events', label: 'Event Stream' }
  ];

  return (
    <div className="p-6 max-w-[1800px] mx-auto min-h-screen">
      {/* Date Picker */}
      <div className="flex justify-end mb-4 gap-2">
        <GranularityPicker value={granularity} onChange={setGranularity} />
        <DateRangePicker onRangeChange={setDateRange} />
      </div>

      {/* Header */}
      <header className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            SOLUNA <span className="text-muted-foreground font-light">ANALYTICS</span>
          </h1>
          <div className="flex gap-4 text-xs font-mono text-muted-foreground mt-2 uppercase tracking-wider">
            <span className="flex items-center gap-2 text-green-600 font-bold">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              SYSTEM ONLINE
            </span>
            <span>LATENCY: {data.perf}ms</span>
            <span>VERSION: 3.0.1-ENT</span>
          </div>
        </div>

        {/* Live Graph */}
        <Card className="pt-0">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-base">Real-time Traffic</CardTitle>
              <CardDescription>Active visitors (last 30 minutes)</CardDescription>
            </div>
            <div className="text-lg font-bold text-green-600 tabular-nums">{data.liveVisitors}</div>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer config={liveChartConfig} className="aspect-auto h-[80px] w-full">
              <AreaChart data={liveHistory}>
                <defs>
                  <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel indicator="dot" />}
                />
                <Area
                  type="natural"
                  dataKey="visitors"
                  stroke="var(--color-visitors)"
                  fill="url(#fillVisitors)"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="p-4 flex justify-between items-center">
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Today's Revenue</div>
            <div className="text-2xl font-bold">{fmt(data.todaySales?.net_revenue || 0)}</div>
          </div>
          <div className="text-right">
             <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Orders</div>
             <div className="text-xl font-bold">{data.todaySales?.total_orders || 0}</div>
          </div>
        </Card>
      </header>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-transparent border-b rounded-none">
          {tabs.map(tab => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-4 py-2"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Tab Content */}
      <div className="space-y-8 animate-in fade-in duration-500">
        {activeTab === 'overview' && <OverviewTab data={data} dateRange={dateRange} granularity={granularity} />}
        {activeTab === 'products' && <ProductsTab data={data} />}
        {activeTab === 'funnel' && <FunnelTab data={data} />}
        {activeTab === 'traffic' && <TrafficTab data={data} />}
        {activeTab === 'landing_pages' && <LandingPagesTab data={data} />}
        {activeTab === 'sessions' && <SessionsTab data={data} />}
        {activeTab === 'events' && <EventsTab data={data} />}
      </div>

      {/* Customer Segments */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Customer Segments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.customerSegments.map((segment: any) => (
            <Card key={segment.id}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{segment.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{segment.description}</p>
                <p className="text-xs text-muted-foreground mt-2">Created: {new Date(segment.created_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Audit Logs */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Audit Logs</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Changes</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.auditLogs.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell>{log.table_name}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.user_id || 'N/A'}</TableCell>
                  <TableCell className="max-w-xs truncate">{JSON.stringify(log.changes)}</TableCell>
                  <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>
    </div>
  );
}

// === TAB COMPONENTS ===

function OverviewTab({ data, dateRange, granularity }: any) {
  // Determine if we are in "intraday" mode (<= 24 hours)
  const isIntraday = useMemo(() => {
    if (granularity === 'hourly') return true;
    if (granularity === 'daily') return false;
    
    if (!dateRange?.startDate || !dateRange?.endDate) return false;
    const diff = new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime();
    return diff <= 24 * 60 * 60 * 1000;
  }, [dateRange, granularity]);

  // Prepare chart data based on mode
  const chartData = useMemo(() => {
    const currentStart = new Date(dateRange.startDate).getTime();
    const currentEnd = new Date(dateRange.endDate).getTime();
    const duration = currentEnd - currentStart;
    // Shift is exactly the duration because prevEndDate = currentStartDate
    const shift = duration;

    if (!isIntraday) {
      return (data.dailySales || []).map((day: any) => {
        const dayStart = new Date(day.day).getTime();
        // Previous period equivalent range for this day
        const prevDayStart = dayStart - shift;
        const prevDayEnd = prevDayStart + 24 * 60 * 60 * 1000; // Approx 1 day window

        const prevRevenue = (data.prevOrders || [])
          .filter((o: any) => {
            const t = new Date(o.created_at).getTime();
            return t >= prevDayStart && t < prevDayEnd;
          })
          .reduce((sum: number, o: any) => sum + (o.net_sales || o.amount || 0), 0);

        return {
          ...day,
          prev_net_revenue: prevRevenue
        };
      });
    }

    // Generate hourly buckets for intraday view
    const buckets: any[] = [];
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    
    // Round start down to nearest hour
    start.setMinutes(0, 0, 0);

    let current = new Date(start);
    // Safety break to prevent infinite loops if range is huge
    let iterations = 0;
    while (current <= end && iterations < 1000) {
      buckets.push({
        time: current.toISOString(),
        label: current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        net_revenue: 0,
        total_orders: 0,
        prev_net_revenue: 0,
        aov: 0
      });
      current.setHours(current.getHours() + 1);
      iterations++;
    }

    // Fill buckets with order data
    (data.orders || []).forEach((order: any) => {
      const orderTime = new Date(order.created_at);
      const bucket = buckets.find(b => {
        const bTime = new Date(b.time);
        return orderTime >= bTime && orderTime < new Date(bTime.getTime() + 60 * 60 * 1000);
      });

      if (bucket) {
        bucket.net_revenue += (order.net_sales || order.amount || 0);
        bucket.total_orders += 1;
      }
    });

    // Fill buckets with previous period data
    (data.prevOrders || []).forEach((order: any) => {
      const orderTime = new Date(order.created_at).getTime();
      // Find which bucket this order corresponds to in the CURRENT timeline
      // The order is from the past. We need to shift it FORWARD to find the bucket.
      // bucketTime = orderTime + shift
      const shiftedTime = orderTime + shift;
      
      const bucket = buckets.find(b => {
        const bTime = new Date(b.time).getTime();
        return shiftedTime >= bTime && shiftedTime < (bTime + 60 * 60 * 1000);
      });

      if (bucket) {
        bucket.prev_net_revenue += (order.net_sales || order.amount || 0);
      }
    });

    // Convert to cumulative totals for "Pacing" view
    let runningTotal = 0;
    let prevRunningTotal = 0;
    let runningOrders = 0;
    const now = new Date();
    
    // First pass: Calculate cumulative totals
    buckets.forEach(b => {
      const discreteRevenue = b.net_revenue;
      const discreteOrders = b.total_orders;

      runningTotal += discreteRevenue;
      prevRunningTotal += b.prev_net_revenue;
      runningOrders += discreteOrders;
      
      // Store the cumulative total but don't assign to final keys yet
      b._cumulative_revenue = runningTotal;
      b.prev_net_revenue = prevRunningTotal;
      b.aov = runningOrders > 0 ? runningTotal / runningOrders : 0;
    });

    // Second pass: Assign to solid/dotted based on time
    let transitionIndex = -1;
    
    buckets.forEach((b, i) => {
      const bucketTime = new Date(b.time);
      
      // If bucket is in the past (or current hour), it's solid
      if (bucketTime <= now) {
        b.net_revenue_solid = b._cumulative_revenue;
        b.net_revenue_dotted = null;
        transitionIndex = i;
      } else {
        b.net_revenue_solid = null;
        b.net_revenue_dotted = b._cumulative_revenue;
      }
    });

    // Connect the lines: The last solid point should also be the start of the dotted line
    if (transitionIndex !== -1 && transitionIndex < buckets.length - 1) {
      buckets[transitionIndex].net_revenue_dotted = buckets[transitionIndex].net_revenue_solid;
    }

    return buckets;
  }, [isIntraday, data.dailySales, data.orders, data.prevOrders, dateRange]);

  // Calculate totals based on the filtered data (orders for intraday, dailySales for longer)
  const totals = useMemo(() => {
    if (isIntraday) {
      return data.orders.reduce((acc: any, o: any) => ({
        revenue: acc.revenue + (o.net_sales || o.amount || 0),
        orders: acc.orders + 1,
        newCustomers: acc.newCustomers + ((!o.customer || o.customer.orders_count <= 1) ? 1 : 0),
        returningCustomers: acc.returningCustomers + (o.customer?.orders_count > 1 ? 1 : 0)
      }), { revenue: 0, orders: 0, newCustomers: 0, returningCustomers: 0 });
    } else {
      return (data.dailySales || []).reduce((acc: any, d: any) => ({
        revenue: acc.revenue + (d.net_revenue || 0),
        orders: acc.orders + (d.total_orders || 0),
        newCustomers: acc.newCustomers + (d.new_customer_orders || 0),
        returningCustomers: acc.returningCustomers + (d.returning_customer_orders || 0)
      }), { revenue: 0, orders: 0, newCustomers: 0, returningCustomers: 0 });
    }
  }, [isIntraday, data.orders, data.dailySales]);

  // Calculate funnel totals for conversion rate
  const funnelTotals = (data.funnel || []).reduce((acc: any, day: any) => ({
    sessions: acc.sessions + (day.sessions || 0),
    carts: acc.carts + (day.sessions_with_add_to_cart || 0),
    checkouts: acc.checkouts + (day.checkouts_initiated || 0),
    orders: acc.orders + (day.orders || 0),
  }), { sessions: 0, carts: 0, checkouts: 0, orders: 0 });

  const conversionRate = funnelTotals.sessions > 0 
    ? ((funnelTotals.orders / funnelTotals.sessions) * 100).toFixed(2) 
    : '0.00';

  const returningRate = totals.orders > 0 
    ? ((totals.returningCustomers / totals.orders) * 100).toFixed(2)
    : '0.00';

  const aov = totals.orders > 0 ? totals.revenue / totals.orders : 0;

  const chartConfig = {
    net_revenue_solid: {
      label: "Revenue (Solid)",
      color: "var(--chart-1)",
    },
    net_revenue_dotted: {
      label: "Revenue (Projected)",
      color: "var(--chart-1)",
    },
    prev_net_revenue: {
      label: "Previous Period",
      color: "var(--muted-foreground)",
    },
    sessions: {
      label: "Sessions",
      color: "var(--chart-2)",
    },
    first_time: {
      label: "First-time",
      color: "var(--chart-3)",
    },
    returning: {
      label: "Returning",
      color: "var(--chart-4)",
    },
    aov: {
      label: "AOV",
      color: "var(--chart-5)",
    },
    total_orders: {
      label: "Orders",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  return (
    <>
      {/* Main Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* 1. Total Sales */}
        <DashboardCard title="Total Sales" value={fmt(totals.revenue)} trend="+5%">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-net_revenue_solid)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--color-net_revenue_solid)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--grid-color)" />
              <XAxis dataKey={isIntraday ? "label" : "day"} tick={{fontSize: 10}} tickLine={false} axisLine={false} />
              <YAxis hide domain={['auto', 'auto']} />
              <ChartTooltip 
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area type="monotone" dataKey="net_revenue_solid" stroke="var(--color-net_revenue_solid)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              <Area type="monotone" dataKey="net_revenue_dotted" stroke="var(--color-net_revenue_dotted)" fillOpacity={0.3} fill="url(#colorRevenue)" strokeWidth={2} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="prev_net_revenue" stroke="var(--color-prev_net_revenue)" strokeDasharray="3 3" dot={false} strokeWidth={2} />
            </ComposedChart>
          </ChartContainer>
        </DashboardCard>

        {/* 2. Online Store Sessions */}
        <DashboardCard title="Online Store Sessions" value={funnelTotals.sessions.toLocaleString()} trend="+12%">
          <div className="absolute top-0 right-0 text-xs text-muted-foreground">
            Visitors: <span className="font-bold text-foreground">{funnelTotals.sessions.toLocaleString()}</span>
          </div>
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart data={data.funnel}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--grid-color)" />
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <ChartTooltip 
                content={<ChartTooltipContent indicator="line" />}
                cursor={{fill: 'var(--muted)'}}
              />
              <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </DashboardCard>

        {/* 3. Returning Customer Rate */}
        <DashboardCard title="Returning Customer Rate" value={`${returningRate}%`} trend="-2%">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <Pie
                data={[
                  { name: 'first_time', value: totals.newCustomers, fill: 'var(--color-first_time)' },
                  { name: 'returning', value: totals.returningCustomers, fill: 'var(--color-returning)' }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="var(--color-first_time)" />
                <Cell fill="var(--color-returning)" />
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" height={36} />
            </PieChart>
          </ChartContainer>
        </DashboardCard>

        {/* 4. Online Store Conversion Rate */}
        <DashboardCard title="Online Store Conversion Rate" value={`${conversionRate}%`} trend="+90%">
          <div className="flex flex-col justify-center h-full space-y-4 text-sm">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Added to cart</span>
              <div className="text-right">
                <div className="font-medium">{((funnelTotals.carts / funnelTotals.sessions) * 100).toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground">{funnelTotals.carts} sessions</div>
              </div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Reached checkout</span>
              <div className="text-right">
                <div className="font-medium">{((funnelTotals.checkouts / funnelTotals.sessions) * 100).toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground">{funnelTotals.checkouts} sessions</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Sessions converted</span>
              <div className="text-right">
                <div className="font-medium">{conversionRate}%</div>
                <div className="text-xs text-muted-foreground">{funnelTotals.orders} sessions</div>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* 5. Average Order Value */}
        <DashboardCard title="Average Order Value" value={fmt(aov)} trend="-5%">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--grid-color)" />
              <XAxis dataKey={isIntraday ? "label" : "day"} tick={{fontSize: 10}} tickLine={false} axisLine={false} />
              <YAxis hide domain={['auto', 'auto']} />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Line type="monotone" dataKey="aov" stroke="var(--color-aov)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </DashboardCard>

        {/* 6. Total Orders */}
        <DashboardCard title="Total Orders" value={totals.orders} trendLabel="orders">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--grid-color)" />
              <XAxis dataKey={isIntraday ? "label" : "day"} tick={{fontSize: 10}} tickLine={false} axisLine={false} />
              <YAxis hide />
              <ChartTooltip cursor={{fill: 'var(--muted)'}} content={<ChartTooltipContent indicator="line" />} />
              <Bar dataKey="total_orders" fill="var(--color-total_orders)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </DashboardCard>

      </div>

      <Section title="Daily Sales Performance (30 Days)" rows={data.dailySales.length}>
        <DataTable 
          headers={['Date', 'Orders', 'New', 'Returning', 'Gross', 'Discounts', 'Shipping', 'Tax', 'Net Revenue', 'AOV']}
          rows={data.dailySales.slice().reverse().map((d: any) => [
            d.day?.split('T')[0],
            d.total_orders,
            d.new_customer_orders || 0,
            d.returning_customer_orders || 0,
            fmt(d.gross_revenue),
            fmt(d.total_discounts),
            fmt(d.shipping_revenue),
            fmt(d.tax_collected),
            <span key="net" className="font-medium text-gray-900">{fmt(d.net_revenue)}</span>,
            fmt(d.aov)
          ])}
        />
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Section title="Cart Abandonment" rows={data.cartAbandonment.length}>
          <DataTable 
            headers={['Date', 'Created', 'Abandoned', 'Lost Value', 'Rate']}
            rows={data.cartAbandonment.slice().reverse().map((d: any) => [
              d.day?.split('T')[0],
              d.carts_created || 0,
              d.carts_abandoned || 0,
              fmt(d.abandoned_value || 0),
              <span key="rate" className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${d.abandonment_rate > 70 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {d.abandonment_rate || 0}%
              </span>
            ])}
          />
        </Section>

        <Section title="Subscription MRR" rows={data.subscriptionMrr.length}>
          <DataTable 
            headers={['Month', 'New MRR', 'Churn', 'Net Change', 'New Subs']}
            rows={data.subscriptionMrr.slice().reverse().map((d: any) => [
              d.month?.split('T')[0],
              fmt(d.new_mrr || 0),
              <span key="churn" className="text-red-600">{fmt(d.churned_mrr || 0)}</span>,
              <span key="net" className={(d.net_mrr_change || 0) >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {fmt(d.net_mrr_change || 0)}
              </span>,
              d.new_subscriptions || 0
            ])}
          />
        </Section>
      </div>
    </>
  );
}



function FunnelTab({ data }: any) {
  // Use the latest day's data for the visual funnel
  const latest = data.funnel[data.funnel.length - 1] || {};
  
  // Calculate totals for the period (30 days)
  const totals = data.funnel.reduce((acc: any, day: any) => ({
    sessions: acc.sessions + (day.sessions || 0),
    productViews: acc.productViews + (day.sessions_with_product_view || 0),
    carts: acc.carts + (day.sessions_with_add_to_cart || 0),
    checkouts: acc.checkouts + (day.checkouts_initiated || 0),
    orders: acc.orders + (day.orders || 0),
  }), { sessions: 0, productViews: 0, carts: 0, checkouts: 0, orders: 0 });

  const conversionRate = totals.sessions > 0 
    ? ((totals.orders / totals.sessions) * 100).toFixed(2) 
    : '0.00';

  const getPercentage = (val: number, total: number) => {
    if (total === 0) return '0%';
    return `${((val / total) * 100).toFixed(1)}%`;
  };

  // Funnel Step Component (Inline for now)
  const FunnelStep = ({ label, value, total, prevValue, color, isLast }: any) => {
    const percentOfTotal = getPercentage(value, totals.sessions);
    const percentOfPrev = prevValue ? getPercentage(value, prevValue) : '100%';
    
    // Calculate height relative to max (sessions) for visualization
    const heightPercent = totals.sessions > 0 ? (value / totals.sessions) * 100 : 0;

    return (
      <div className="flex-1 flex flex-col gap-4 min-w-[150px]">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</div>
        <div className="flex items-end gap-2 h-[200px] relative group bg-gray-50 rounded-lg p-2 border border-gray-100">
           {/* Bar */}
           <div 
             className={`w-full rounded-t-sm transition-all duration-500 ${color} relative`}
             style={{ height: `${Math.max(heightPercent, 5)}%` }}
           >
             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
               {value} ({percentOfTotal})
             </div>
           </div>
        </div>
        
        <div className="space-y-1 text-center">
          <div className="text-xl font-black text-gray-900">{value}</div>
          <div className="flex flex-col items-center gap-1 text-[10px] text-gray-500 font-mono uppercase">
            <span>{percentOfTotal} of Traffic</span>
            {prevValue && (
              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                ↘ {percentOfPrev} Step Conv.
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
          <div>
            <CardTitle className="text-lg font-bold uppercase tracking-tight">Conversion Funnel (30 Days)</CardTitle>
            <CardDescription>Aggregate performance across all traffic sources.</CardDescription>
          </div>
          <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full border border-green-100">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-bold text-green-700">{conversionRate}% Conversion Rate</span>
          </div>
        </CardHeader>

        <CardContent className="flex gap-4 md:gap-8 justify-between">
            <FunnelStep 
                label="Sessions" 
                value={totals.sessions} 
                total={totals.sessions}
                color="bg-gray-800"
            />
            <FunnelStep 
                label="Product Views" 
                value={totals.productViews} 
                total={totals.sessions}
                prevValue={totals.sessions}
                color="bg-gray-700"
            />
            <FunnelStep 
                label="Added to Cart" 
                value={totals.carts} 
                total={totals.sessions}
                prevValue={totals.productViews}
                color="bg-gray-600"
            />
            <FunnelStep 
                label="Checkout" 
                value={totals.checkouts} 
                total={totals.sessions}
                prevValue={totals.carts}
                color="bg-gray-400"
            />
            <FunnelStep 
                label="Purchased" 
                value={totals.orders} 
                total={totals.sessions}
                prevValue={totals.checkouts}
                color="bg-[#22c55e]" // Green for success
                isLast={true}
            />
        </CardContent>
      </Card>

      <Section title="Daily Funnel Breakdown" rows={data.funnel.length}>
        <DataTable 
          headers={['Date', 'Sessions', 'Add to Cart', 'ATC Rate', 'Checkout', 'Orders', 'Conv. Rate']}
          rows={data.funnel.slice().reverse().map((d: any) => [
            d.day?.split('T')[0],
            d.sessions,
            d.sessions_with_add_to_cart,
            <span key="atc" className="text-gray-500">{d.add_to_cart_rate}%</span>,
            d.checkouts_initiated,
            d.orders,
            <span key="cvr" className="font-bold text-green-600">{d.conversion_rate}%</span>
          ])}
        />
      </Section>
    </>
  );
}

function TrafficTab({ data }: any) {
  const chartConfig = {
    traffic: {
      label: "Traffic Sources",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <>
      <Card className="mb-6 h-[400px]">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wide">Traffic Quality Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[85%]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
              <XAxis type="number" dataKey="sessions" name="Sessions" unit="" tick={{fontSize: 10}} />
              <YAxis type="number" dataKey="conversion_rate" name="Conversion Rate" unit="%" tick={{fontSize: 10}} />
              <ZAxis type="number" dataKey="avg_session_duration" range={[50, 400]} name="Duration" unit="s" />
              <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Scatter name="traffic" data={data.traffic} fill="var(--color-traffic)" />
            </ScatterChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Section title="Traffic Sources (30 Days)" rows={data.traffic.length}>
        <DataTable 
          headers={['Source', 'Medium', 'Campaign', 'Sessions', 'Conversions', 'CVR', 'Bounce Rate', 'Avg Duration']}
          rows={data.traffic.map((d: any) => [
            <span key="src" className="font-medium text-gray-900">{d.source}</span>,
            d.medium,
            d.campaign || '-',
            d.sessions,
            d.conversions,
            <span key="cvr" className="text-green-600 font-medium">{d.conversion_rate}%</span>,
            <span key="br" className={d.bounce_rate > 60 ? 'text-red-600' : 'text-gray-600'}>{d.bounce_rate}%</span>,
            `${Math.round(d.avg_session_duration || 0)}s`
          ])}
        />
      </Section>
    </>
  );
}

function SessionsTab({ data }: any) {
  return (
    <Section title="Live Sessions Stream" rows={data.sessions.length}>
      <DataTable 
        headers={['Session ID', 'Visitor', 'Location', 'Device', 'Source', 'Landing Page', 'Pages', 'Duration', 'Last Seen']}
        rows={data.sessions.map((s: any) => [
          <span key="id" className="font-mono text-xs text-gray-500">{s.id?.slice(0,8)}</span>,
          s.visitor_id ? <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Returning</span> : <span className="text-xs text-gray-400">Guest</span>,
          `${s.city || '-'}, ${s.country || '-'}`,
          s.device_type || '-',
          <div key="src" className="flex flex-col text-xs">
            <span className="font-medium">{s.utm_source || 'Direct'}</span>
            <span className="text-gray-500">{s.utm_medium}</span>
          </div>,
          <span key="lp" className="text-xs text-gray-500 truncate max-w-[150px] block" title={s.landing_page}>{s.landing_page || s.path || '-'}</span>,
          s.pages_viewed || 0,
          s.session_duration ? `${s.session_duration}s` : '-',
          <span key="seen" className="text-xs text-gray-500">{timeAgo(s.last_seen)}</span>
        ])}
      />
    </Section>
  );
}

function EventsTab({ data }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Section title="Recent Page Views" rows={data.pageViews.length}>
        <DataTable 
          headers={['Time', 'Path', 'Title', 'Time on Page']}
          rows={data.pageViews.slice(0, 20).map((p: any) => [
            <span key="t" className="text-xs text-gray-500">{timeAgo(p.created_at)}</span>,
            <span key="p" className="font-mono text-xs">{p.path || p.url?.replace(/https?:\/\/[^\/]+/, '')}</span>,
            <span key="ti" className="truncate max-w-[150px] block">{p.title}</span>,
            p.time_on_page ? `${p.time_on_page}s` : '-'
          ])}
        />
      </Section>

      <Section title="Cart Activity" rows={data.cartEvents.length}>
        <DataTable 
          headers={['Time', 'Event', 'Product', 'Value']}
          rows={data.cartEvents.slice(0, 20).map((e: any) => [
            <span key="t" className="text-xs text-gray-500">{timeAgo(e.created_at)}</span>,
            <Badge key="type" status={e.event_type} />,
            <span key="p" className="text-sm">{e.product_name}</span>,
            fmt(e.total_value || 0)
          ])}
        />
      </Section>
    </div>
  );
}

function ProductsTab({ data }: any) {
  // Calculate Category Metrics
  const categoryMetrics = useMemo(() => {
    const metrics = {
      subscription: { revenue: 0, units: 0 },
      onetime: { revenue: 0, units: 0 }
    };

    (data.orders || []).forEach((order: any) => {
      (order.order_items || []).forEach((item: any) => {
        // Determine category based on SKU or Name
        // Subscription SKUs usually contain 'S' (e.g. FG1S1) or name has 'Subscription'
        // One-time SKUs usually contain 'O' (e.g. FG1O)
        const isSub = (item.sku && item.sku.includes('S')) || (item.name && item.name.toLowerCase().includes('subscription'));
        const target = isSub ? metrics.subscription : metrics.onetime;
        
        // Use item price * quantity for revenue contribution
        const itemRevenue = (item.price || 0) * (item.quantity || 1);
        
        target.revenue += itemRevenue;
        target.units += (item.quantity || 0);
      });
    });

    return [
      { name: 'Subscription', value: metrics.subscription.revenue, units: metrics.subscription.units, fill: 'var(--chart-1)' },
      { name: 'One-time', value: metrics.onetime.revenue, units: metrics.onetime.units, fill: 'var(--chart-2)' }
    ];
  }, [data.orders]);

  const categoryChartConfig = {
    Subscription: {
      label: "Subscription",
      color: "var(--chart-1)",
    },
    "One-time": {
      label: "One-time",
      color: "var(--chart-2)",
    },
    units: {
      label: "Units",
    },
  } satisfies ChartConfig

  return (
    <div className="space-y-8">
      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Revenue by Category" value={fmt(categoryMetrics.reduce((a, b) => a + b.value, 0))} trendLabel="Total Revenue">
          <ChartContainer config={categoryChartConfig} className="h-full w-full">
            <PieChart>
              <Pie
                data={categoryMetrics}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryMetrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" indicator="dot" />} />
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        </DashboardCard>
        
        <DashboardCard title="Units Sold by Category" value={categoryMetrics.reduce((a, b) => a + b.units, 0)} trendLabel="Total Units">
          <ChartContainer config={categoryChartConfig} className="h-full w-full">
            <BarChart data={categoryMetrics} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--grid-color)" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{fontSize: 11}} width={80} />
              <ChartTooltip cursor={{fill: 'var(--muted)'}} content={<ChartTooltipContent nameKey="name" indicator="dot" />} />
              <Bar dataKey="units" radius={[0, 4, 4, 0]} barSize={40}>
                {categoryMetrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </DashboardCard>
      </div>

      {/* Product Performance Table */}
      <Section title="Product Performance" rows={data.products.length}>
        <DataTable 
          headers={['Product Name', 'SKU', 'Units Sold', 'Gross Sales', 'Gross Profit', 'Margin']}
          rows={data.products.map((p: any) => [
            <span key="name" className="font-medium text-gray-900">{p.product_name}</span>,
            <span key="sku" className="font-mono text-xs text-gray-500">{p.sku || '-'}</span>,
            p.units_sold,
            fmt(p.gross_sales),
            fmt(p.gross_profit),
            <span key="margin" className="text-green-600 font-bold">{p.profit_margin_pct}%</span>
          ])}
        />
      </Section>
    </div>
  );
}

// === UI COMPONENTS ===

function DashboardCard({ title, value, trend, trendLabel, children }: any) {
  const isPositive = trend && (trend.startsWith('+') || !trend.startsWith('-'));
  
  return (
    <Card className="flex flex-col h-[320px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-baseline gap-3 mb-6">
          <div className="text-3xl font-bold">{value}</div>
          {trend && (
            <div className={cn("flex items-center text-sm font-medium", isPositive ? "text-green-600" : "text-red-600")}>
              {isPositive ? '↑' : '↓'} {trend.replace(/[+-]/, '')}
            </div>
          )}
        </div>
        <div className="flex-1 relative">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

function MetricBox({ label, value }: any) {
  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function Section({ title, rows, children }: any) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-6 py-4 border-b flex flex-row justify-between items-center bg-muted/50 space-y-0">
        <CardTitle className="text-sm font-bold uppercase tracking-wide">{title}</CardTitle>
        <span className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded border">{rows} records</span>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {children}
      </CardContent>
    </Card>
  );
}

function DataTable({ headers, rows }: any) {
  if (!rows || rows.length === 0) {
    return <div className="p-8 text-center text-muted-foreground italic">No data available for this period</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-background hover:bg-background">
          {headers.map((h: string, i: number) => (
            <TableHead key={i} className="px-6 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row: any[], i: number) => (
          <TableRow key={i}>
            {row.map((cell: any, j: number) => (
              <TableCell key={j} className="px-6 py-3 whitespace-nowrap">{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function Badge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    initiated: 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
    abandoned: 'bg-red-100 text-red-800',
    add: 'bg-green-50 text-green-700',
    remove: 'bg-red-50 text-red-700',
    vip: 'bg-purple-100 text-purple-800',
    new: 'bg-blue-100 text-blue-800'
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}

function LandingPagesTab({ data }: any) {
  const landingStats = data.landingPageStats || [];
  const referrerStats = data.referrerStats || [];
  const campaignStats = data.campaignStats || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Section title="Landing Page Performance" rows={landingStats.length}>
          <DataTable 
            headers={['Landing Page', 'Sessions', 'Orders', 'Conversion Rate']}
            rows={landingStats.map((s: any) => [
              s.landing_page || '(Direct/Unknown)',
              s.sessions_count,
              s.orders_count,
              `${s.conversion_rate}%`
            ])}
          />
        </Section>

        <Section title="Campaign Performance (UTM)" rows={campaignStats.length}>
          <DataTable 
            headers={['Source', 'Medium', 'Campaign', 'Sessions', 'Orders', 'Conversion Rate']}
            rows={campaignStats.map((s: any) => [
              s.utm_source || '-',
              s.utm_medium || '-',
              s.utm_campaign || '-',
              s.sessions_count,
              s.orders_count,
              `${s.conversion_rate}%`
            ])}
          />
        </Section>

        <Section title="Referrer Performance" rows={referrerStats.length}>
          <DataTable 
            headers={['Referrer', 'Sessions', 'Orders', 'Conversion Rate']}
            rows={referrerStats.map((s: any) => [
              s.referrer || '(Direct)',
              s.sessions_count,
              s.orders_count,
              `${s.conversion_rate}%`
            ])}
          />
        </Section>
      </div>
    </div>
  );
}

// === HELPERS ===

function fmt(num: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(num || 0);
}

function timeAgo(dateStr: string) {
  if (!dateStr) return '-';
  const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}


