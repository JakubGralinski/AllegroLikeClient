import {Address} from "./types.ts";
import authService from "./auth.service.ts";
import {BASE_API_URL} from "./constants.ts";
import axios from "axios";

class AddressService {
    async searchAddress(searchQuery: string): Promise<Address[]> {
        const jwtToken = authService.getCurrentUser();
        const url = `${BASE_API_URL}addresses/${searchQuery}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });

        return response.data;
    }
}

export default new AddressService();