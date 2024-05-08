"use strict";
const usePositioning = () => {
  const isExceed = (lat1, lon1, lat2, lon2, kilometer = 3) => {
    const earthRadiusKm = 6371;
    const deg2rad = (deg) => {
      return deg * (Math.PI / 180);
    };
    const haversine = (lat12, lon12, lat22, lon22) => {
      const dLat = deg2rad(lat22 - lat12);
      const dLon = deg2rad(lon22 - lon12);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat12)) * Math.cos(deg2rad(lat22)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return earthRadiusKm * c;
    };
    const distance = haversine(lat1, lon1, lat2, lon2);
    return distance <= kilometer;
  };
  const extractCityInfo = (text) => {
    const cityPattern = /([^省]+省)?([^市]+市)/;
    const matches = text.match(cityPattern);
    if (matches && matches.length >= 3) {
      const province = matches[1] || "";
      const city = matches[2];
      return {
        province: province.trim(),
        city: city.trim()
      };
    } else {
      return { province: "未找到省份信息", city: "未找到城市信息" };
    }
  };
  return {
    isExceed,
    extractCityInfo
  };
};
exports.usePositioning = usePositioning;
