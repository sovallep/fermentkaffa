const medivision = {
    env: 'development',
};

export const httpConstants = {
    verb: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE'
    },
    test: {
        api: 'http://localhost:1337/api/',
    },
    development: {
        api: 'https://backfermentkaffa.antiguageeks.com/',
    }

};

export const syncEnvironment = {
    api: httpConstants[medivision.env].api
};

