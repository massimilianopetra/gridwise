import React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Button, Divider } from '@mui/material';
import Link from 'next/link';
import Image from "next/image";

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
                    OpenTradeNet Accademy
                </Typography>

                <Box maxWidth="lg" sx={{ width: '100%' }}>
                    {/* Card per Liquidity Pool */}

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

                            <Image
                                src="/images/grid1.jpg"
                                width={800}
                                height={480}
                                alt="grid1"
                                className="mx-auto mb-6 rounded-lg shadow-md"
                            />
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
