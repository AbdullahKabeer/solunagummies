'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminRaw() {
  const [data, setData] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // 1. Sessions (Live View Data)
      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .order('last_seen', { ascending: false })
        .limit(20);

      // 2. Analytics Events (Behavior Data)
      const { data: events } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // 3. Orders (Sales Data)
      const { data: orders } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })
        .limit(10);

      // 4. Active Carts
      const { data: carts } = await supabase
        .from('cart_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      setData({ sessions, events, orders, carts });
    };

    fetchData();
    
    // Simple auto-refresh every 5s
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [supabase]);

  if (!data) return <div>Loading raw telemetry...</div>;

  return (
    <div>
      <h1>Infrastructure & Data Collection Check</h1>
      <p>This page displays raw data directly from the database to verify collection pipelines.</p>

      <hr style={{ margin: '20px 0' }} />

      <section>
        <h2>1. Live Sessions (Visitor Tracking)</h2>
        <p>Table: <code>public.sessions</code> | Status: {data.sessions?.length > 0 ? '✅ Collecting' : '⚠️ No Data'}</p>
        <details open>
          <summary>View Raw Data ({data.sessions?.length} rows)</summary>
          <table border={1} cellPadding={5} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th>Session ID</th>
                <th>Visitor ID</th>
                <th>Last Seen</th>
                <th>Device</th>
                <th>Geo (City/Region/Country)</th>
                <th>IP</th>
                <th>Referrer / UTM</th>
              </tr>
            </thead>
            <tbody>
              {data.sessions?.map((s: any) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.visitor_id || '-'}</td>
                  <td>{new Date(s.last_seen).toLocaleTimeString()}</td>
                  <td>{s.device_type || '-'}</td>
                  <td>{s.city}, {s.region}, {s.country}</td>
                  <td>{s.ip_address}</td>
                  <td>
                    {s.referrer}<br/>
                    {s.utm_source && <div style={{background: '#fff3cd', padding: '2px'}}>Source: {s.utm_source}</div>}
                    {s.utm_medium && <div style={{background: '#e2e3e5', padding: '2px'}}>Medium: {s.utm_medium}</div>}
                    {s.utm_campaign && <div style={{background: '#d1e7dd', padding: '2px'}}>Campaign: {s.utm_campaign}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>

      <hr style={{ margin: '20px 0' }} />

      <section>
        <h2>2. Analytics Events (Behavior Stream)</h2>
        <p>Table: <code>public.analytics_events</code> | Status: {data.events?.length > 0 ? '✅ Collecting' : '⚠️ No Data'}</p>
        <details open>
          <summary>View Raw Data ({data.events?.length} rows)</summary>
          <table border={1} cellPadding={5} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th>Time</th>
                <th>Event Name</th>
                <th>Properties (JSON)</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {data.events?.map((e: any) => (
                <tr key={e.id}>
                  <td>{new Date(e.created_at).toLocaleTimeString()}</td>
                  <td><strong>{e.event_name}</strong></td>
                  <td>
                    <pre style={{ margin: 0 }}>{JSON.stringify(e.properties)}</pre>
                  </td>
                  <td>{e.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>

      <hr style={{ margin: '20px 0' }} />

      <section>
        <h2>3. Orders (Sales & Financials)</h2>
        <p>Table: <code>public.orders</code> | Status: {data.orders?.length > 0 ? '✅ Collecting' : '⚠️ No Data'}</p>
        <details open>
          <summary>View Raw Data ({data.orders?.length} rows)</summary>
          <table border={1} cellPadding={5} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th>Order ID</th>
                <th>Visitor ID</th>
                <th>Total</th>
                <th>Net Sales</th>
                <th>Subtotal</th>
                <th>Tax</th>
                <th>Shipping</th>
                <th>Items (SKU / COGS)</th>
              </tr>
            </thead>
            <tbody>
              {data.orders?.map((o: any) => (
                <tr key={o.id}>
                  <td>{o.id.slice(0, 8)}...</td>
                  <td>{o.visitor_id ? o.visitor_id.slice(0, 8) + '...' : '-'}</td>
                  <td><strong>${o.amount?.toFixed(2)}</strong></td>
                  <td style={{color: 'green'}}>${o.net_sales?.toFixed(2)}</td>
                  <td>${o.subtotal_price?.toFixed(2)}</td>
                  <td>${o.total_tax?.toFixed(2)}</td>
                  <td>${o.total_shipping?.toFixed(2)}</td>
                  <td>
                    {o.order_items?.map((i: any) => (
                      <div key={i.id} style={{borderBottom: '1px solid #eee', paddingBottom: '4px', marginBottom: '4px'}}>
                        <strong>{i.quantity}x {i.name}</strong><br/>
                        <span style={{fontSize: '10px', color: '#666'}}>
                          SKU: {i.sku || 'N/A'} | COGS: ${i.cost_per_item?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>

      <hr style={{ margin: '20px 0' }} />

      <section>
        <h2>4. Active Carts (Potential Orders)</h2>
        <p>Table: <code>public.cart_items</code> | Status: {data.carts?.length > 0 ? '✅ Collecting' : '⚠️ No Data'}</p>
        <details open>
          <summary>View Active Carts ({Object.keys(data.carts?.reduce((acc: any, item: any) => {
            const key = item.visitor_id || item.session_id || 'unknown';
            if (!acc[key]) acc[key] = [];
            return acc;
          }, {}) || {}).length} Visitors)</summary>
          
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.values(data.carts?.reduce((acc: any, item: any) => {
                const key = item.visitor_id || item.session_id || 'unknown';
                if (!acc[key]) {
                  acc[key] = {
                    visitor_id: item.visitor_id,
                    session_id: item.session_id,
                    items: [],
                    totalValue: 0,
                    totalItems: 0,
                    lastUpdated: item.created_at
                  };
                }
                acc[key].items.push(item);
                acc[key].totalValue += (item.price * item.quantity);
                acc[key].totalItems += item.quantity;
                if (new Date(item.created_at) > new Date(acc[key].lastUpdated)) {
                    acc[key].lastUpdated = item.created_at;
                }
                return acc;
              }, {}) || {}).map((group: any, i) => (
                <details key={i} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px', background: '#fff' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      Visitor: {group.visitor_id ? group.visitor_id.slice(0, 8) + '...' : 'Guest'} 
                      <span style={{ fontWeight: 'normal', color: '#666', marginLeft: '10px' }}>
                        ({group.totalItems} items)
                      </span>
                    </span>
                    <span>${group.totalValue.toFixed(2)}</span>
                  </summary>
                  
                  <div style={{ marginTop: '10px', paddingLeft: '10px', borderLeft: '2px solid #eee' }}>
                    <div style={{ fontSize: '10px', color: '#999', marginBottom: '5px' }}>
                      Session: {group.session_id}<br/>
                      Last Updated: {new Date(group.lastUpdated).toLocaleString()}
                    </div>
                    <table border={1} cellPadding={5} style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ background: '#f9f9f9' }}>
                          <th>Product</th>
                          <th>SKU</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((item: any) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.sku || '-'}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price?.toFixed(2)}</td>
                            <td>{item.subscription ? 'Sub' : 'One-time'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
            ))}
          </div>
        </details>
      </section>
    </div>
  );
}
