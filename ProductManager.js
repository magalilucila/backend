// ProductManager.js
const fs = require('fs').promises;

class ProductManager {
    #products;
    #lastId = 1;
    path;

    constructor(path) {
        this.#products = [];
        this.path = path;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.#products = JSON.parse(data);
            return this.#products;
        } catch (error) {
            throw new Error('Error al leer los productos del archivo.');
        }
    }

    #getNewId() {
        const usedIds = new Set(this.#products.map(product => product.id));
        let newId = this.#lastId;
        while (usedIds.has(newId)) {
            newId++;
        }
        this.#lastId = newId + 1;
        return newId;
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            throw new Error('Todos los campos obligatorios deben estar presentes para agregar un nuevo producto.');
        }

        if (this.#products.some(existingProduct => existingProduct.code === product.code)) {
            throw new Error('El código del producto ya existe. Debe ser único.');
        }
        product.id = this.#getNewId();
        this.#products.push(product);
        try {
            await fs.writeFile(this.path, JSON.stringify(this.#products), 'utf8');
        } catch (error) {
            throw new Error('Error al escribir en el archivo de productos.');
        }
    }
    
    getProductById(id) {
        const product = this.#products.find(p => p.id === id);

        if (!product) {
            console.error(`Producto no encontrado con el ID ${id}`);
            return "NotFound";
        } else {
            return product;
        }
    }

    async updateProduct(id, updatedProduct) {
        this.#products = this.#products.map(product => (product.id === id ? { ...product, ...updatedProduct } : product));
        try {
            await fs.writeFile(this.path, JSON.stringify(this.#products), 'utf8');
        } catch (error) {
            throw new Error('Error al escribir en el archivo de productos.');
        }
    }

    async deleteProduct(id) {
        this.#products = this.#products.filter(product => product.id !== id);
        try {
            await fs.writeFile(this.path, JSON.stringify(this.#products), 'utf8');
        } catch (error) {
            throw new Error('Error al escribir en el archivo de productos.');
        }
    }
}

module.exports = ProductManager;
