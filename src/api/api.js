import request from 'superagent';

export default {

    getLists: (searchQuery) => {
        return (
            request
                .get(`api/search/${searchQuery}`)
                .set('Content-Type', 'application/json')
                .then(res => JSON.parse(res.text) )
        );
    }
}