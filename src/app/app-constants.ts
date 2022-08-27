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
    development: {
        hostname: 'http://192.168.1.16:8080/',
        couchdb: 'http://admin:admin@127.0.0.1:5984/',
        api: 'http://192.168.1.16:8080/medivision/api/v1.0/'
    }

};

export const syncEnvironment = {
    host: httpConstants[medivision.env].couchdb,
    webApp: httpConstants[medivision.env].hostname,
    api: httpConstants[medivision.env].api
};

export const imgPreConsulta = {

    apiEndpoint: {
        general: httpConstants[medivision.env].api + 'general/pre-consulta/img/',
        upload: httpConstants[medivision.env].api + 'general/pre-consulta/image/upload',
    },
    persistenceType: {
        SAVE: 'save',
        UPDATE: 'update'
    }
};

export const imgExpediente = {

    apiEndpoint: {
        general: httpConstants[medivision.env].api + 'general/expediente/img/',
        upload: httpConstants[medivision.env].api + 'general/expediente/image/upload',
        expediente: httpConstants[medivision.env].api + 'general/expediente/',
    },
    persistenceType: {
        SAVE: 'save',
        UPDATE: 'update'
    }

};

export const imgEntityType = {
    IMG_PRE_CONSULTA: 'img-pre-consulta',
    IMG_EXPEDIENTE: 'img-expediente'
};
