import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get admin dashboard data including inventory, sales, and revenue
    Args: event with httpMethod and queryStringParameters
    Returns: HTTP response with admin data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT i.id, i.product_name, i.category, i.current_stock, i.min_stock_level, 
               s.name as supplier_name, s.phone, s.email,
               i.last_delivery_date, i.next_delivery_date, i.unit_price
        FROM inventory i
        LEFT JOIN suppliers s ON i.supplier_id = s.id
        ORDER BY i.current_stock ASC
    """)
    inventory_rows = cur.fetchall()
    
    inventory = []
    for row in inventory_rows:
        inventory.append({
            'id': row[0],
            'productName': row[1],
            'category': row[2],
            'currentStock': row[3],
            'minStockLevel': row[4],
            'supplierName': row[5],
            'supplierPhone': row[6],
            'supplierEmail': row[7],
            'lastDeliveryDate': str(row[8]) if row[8] else None,
            'nextDeliveryDate': str(row[9]) if row[9] else None,
            'unitPrice': float(row[10]) if row[10] else 0,
            'needsRestock': row[3] < row[4]
        })
    
    cur.execute("""
        SELECT store_id, product_name, SUM(quantity) as total_quantity, 
               SUM(total_amount) as total_revenue
        FROM sales
        WHERE sale_date >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY store_id, product_name
        ORDER BY total_revenue DESC
        LIMIT 10
    """)
    sales_rows = cur.fetchall()
    
    top_sales = []
    for row in sales_rows:
        top_sales.append({
            'storeId': row[0],
            'productName': row[1],
            'quantity': row[2],
            'revenue': float(row[3])
        })
    
    cur.execute("""
        SELECT store_id, store_name, SUM(revenue) as total_revenue
        FROM store_revenue
        WHERE date >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY store_id, store_name
        ORDER BY store_id
    """)
    revenue_rows = cur.fetchall()
    
    revenue = []
    for row in revenue_rows:
        revenue.append({
            'storeId': row[0],
            'storeName': row[1],
            'totalRevenue': float(row[2])
        })
    
    cur.execute("""
        SELECT date, SUM(revenue) as daily_revenue
        FROM store_revenue
        WHERE date >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY date
        ORDER BY date
    """)
    daily_rows = cur.fetchall()
    
    daily_revenue = []
    for row in daily_rows:
        daily_revenue.append({
            'date': str(row[0]),
            'revenue': float(row[1])
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'inventory': inventory,
            'topSales': top_sales,
            'storeRevenue': revenue,
            'dailyRevenue': daily_revenue
        }),
        'isBase64Encoded': False
    }
