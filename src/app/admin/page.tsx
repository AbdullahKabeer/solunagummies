'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ComposedChart, Legend,
  ScatterChart, Scatter, ZAxis
} from 'recharts';

// Colors for charts
const COLORS = ['#000000', '#333333', '#666666', '#999999', '#cccccc'];
const GREEN = '#22c55e';
const RED = '#ef4444';
const BLUE = '#3b82f6';

export default function AdminAnalyticsConsole() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [liveHistory, setLiveHistory] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now();
      
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
        { data: auditLogs }
      ] = await Promise.all([
        supabase.from('sessions').select('*').order('last_seen', { ascending: false }).limit(500),
        supabase.from('orders').select('*, order_items(*), customer:customers(*)').order('created_at', { ascending: false }).limit(100),
        supabase.from('kpi_daily_sales').select('*').order('day', { ascending: true }).limit(30), // Ascending for charts
        supabase.from('kpi_product_performance').select('*').order('gross_sales', { ascending: false }),
        supabase.from('kpi_customer_ltv').select('*').order('total_spent', { ascending: false }).limit(100),
        supabase.from('kpi_funnel_daily').select('*').order('day', { ascending: true }).limit(30),
        supabase.from('kpi_traffic_sources').select('*').order('sessions', { ascending: false }),
        supabase.from('cart_events').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('checkout_events').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('page_views').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('product_views').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('kpi_cart_abandonment').select('*').order('day', { ascending: true }).limit(30),
        supabase.from('kpi_subscription_mrr').select('*').order('month', { ascending: true }).limit(12),
        supabase.from('customer_segments').select('*').order('created_at', { ascending: false }),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100)
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
      const todaySales = (dailySales || []).find((d: any) => d.day?.startsWith(today));

      setData({
        sessions: sessions || [],
        orders: orders || [],
        dailySales: dailySales || [],
        products: products || [],
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
        liveVisitors,
        todaySales,
        perf: (performance.now() - start).toFixed(0)
      });
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Faster polling for "insane" feel
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50 text-sm text-gray-500 font-mono animate-pulse">INITIALIZING DATA STREAMS...</div>;

  const tabs = [
    { id: 'overview', label: 'Command Center' },
    { id: 'funnel', label: 'Conversion Funnel' },
    { id: 'traffic', label: 'Traffic Intelligence' },
    { id: 'orders', label: 'Order Ledger' },
    { id: 'products', label: 'Product Matrix' },
    { id: 'customers', label: 'Customer LTV' },
    { id: 'sessions', label: 'Live Sessions' },
    { id: 'events', label: 'Event Stream' }
  ];

  return (
    <div className="p-6 max-w-[1800px] mx-auto min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            SOLUNA <span className="text-gray-400 font-light">ANALYTICS</span>
          </h1>
          <div className="flex gap-4 text-xs font-mono text-gray-500 mt-2 uppercase tracking-wider">
            <span className="flex items-center gap-2 text-green-600 font-bold">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              SYSTEM ONLINE
            </span>
            <span>LATENCY: {data.perf}ms</span>
            <span>VERSION: 3.0.1-ENT</span>
          </div>
        </div>

        {/* Live Graph */}
        <div className="h-16 w-full bg-white border border-gray-200 rounded shadow-sm overflow-hidden relative">
          <div className="absolute top-1 left-2 text-[10px] font-bold text-gray-400 uppercase">Real-time Traffic</div>
          <div className="absolute top-1 right-2 text-lg font-bold text-green-600">{data.liveVisitors}</div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={liveHistory}>
              <Area type="monotone" dataKey="visitors" stroke="#22c55e" fill="#dcfce7" strokeWidth={2} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="text-right bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Today's Revenue</div>
            <div className="text-2xl font-bold text-gray-900">{fmt(data.todaySales?.net_revenue || 0)}</div>
          </div>
          <div className="text-right">
             <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Orders</div>
             <div className="text-xl font-bold text-gray-900">{data.todaySales?.total_orders || 0}</div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap
              ${activeTab === tab.id 
                ? 'border-black text-black bg-white' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-8 animate-in fade-in duration-500">
        {activeTab === 'overview' && <OverviewTab data={data} />}
        {activeTab === 'funnel' && <FunnelTab data={data} />}
        {activeTab === 'traffic' && <TrafficTab data={data} />}
        {activeTab === 'orders' && <OrdersTab data={data} />}
        {activeTab === 'products' && <ProductsTab data={data} />}
        {activeTab === 'customers' && <CustomersTab data={data} />}
        {activeTab === 'sessions' && <SessionsTab data={data} />}
        {activeTab === 'events' && <EventsTab data={data} />}
      </div>

      {/* Customer Segments */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Segments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.customerSegments.map((segment: any) => (
            <div key={segment.id} className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
              <p className="text-sm text-gray-600">{segment.description}</p>
              <p className="text-xs text-gray-400 mt-2">Created: {new Date(segment.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Audit Logs */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Audit Logs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Table</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Action</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">User</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Changes</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data.auditLogs.map((log: any) => (
                <tr key={log.id} className="border-t">
                  <td className="px-4 py-2 text-sm text-gray-700">{log.table_name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{log.action}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{log.user_id || 'N/A'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{JSON.stringify(log.changes)}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// === TAB COMPONENTS ===

function OverviewTab({ data }: any) {
  // Calculate 30d totals
  const totals = (data.dailySales || []).reduce((acc: any, d: any) => ({
    revenue: acc.revenue + (d.net_revenue || 0),
    orders: acc.orders + (d.total_orders || 0),
    newCustomers: acc.newCustomers + (d.new_customer_orders || 0)
  }), { revenue: 0, orders: 0, newCustomers: 0 });

  return (
    <>
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricBox label="30d Revenue" value={fmt(totals.revenue)} trend="+12%" />
        <MetricBox label="30d Orders" value={totals.orders} trend="+5%" />
        <MetricBox label="30d AOV" value={fmt(totals.revenue / (totals.orders || 1))} trend="-2%" />
        <MetricBox label="New Customers" value={totals.newCustomers} trend="+8%" />
        <MetricBox label="Total Customers" value={data.customers.length} />
        <MetricBox label="Products Tracked" value={data.products.length} />
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Revenue & Order Velocity (30d)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <ComposedChart data={data.dailySales}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" tickFormatter={(d) => d.split('T')[0].slice(5)} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{fontSize: 10}} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <YAxis yAxisId="right" orientation="right" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '12px'}}
                formatter={(value: any, name: any) => [name === 'net_revenue' ? fmt(value) : value, name === 'net_revenue' ? 'Revenue' : 'Orders']}
              />
              <Legend />
              <Bar yAxisId="right" dataKey="total_orders" name="Orders" fill="#e5e7eb" radius={[4, 4, 0, 0]} barSize={20} />
              <Line yAxisId="left" type="monotone" dataKey="net_revenue" name="Revenue" stroke="#000000" strokeWidth={2} dot={false} activeDot={{r: 4}} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
           <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Traffic Sources</h3>
           <ResponsiveContainer width="100%" height="85%">
             <PieChart>
               <Pie
                 data={data.traffic}
                 dataKey="sessions"
                 nameKey="source"
                 cx="50%"
                 cy="50%"
                 innerRadius={60}
                 outerRadius={80}
                 paddingAngle={5}
               >
                 {data.traffic.map((entry: any, index: number) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </Pie>
               <Tooltip contentStyle={{fontSize: '12px'}} />
               <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '10px'}} />
             </PieChart>
           </ResponsiveContainer>
        </div>
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
  // Prepare funnel data for chart
  const latestFunnel = data.funnel[data.funnel.length - 1] || {};
  const funnelChartData = [
    { name: 'Sessions', value: latestFunnel.sessions || 0, fill: '#000000' },
    { name: 'Product Views', value: latestFunnel.sessions_with_product_view || 0, fill: '#333333' },
    { name: 'Add to Cart', value: latestFunnel.sessions_with_add_to_cart || 0, fill: '#666666' },
    { name: 'Checkout', value: latestFunnel.checkouts_initiated || 0, fill: '#999999' },
    { name: 'Orders', value: latestFunnel.orders || 0, fill: '#22c55e' }
  ];

  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6 h-[400px]">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Conversion Funnel (Today)</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={funnelChartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{fontSize: '12px'}} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
              {funnelChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Section title="Conversion Funnel History (Daily)" rows={data.funnel.length}>
        <DataTable 
          headers={['Date', 'Sessions', 'PDP Views', 'PDP %', 'Add to Cart', 'ATC %', 'Checkout', 'Orders', 'Conv. Rate']}
          rows={data.funnel.slice().reverse().map((d: any) => [
            d.day?.split('T')[0],
            d.sessions,
            d.sessions_with_product_view,
            <span key="pdp" className="text-gray-500">{d.product_view_rate}%</span>,
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
  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6 h-[400px]">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Traffic Quality Analysis</h3>
        <ResponsiveContainer width="100%" height="85%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" dataKey="sessions" name="Sessions" unit="" tick={{fontSize: 10}} />
            <YAxis type="number" dataKey="conversion_rate" name="Conversion Rate" unit="%" tick={{fontSize: 10}} />
            <ZAxis type="number" dataKey="avg_session_duration" range={[50, 400]} name="Duration" unit="s" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{fontSize: '12px'}} />
            <Legend />
            <Scatter name="Traffic Sources" data={data.traffic} fill="#000000" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

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

function OrdersTab({ data }: any) {
  return (
    <Section title="Order Ledger" rows={data.orders.length}>
      <DataTable 
        headers={['Order', 'Date', 'Customer', 'Items', 'Total', 'Net Sales', 'Profit', 'Margin', 'Status', 'Source']}
        rows={data.orders.map((o: any) => {
          const cost = (o.order_items || []).reduce((acc: number, i: any) => acc + ((i.cost_per_item || 0) * (i.quantity || 0)), 0);
          const profit = (o.net_sales || 0) - cost;
          const margin = o.net_sales > 0 ? (profit / o.net_sales) * 100 : 0;
          
          return [
            <span key="id" className="font-mono text-xs">#{o.order_number || o.id?.slice(0,6)}</span>,
            new Date(o.created_at).toLocaleDateString(),
            <div key="cust" className="flex flex-col">
              <span className="font-medium text-gray-900">{o.customer?.first_name} {o.customer?.last_name}</span>
              <span className="text-xs text-gray-500">{o.customer?.email || o.shipping_details?.email || 'Guest'}</span>
            </div>,
            (o.order_items || []).length,
            fmt(o.subtotal_price),
            <span key="net" className="font-medium">{fmt(o.net_sales)}</span>,
            <span key="profit" className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>{fmt(profit)}</span>,
            `${margin.toFixed(1)}%`,
            <Badge key="status" status={o.status} />,
            <span key="src" className="text-xs bg-gray-100 px-2 py-1 rounded">{o.utm_source || 'Direct'}</span>
          ];
        })}
      />
    </Section>
  );
}

function ProductsTab({ data }: any) {
  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6 h-[400px]">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Product Profitability Matrix</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data.products.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} angle={-45} textAnchor="end" height={80} />
            <YAxis yAxisId="left" orientation="left" stroke="#000000" tick={{fontSize: 10}} />
            <YAxis yAxisId="right" orientation="right" stroke="#22c55e" tick={{fontSize: 10}} />
            <Tooltip contentStyle={{fontSize: '12px'}} />
            <Legend />
            <Bar yAxisId="left" dataKey="gross_sales" name="Gross Sales" fill="#000000" />
            <Bar yAxisId="right" dataKey="gross_profit" name="Profit" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Section title="Product Performance" rows={data.products.length}>
        <DataTable 
          headers={['Product', 'SKU', 'Orders', 'Units', 'Gross Sales', 'COGS', 'Profit', 'Margin %', '$/Unit']}
          rows={data.products.map((p: any) => [
            <span key="name" className="font-medium text-gray-900">{p.name}</span>,
            <span key="sku" className="font-mono text-xs text-gray-500">{p.sku || '-'}</span>,
            p.orders || 0,
            p.units_sold || 0,
            fmt(p.gross_sales),
            fmt(p.total_cost),
            <span key="profit" className="text-green-600 font-medium">{fmt(p.gross_profit)}</span>,
            <span key="margin" className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${p.profit_margin_pct > 50 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {(p.profit_margin_pct || 0).toFixed(1)}%
            </span>,
            fmt((p.gross_profit || 0) / (p.units_sold || 1))
          ])}
        />
      </Section>
    </>
  );
}

function CustomersTab({ data }: any) {
  return (
    <Section title="Customer LTV Segments" rows={data.customers.length}>
      <DataTable 
        headers={['Customer', 'Orders', 'Total Spent', 'AOV', 'First Order', 'Last Order', 'Lifetime', 'Source', 'Segment']}
        rows={data.customers.map((c: any) => [
          <div key="c" className="flex flex-col">
            <span className="font-medium text-gray-900">{c.first_name} {c.last_name}</span>
            <span className="text-xs text-gray-500">{c.email}</span>
          </div>,
          c.orders_count || 0,
          <span key="spent" className="font-bold text-gray-900">{fmt(c.total_spent)}</span>,
          fmt(c.aov),
          c.first_order_date ? new Date(c.first_order_date).toLocaleDateString() : '-',
          c.last_order_date ? new Date(c.last_order_date).toLocaleDateString() : '-',
          c.customer_lifetime_days ? `${Math.round(c.customer_lifetime_days)} days` : '-',
          c.acquisition_source || '-',
          c.customer_segment ? <Badge key="seg" status={c.customer_segment} /> : '-'
        ])}
      />
    </Section>
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

// === UI COMPONENTS ===

function MetricBox({ label, value }: any) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function Section({ title, rows, children }: any) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{title}</h2>
        <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">{rows} records</span>
      </div>
      <div className="overflow-x-auto">
        {children}
      </div>
    </section>
  );
}

function DataTable({ headers, rows }: any) {
  if (!rows || rows.length === 0) {
    return <div className="p-8 text-center text-gray-500 italic">No data available for this period</div>;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="bg-white border-b border-gray-200">
          {headers.map((h: string, i: number) => (
            <th key={i} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map((row: any[], i: number) => (
          <tr key={i} className="hover:bg-gray-50 transition-colors">
            {row.map((cell: any, j: number) => (
              <td key={j} className="px-6 py-3 whitespace-nowrap text-gray-700">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
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
