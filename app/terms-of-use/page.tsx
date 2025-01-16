import React from 'react';
import { Container, Card, CardContent, Typography, Box } from '@mui/material';
import Image from "next/image";
import Link from 'next/link';

const TermsOfUse = () => {
    return (

        <Container maxWidth="md" sx={{ py: 6 }}>
            <Image
                src="/images/home.jpg"
                width={600}
                height={480}
                alt="Screenshots of the dashboard project showing desktop version"
                className="mx-auto mb-6 rounded-lg shadow-md"
            />
            <Link href="/" passHref>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Welcome to <span className="text-blue-500">OpenTradeNet</span>
                </h1>
            </Link>
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                        Terms of Use
                    </Typography>

                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                            - Disclaimer on Investment Advice
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            This website does not constitute investment advice, solicitation, or recommendation to buy or sell any financial instruments. The content provided here is not intended as a substitute for professional financial advice. Investing in financial markets involves risks, and individuals should carefully consider their own financial situation and objectives before making any investment decisions. The information presented on this website is believed to be accurate and reliable, but we make no representations or warranties, express or implied, regarding the accuracy, completeness, or suitability of the information provided. Users of this website are solely responsible for their own investment decisions and should conduct their own research and due diligence before engaging in any financial transactions. We do not endorse or recommend any specific investment products or services mentioned on this website. By accessing this website, you agree that we are not liable for any loss or damage resulting from the use of the information provided herein. Past performance is not indicative of future results, and investment outcomes may vary.
                            OpenTradeNet develops tools to support trading activities but does not operate as a financial service provider.
                        </Typography>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                            - Free Service with Open-Source Licensing
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            This service is offered free of charge and is based on an open-source platform licensed under GPL. However, we reserve the right to introduce premium subscription plans. These plans may offer enhanced service guarantees, including higher limits on requests and access.
                        </Typography>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                            - No Service Level Agreement
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            The service is provided on a best-effort basis and does not include any guarantees or Service Level Agreements (SLAs).
                        </Typography>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                            - Use of Technical Cookies
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            The application uses technical cookies to store information necessary to deliver the service and support login procedures. These cookies are essential for the proper functioning of the platform.
                        </Typography>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                            - Sharing of Usage Information
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            By using this service, you authorize us to share application usage information with third parties when required for service delivery. We ensure that such sharing is limited to what is strictly necessary for this purpose.
                        </Typography>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                            - User Responsibilities
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Users are responsible for using the service in compliance with applicable laws and must not misuse or abuse the platform. Any violation may result in the suspension or termination of access.
                        </Typography>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                            - Intellectual Property
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            All content, trademarks, and materials provided through the application are protected by intellectual property rights. Unauthorized use or reproduction is strictly prohibited.
                        </Typography>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                            - Account Security
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Users are responsible for maintaining the confidentiality of their login credentials. The service is not liable for unauthorized access resulting from user negligence.
                        </Typography>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                            - Termination of Service
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            We reserve the right to suspend or terminate the service at our discretion, including but not limited to cases of terms violation or other justified reasons.
                        </Typography>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                            - Disclaimer of Liability
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            The service is provided "as is" without warranties of any kind. We disclaim liability for any direct, indirect, or consequential damages arising from the use of the service.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                            - Changes to Terms
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            We reserve the right to modify these terms at any time. Users will be notified of any significant changes, and continued use of the service implies acceptance of the updated terms.
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default TermsOfUse;
