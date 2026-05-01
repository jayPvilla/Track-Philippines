const base_url = 'https://psgc.cloud/api/v2';

export const get_region = async () => {
    try{
        const response = await fetch(`${base_url}/regions`)
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
        const response = await fetch(`${base_url}/provinces`)
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
        const response = await fetch(`${base_url}/provinces/${province}/cities-municipalities`)
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
        const response = await fetch(`${base_url}/cities-municipalities/${city_municipality}/barangays`)
        const data = await response.json()
        console.log(data)
        return data;
    } catch (e){
        console.error(e);
        throw e;
    }
}