import request from 'supertest';
import app from '../server.js';
    
describe("Server start test", () => {
    test('Testing server.', () => {
        request('/')
            .get('/')
            .expect(200);
        });
});

describe("External API request test", () => {
    test('External API request', () => {
        request('/')
            .post('/request_database/game_info')
            .send({
                id: '51'
            })
            .expect(201);
    });
});
    
function closeServer() {
    app.close(() => {
        console.log('server closing.');
    });
}

