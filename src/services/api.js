const psgc_base_url = 'https://psgc.cloud/api/v2';
const open_weather_base_url = 'https://api.openweathermap.org/data/2.5/weather?&units=metric&q=';
const open_weather_api_key = "5033699b238dff9213b577c575959ec0";


export const get_region = async () => {
    try{
        const response = await fetch(`${psgc_base_url}/regions`)
        const data = await response.json()
        console.log(data)
        return data;
    } catch (e){
        console.error(e);
        throw e;
    }
}


export const get_province = async () => {
    try{
        const response = await fetch(`${psgc_base_url}/provinces`)
        const data = await response.json()
        console.log(data)
        return data;
    } catch (e){
        console.error(e);
        throw e;
    }
}

export const get_city_municipality = async (province) => {
    try{
        const response = await fetch(`${psgc_base_url}/provinces/${province}/cities-municipalities`)
        const data = await response.json()
        console.log(data)
        return data;
    } catch (e){
        console.error(e);
        throw e;
    }
}

export const get_barangay = async (city_municipality) => {
    try{
        const response = await fetch(`${psgc_base_url}/cities-municipalities/${city_municipality}/barangays`)
        const data = await response.json()
        console.log(data)
        return data;
    } catch (e){
        console.error(e);
        throw e;
    }
}

export const checkWeather = async (city) => {
    try {
        const response = await fetch (open_weather_base_url + city + `&appid=${open_weather_api_key}`)
        if (response.status == 404) {
            alert("City not found!");
            return;
        }
        const data = await response.json();
        return data;
    } catch(e){
        console.error(e);
    }
}

export const checkForecast = async (city) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${open_weather_api_key}`
        );
        const data = await response.json();
        return data;
    } catch (e){
        console.error(e);
    }
}