'use server'

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

import { cookies } from "next/headers";

export async function setToken(): Promise<string> {

    const sessionToken = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generate new token ${sessionToken}`);
    (await cookies()).set("token", sessionToken);
    return sessionToken;
}

export async function getToken(): Promise<string|undefined> {
    const  sessionToken = (await cookies()).get("token");
    console.log(`GeReaded token is ${sessionToken?.value}`);

    return sessionToken?.value;
}