import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";

function Home() {
  const [city, setCity] = useState("Coimbatore");
  const [inputCity, setInputCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [otherCities, setOtherCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch weather by city
  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError("");

      // Get coordinates for the city
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`
      );
      const geoData = await geoRes.json();
      if (!geoData.results?.length) {
        setError("City not found");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name } = geoData.results[0];

      // Fetch weather + hourly forecast
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,visibility`
      );
      const data = await weatherRes.json();

      const current = data.current_weather;
      setWeather({
        name,
        temperature: current.temperature,
        windspeed: current.windspeed,
        time: new Date(current.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        condition:
          current.temperature > 30
            ? "Sunny"
            : current.temperature > 20
            ? "Partly Cloudy"
            : "Cool & Breezy",
        feelsLike: (current.temperature + 2).toFixed(1),
        humidity: data.hourly.relative_humidity_2m[0],
        visibility: data.hourly.visibility[0] / 1000, // in km
      });

      // Create a small forecast (next 4 hours)
      const hourly = data.hourly.temperature_2m.slice(0, 4).map((temp, i) => ({
        time: `${new Date(data.hourly.time[i]).getHours()}:00`,
        temp: `${temp.toFixed(1)}°C`,
        icon: temp > 30 ? "☀️" : temp > 25 ? "🌤️" : "⛅",
      }));
      setForecast(hourly);

      // Add random other cities
      const cityList = ["London", "Tokyo", "Berlin", "Sydney", "New York"];
      const cityData = await Promise.all(
        cityList.map(async (c) => {
          const geo = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${c}`
          ).then((res) => res.json());
          const coords = geo.results[0];
          const weatherInfo = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`
          ).then((res) => res.json());
          return {
            country: coords.country,
            city: c,
            weather:
              weatherInfo.current_weather.temperature > 25
                ? "Sunny"
                : "Cloudy",
          };
        })
      );
      setOtherCities(cityData);
    } catch (err) {
      setError("Failed to fetch weather data");
    }
    setLoading(false);
  };

  // 🔹 Fetch default city when app loads
  useEffect(() => {
    fetchWeather(city);
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4 w-full sm:w-2/3">
          {/* 🔍 Search Input */}
          <div className="mb-3 flex gap-2">
            <input
              type="text"
              className="w-full bg-blue-200  p-2 rounded-lg text-black outline-none"
              placeholder="Search city..."
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
            />
            <button
              onClick={() => fetchWeather(inputCity)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
            >
              Search
            </button>
          </div>

          {/* Main Weather Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 sm:p-15 p-5 md:p-10 rounded-2xl text-gray-100 h-75 flex justify-between items-center">
            {loading ? (
              <p className="text-center animate-pulse">Loading...</p>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : weather ? (
              <>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <FaLocationDot />
                    <span>{weather.name}</span>
                  </div>

                  <p className="text-sm opacity-70 mt-1">{weather.time}</p>

                  <div className="flex items-center gap-3 mt-4">
                    <h1 className="text-5xl font-bold">
                      {weather.temperature}°C
                    </h1>
                    <p className="text-sm opacity-80">
                      {weather.condition} · Feels like {weather.feelsLike}°C
                    </p>
                  </div>

                  <p className="mt-3 text-md sm:text-md opacity-80 leading-relaxed">
                    Light winds and {weather.condition.toLowerCase()}. Slight
                    chance of change in the evening. Humidity{" "}
                    {weather.humidity}% and visibility {weather.visibility} km.
                  </p>
                </div>

                <div className="flex-shrink-0 ml-6">
                  <img
                    src="/cloud.png"
                    alt="Weather"
                    className="w-20 sm:w-28 md:w-72 opacity-90"
                  />
                </div>
              </>
            ) : (
              <p>No data yet.</p>
            )}
          </div>

          {/* Forecast */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl text-gray-100">
            <div className="flex justify-center bg-white/5 rounded-full py-1 px-1 sm:px-3 w-fit mx-auto">
              <button className="px-4 py-1 text-sm rounded-full bg-white/30">
                Today
              </button>
              <button className="px-4 py-1 text-sm text-gray-300 hover:text-white transition">
                Week
              </button>
              <button className="px-4 py-1 text-sm text-gray-300 hover:text-white transition">
                Month
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1 sm:gap-3 mt-6 h-25">
              {forecast.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-md p-3 rounded-xl text-center"
                >
                  <p className="text-xs opacity-70">{item.time}</p>
                  <p className="text-xl">{item.icon}</p>
                  <p className="text-xs opacity-70">{item.temp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="pt-1 px-10 pb-1 rounded-2xl text-gray-100 w-full sm:w-1/3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold mb-3">Other Cities</h2>
            {/* <h2 className="text-sm opacity-70 hover:opacity-100 hover:underline transition">
              see less
            </h2> */}
          </div>

          {otherCities.map((c, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md p-3 rounded-xl mb-3"
            >
              <p className="text-xs opacity-60">{c.country}</p>
              <p className="text-lg font-medium">{c.city}</p>
              <p className="text-xs opacity-60">{c.weather}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Overview Section */}
      {weather && (
        <div className="p-4">
          <h1 className="text-xl font-semibold text-gray-100 mb-3">Overview</h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl text-white text-center">
              <p className="text-lg font-medium">Humidity</p>
              <div className="text-5xl my-2">💧</div>
              <p className="text-2xl font-bold">{weather.humidity}%</p>
              <p className="text-xs opacity-70 mt-1">
                Amount of moisture in the air
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl text-white text-center">
              <p className="text-lg font-medium">Wind Speed</p>
              <div className="text-5xl my-2">🌬️</div>
              <p className="text-2xl font-bold">{weather.windspeed} km/h</p>
              <p className="text-xs opacity-70 mt-1">
                Current air movement speed
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl text-white text-center">
              <p className="text-lg font-medium">Visibility</p>
              <div className="text-5xl my-2">🌫️</div>
              <p className="text-2xl font-bold">{weather.visibility} km</p>
              <p className="text-xs opacity-70 mt-1">
                Distance visible to the human eye
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
