export default interface MarkerType {
	latitude: number
	longitude: number
	address?: string
}

const PROXY_PATH = '/api/proxy';

export const getMarkers = async (): Promise<MarkerType[]> => {
	const response = await fetch(`${PROXY_PATH}?path=markers/`);
	if (!response.ok) {
		throw new Error('Failed to fetch markers');
	}
	return response.json();
};

export const addMarker = async (marker: MarkerType): Promise<void> => {
	const response = await fetch(`${PROXY_PATH}?path=markers/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(marker),
	})
	if (!response.ok) {
		throw new Error('Failed to add marker')
	}
}

export interface AddressDetails {
	city?: string
	locality?: string
	street?: string
	houseNumber?: string
	formattedAddress: string
	error?: string // For error messages if geocoding fails
}

// Using OpenStreetMap's Nominatim service for reverse geocoding
export const reverseGeocode = async (
	lat: number,
	lon: number
): Promise<AddressDetails> => {
	try {
		// Format coordinates with 6 decimal places for better accuracy
		const formatCoord = (coord: number) => coord.toFixed(6)
		const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${formatCoord(
			lat
		)}&lon=${formatCoord(lon)}&accept-language=ru&addressdetails=1`

		console.log('Fetching address from:', url)

		const response = await fetch(url, {
			headers: {
				'User-Agent': 'gaitcy/1.0', // Using ASCII characters only
				Accept: 'application/json',
			},
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		console.log('Nominatim response:', data)

		if (data.error) {
			return { formattedAddress: 'Адрес не найден' }
		}

		const address = data.address || {}

		// Build address parts
		const addressParts = [
			address.house_number ? `д. ${address.house_number}` : null,
			address.road,
			address.city || address.town || address.village,
			address.county,
			address.country,
		].filter(Boolean)

		const result: AddressDetails = {
			city: address.city || address.town || address.village,
			locality: address.county || address.state,
			street: address.road,
			houseNumber: address.house_number,
			formattedAddress: address.display_name || addressParts.join(', '),
		}

		// If we have a display name but no street, try to extract it
		if (!result.street && data.display_name) {
			const parts = data.display_name.split(',')
			if (parts.length > 1) {
				result.street = parts[0].trim()
			}
		}

		console.log('Formatted address:', result)
		return result
	} catch (error) {
		console.error('Reverse geocoding error:', error)
		return {
			formattedAddress: 'Ошибка при получении адреса',
			error: error instanceof Error ? error.message : String(error),
		}
	}
}
