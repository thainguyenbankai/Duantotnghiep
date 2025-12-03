import React, { useState } from "react";
import Select from "react-select";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix icon marker mặc định bị lỗi trong React
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const storeData = [
  {
    city: "Hồ Chí Minh",
    district: "Quận 5",
    name: "J-P Fashion - 38 Nguyễn Trãi",
    address: "38 Nguyễn Trãi, Phường 2, Quận 5",
    phone: "0917584112",
    hours: "8:30 - 22:30",
    lat: 10.759917,
    lng: 106.682279,
  },
  {
    city: "Hồ Chí Minh",
    district: "Quận 5",
    name: "J-P Fashion - 412 Nguyễn Trãi",
    address: "412 Nguyễn Trãi, Phường 8, Quận 5",
    phone: "0917584113",
    hours: "8:30 - 22:30",
    lat: 10.7591,
    lng: 106.681,
  },
  {
    city: "Hồ Chí Minh",
    district: "Quận 7",
    name: "J-P Fashion - 343 Nguyễn Thị Thập",
    address: "343 Nguyễn Thị Thập, Phường Tân Phong, Quận 7",
    phone: "0917584115",
    hours: "8:30 - 22:30",
    lat: 10.730833,
    lng: 106.705139,
  },
];

const StoreSystem = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedStore, setSelectedStore] = useState(storeData[0]);

  // City & district options
  const cityOptions = [...new Set(storeData.map((s) => s.city))].map((c) => ({
    label: c,
    value: c,
  }));
  const districtOptions = selectedCity
    ? [...new Set(storeData.filter((s) => s.city === selectedCity.value).map((s) => s.district))].map((d) => ({
        label: d,
        value: d,
      }))
    : [];

  // Filter store
  const filteredStores = storeData.filter(
    (s) =>
      (!selectedCity || s.city === selectedCity.value) &&
      (!selectedDistrict || s.district === selectedDistrict.value)
  );

  return (
    <div className="max-w-7xl mx-auto p-4 mt-20 mb-10">
      <h1 className="text-2xl font-bold mb-4">Hệ Thống Cửa Hàng</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Danh sách cửa hàng */}
        <div className="w-full md:w-1/2 space-y-4">
          <Select
            options={cityOptions}
            placeholder="Chọn tỉnh/thành phố"
            onChange={(val) => {
              setSelectedCity(val);
              setSelectedDistrict(null);
            }}
            value={selectedCity}
          />
          <Select
            options={districtOptions}
            placeholder="Chọn quận/huyện"
            onChange={setSelectedDistrict}
            value={selectedDistrict}
            isDisabled={!selectedCity}
          />

          <div className="border rounded-md shadow-sm p-2 h-[400px] overflow-y-auto">
            {filteredStores.map((store, idx) => (
              <div
                key={idx}
                className={`border-b last:border-0 py-2 cursor-pointer ${
                  selectedStore.name === store.name ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedStore(store)}
              >
                <h3 className="font-semibold">
                  {store.city} - {store.name}
                </h3>
                <p>{store.address}</p>
                <p>📞 {store.phone}</p>
                <p>🕒 {store.hours}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    store.address
                  )}`}
                  target="_blank"
                  className="text-blue-600 underline mt-1 inline-block"
                  rel="noreferrer"
                >
                  📍 Chỉ đường
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bản đồ Leaflet */}
        <div className="w-full md:w-1/2">
          <MapContainer
            center={[selectedStore.lat, selectedStore.lng]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: "450px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={[selectedStore.lat, selectedStore.lng]}>
              <Popup>
                <strong>{selectedStore.name}</strong>
                <br />
                {selectedStore.address}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default StoreSystem;
