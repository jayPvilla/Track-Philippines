import React from 'react'
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import { 
  get_region, 
  get_province, 
  get_city_municipality,
  get_barangay,
  checkWeather,
  checkForecast }
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
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, [selected_city_municipality]);

  return (
    <Container>
      <Row>
        <Col>
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
              {selected_barangay|| "Select Barangay"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {barangays.map(barangay => (
                <Dropdown.Item eventKey={barangay.name}  key={barangay.name}>
                  {barangay.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col>
          <div className="ratio ratio-16x9">
          {(selected_region && selected_province && selected_city_municipality && selected_barangay)? 
          <Container>
            <iframe
              title="Location Map"
              src={`https://google.com/maps?q=${selected_province},${selected_city_municipality},${selected_barangay || ""}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              style={{ border: 0, width: "100%", height: "450px" }}
              allowFullScreen
              loading="lazy">
            </iframe>
          </Container>
             : <></>
          }
            
          </div>
        </Col>
      </Row>
      <Row>

      </Row>
    </Container>
  )
}

export default GetStarted
