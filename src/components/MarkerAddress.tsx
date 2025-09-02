import { useEffect, useState } from 'react'
import { reverseGeocode, type AddressDetails } from '../api'
import type MarkerType from '../api'

interface MarkerAddressProps {
	marker: MarkerType
}

const MarkerAddress = ({ marker }: MarkerAddressProps) => {
	const [address, setAddress] = useState<AddressDetails | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		const fetchAddress = async () => {
			try {
				setLoading(true)
				const addr = await reverseGeocode(marker.latitude, marker.longitude)
				setAddress(addr)
			} catch (error) {
				console.error('Failed to fetch address:', error)
				setAddress({ formattedAddress: 'Could not fetch address' })
			} finally {
				setLoading(false)
			}
		}

		fetchAddress()
	}, [marker])

	if (loading) {
		return <div className="marker-address">Loading address...</div>
	}

	return <div className="marker-address">{address?.formattedAddress || 'Загрука...'}</div>
}

export default MarkerAddress
