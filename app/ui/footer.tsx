/*
 * This file is part of the project by Massimiliano Petra.
 *
 * Copyright (C) 2025 Massimiliano Petra
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

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
