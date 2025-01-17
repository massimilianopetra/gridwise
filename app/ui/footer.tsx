import Link from 'next/link';
import { Typography} from '@mui/material';

export default function Footer() {
    return (



        <div className="text-xs text-balck space-x-5 text-black">
            This website does not provide investment advice. Users are solely responsible for their financial decisions.{' '}
            <Link className="text-blue-700" href="/terms-of-use" passHref>

                    Read more in our Terms of Use

            </Link>


        </div>

    )
}
