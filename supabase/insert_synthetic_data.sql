-- Insert synthetic data into the `sessions` table
insert into public.sessions (id, last_seen, user_agent, country)
select gen_random_uuid(), now() - (interval '1 minute' * generate_series(1, 50)), 'Synthetic Browser', 'Synthetic Country';

-- Insert synthetic data into the `orders` table
insert into public.orders (id, created_at, total_amount, customer_id)
select gen_random_uuid(), now() - (interval '1 hour' * generate_series(1, 20)), random() * 100 + 20, gen_random_uuid();

-- Insert synthetic data into the `order_items` table
insert into public.order_items (id, order_id, product_name, category, price, quantity)
select gen_random_uuid(), (select id from public.orders order by random() limit 1), 
       'Product ' || generate_series(1, 3), 'Synthetic Category', random() * 50 + 10, floor(random() * 5) + 1
from generate_series(1, 60);

-- Insert synthetic data into the `customers` table
insert into public.customers (id, first_name, clv, churn_risk_score, acquisition_channel)
select gen_random_uuid(), 'Customer ' || generate_series(1, 20), random() * 1000, random() * 100, 'Synthetic Channel';

-- Insert synthetic data into the `customer_segments` table
insert into public.customer_segments (id, name, description, created_at)
select gen_random_uuid(), 'Segment ' || generate_series(1, 5), 'Description for Segment ' || generate_series(1, 5), now() - (interval '1 day' * generate_series(1, 5));

-- Insert synthetic data into the `audit_logs` table
insert into public.audit_logs (id, table_name, action, user_id, changes, created_at)
select gen_random_uuid(), 'Synthetic Table', 'INSERT', 'User ' || generate_series(1, 10), jsonb_build_object('field', 'Value ' || generate_series(1, 10)), now() - (interval '2 hours' * generate_series(1, 10));