import {User} from "./types.ts";
import authService from "./auth.service.ts";
import {BASE_API_URL} from "./constants.ts";
import axios from "axios";


class UserService {
    async updateCurrentUserAddress(addressId: number, userId: number): Promise<User> {
        const jwtToken = authService.getCurrentUser();
        const url = `${BASE_API_URL}/users/${userId}/address/${addressId}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });

        return response.data;
    }
}

export default new UserService();