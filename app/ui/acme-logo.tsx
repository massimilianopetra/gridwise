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

import Grid4x4Icon from '@mui/icons-material/Grid4x4';

export default function AcmeLogo() {


  return (
    <div>
      <div className={`flex flex-row items-center leading-none text-white space-x-7`}>
        <Grid4x4Icon className="h-10 w-10 rotate-[15deg]" />
        <p className="text-xl space-x-11 text-white">OpenTradeNet </p>
      </div>
    </div>
  );
}