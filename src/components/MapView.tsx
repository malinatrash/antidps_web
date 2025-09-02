import { Icon, LatLng } from 'leaflet'
import { useEffect, useMemo, useState } from 'react'
import {
	Button,
	Card,
	Col,
	Container,
	ListGroup,
	Modal,
	Row,
} from 'react-bootstrap'
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMap,
	useMapEvents,
} from 'react-leaflet'
import type MarkerType from '../api'
import { addMarker, getMarkers } from '../api'
import MarkerAddress from './MarkerAddress'

const userIcon = new Icon({
	iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
})

const backendMarkerIcon = new Icon({
	iconUrl:
		'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
})

function LocationMarker({ setUserPosition }: { setUserPosition: (position: LatLng) => void }) {
	const map = useMap()

	useEffect(() => {
		map.locate().on('locationfound', function (e: any) {
			setUserPosition(e.latlng)
			map.flyTo(e.latlng, 13)
		})
	}, [map, setUserPosition])

	return null
}

function MapClickHandler({ onMapClick }: { onMapClick: (latlng: LatLng) => void }) {
	useMapEvents({
		click(e: any) {
			onMapClick(e.latlng)
		},
	})
	return null
}

const MapView = () => {
	const [userPosition, setUserPosition] = useState<LatLng | null>(null)
	const [markers, setMarkers] = useState<MarkerType[]>([])
	const [showModal, setShowModal] = useState(false)
	const [newMarkerCoords, setNewMarkerCoords] = useState<LatLng | null>(null)

	const fetchMarkers = async () => {
		try {
			const fetchedMarkers = await getMarkers()
			setMarkers(fetchedMarkers)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetchMarkers()
		const interval = setInterval(fetchMarkers, 30000)
		return () => clearInterval(interval)
	}, [])

	const handleAddUserMarker = async () => {
		if (userPosition) {
			await addMarker({
				latitude: userPosition.lat,
				longitude: userPosition.lng,
			})
			fetchMarkers()
		}
	}

	const handleMapClick = (latlng: LatLng) => {
		setNewMarkerCoords(latlng)
		setShowModal(true)
	}

	const confirmAddMarker = async () => {
		if (newMarkerCoords) {
			await addMarker({
				latitude: newMarkerCoords.lat,
				longitude: newMarkerCoords.lng,
			})
			fetchMarkers()
		}
		setShowModal(false)
		setNewMarkerCoords(null)
	}

	const memoizedMarkers = useMemo(
		() =>
			markers.map((marker, idx) => (
				<Marker
					key={idx}
					position={[marker.latitude, marker.longitude]}
					icon={backendMarkerIcon}
				>
					<Popup>
						<div>
							<p>
								<MarkerAddress marker={marker} />
							</p>
							<img
								src={`https://picsum.photos/200/100?random=${idx}`}
								alt='Location'
								style={{ width: '100%' }}
							/>
						</div>
					</Popup>
				</Marker>
			)),
		[markers]
	)

	return (
		<Container fluid>
			<Row>
				<Col md={9} className='map-column'>
					<MapContainer
						center={[51.505, -0.09]}
						zoom={13}
						style={{ height: '100%', width: '100%' }}
					>
						<TileLayer
							url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						/>
						<LocationMarker setUserPosition={setUserPosition} />
						{userPosition && (
							<Marker position={userPosition} icon={userIcon}>
								<Popup>You are here</Popup>
							</Marker>
						)}
						{memoizedMarkers}
						<MapClickHandler onMapClick={handleMapClick} />
					</MapContainer>
				</Col>
				<Col md={3} className='pt-3 controls-column'>
					<Card>
						<Card.Body>
							<Card.Title>Управление</Card.Title>
							<Button
								onClick={handleAddUserMarker}
								disabled={!userPosition}
								className='w-100'
							>
								Добавить патруль
							</Button>
						</Card.Body>
					</Card>
					<Card className='mt-3'>
						<Card.Body>
							<Card.Title>Патрули</Card.Title>
							<ListGroup variant='flush' className='marker-list'>
								{markers.map((marker, idx) => (
									<ListGroup.Item key={idx}>
										<MarkerAddress marker={marker} />
									</ListGroup.Item>
								))}
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Marker</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Add a marker at Lat: {newMarkerCoords?.lat.toFixed(4)}, Lng:{' '}
					{newMarkerCoords?.lng.toFixed(4)}?
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={() => setShowModal(false)}>
						Cancel
					</Button>
					<Button variant='primary' onClick={confirmAddMarker}>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	)
}

export default MapView
