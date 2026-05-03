import React from 'react'
import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Dropdown } from 'react-bootstrap';
import {
  get_region,
  get_province,
  get_city_municipality,
  get_barangay,
  checkWeather,
  checkForecast
}
  from '../services/api';


const GetStarted = () => {
  const [regions, set_regions] = useState([]);
  const [selected_region, set_selected_region] = useState(null);

  const [provinces, set_provinces] = useState([]);
  const [selected_province, set_selected_province] = useState(null);

  const [cities_municipalities, set_cities_municipalities] = useState([]);
  const [selected_city_municipality, set_selected_city_municipality] = useState(null);

  const [barangays, set_barangays] = useState([]);
  const [selected_barangay, set_selected_barangay] = useState(null);

  const [weather, set_weather] = useState({})
  const [forecast, set_forecast] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get_region();
        set_regions(data.data || []);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get_province();
        const filtered_province = data.data.filter(province => province.region == selected_region)
        set_provinces(filtered_province || []);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, [selected_region]);

  useEffect(() => {
    if (!selected_province) return;
    const fetchData = async () => {
      try {
        const data = await get_city_municipality(selected_province);
        set_cities_municipalities(data.data || []);
        set_barangays([]);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, [selected_province]);

  useEffect(() => {
    if (!selected_city_municipality) return;
    const fetchData = async () => {
      try {
        const data = await get_barangay(selected_city_municipality);
        set_barangays(data.data || []);

        const weatherData = await checkWeather(selected_city_municipality);
        set_weather(weatherData || {});

        const forecastData = await checkForecast(selected_city_municipality);
        set_forecast(forecastData || []);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [selected_city_municipality]);

  return (
    <Container>
      <Row>
        <Col md={2}>
          <Dropdown onSelect={(val) => set_selected_region(val)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {selected_region || "Select Region"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {regions.map(region => (
                <Dropdown.Item eventKey={region.name} key={region.name}>
                  {region.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown onSelect={(val) => set_selected_province(val)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {selected_province || "Select Province"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {provinces.map(province => (
                <Dropdown.Item eventKey={province.name} key={province.name}>
                  {province.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown onSelect={(val) => set_selected_city_municipality(val)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {selected_city_municipality || "Select City/Municipality"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {cities_municipalities.map(city => (
                <Dropdown.Item eventKey={city.name} key={city.name}>
                  {city.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown onSelect={(val) => set_selected_barangay(val)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {selected_barangay || "Select Barangay"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {barangays.map(barangay => (
                <Dropdown.Item eventKey={barangay.name} key={barangay.name}>
                  {barangay.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={7}>
          <div className="ratio ratio-16x9">
            {(selected_region && selected_province && selected_city_municipality && selected_barangay) ?
              <Container>
                <iframe
                  title="Location Map"
                  src={`https://google.com/maps?q=${selected_province},${selected_city_municipality},${selected_barangay || ""}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  style={{ border: 0, width: "100%", height: "700px" }}
                  allowFullScreen
                  loading="lazy">
                </iframe>
              </Container>
              : <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "450px" }}>
                <p className="text-muted">Please select a location to view the map.</p>
              </div>
            }

          </div>
        </Col>
        <Col md={3}>
          <Card className="p-3 mb-3 border-0 shadow-sm">
            <Row className="align-items-center">
              <Col xs={8}>
                <Card.Title className="small text-muted">Current Conditions</Card.Title>
                <h2 className="fw-bold">
                  {weather?.main ? `${Math.round(weather.main.temp)}°C` : "--"}
                </h2>
                <p className="text-capitalize mb-1">{weather?.weather?.[0]?.description}</p>
                <div className="small text-muted">
                  Humidity: {weather?.main?.humidity}% <br />
                  Wind: {weather?.wind?.speed} km/h
                </div>
              </Col>
              <Col xs={4} className="text-center">
                {weather?.weather?.[0] && (
                  <img
                    src={`/images/${weather.weather[0].main.toLowerCase()}.png`}
                    alt={weather.weather[0].main}
                    style={{ width: '100%' }}
                    onError={(e) => { e.target.src = '/images/clear.png'; }} // Fallback
                  />
                )}
              </Col>
            </Row>
          </Card>
          <Row>
            <Card className="p-3 mb-3 border-0 shadow-sm">
              <Card.Title className="small text-muted">5 Day Forecast</Card.Title>
              <Container className='d-flex flex-column'>
                {forecast.map((f, index) => (
                  <div
                    key={index}
                    className='d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom'
                  >
                    <p className="mb-0" style={{ width: '50px' }}>
                      {new Date(f.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <img
                      src={`/images/${f.weather[0].main.toLowerCase()}.png`}
                      alt={f.weather[0].main}
                      style={{ width: '25px' }}
                      onError={(e) => { e.target.src = '/images/clear.png'; }}
                    />
                    <p className="fw-bold mb-0" style={{ width: '50px', textAlign: 'right' }}>
                      {`${Math.round(f.main.temp)}°C`}
                    </p>
                    <p className='text-capitalize small text-muted'>{f.weather[0].description}</p>
                  </div>
                ))}
              </Container>
            </Card>
          </Row>
        </Col>

      </Row>
    </Container>
  )
}

export default GetStarted
