const AppDataSource = require('../lib/datasource');
const List = require('../entities/movie_list');


const listRepository = AppDataSource.getRepository(List);

const getListsByUserId = async (user_id, movie_id) => {
    return await listRepository.find({ where: { user_id, movie_id } });
};

const addList = async (listData) => {
    console.log("listData", listData);
    const list = listRepository.create(listData);
    return await listRepository.save(list);
};

const deletelist = async (listData) => {
    return await listRepository.delete(listData);
};

module.exports = {
    getListsByUserId,
    addList,
    deletelist,
};
