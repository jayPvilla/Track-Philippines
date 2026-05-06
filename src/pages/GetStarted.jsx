import React from 'react'
import { useState, useEffect } from 'react';
import { Stack, Container, Card, Row, Col, Dropdown } from 'react-bootstrap';
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
  const [five_day_forecast, set_five_day_forecast] = useState([])
  const [one_day_forecast, set_one_day_forecast] = useState([])

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

        const five_day_forecastData = await checkForecast(selected_city_municipality, 'five_day_data');
        set_five_day_forecast(five_day_forecastData || []);

        const one_day_forecastData = await checkForecast(selected_city_municipality, 'one_day_data');
        set_one_day_forecast(one_day_forecastData || []);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [selected_city_municipality]);

  return (
    <Container fluid className="py-4 px-lg-5 bg-light bg-transparent">
      <Row className="g-4">
        {/* Left Column: Navigation & Filters */}
        <Col lg={2}>
          <Card className="border-0 shadow-sm p-3 h-75">
            <h6 className="fw-bold mb-3 text-uppercase text-muted small">Location Filter</h6>
            <Stack gap={3}>
              {[
                { label: selected_region || "Select Region", data: regions, setter: set_selected_region },
                { label: selected_province || "Select Province", data: provinces, setter: set_selected_province },
                { label: selected_city_municipality || "Select City", data: cities_municipalities, setter: set_selected_city_municipality },
                { label: selected_barangay || "Select Barangay", data: barangays, setter: set_selected_barangay }
              ].map((drop, idx) => (
                <Dropdown onSelect={drop.setter} key={idx} className="w-100">
                  <Dropdown.Toggle variant="outline-success" className="w-100 text-start d-flex justify-content-between align-items-center">
                    <span className="text-truncate" style={{ maxWidth: '85%' }}>{drop.label}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 shadow-sm border-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {drop.data.map(item => (
                      <Dropdown.Item eventKey={item.name} key={item.name}>{item.name}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              ))}
              {weather.coord && (
                <Card className='border-0 align-items-start pt-4'>
                  <h6 className="fw-bold mb-3 text-uppercase text-muted small">Coordinates</h6>
                  <span className="text-muted small text-end text-capitalize flex-grow-1">Longitude: {weather?.coord?.lon}</span>
                  <span className="text-muted small text-end text-capitalize flex-grow-1">Latitude: {weather?.coord?.lat}</span>
                </Card>
              )
              }

            </Stack>
          </Card>
        </Col>

        {/* Middle Column: Interactive Map */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100 p-4 overflow-hidden" style={{ minHeight: '600px' }}>
            <Card.Title>
              <p className="text-muted small fw-bold text-uppercase mb-1">Interactive Map</p>
            </Card.Title>
            <Card.Body>
              {selected_city_municipality ? (
                // <iframe
                //   title="Location Map"
                //   src={`https://google.com/maps?q=${selected_province || ""},${selected_city_municipality || ""},${selected_barangay || ""}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                //   style={{ border: 0, width: "100%", height: "100%" }}
                //   allowFullScreen
                //   loading="lazy"
                // />
                <iframe
                  title="Location Map"s
                  src={`https://embed.ventusky.com/?p=${weather?.coord?.lat};${weather?.coord?.lon};10&l=temperature-2m`}
                  style={{ border: 0, width: "100%", height: "100%" }}
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted bg-white">
                  <i className="bi bi-geo-alt fs-1 mb-2"></i>
                  <p>Please select a location to view the map.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Weather & Insights */}
        <Col lg={4}>
          <Stack gap={4}>
            {/* Current Weather Card */}
            <Card className="p-4 border-0 shadow-sm bg-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small fw-bold text-uppercase mb-1">Current Weather</p>
                  <h1 className="display-5 fw-bold mb-0">
                    {weather?.main ? `${Math.round(weather.main.temp)}°C` : "--"}
                  </h1>
                  <p className="text-capitalize text-success fw-semibold mb-0">{weather?.weather?.[0]?.description || "No data"}</p>
                </div>
                {weather?.weather?.[0] && (
                  <img
                    src={`/images/${weather.weather[0].main.toLowerCase()}.png`}
                    alt="icon"
                    style={{ width: '80px' }}
                    onError={(e) => e.target.src = '/images/clear.png'}
                  />
                )}
              </div>
              <hr className="my-3 opacity-10" />
              <Row className="text-center g-0">
                <Col>
                  <Row className="text-center g-3 align-items-center">
                    <Col className='d-flex justify-content-end'>
                      <i className="bi bi-moisture display-6"></i>
                    </Col>
                    <Col className='d-flex justify-content-start'>
                      <small className="text-muted d-block">Humidity</small>
                      <span className="fw-bold">{weather?.main?.humidity || 0}%</span>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row className="text-center g-3 align-items-center">
                    <Col className='d-flex justify-content-end'>
                      <i className="bi bi-wind display-6"></i>
                    </Col>
                    <Col>
                      <small className="text-muted d-block">Wind Speed</small>
                      <span className="fw-bold">{weather?.wind?.speed || 0} km/h</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>

            {/* Forecast Card */}
            <Card className="p-4 border-0 shadow-sm bg-white">
              <h6 className="fw-bold mb-4 text-uppercase text-muted small">5-Day Forecast</h6>
              <Stack gap={2}>
                {five_day_forecast.map((f, index) => (
                  <div key={index} className="d-flex align-items-center py-2 border-bottom border-light last-child-border-0">
                    <span className="text-muted" style={{ width: '60px' }}>
                      {new Date(f.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <img
                      src={`/images/${f.weather[0].main.toLowerCase()}.png`}
                      alt="icon"
                      className="mx-auto"
                      style={{ width: '32px' }}
                      onError={(e) => e.target.src = '/images/clear.png'}
                    />
                    <span className="fw-bold text-end" style={{ width: '60px' }}>{Math.round(f.main.temp)}°C</span>
                    <span className="text-muted small text-end text-capitalize flex-grow-1">{f.weather[0].description}</span>
                  </div>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Col>
      </Row>
      <Row className='mt-4'>
        <Card className="p-4 border-0 shadow-sm bg-white">
          <Col>
            <h6 className="fw-bold mb-4  text-uppercase text-muted small">24 HOURS FORECAST</h6>
          </Col>
          <Row>
            {one_day_forecast.map((f, index) => (
              <Col>
                <Card className='border-success'>
                  <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span className="text-muted text-center fw-bold">
                      {new Date(f.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-muted text-center small" style={{ width: '80px' }}>
                      {new Date(f.dt_txt).toLocaleTimeString()}
                    </span>
                    <img
                      src={`/images/${f.weather[0].main.toLowerCase()}.png`}
                      alt="icon"
                      className="mx-auto"
                      style={{ width: '50px' }}
                      onError={(e) => e.target.src = '/images/clear.png'}
                    />
                    <span className="fw-bold text-center" style={{ width: '60px' }}>{Math.round(f.main.temp)}°C</span>
                    <span className="text-muted small text-center text-capitalize flex-grow-1">{f.weather[0].description}</span>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Row>
    </Container>
  );
}

export default GetStarted
