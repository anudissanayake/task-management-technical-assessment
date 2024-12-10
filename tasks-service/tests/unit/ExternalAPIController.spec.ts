import axios from 'axios';
import { fetchUsers } from '../../src/services/ExternalApiService';
import { getFromCache, putInCache } from '../../src/infrastructure/database/DynamoDBExternalRepository';

// Mock dependencies
jest.mock('axios');
jest.mock('../../src/infrastructure/database/DynamoDBExternalRepository');
jest.mock('../../src/services/TaskService');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ExternalApiService', () => {
  let mockAxiosGet: jest.MockedFunction<typeof axios.get>;
  let mockGetFromCache: jest.MockedFunction<typeof getFromCache>;
  let mockPutInCache: jest.MockedFunction<typeof putInCache>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;
    mockGetFromCache = getFromCache as jest.MockedFunction<typeof getFromCache>;
    mockPutInCache = putInCache as jest.MockedFunction<typeof putInCache>;
  });

  describe('fetchUsers', () => {
    const cacheKey = 'users';
    const mockUsers = [
      {
          "id": 1,
          "name": "Leanne Graham",
          "username": "Bret",
          "email": "Sincere@april.biz",
          "address": {
              "street": "Kulas Light",
              "suite": "Apt. 556",
              "city": "Gwenborough",
              "zipcode": "92998-3874",
              "geo": {
                  "lat": "-37.3159",
                  "lng": "81.1496"
              }
          },
          "phone": "1-770-736-8031 x56442",
          "website": "hildegard.org",
          "company": {
              "name": "Romaguera-Crona",
              "catchPhrase": "Multi-layered client-server neural-net",
              "bs": "harness real-time e-markets"
          }
      }
    ];

    it('should return users from cache if present', async () => {
      mockGetFromCache.mockResolvedValue(mockUsers);
      const result = await fetchUsers();

      expect(mockGetFromCache).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual(mockUsers);
      expect(mockAxiosGet).not.toHaveBeenCalled();
      expect(mockPutInCache).not.toHaveBeenCalled();
    });

    it('should fetch users from the API if not cached and cache the result', async () => {
      mockGetFromCache.mockResolvedValue(null);
      mockAxiosGet.mockResolvedValue({ data: mockUsers });
      mockPutInCache.mockResolvedValue(undefined);
      const result = await fetchUsers();

      expect(mockGetFromCache).toHaveBeenCalledWith(cacheKey);
      expect(mockAxiosGet).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
      expect(mockPutInCache).toHaveBeenCalledWith(cacheKey, mockUsers);
      expect(result).toEqual(mockUsers);
    });

    it('should throw an error if API call fails', async () => {
      const error = new Error('API error');
      mockGetFromCache.mockResolvedValue(null);
      mockAxiosGet.mockRejectedValue(error);
      await expect(fetchUsers()).rejects.toThrow('API error');

      expect(mockGetFromCache).toHaveBeenCalledWith(cacheKey);
      expect(mockAxiosGet).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
      expect(mockPutInCache).not.toHaveBeenCalled();
    });
  });
});
