export interface GooglePlacesJsonType {
  type: string;
  features: {
    geometry: {
      coordinates: [number, number];
      type: 'Point';
    };
    properties: {
      /** Like "http://maps.google.com/?cid=7658197769037870294" */
      'Google Maps URL': string;
      Location: {
        /** Like "Carrer de la Mare de Déu dels Desemparats, 8, 08012 Barcelona, Spain" */
        Address: string;
        /** Like "Syra Coffee - Gracia" */
        'Business Name': string;
        'Country Code': "ES" | string;
        'Geo Coordinates': {
          /** Like "41.4015051" */
          Latitude: string;
          /** Like "2.1595591" */
          Longitude: string;
        };
      };
      /** Like "2022-05-31T05:13:00Z" */
      Published: string;
      /** Like "Syra Coffee - Gracia" */
      Title: string;
      /** Like "2022-05-31T05:13:00Z" */
      Updated: string;
    };
    type: 'Feature';
  }[];
}
