interface BarikoiPlace {
  id: number;
  longitude: number;
  latitude: number;
  address: string;
  address_bn: string;
  city: string;
  city_bn: string;
  area: string;
  area_bn: string;
  postCode: number;
  pType: string;
  uCode: string;
}

interface BarikoiResponse {
  places: BarikoiPlace[];
  status: number;
}

export async function getAddressSuggestions(
  query: string,
  city: string = "dhaka",
): Promise<BarikoiPlace[]> {
  const API_KEY = process.env.NEXT_PUBLIC_BARIKOI_API_KEY;

  if (!query) return [];

  try {
    const response = await fetch(
      `https://barikoi.xyz/v2/api/search/autocomplete/place?api_key=${API_KEY}&q=${encodeURIComponent(
        query,
      )}&city=${encodeURIComponent(city)}&sub_area=true&sub_district=true`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch address suggestions");
    }

    const data: BarikoiResponse = await response.json();
    return data.places;
  } catch (error) {
    console.error("Error fetching address suggestions:", error);
    return [];
  }
}
