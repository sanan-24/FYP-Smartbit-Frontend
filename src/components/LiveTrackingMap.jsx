import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import socketService from '../api/socket';
import riderApi from '../api/rider';
import { Info, Navigation2, Clock, Map as MapIcon, Loader2 } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '450px',
  borderRadius: '2rem'
};

const LiveTrackingMap = ({ riderId, orderId, destinationAddress }) => {
  const { user } = useSelector((state) => state.auth);
  const { currentLocation } = useSelector((state) => state.rider);
  const userId = user?._id;
  const [riderLocation, setRiderLocation] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);

  // No longer using useJsApiLoader as we load it in index.html for persistence
  // But we should check if window.google is actually available
  const [isGoogleReady, setIsGoogleReady] = useState(!!window.google);

  useEffect(() => {
    const checkGoogle = setInterval(() => {
      if (window.google) {
        setIsGoogleReady(true);
        clearInterval(checkGoogle);
      }
    }, 500);
    return () => clearInterval(checkGoogle);
  }, []);

  // Fetch Initial Rider Location
  useEffect(() => {
    // If it's the current rider viewing their own map, use local state
    if (riderId === userId && currentLocation) {
      setRiderLocation(currentLocation);
      setLoading(false);
      return;
    }

    const fetchInitialLocation = async () => {
      if (!riderId) {
        setLoading(false);
        return;
      }
      try {
        const response = await riderApi.getLocation(riderId);
        if (response.data && response.data.lat && response.data.lng) {
          setRiderLocation({ lat: response.data.lat, lng: response.data.lng });
        }
      } catch (error) {
        console.error("Failed to fetch initial rider location:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialLocation();

    socketService.on('rider_location_changed', (data) => {
      if (data.riderId === riderId) {
        setRiderLocation({ lat: data.lat, lng: data.lng });
      }
    });

    return () => {
      socketService.off('rider_location_changed');
    };
  }, [riderId, userId, currentLocation]);

  // Calculate Route whenever rider location or destination changes
  const calculateRoute = useCallback(async (currentRiderLoc, targetMap) => {
    if (!window.google || !currentRiderLoc || !destinationAddress) return;
    
    try {
        const directionsService = new window.google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: currentRiderLoc,
            destination: destinationAddress,
            travelMode: window.google.maps.TravelMode.DRIVING,
        });

        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance.text);
        setDuration(results.routes[0].legs[0].duration.text);

        const mapInstance = targetMap || map;
        if (mapInstance) {
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(currentRiderLoc);
            bounds.extend(results.routes[0].legs[0].end_location);
            mapInstance.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
        }
    } catch (error) {
        console.error("Directions request failed:", error);
    }
  }, [destinationAddress, map]);

  useEffect(() => {
    if (riderLocation && isGoogleReady) {
      calculateRoute(riderLocation);
    }
  }, [riderLocation, isGoogleReady, calculateRoute]);

  const onLoad = useCallback(async function callback(loadedMap) {
    setMap(loadedMap);
    if (riderLocation) {
        calculateRoute(riderLocation, loadedMap);
    }
  }, [calculateRoute, riderLocation]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isGoogleReady || loading) {
    return (
        <div className="h-[450px] w-full bg-slate-50 dark:bg-secondary-900 rounded-[2rem] flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-slate-200 dark:border-secondary-800">
            <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
            <p className="text-sm font-black text-secondary-500 uppercase tracking-widest">Initializing Map...</p>
        </div>
    );
  }

  return (
    <div className="space-y-4 p-3 md:p-5 bg-white dark:bg-secondary-900 rounded-[1.5rem] md:rounded-[2.5rem]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 px-1 md:px-2">
            <div className="flex items-center">
                <div className="bg-primary-500/10 p-1.5 md:p-2 rounded-lg md:rounded-xl mr-2 md:mr-3">
                    <Navigation2 className="h-4 w-4 md:h-5 md:w-5 text-primary-500" />
                </div>
                <h3 className="font-black text-secondary-900 dark:text-white text-sm md:text-base tracking-tight">
                    Live Navigation
                </h3>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-3 w-full sm:w-auto">
                {distance && (
                    <div className="flex-1 sm:flex-none flex items-center justify-center bg-slate-50 dark:bg-secondary-800 px-2.5 md:px-3 py-1.5 rounded-lg md:rounded-xl border border-slate-100 dark:border-secondary-700 shadow-sm">
                        <MapIcon className="h-3 w-3 md:h-3.5 md:w-3.5 text-secondary-500 mr-1.5 md:mr-2" />
                        <span className="text-[9px] md:text-[11px] font-black text-secondary-700 dark:text-secondary-200 truncate">{distance}</span>
                    </div>
                )}
                {duration && (
                    <div className="flex-1 sm:flex-none flex items-center justify-center bg-green-50 dark:bg-green-900/20 px-2.5 md:px-3 py-1.5 rounded-lg md:rounded-xl border border-green-100 dark:border-green-800 shadow-sm">
                        <Clock className="h-3 w-3 md:h-3.5 md:w-3.5 text-green-500 mr-1.5 md:mr-2" />
                        <span className="text-[9px] md:text-[11px] font-black text-green-700 dark:text-green-400 truncate">{duration}</span>
                    </div>
                )}
            </div>
        </div>
        
        <div className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-slate-100 dark:border-secondary-800 shadow-inner">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={riderLocation || { lat: 31.5204, lng: 74.3587 }}
                zoom={15}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    styles: [
                        { "featureType": "poi", "stylers": [{ "visibility": "off" }] }
                    ],
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
            >
                {directionsResponse && (
                    <DirectionsRenderer 
                        directions={directionsResponse}
                        options={{
                            polylineOptions: {
                                strokeColor: '#22C55E', // Green (matching primary-500)
                                strokeWeight: 6,
                                strokeOpacity: 0.8
                            },
                            suppressMarkers: true // We will use our own custom markers
                        }}
                    />
                )}

                {/* Custom Rider Marker */}
                {riderLocation && (
                    <Marker 
                        position={riderLocation} 
                        label={{
                            text: "R",
                            color: "#FFFFFF",
                            fontSize: "12px",
                            fontWeight: "900"
                        }}
                        icon={{
                            path: window.google.maps.SymbolPath.CIRCLE,
                            fillColor: "#22C55E",
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: "#FFFFFF",
                            scale: 12, // Chota circle
                        }}
                        title="Rider"
                    />
                )}

                {/* Custom Customer Marker */}
                {directionsResponse && (
                    <Marker 
                        position={directionsResponse.routes[0].legs[0].end_location} 
                        label={{
                            text: "C",
                            color: "#FFFFFF",
                            fontSize: "12px",
                            fontWeight: "900"
                        }}
                        icon={{
                            path: window.google.maps.SymbolPath.CIRCLE,
                            fillColor: "#EF4444",
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: "#FFFFFF",
                            scale: 12, // Chota circle
                        }}
                        title="Customer"
                    />
                )}
            </GoogleMap>
        </div>
        
        {!riderLocation && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800 flex items-start space-x-3">
                <Info className="h-5 w-5 text-orange-500 mt-0.5" />
                <p className="text-xs font-medium text-orange-700 dark:text-orange-400">
                    Rider location is not available yet. Navigation will start once the rider is online.
                </p>
            </div>
        )}
    </div>
  );
};

export default React.memo(LiveTrackingMap);
