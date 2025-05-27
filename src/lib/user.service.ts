import {User} from "./types.ts";
import authService from "./auth.service.ts";
import {BASE_API_URL} from "./constants.ts";
import axios from "axios";

export interface CreateCurrentUserAddressProps {
    city: string,
    country: string,
    street: string,
    houseNumber: number;
}

class UserService {
    async updateCurrentUserAddress(addressId: number, userId: number): Promise<User> {
        const jwtToken = authService.getCurrentUser();
        const url = `${BASE_API_URL}users/${userId}/address/${addressId}`;
        const response = await axios.put(url, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });

        return response.data;
    }

    async createCurrentUserAddress(createUserAddressProps: CreateCurrentUserAddressProps, userId: number): Promise<User> {
        const jwtToken = authService.getCurrentUser();
        const url = `${BASE_API_URL}users/${userId}/address`;
        const response = await axios.post(url, createUserAddressProps, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            }
        });

        return response.data;
    }
}

export default new UserService();