import axios from 'axios';
import { getFromCache, putInCache } from '../infrastructure/database/DynamoDBExternalRepository';

// URL for External API
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Fetch and cache users data
export const fetchUsers = async (): Promise<string[]> => {
  const cacheKey = 'users'; // Cache key for users data
  // Check if data is cached
  const cachedData = await getFromCache(cacheKey);
  if (Array.isArray(cachedData) && cachedData.length !== 0) {
    return cachedData;
  }

  // If not cached, fetch from the external API
  try {
    const response = await axios.get(API_URL);
    const users = response.data;
    // Cache the API response
    await putInCache(cacheKey, users);
    return users;
  } catch (error) {
    console.error('Error fetching data from external API:', error);
    throw error;
  }
};