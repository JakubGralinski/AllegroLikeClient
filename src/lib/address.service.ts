import {Address} from "./types.ts";
import authService from "./auth.service.ts";
import {BASE_API_URL} from "./constants.ts";
import axios from "axios";

class AddressService {
    async searchAddress(searchQuery: string): Promise<Address[] | null> {
        const jwtToken = authService.getCurrentUser();
        const url = `${BASE_API_URL}addresses/${searchQuery}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });

            return response.data;
        } catch (_) {
            return null;
        }
    }
}

export default new AddressService();