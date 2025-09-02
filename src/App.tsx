import 'leaflet/dist/leaflet.css';
import './App.css'
import './DpsStyles.css' // Import DPS styles;
import MapView from './components/MapView';
import { TelegramProvider } from './telegram/TelegramProvider';

function App() {
	return (
		<TelegramProvider>
			<div className="dps-container">
				<div className="map-view-container">
					<MapView />
				</div>
			</div>
		</TelegramProvider>
	)
}

export default App;
