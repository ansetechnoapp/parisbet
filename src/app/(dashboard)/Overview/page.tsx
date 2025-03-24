'use client';

import { useState, useEffect } from 'react';
import { Card, Metric, Text, Title, AreaChart, BarChart, DonutChart, Grid, Flex, Badge, Button, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';
import { Ticket, Users, Trophy, DollarSign, Activity, Calendar, ChevronRight } from 'lucide-react';

interface DashboardStats {
  totalTickets: number;
  activeMatches: number;
  pendingResults: number;
  totalRevenue: number;
}

// Dummy data for visualization
const chartdata = [
  {
    date: 'Jan',
    "Tickets": 2890,
    "Revenue": 12000,
  },
  {
    date: 'Feb',
    "Tickets": 1890,
    "Revenue": 10000,
  },
  {
    date: 'Mar',
    "Tickets": 3090,
    "Revenue": 14000,
  },
  {
    date: 'Apr',
    "Tickets": 2190,
    "Revenue": 11000,
  },
  {
    date: 'May',
    "Tickets": 3490,
    "Revenue": 16000,
  },
  {
    date: 'Jun',
    "Tickets": 2090,
    "Revenue": 9800,
  },
];

const ticketTypes = [
  { name: 'Poto', value: 35 },
  { name: 'Tout Chaud', value: 25 },
  { name: '3 Nape', value: 20 },
  { name: '4 Nape', value: 15 },
  { name: 'Perm', value: 5 },
];

const recentActivities = [
  { id: 1, type: 'Ticket', description: 'New ticket purchased', time: '20 min ago', status: 'pending' },
  { id: 2, type: 'Match', description: 'Match PSG vs OM updated', time: '1 hour ago', status: 'completed' },
  { id: 3, type: 'Result', description: 'Fortune 14H results published', time: '3 hours ago', status: 'completed' },
  { id: 4, type: 'Ticket', description: 'Ticket #45678 marked as won', time: '5 hours ago', status: 'won' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    activeMatches: 0,
    pendingResults: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // TODO: Fetch real stats from Supabase
    // This is mock data for now
    setStats({
      totalTickets: 156,
      activeMatches: 8,
      pendingResults: 3,
      totalRevenue: 25000,
    });
  }, []);

  return (
    <div className="max-w-full">
      <Title className="mb-4">Dashboard Overview</Title>
      
      <Grid numItemsMd={2} numItemsLg={4} className="gap-6 mb-6">
        <Card decoration="top" decorationColor="blue">
          <Flex justifyContent="between" alignItems="center">
            <Text>Total Tickets</Text>
            <Ticket size={18} className="text-blue-500" />
          </Flex>
          <Metric className="mt-1">{stats.totalTickets}</Metric>
        </Card>
        
        <Card decoration="top" decorationColor="green">
          <Flex justifyContent="between" alignItems="center">
            <Text>Active Matches</Text>
            <Trophy size={18} className="text-green-500" />
          </Flex>
          <Metric className="mt-1">{stats.activeMatches}</Metric>
        </Card>
        
        <Card decoration="top" decorationColor="yellow">
          <Flex justifyContent="between" alignItems="center">
            <Text>Pending Results</Text>
            <Activity size={18} className="text-yellow-500" />
          </Flex>
          <Metric className="mt-1">{stats.pendingResults}</Metric>
        </Card>
        
        <Card decoration="top" decorationColor="indigo">
          <Flex justifyContent="between" alignItems="center">
            <Text>Total Revenue</Text>
            <DollarSign size={18} className="text-indigo-500" />
          </Flex>
          <Metric className="mt-1">FCFA {stats.totalRevenue.toLocaleString()}</Metric>
        </Card>
      </Grid>

      <TabGroup>
        <TabList className="mb-4">
          <Tab>Overview</Tab>
          <Tab>Sales</Tab>
          <Tab>Analysis</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel>
            <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
              <Card>
                <Title>Tickets vs Revenue</Title>
                <Text>Six months performance</Text>
                <AreaChart
                  className="mt-4 h-72"
                  data={chartdata}
                  index="date"
                  categories={["Tickets", "Revenue"]}
                  colors={["blue", "indigo"]}
                  valueFormatter={(number) => `${number.toLocaleString()}`}
                />
              </Card>

              <Card>
                <Title>Ticket Types</Title>
                <Text>Distribution by type</Text>
                <DonutChart
                  className="mt-4 h-72"
                  data={ticketTypes}
                  category="value"
                  index="name"
                  colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
                  valueFormatter={(number) => `${number}%`}
                />
              </Card>

              <Card>
                <Flex justifyContent="between" alignItems="center" className="mb-4">
                  <Title>Recent Activity</Title>
                  <Button size="xs" variant="light" icon={ChevronRight} iconPosition="right">
                    View All
                  </Button>
                </Flex>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <Flex key={activity.id} alignItems="center" justifyContent="between" className="border-b pb-2">
                      <Flex alignItems="center" className="gap-2">
                        <div className={`p-2 rounded-full 
                          ${activity.type === 'Ticket' ? 'bg-blue-100' : 
                            activity.type === 'Match' ? 'bg-green-100' : 'bg-amber-100'}`}>
                          {activity.type === 'Ticket' ? 
                            <Ticket size={16} className="text-blue-500" /> : 
                            activity.type === 'Match' ? 
                              <Trophy size={16} className="text-green-500" /> : 
                              <Calendar size={16} className="text-amber-500" />}
                        </div>
                        <div>
                          <Text className="font-medium">{activity.description}</Text>
                          <Text className="text-xs text-gray-500">{activity.time}</Text>
                        </div>
                      </Flex>
                      <Badge color={
                        activity.status === 'won' ? 'green' : 
                        activity.status === 'pending' ? 'yellow' : 'blue'
                      }>
                        {activity.status}
                      </Badge>
                    </Flex>
                  ))}
                </div>
              </Card>
            </Grid>
          </TabPanel>
          
          <TabPanel>
            <Card>
              <Title>Monthly Sales</Title>
              <BarChart
                className="mt-4 h-80"
                data={chartdata}
                index="date"
                categories={["Revenue"]}
                colors={["blue"]}
                valueFormatter={(number) => `FCFA ${number.toLocaleString()}`}
              />
            </Card>
          </TabPanel>
          
          <TabPanel>
            <Card>
              <Title>Performance Analysis</Title>
              <Text>Coming soon</Text>
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
} 