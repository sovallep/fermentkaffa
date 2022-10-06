const medivision = {
    env: 'test',
};

export const httpConstants = {
    verb: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE'
    },
    test: {
        api: 'http://backfermentkaffa.saraovalle.com/api/',
    },
    development: {
        api: 'http://backfermentkaffa.saraovalle.com/api/',
    }

};

export const syncEnvironment = {
    api: httpConstants[medivision.env].api
};

