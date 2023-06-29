export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async getAll() {
    return await this.dao.getAll();
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async post() {
    return await this.dao.post();
  }

  async postProductToCart(cid, pid) {
    return await this.dao.postProductToCart(cid, pid);
  }

  async putProducts(cid, products) {
    return await this.dao.putProducts(cid, products);
  }

  async putProductQuantity(cid, pid, quantity) {
    return await this.dao.putProductQuantity(cid, pid, quantity);
  }

  async deleteProductToCart(cid, pid) {
    return await this.dao.deleteProductToCart(cid, pid);
  }

  async deleteProducts(cid) {
    return await this.dao.deleteProducts(cid);
  }

  async deleteById(cid) {
    return await this.dao.deleteById(cid);
  }

  async purchase(cid, purchaser) {
    return await this.dao.purchase(cid, purchaser);
  }
}
