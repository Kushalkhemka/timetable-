import CardBox from 'src/components/shared/CardBox';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Progress } from 'flowbite-react';
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
interface MarkerData {
  markerOffset: number;
  color: string;
  name: string;
  coordinates: [number, number];
}

const VisitFromUsa = () => {
  const SalesFromLocationData = [
    {
      name: 'LA',
      percentage: 28,
      color: 'primary',
    },
    {
      name: 'NY',
      percentage: 21,
      color: 'info',
    },
    {
      name: 'KA',
      percentage: 18,
      color: 'warning',
    },
    {
      name: 'AZ',
      percentage: 12,
      color: 'error',
    },
  ];

  const markers: MarkerData[] = [
    {
      markerOffset: -20,
      color: 'var(--color-info)',
      name: 'Chicago',
      coordinates: [-87.6298, 41.8781],
    },
    {
      markerOffset: -20,
      color: 'var(--color-primary)',
      name: 'Boston',
      coordinates: [-71.0589, 42.3601],
    },
    {
      markerOffset: -20,
      color: 'var(--color-warning)',
      name: 'Tulsa',
      coordinates: [-95.9928, 36.154],
    },
    {
      markerOffset: -20,
      color: 'var(--color-error)',
      name: 'Baltimore',
      coordinates: [-76.6122, 39.2904],
    },
  ];

  return (
    <>
      <CardBox >
        <div>
          <h5 className="card-title">Visit From USA</h5>
          <p className="card-subtitle">Top locations</p>
        </div>
        <div>
          <div className="lg:h-64">
            <ComposableMap projection="geoAlbersUsa">
              <Geographies geography={geoUrl}>
                {({ geographies }) => (
                  <>
                    {geographies.map((geo) => (
                      <Geography key={geo.rsmKey} geography={geo} fill="#D4DEE5" strokeWidth={4} />
                    ))}
                  </>
                )}
              </Geographies>
              {markers.map(({ name, coordinates, color }) => (
                <Marker key={name} coordinates={coordinates}>
                  <circle r={15} fill={color} stroke="#fff" strokeWidth={4} />
                </Marker>
              ))}
            </ComposableMap>
          </div>
          <div className="mt-6">
            {SalesFromLocationData.map((item, index) => (
              <div className="grid grid-cols-12 gap-[15px] items-center mb-4" key={index}>
                <div className="xl:col-span-2 lg:col-span-2 sm:col-span-2 col-span-2">
                  <h6 className="text-sm">{item.name}</h6>
                </div>
                <div className="xl:col-span-8 lg:col-span-6  col-span-7">
                  <Progress progress={item.percentage} color={`${item.color}`} size={'md'} />
                </div>
                <div className="xl:col-span-2 lg:col-span-3 sm:col-span-3  col-span-3 text-end">
                  <h6 className="text-sm opacity-80">{item.percentage}%</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default VisitFromUsa;
