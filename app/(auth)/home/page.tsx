import React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Button, Divider } from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f7f7f7',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        {/* Titolo principale */}
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 6 }}
        >
          Welcome to OpenTradeNet
        </Typography>

        <Box maxWidth="lg" sx={{ width: '100%' }}>
          {/* Card per Liquidity Pool */}
          <Card
            sx={{
              mb: 4,
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" color="primary">
                What is a Liquidity Pool?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                A liquidity pool is a collection of funds locked in a smart contract. It is used to facilitate
                trading on decentralized exchanges (DEXs) by providing liquidity. Liquidity providers earn fees
                in exchange for their contribution to the pool.
              </Typography>
              <Typography variant="h5" component="h3" gutterBottom>
                Key Features
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Earn fees as a liquidity provider." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Facilitates decentralized trading." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="No need for traditional order books." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Supports automated market making (AMM)." />
                </ListItem>
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                How OpenTradeNet helps you with Liquidity Pools
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                OpenTradeNet provides tools and insights to simplify and optimize your experience with liquidity pools:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Detailed analytics on pool performance." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Guidance for choosing the best pools." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Automated tools for managing your investments." />
                </ListItem>
              </List>
              <Box textAlign="center" sx={{ mt: 2 }}>
                <Link href="/home/liquidity" passHref>
                  <Button variant="contained" color="primary">
                    Go To Service
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>

          {/* Card per Grid Trading */}
          <Card
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" color="primary">
                What is Grid Trading?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Grid trading is a trading strategy that involves placing a series of buy and sell orders at
                predefined intervals above and below a set price. This creates a "grid" of orders, enabling
                traders to profit from market volatility without needing to predict the market direction.
              </Typography>
              <Typography variant="h5" component="h3" gutterBottom>
                Key Features
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Profits from market fluctuations." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="No need to predict market direction." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Works well in ranging markets." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Customizable grid levels and intervals." />
                </ListItem>
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                How OpenTradeNet helps you with Grid Trading
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                OpenTradeNet empowers you to master grid trading with innovative tools and resources:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Predefined strategies for easy setup." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Real-time monitoring and alerts." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Detailed performance metrics." />
                </ListItem>
              </List>
              <Box textAlign="center" sx={{ mt: 2 }}>
                <Link href="/home/gridtrading" passHref>
                  <Button variant="contained" color="primary">
                    Go To Service
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </main>
  );
}
