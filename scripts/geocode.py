"""Geocode school zone addresses using Google Geocoding API."""

import os
import googlemaps


class Geocode(object):
    """Interact with Google's geocoding API."""

    def __init__(self, address):
        """Geocode address and select relevent output data."""
        api_key = os.environ.get("GOOGLE_GEOCODING_API_KEY")
        self.client = googlemaps.Client(key=api_key)

        geocode_output = self._geocode(address)

        self.lat = self._get_lat(geocode_output)
        self.lon = self._get_lon(geocode_output)
        self.rating = self._get_rating(geocode_output)

    def _geocode(self, address):
        """Use Google's geocoding API."""
        return self.client.geocode(address)

    def _get_lat(self, geocode_output):
        """Get latitude from Google API output."""
        return geocode_output[0]['geometry']['location']['lat']

    def _get_lon(self, geocode_output):
        """Get longitude from Google API output."""
        return geocode_output[0]['geometry']['location']['lng']

    def _get_rating(self, geocode_output):
        """Get rating from Google API output."""
        return geocode_output[0]['geometry']['location_type']
