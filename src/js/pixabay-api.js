import axios from 'axios';

const API_KEY = '45156920-6e611072a4f9c22ae400d324b';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchImages = async (query, page = 1, perPage = 15) => {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: perPage,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};