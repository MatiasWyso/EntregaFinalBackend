export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll(query, limit, page, sort) {
    return await this.dao.getAll(query, limit, page, sort);
  }

  async post(product) {
    return await this.dao.post(product);
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async putById(id, object) {
    return await this.dao.putById(id, object);
  }

  async deleteById(id) {
    return await this.dao.deleteById(id);
  }
}
