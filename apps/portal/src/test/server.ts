import { setupServer } from 'msw/node';
import { handlers } from '../features/releasePlans/api/mocks/handlers';

export const server = setupServer(...handlers);


