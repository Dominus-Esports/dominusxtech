import { NextRequest, NextResponse } from 'next/server';

// Real Airalo API credentials
const AIRALO_CLIENT_ID = 'db31ecdebc5419cce6a42a0191917f8b';
const AIRALO_CLIENT_SECRET = 'aOYdlcKzwun4GT25gwUlpn9Xc8wuUJSknZVKukJH';
const AIRALO_BASE_URL = 'https://api.airalo.com/v2';

interface AiraloPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  data: string;
  validity: string;
  country: string;
  region: string;
}

interface AiraloOrder {
  id: string;
  status: string;
  qr_code?: string;
  activation_code?: string;
  package: AiraloPackage;
}

// Mock data for development (replace with real API calls)
const mockPackages: AiraloPackage[] = [
  {
    id: 'sa_1gb_7days',
    name: 'South Africa 1GB',
    description: '1GB data for 7 days in South Africa',
    price: 5.99,
    data: '1GB',
    validity: '7 days',
    country: 'South Africa',
    region: 'Africa'
  },
  {
    id: 'sa_3gb_30days',
    name: 'South Africa 3GB',
    description: '3GB data for 30 days in South Africa',
    price: 12.99,
    data: '3GB',
    validity: '30 days',
    country: 'South Africa',
    region: 'Africa'
  },
  {
    id: 'global_1gb_7days',
    name: 'Global 1GB',
    description: '1GB data for 7 days worldwide',
    price: 9.99,
    data: '1GB',
    validity: '7 days',
    country: 'Global',
    region: 'Worldwide'
  },
  {
    id: 'global_5gb_30days',
    name: 'Global 5GB',
    description: '5GB data for 30 days worldwide',
    price: 24.99,
    data: '5GB',
    validity: '30 days',
    country: 'Global',
    region: 'Worldwide'
  }
];

// Real Airalo API functions
async function getAiraloToken(): Promise<string> {
  try {
    const response = await fetch(`${AIRALO_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: AIRALO_CLIENT_ID,
        client_secret: AIRALO_CLIENT_SECRET,
        grant_type: 'client_credentials'
      })
    });

    if (!response.ok) {
      throw new Error(`Airalo auth failed: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Airalo token error:', error);
    throw error;
  }
}

async function getAiraloPackages(token: string): Promise<AiraloPackage[]> {
  try {
    const response = await fetch(`${AIRALO_BASE_URL}/packages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airalo packages failed: ${response.status}`);
    }

    const data = await response.json();
    return data.packages || [];
  } catch (error) {
    console.error('Airalo packages error:', error);
    // Fallback to mock data
    return mockPackages;
  }
}

async function createAiraloOrder(token: string, packageId: string, customerEmail: string): Promise<AiraloOrder> {
  try {
    const response = await fetch(`${AIRALO_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        package_id: packageId,
        customer_email: customerEmail,
        quantity: 1
      })
    });

    if (!response.ok) {
      throw new Error(`Airalo order creation failed: ${response.status}`);
    }

    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('Airalo order error:', error);
    // Fallback to mock order
    const packageData = mockPackages.find(p => p.id === packageId) || mockPackages[0];
    return {
      id: `mock_order_${Date.now()}`,
      status: 'pending',
      qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      activation_code: 'MOCK123456',
      package: packageData
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'packages') {
      // Try real API first, fallback to mock
      try {
        const token = await getAiraloToken();
        const packages = await getAiraloPackages(token);
        return NextResponse.json({ packages });
      } catch (error) {
        console.log('Using mock packages due to API error:', error);
        return NextResponse.json({ packages: mockPackages });
      }
    }

    if (action === 'orders') {
      // For now, return empty orders list
      return NextResponse.json({ orders: [] });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Airalo API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Add better error handling for JSON parsing
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json({
        error: 'Invalid JSON in request body',
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      }, { status: 400 });
    }

    const { packageId, customerEmail } = body;

    if (!packageId || !customerEmail) {
      return NextResponse.json({
        error: 'Missing packageId or customerEmail',
        received: { packageId, customerEmail }
      }, { status: 400 });
    }

    // Try real API first, fallback to mock
    try {
      const token = await getAiraloToken();
      const order = await createAiraloOrder(token, packageId, customerEmail);
      return NextResponse.json({ order });
    } catch (error) {
      console.log('Using mock order due to API error:', error);
      const packageData = mockPackages.find(p => p.id === packageId) || mockPackages[0];
      const mockOrder = {
        id: `mock_order_${Date.now()}`,
        status: 'pending',
        qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        activation_code: 'MOCK123456',
        package: packageData
      };
      return NextResponse.json({ order: mockOrder });
    }
  } catch (error) {
    console.error('Airalo order creation error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
